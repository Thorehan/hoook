// Kuyu · skor sunucusu (Cloudflare Worker + D1). Kurulum: docs/online-kurulum.md
//
// Uçlar:
//   GET  /tablo?tahta=h-2026-11-23&n=100   → { satirlar: [{ ad, puan, metre }], toplam }   (giriş gerekmez)
//   POST /skor  { tahta, ad, puan, metre } → { yazildi, sira, toplam, puan }             (Firebase kimlik belgesi gerekir)
//
// Kimlik: istemci Firebase'de anonim giriş yapar, "Authorization: Bearer <idToken>" gönderir. Belge burada Google'ın
// açık anahtarlarıyla (RS256) denetlenir; oyuncu kimliği belgenin "sub" alanıdır. Listede kimlik dönmez.
// Kurallar: oyuncu başına tahtada tek satır, yalnız daha iyi puan yazılır (ad her gönderimde güncellenir);
// yalnız şu anki gün/hafta tahtasına yazılır (bitişten sonra 30 dk pay); oyuncu başına 5 sn'de bir gönderim.
// Puan henüz doğrulanmıyor (Aşama 2: dokunuş günlüğü + engine.js ile yeniden oynatma).

const TAHTA = /^[hg]-\d{4}-\d{2}-\d{2}$/;
const GUN_KAYMA = 3 * 3600e3; // oyunla aynı: gün ve hafta Türkiye saatine göre döner (js/game.js GUN_KAYMA)
const PAY = 30 * 60e3;        // gün/hafta bittikten sonra biten koşular için
const ARALIK = 5000;          // aynı oyuncunun iki gönderimi arasında en az
const PUAN_UST = 5000000, METRE_UST = 200000;
const JWK_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

// ---------- yardımcılar ----------
function json(veri, kod, ek) {
  return new Response(JSON.stringify(veri), { status: kod || 200, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, ek || {}) });
}
function cors(istek, env) {
  const koken = istek.headers.get('Origin') || '';
  const izinli = String(env.KOKENLER || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!izinli.includes(koken)) return {};
  return { 'Access-Control-Allow-Origin': koken, 'Access-Control-Allow-Headers': 'authorization, content-type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Max-Age': '86400', Vary: 'Origin' };
}
const gunKey = ms => new Date(ms + GUN_KAYMA).toISOString().slice(0, 10);
function haftaKey(ms) { const d = new Date(ms + GUN_KAYMA); d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7); return d.toISOString().slice(0, 10); }
// Şu an yazılabilecek tahtalar: bugünkü gün ve hafta, bitişten sonraki PAY içinde bir öncekiler de.
function acikTahtalar(simdi) {
  return new Set(['g-' + gunKey(simdi), 'h-' + haftaKey(simdi), 'g-' + gunKey(simdi - PAY), 'h-' + haftaKey(simdi - PAY)]);
}

