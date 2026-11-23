// Online testi: meydan okuma bağlantısı, skor tablosu istemcisi ve skor sunucusu (gerçek Worker kodu, SQLite, sahte Firebase).
//   node tools/online-test.js
const { kur } = require('./sahte-sunucu.js');
const W = require('../sunucu/src/index.js');
let bad = 0;
const ok = (c, m) => { if (!c) { bad++; console.log('HATA:', m); } };
// tarayıcı deposunun yerine geçen küçük nesne (online.js localStorage'dan ayar ve oturum okur)
const kasa = {};
global.localStorage = { getItem: k => (k in kasa ? kasa[k] : null), setItem: (k, v) => { kasa[k] = String(v); }, removeItem: k => { delete kasa[k]; } };
const O = require('../js/online.js');

// ---- meydan okuma: kodla / çöz ----
const m = { tur: 's', seed: 3999999999, puan: 2450, ad: 'Çıra & <Kor>' };
const kod = O.meydanKodla(m), geri = O.meydanCoz(kod);
ok(geri && geri.seed === m.seed && geri.puan === 2450 && geri.tur === 's', 'kodla → çöz aynı tohum ve puan');
ok(geri.ad === 'Çıra Kor', 'ad temizlenir (işaretler atılır)');
ok(O.meydanCoz('h-' + (12345).toString(36) + '-900-Ali').tur === 'h', 'haftalık türü');
ok(O.meydanCoz('x-1-2-3') === null && O.meydanCoz('s-zzzzzzzz-1-a') === null && O.meydanCoz('') === null && O.meydanCoz('s-1--a') === null, 'bozuk bağlantı reddedilir');
ok(O.meydanCoz('s-1-5-%E0%A4%A') === null, 'bozuk ad kodlaması reddedilir');
ok(O.meydanBaglanti('https://ornek.test/kuyu/', m).indexOf('?meydan=s-') > 0, 'bağlantı biçimi');

// ---- sunucu: ad süzgeci, açık tahtalar ----
ok(W.temizAd('Sik kafa') === 'Tırmanıcı' && W.temizAd('AMK') === 'Tırmanıcı' && W.temizAd('or0spu') === 'Tırmanıcı' && W.temizAd('f u c k') === 'Tırmanıcı', 'kaba ad süzülür');
ok(W.temizAd('Işık') === 'Işık' && W.temizAd('Kamil') === 'Kamil' && W.temizAd('Sıkı Kor') === 'Sıkı Kor' && W.temizAd('  Ali   Can ') === 'Ali Can', 'olağan ad bozulmaz');
const PZT = Date.UTC(2026, 10, 22, 21, 10); // 23/11/2026 pazartesi 00:10 (Türkiye)
ok(W.acikTahtalar(PZT).has('h-2026-11-16') && W.acikTahtalar(PZT).has('g-2026-11-22') && W.acikTahtalar(PZT).has('h-2026-11-23'), 'gece yarısından sonra 30 dk eski tahtaya yazılır');
ok(!W.acikTahtalar(PZT + 3600e3).has('h-2026-11-16') && !W.acikTahtalar(PZT + 3600e3).has('g-2026-11-22'), '30 dk sonra eski tahta kapanır');

