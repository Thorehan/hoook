// Ekonomi ölçümü: sanal oyuncular saatte ve tipik bir günde kaç ateşböceği kazanır, Dolap ve ışık yolu kaç günde biter?
//   node tools/ekonomi-olcum.js
// v0.53'ten beri oyuncular HATA YAPAR (tools/hata.js ve tools/denge.js ile aynı model): eski ölçüm hatasız ve yavaş bir
// botla Sonsuz'u saatte 121 ateşböceği sayıyordu; gerçekte koşular suya yakalanarak biter ve kazanç bunun iki katıdır.
// Bölümler: yalnızca ilk kez alınan ateşböceği ödenir; yanınca bölüm yeniden denenir. Sonsuz: toplanan her ateşböceği.
// Tipik gün (v0.64): 10 dk bölüm + 3 Günlük Kuyu denemesi (+ günün hedefi yıldızları) + haftada 5 Haftalık denemesinin günlük payı
// + 3 görev + günlük giriş + lig ödülünün ve seri ödülünün günlük payı. Serbest Sonsuz kalktı.
const E = require('../js/engine.js');
const G = require('../js/gen.js');
const EKO = require('../js/ekonomi.js');
const GOREV = require('../js/gorevler.js');
const C = E.CFG;
function rng(seed) { let x = seed >>> 0 || 1; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }
const step = (s, sec, u) => { for (let i = 0; i < Math.round(sec / C.DT) && s.status === 'play'; i++) { E.step(s); if (u && u()) return; } };
function bekle(s, f, a) { if (!a.bekle) return a; const son = s.t + C.BEKLE_SN; while (s.status === 'play') { E.step(s); a = E.aim(s, f); if (!a.bekle || s.t >= son || s.p.y - s.p.py >= 0) break; } return a; }
const ringAt = (s, a) => s.rings.find(r => Math.hypot(r.x - a.x, r.y - a.y) < 3);
function taraf(s, ates) {
  const L = E.aim(s, 0.25), R = E.aim(s, 0.75), y = a => (a.bekle || a).y, ok = a => (a.kind !== 'none' && !a.miss) || a.bekle;
  if (L.rescue || R.rescue) return L.rescue ? 0.25 : 0.75;
  const ff = a => ok(a) && !a.bekle && ringAt(s, a) && ringAt(s, a).ff && !ringAt(s, a).got;
  if (ates && ff(L)) return 0.25; if (ates && ff(R)) return 0.75;
  return ok(L) && ok(R) ? (y(L) <= y(R) ? 0.25 : 0.75) : ok(L) ? 0.25 : ok(R) ? 0.75 : null;
}
// tarz: 'temkinli' (ipe sarılıp bekler) ya da 'akis' (ipi erken bırakıp zincirler); p: dokunuş başına hata olasılığı;
// ates: ateşböceği gösteren işareti seçer
function oyna(def, tarz, p, seed, maxT, ates) {
  const s = E.createSim(def), r = rng(seed * 977 + Math.round(p * 1000) + 5);
  while (s.t < maxT) {
    if (s.status === 'dead' && def.fenerli && E.fenerDon(s)) { step(s, 1); continue; } // Hikâye: son fenerden devam (perde ~1 sn)
    if (s.status !== 'play') break;
    let f = taraf(s, ates);
    if (f == null) { step(s, 0.1); continue; }
    const havada = !s.rope;
    if (r() < p) { if (!havada || r() < 0.5) f = 1 - f; else step(s, 0.9); }
    const a = bekle(s, f, E.aim(s, f));
    if (tarz === 'temkinli' && !a.miss) E.release(s);
    E.press(s, a.x, a.y, { keep: !!a.miss, rescue: !!a.rescue });
    step(s, 0.8, () => (s.rope && !s.hook) || !s.hook);
    if (!s.rope || a.miss) { step(s, 0.3); continue; }
    if (tarz === 'temkinli') { step(s, 1.6, () => (s.rope && s.rope.len <= C.MIN_LEN + 0.01 && Math.hypot(s.p.x - s.p.px, s.p.y - s.p.py) / C.DT < 120) || (!s.rope && !s.hook && s.springs > 0 && s.p.y - s.p.py > -0.4)); step(s, 0.35); }
    else { step(s, 1.2, () => s.rope && s.rope.len <= 60); E.release(s); step(s, 0.08); }
  }
  return s;
}