// Ad: oyundaki temizAd ile aynı, ayrıca kaba sözcük süzgeci (sözcük başında eşleşir; "Işık", "Sıkı" gibi adlar takılmaz:
// noktasız ı ayrı harf sayılır).
const KABA = ['amk', 'amina', 'aminak', 'amcik', 'amına', 'amın', 'amcık', 'orospu', 'oruspu', 'pic', 'sik', 'sikis', 'yarak', 'yarrak', 'got', 'gotveren', 'pezevenk', 'kahpe', 'ibne', 'yavsak', 'serefsiz', 'fuck', 'shit', 'bitch', 'cunt', 'nigger', 'nigga', 'dick', 'pussy'];
function sade(s) {
  return s.toLocaleLowerCase('tr').replace(/i̇/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/\$/g, 's').replace(/@/g, 'a');
}
function temizAd(s) {
  const ad = String(s || '').replace(/[<>&"]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
  if (!ad) return 'Tırmanıcı';
  const sozcukler = sade(ad).split(/[^a-zı]+/).filter(Boolean), bitisik = sozcukler.join('');
  if (sozcukler.some(w => KABA.some(k => w.startsWith(k) && (k.length >= 4 || w.length <= k.length + 2))) || KABA.some(k => k.length >= 4 && bitisik.includes(k))) return 'Tırmanıcı';
  return ad;
}

// ---------- Firebase kimlik belgesi (RS256 JWT) ----------
const b64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const metin = u8 => new TextDecoder().decode(u8);
let anahtarBellek = { bitis: 0, keys: null };
async function googleAnahtarlari(getir) {
  if (anahtarBellek.keys && Date.now() < anahtarBellek.bitis) return anahtarBellek.keys;
  const r = await (getir || fetch)(JWK_URL);
  if (!r.ok) throw new Error('anahtarlar alınamadı');
  const yas = /max-age=(\d+)/.exec(r.headers.get('Cache-Control') || '');
  anahtarBellek = { keys: (await r.json()).keys || [], bitis: Date.now() + (yas ? +yas[1] : 3600) * 1000 };
  return anahtarBellek.keys;
}
// Geçerliyse oyuncu kimliğini (uid) döner, değilse null. anahtarlar: test için verilebilir (yoksa Google'dan alınır).
export async function belgeDogrula(belge, proje, anahtarlar, simdi) {
  try {
    const p = String(belge || '').split('.');
    if (p.length !== 3 || !proje) return null;
    const bas = JSON.parse(metin(b64(p[0]))), icerik = JSON.parse(metin(b64(p[1])));
    if (bas.alg !== 'RS256' || !bas.kid) return null;
    const jwk = (anahtarlar || await googleAnahtarlari()).find(k => k.kid === bas.kid);
    if (!jwk) return null;
    const anahtar = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const dogru = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', anahtar, b64(p[2]), new TextEncoder().encode(p[0] + '.' + p[1]));
    if (!dogru) return null;
    const sn = Math.floor((simdi || Date.now()) / 1000);
    if (icerik.aud !== proje || icerik.iss !== 'https://securetoken.google.com/' + proje) return null;
    if (!(icerik.exp > sn) || !(icerik.iat <= sn + 60) || !(icerik.auth_time <= sn + 60)) return null;
    if (typeof icerik.sub !== 'string' || !icerik.sub || icerik.sub.length > 128) return null;
    return icerik.sub;
  } catch (e) { return null; }
}

// ---------- uçlar ----------
async function tablo(url, env) {
  const tahta = url.searchParams.get('tahta') || '';
  if (!TAHTA.test(tahta)) return json({ hata: 'tahta' }, 400);
  const n = Math.max(1, Math.min(200, Math.floor(+url.searchParams.get('n') || 100)));
  const r = await env.DB.prepare('SELECT ad, puan, metre FROM skorlar WHERE tahta = ? ORDER BY puan DESC, zaman ASC LIMIT ?').bind(tahta, n).all();
  const t = await env.DB.prepare('SELECT COUNT(*) AS n FROM skorlar WHERE tahta = ?').bind(tahta).first();
  return json({ satirlar: r.results || [], toplam: t ? t.n : 0 });
}

async function skor(istek, env, dogrula, simdi) {
  const yetki = istek.headers.get('Authorization') || '';
  const uid = yetki.startsWith('Bearer ') ? await dogrula(yetki.slice(7)) : null;
  if (!uid) return json({ hata: 'kimlik' }, 401);
  let b;
  try { const ham = await istek.text(); if (ham.length > 2048) return json({ hata: 'büyük' }, 413); b = JSON.parse(ham); } catch (e) { return json({ hata: 'gövde' }, 400); }
  const tahta = String(b.tahta || ''), puan = Math.floor(+b.puan), metre = Math.floor(+b.metre || 0), ad = temizAd(b.ad);
  if (!TAHTA.test(tahta) || !(puan >= 0 && puan <= PUAN_UST) || !(metre >= 0 && metre <= METRE_UST)) return json({ hata: 'değer' }, 400);
  if (!acikTahtalar(simdi).has(tahta)) return json({ hata: 'tahta kapalı' }, 409);

  const son = await env.DB.prepare('SELECT zaman FROM gonderim WHERE uid = ?').bind(uid).first();
  if (son && simdi - son.zaman < ARALIK) return json({ hata: 'çok sık' }, 429);
  await env.DB.prepare('INSERT INTO gonderim (uid, zaman) VALUES (?, ?) ON CONFLICT(uid) DO UPDATE SET zaman = excluded.zaman').bind(uid, simdi).run();

  const eski = await env.DB.prepare('SELECT puan FROM skorlar WHERE tahta = ? AND uid = ?').bind(tahta, uid).first();
  const yazildi = !eski || puan > eski.puan;
  if (yazildi) await env.DB.prepare('INSERT INTO skorlar (tahta, uid, ad, puan, metre, zaman) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(tahta, uid) DO UPDATE SET ad = excluded.ad, puan = excluded.puan, metre = excluded.metre, zaman = excluded.zaman')
    .bind(tahta, uid, ad, puan, metre, simdi).run();
  else await env.DB.prepare('UPDATE skorlar SET ad = ? WHERE tahta = ? AND uid = ?').bind(ad, tahta, uid).run();

  const ben = await env.DB.prepare('SELECT puan, zaman FROM skorlar WHERE tahta = ? AND uid = ?').bind(tahta, uid).first();
  const ust = await env.DB.prepare('SELECT COUNT(*) AS n FROM skorlar WHERE tahta = ? AND (puan > ? OR (puan = ? AND zaman < ?))').bind(tahta, ben.puan, ben.puan, ben.zaman).first();
  const t = await env.DB.prepare('SELECT COUNT(*) AS n FROM skorlar WHERE tahta = ?').bind(tahta).first();
  return json({ yazildi, sira: ust.n + 1, toplam: t.n, puan: ben.puan, ad });
}

// ek: testler için { dogrula(belge) → uid|null, simdi: ms }
export async function isle(istek, env, ek) {
  ek = ek || {};
  const c = cors(istek, env);
  if (istek.method === 'OPTIONS') return new Response(null, { status: 204, headers: c });
  const url = new URL(istek.url);
  const dogrula = ek.dogrula || (belge => belgeDogrula(belge, env.FIREBASE_PROJE));
  let yanit;
  try {
    if (istek.method === 'GET' && url.pathname === '/tablo') yanit = await tablo(url, env);
    else if (istek.method === 'POST' && url.pathname === '/skor') yanit = await skor(istek, env, dogrula, ek.simdi || Date.now());
    else yanit = json({ hata: 'yok' }, 404);
  } catch (e) { yanit = json({ hata: 'sunucu' }, 500); }
  for (const k in c) yanit.headers.set(k, c[k]);
  return yanit;
}

export { temizAd, acikTahtalar };
export default { fetch: (istek, env) => isle(istek, env) };