// ---- sunucu: Firebase belgesi (RS256) ----
async function belgeTesti() {
  const s = crypto.subtle, enc = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const cift = await s.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = Object.assign(await s.exportKey('jwk', cift.publicKey), { kid: 'a1' });
  const sn = 1800000000, simdi = sn * 1000;
  const imzala = async (ic, kid) => {
    const g = enc({ alg: 'RS256', kid: kid || 'a1', typ: 'JWT' }) + '.' + enc(ic);
    return g + '.' + Buffer.from(await s.sign('RSASSA-PKCS1-v1_5', cift.privateKey, new TextEncoder().encode(g))).toString('base64url');
  };
  const ic = { aud: 'kuyu-p', iss: 'https://securetoken.google.com/kuyu-p', sub: 'uid123', iat: sn - 10, auth_time: sn - 10, exp: sn + 3000 };
  ok(await W.belgeDogrula(await imzala(ic), 'kuyu-p', [jwk], simdi) === 'uid123', 'geçerli belge kabul edilir');
  ok(await W.belgeDogrula(await imzala(Object.assign({}, ic, { aud: 'baska' })), 'kuyu-p', [jwk], simdi) === null, 'başka proje reddedilir');
  ok(await W.belgeDogrula(await imzala(Object.assign({}, ic, { exp: sn - 1 })), 'kuyu-p', [jwk], simdi) === null, 'süresi geçmiş belge reddedilir');
  ok(await W.belgeDogrula(await imzala(ic, 'yok'), 'kuyu-p', [jwk], simdi) === null, 'bilinmeyen anahtar reddedilir');
  const b = await imzala(ic), p = b.split('.');
  ok(await W.belgeDogrula(p[0] + '.' + enc(Object.assign({}, ic, { sub: 'baskasi' })) + '.' + p[2], 'kuyu-p', [jwk], simdi) === null, 'değiştirilmiş belge reddedilir');
  ok(await W.belgeDogrula('bozuk', 'kuyu-p', [jwk], simdi) === null && await W.belgeDogrula(b, '', [jwk], simdi) === null, 'bozuk belge ve boş proje reddedilir');
}

// ---- istemci + sunucu uçtan uca ----
let saat = Date.UTC(2026, 10, 25, 9, 0), adim = 6000; // 25/11/2026 çarşamba 12:00 (Türkiye); her istekte saat ilerler
const H = 'h-2026-11-23', G = 'g-2026-11-25';
const { sunucu } = kur({ saat: () => (saat += adim) });
const OTURUM = 'kuyu.oturum';
const oyuncu = o => { if (o) kasa[OTURUM] = o; else delete kasa[OTURUM]; };