const PROFIL = [
  ['yeni', 'temkinli', 0.20, false],
  ['ortalama', 'temkinli', 0.10, false],
  ['ateşböceği avcısı', 'temkinli', 0.10, true],
  ['akışla oynayan', 'akis', 0.10, false]
];
const gorev = EKO.GOREV_ATES.reduce((a, b) => a + b, 0), giris = EKO.GIRIS.reduce((a, b) => a + b, 0) / EKO.GIRIS.length;
// Haftalık Kuyu (v0.54) varsa: profilin vardığı lig kademesinin ödülü 7 güne bölünür
const haftalikPay = puan => { if (!EKO.ligOdul) return 0; return EKO.ligOdul(puan) / 7; };
const fiyatlar = EKO.KATALOG.filter(i => i.fiyat > 0).map(i => i.fiyat).sort((a, b) => a - b);
const dolapToplam = fiyatlar.reduce((a, b) => a + b, 0);
const basarimToplam = GOREV.ACH.length * EKO.BASARIM_ATES.reduce((a, b) => a + b, 0);
// Yarışma koşusu en çok 200 sn sayılır: insan koşusu 1–3 dk sürer (model çok daha uzun yaşar); 3 Günlük denemesi ~10 dk eder,
// v0.63'teki "10 dk Sonsuz" ile karşılaştırılabilir.
const N = 10, gunler = [], KOSU_SN = 200;
for (const [ad, tarz, p, ates] of PROFIL) {
  // Günlük Kuyu (v0.64: serbest Sonsuz kalktı): günde 3 deneme (createEndless + günün kuralı); Haftalık: haftada 5 deneme
  let gff = 0, gm = 0, yildiz = 0, puan = [], hff = 0;
  for (let sd = 1; sd <= N; sd++) {
    const key = '2026-11-' + String(10 + sd).padStart(2, '0'), kural = G.gunKurali(key);
    let enM = 0;
    for (let d = 0; d < EKO.HAK.gunluk; d++) { const s = oyna(G.createEndless(sd * 13 + d * 101, kural), tarz, p, sd * 7 + d, KOSU_SN, ates); gff += E.fireflyCount(s); enM = Math.max(enM, E.meters(s)); }
    gm += enM; const y = EKO.yildizSay(key, enM); yildiz += EKO.YILDIZ_ODUL.slice(0, y).reduce((a, b) => a + b, 0);
  }
  if (G.createHaftalik) for (let sd = 1; sd <= 4; sd++) { let en = 0; for (let d = 0; d < EKO.HAK.haftalik; d++) { const s = oyna(G.createHaftalik(sd * 7), tarz, p, sd * 11 + d, KOSU_SN, false); hff += E.fireflyCount(s); en = Math.max(en, E.finalScore(s)); } puan.push(en); }
  puan.sort((a, b) => a - b);
  // Hikâye bölümleri 7–18 (v0.62, tarifli uzun bölümler, fenerden devam): ilk geçişe kadar yeniden dene (en çok 3); deneme arası 6 sn, sonuç kartı 6 sn
  let lff = 0, lsn = 0, den = 0, gecilen = 0;
  for (let k = 7; k <= 18; k++) {
    let best = 0;
    for (let d = 0; d < 3; d++) {
      const s = oyna(G.createBolum(k), tarz, p, k * 10 + d, 400, ates); den++; lsn += s.t + 6; best = Math.max(best, E.fireflyCount(s));
      if (s.status === 'won') { lff += best; lsn += 6; gecilen++; break; }
    }
  }
  const bolumSaat = lff / (lsn / 3600), gunlukGun = gff / N, yildizGun = yildiz / N, haftalikKosu = hff / (4 * 7);
  const haftalik = puan.length ? haftalikPay(puan[puan.length >> 1]) : 0;
  // seri ödülü: her gün oynayan için 30 günde 20+50+100+200 (yarısı sayılır: seri ara ara kopar)
  const seri = Object.values(EKO.SERI_ODUL).reduce((a, b) => a + b, 0) / 30 / 2;
  const gun = Math.round(bolumSaat / 6 + gunlukGun + yildizGun + haftalikKosu + gorev + giris + haftalik + seri);
  gunler.push(gun);
  console.log(`[${ad}]`);
  console.log(`  günlük:   3 denemede ${gunlukGun.toFixed(1)} ateşböceği, en iyi ${Math.round(gm / N)} m, günün hedefi ${yildizGun.toFixed(1)} · haftalık koşu payı ${haftalikKosu.toFixed(1)} · seri payı ${seri.toFixed(1)}`);
  console.log(`  bölümler: 7–18 arası ${gecilen}/12 bölüm, ${lff} ateşböceği, ${den} deneme, ${Math.round(lsn / 60)} dk → saatte ${Math.round(bolumSaat)}`);
  console.log(`  tipik gün (10 dk bölüm + 3 Günlük + 5/7 Haftalık koşu, 3 görev ${gorev}, giriş ort. ${giris.toFixed(0)}${haftalik ? ', haftalık lig payı ' + haftalik.toFixed(0) : ''}): ~${gun} ateşböceği, videolarla ~${gun + gorev + Math.round(giris)}`);
  console.log(`  Dolap ${Math.ceil(Math.max(0, dolapToplam - basarimToplam) / gun)} günde biter (başarımların ${basarimToplam} ateşböceği düşülerek); ışık yolu ${EKO.ISIK.length - 1}. seviye ${Math.ceil(EKO.ISIK[EKO.ISIK.length - 1] / gun)} günde`);
}
console.log(`Dolap: ${fiyatlar.length} satılık ürün (en ucuz ${fiyatlar[0]}, en pahalı ${fiyatlar[fiyatlar.length - 1]}, hepsi ${dolapToplam}) + ${EKO.KATALOG.filter(i => i.isik).length} ışık ödülü; başarımlar bir kez ${basarimToplam}`);
console.log(`Özet: tipik gün ortalama oyuncu ~${gunler[1]} ateşböceği (yeni ~${gunler[0]}, avcı ~${gunler[2]}, akışla ~${gunler[3]})`);
