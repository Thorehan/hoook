// Hikâye bölümleri (tarifli, v0.57) için süre ve fener ölçümü.
//   node tools/hikaye-olcum.js [deneme sayısı, varsayılan 6]
// Oyuncu modeli tools/denge.js ile aynı (iki işaretten yukarıdakini seçer, p olasılıkla hata yapar; temkinli ipe
// sarılıp bekler ve 0,35 sn tepki süresi var, akış ipi erken bırakır). Ölünce son yanan fenerden döner
// (yoksa bölüm baştan); dönüş ve baştan başlama gerçek oyundaki perde için 1 sn sayılır.
// Hedef (plan): Taş Kuyu 60–90 sn, Maden 90–120, Kristal 120–150, Kule 150–180 (ortalama oyuncu = temkinli %5).
// Model insandan hızlıdır: v0.59'da telefonda onaylanan Taş Kuyu bölümleri modelde 35–45 sn.
const E = require('../js/engine.js');
const G = require('../js/gen.js');
const T = require('../js/bolumler.js');
const C = E.CFG;
const N = +process.argv[2] || 6;
function rng(seed) { let x = seed >>> 0 || 1; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }
const step = (s, sec, u) => { for (let i = 0; i < Math.round(sec / C.DT) && s.status === 'play'; i++) { E.step(s); if (u && u()) return; } };
function bekle(s, f, a) { if (!a.bekle) return a; const son = s.t + C.BEKLE_SN; while (s.status === 'play') { E.step(s); a = E.aim(s, f); if (!a.bekle || s.t >= son || s.p.y - s.p.py >= 0) break; } return a; }
function iyiTaraf(s) {
  const L = E.aim(s, 0.25), R = E.aim(s, 0.75), y = a => (a.bekle || a).y, ok = a => (a.kind !== 'none' && !a.miss) || a.bekle;
  if (L.rescue || R.rescue) return L.rescue ? 0.25 : 0.75;
  return ok(L) && ok(R) ? (y(L) <= y(R) ? 0.25 : 0.75) : ok(L) ? 0.25 : ok(R) ? 0.75 : null;
}
function oyna(def, tarz, p, seed, maxT) {
  let s = E.createSim(def), ek = 0, donus = 0, bastan = 0, kutu = !(def.boxes && def.boxes.length);
  const r = rng(seed * 977 + Math.round(p * 1000) + 5);
  while (s.t + ek < maxT) {
    if (s.status === 'won') break;
    if (s.status === 'dead') {
      if (E.fenerDon(s)) { donus++; ek += 1; continue; }
      const t0 = s.t + ek; s = E.createSim(def); ek = t0 + 1; bastan++; kutu = !(def.boxes && def.boxes.length); continue;
    }
    if (!kutu && s.rope && s.rope.kind === 'anchor') { // kutu bulmacası: kutuyu çek, düğmeye düşür (tools/denge.js gibi)
      const b = s.boxes[0]; E.release(s); E.press(s, b.x, b.y); step(s, 0.6, () => s.rope || !s.hook);
      step(s, 1.2); E.release(s); step(s, 1.0); kutu = true; continue;
    }
    let f = iyiTaraf(s);
    if (f == null) { step(s, 0.1); continue; }
    const havada = !s.rope;
    if (r() < p) { if (!havada || r() < 0.5) f = 1 - f; else step(s, 0.9); }
    const a = bekle(s, f, E.aim(s, f));
    if (tarz === 'temkinli' && !a.miss) E.release(s);
    E.press(s, a.x, a.y, { keep: !!a.miss, rescue: !!a.rescue });
    step(s, 0.8, () => (s.rope && !s.hook) || !s.hook);
    if (!s.rope || a.miss) { step(s, 0.3); continue; }
    if (tarz === 'temkinli') step(s, 1.6, () => s.rope && s.rope.len <= C.MIN_LEN + 0.01 && Math.hypot(s.p.x - s.p.px, s.p.y - s.p.py) / C.DT < 120);
    else { step(s, 1.2, () => s.rope && s.rope.len <= 60); E.release(s); step(s, 0.08); }
    if (tarz === 'temkinli') step(s, 0.35);
  }
  return { won: s.status === 'won', t: s.t + ek, donus, bastan, ff: E.fireflyCount(s), ffT: s.fireflies.length };
}
const orta = a => a.slice().sort((x, y) => x - y)[a.length >> 1];
const MODELLER = [['temkinli', 0], ['temkinli', 0.05], ['temkinli', 0.1], ['akis', 0.05]];
// KISA=1: kısa bölümler (v0.85 deneme, docs/kisa-bolumler-plan.md). Hedef (insan): Taş Kuyu 30–45 sn ≈ modelde 17–25 sn.
const IKINCI = process.env.IKINCI === '1'; // v0.93: ikinci yolculuğun kısa bölümleri (gen.createKisaIkinci; oyunda 84–166)
const KISA = process.env.KISA === '1' || IKINCI;
console.log((IKINCI ? 'İkinci yolculuk kısa bölümleri' : KISA ? 'Kısa bölümler' : 'Hikâye bölümleri') + ' · ' + N + ' deneme · süre (ortanca) · fenere dönüş · baştan başlama');
for (const tf of (KISA ? T.KISA : T.BOLUMLER)) {
  const def = IKINCI ? G.createKisaIkinci(tf.no) : KISA ? G.createKisa(tf.no) : G.createBolum(tf.no);
  const satir = MODELLER.map(([tarz, p]) => {
    const o = []; for (let k = 1; k <= N; k++) o.push(oyna(def, tarz, p, k, 600));
    const kaz = o.filter(x => x.won).length;
    return `${tarz} %${Math.round(p * 100)}: ${orta(o.map(x => x.t)).toFixed(0)} sn, dönüş ${orta(o.map(x => x.donus))}, baştan ${orta(o.map(x => x.bastan))}${kaz < N ? ' (' + (N - kaz) + ' bitiremedi)' : ''}`;
  });
  console.log(`${tf.no} ${tf.ad.padEnd(14)} ${satir.join(' · ')}`);
}