ok(!O.acik(), 'ayar boşken online kapalı');
O.gonder({}, H, 'A', 10, 5).then(() => ok(false, 'kapalıyken gönderilmemeli'), () => {}).then(belgeTesti).then(() => new Promise(r => sunucu.listen(0, r))).then(async () => {
  const port = sunucu.address().port, url = 'http://localhost:' + port;
  localStorage.setItem('kuyu.online', JSON.stringify({ url, firebase: 'deneme', kimlikUrl: url, yenileUrl: url }));
  ok(O.acik(), 'yerel ayarla online açık');
  const a = {}, b = {};
  ok(await O.gonder(a, H, 'Ayşe', 1200, 600) === true, 'ilk skor yazılır (anonim hesap açılır)');
  const oa = kasa[OTURUM], uidA = O.kimlik(a);
  ok(uidA && uidA.startsWith('yerel-') && !a.online, 'kimlik Firebase oturumundan; kayda yazılmaz');
  oyuncu(null);
  ok(await O.gonder(b, H, 'Bora', 3400, 1500) === true, 'ikinci oyuncu');
  const ob = kasa[OTURUM];
  ok(O.kimlik(b) !== uidA, 'iki oyuncu iki kimlik');
  oyuncu(oa);
  await O.gonder(a, H, 'Ayşe', 900, 400);
  let rows = await O.tablo(H, 50);
  ok(rows.length === 2 && rows[0].ad === 'Bora' && rows[1].puan === 1200 && rows.toplam === 2, 'sıralı liste; kötü koşu en iyiyi düşürmez');
  ok(!('uid' in rows[0]) && !('oyuncu' in rows[0]), 'listede oyuncu kimliği dönmez');
  let oz = O.ozet(rows, O.kimlik(a), 5);
  ok(oz.sira === 2 && oz.liste[1].ben && !oz.liste[0].ben, 'kendi sıran sunucudan');
  await O.gonder(a, H, 'Ayşe', 5000, 2000);
  rows = await O.tablo(H, 50);
  oz = O.ozet(rows, O.kimlik(a), 5);
  ok(oz.sira === 1 && oz.toplam === 2 && oz.liste[0].ben && oz.liste[0].puan === 5000, 'daha iyi puan yazılır, sıra 1');
  oyuncu(ob); await O.gonder(b, H, 'Bora', 5000, 100); oyuncu(oa);
  rows = await O.tablo(H, 50);
  ok(rows[0].ad === 'Ayşe' && rows[1].puan === 5000, 'eşit puanda önce yazan üstte');
  // ilk sıraların dışındaysan kendi satırın eklenir
  const r3 = [{ ad: 'X', puan: 9 }, { ad: 'Y', puan: 8 }, { ad: 'Ben', puan: 1 }]; r3.sen = { sira: 3, toplam: 3, puan: 1, ad: 'Ben' };
  const o2 = O.ozet(r3, 'ben', 2);
  ok(o2.sira === 3 && o2.liste.length === 3 && o2.liste[2].ben && o2.liste[2].sira === 3, 'ilk sıraların dışındaysan kendi satırın eklenir');
  const r4 = [{ ad: 'X', puan: 9 }]; r4.toplam = 140; r4.sen = { sira: 120, toplam: 140, puan: 3, ad: 'Ben' };
  const o4 = O.ozet(r4, 'ben', 5);
  ok(o4.sira === 120 && o4.toplam === 140 && o4.liste[1].sira === 120 && o4.liste[1].ben, 'ilk 100 dışındaki sıra da bilinir');
  ok((await O.tablo(G, 50)).length === 0, 'başka tahta boş');
  ok(await O.gonder(a, 'bozuk', 'Ayşe', 10, 1) === false, 'geçersiz tahta reddedilir');
  ok(await O.gonder(a, 'h-2026-11-09', 'Ayşe', 10, 1) === false, 'eski haftaya yazılamaz');
  ok(await O.gonder(a, H, 'Ayşe', 9e9, 1) === false, 'olanaksız puan reddedilir');
  adim = 1000; await O.gonder(a, G, 'Ayşe', 10, 1);
  ok(await O.gonder(a, G, 'Ayşe', 20, 1) === false, 'çok sık gönderim reddedilir'); adim = 6000;
  ok(await O.gonder(a, G, 'Sik', 30, 1) === true && (await O.tablo(G, 5))[0].ad === 'Tırmanıcı', 'kaba ad sunucuda değiştirilir');
  // kimlik: belgesiz ve sahte belge
  let y = await fetch(url + '/skor', { method: 'POST', body: JSON.stringify({ tahta: H, ad: 'X', puan: 1 }) });
  ok(y.status === 401, 'belgesiz gönderim 401');
  y = await fetch(url + '/skor', { method: 'POST', headers: { Authorization: 'Bearer uydurma' }, body: '{}' });
  ok(y.status === 401, 'geçersiz belge 401');
  // izinli sayfa (CORS)
  y = await fetch(url + '/tablo?tahta=' + H, { headers: { Origin: 'http://localhost:8766' } });
  const y2 = await fetch(url + '/tablo?tahta=' + H, { headers: { Origin: 'https://kotu.example' } });
  ok(y.headers.get('access-control-allow-origin') === 'http://localhost:8766' && !y2.headers.get('access-control-allow-origin'), 'yalnız izinli sayfa okuyabilir');
  // oturum yenileme
  kasa[OTURUM] = JSON.stringify(Object.assign(JSON.parse(kasa[OTURUM]), { bitis: 0 }));
  await O.oturum();
  ok(O.kimlik(a) === uidA && JSON.parse(kasa[OTURUM]).bitis > Date.now(), 'süresi dolan belge yenilenir, kimlik aynı');
  kasa[OTURUM] = JSON.stringify({ uid: uidA, belge: 'x', yenile: 'gecersiz', bitis: 0 });
  await O.oturum();
  ok(O.kimlik(a) !== uidA, 'geçersiz yenileme belgesinde yeni anonim hesap açılır');
  O.ayarBaglanti('kapat'); ok(!O.acik() && !kasa[OTURUM], '?online=kapat ile kapanır, oturum silinir');
  O.ayarBaglanti('yerel'); ok(O.ayar().url === O.YEREL.url, '?online=yerel ile yerel sunucu');
}).catch(e => { bad++; console.log('HATA:', e.stack || e.message); }).then(() => {
  sunucu.close();
  console.log(bad ? bad + ' hata' : 'Tamam: meydan okuma bağlantısı, skor tablosu istemcisi, skor sunucusu (Worker + D1 kuralları, Firebase belgesi)');
  process.exit(bad ? 1 : 0);
});
