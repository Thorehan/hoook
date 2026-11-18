// "Geriye kanca" ölçümü (Mustafa'nın geri bildirimi, 19/11/2026): insan gibi gecikmeli basan oyuncu, ipi bırakıp
// havadayken sıradaki halkaya basar. Basış anı bırakıştan sonra 0,05–0,75 sn arası (insan tepkisi, geç kalma).
// Taraf, bırakış anında görünen en iyi yukarı hedefin tarafıdır (oyuncu hedefi önceden seçer).
// Sayılan: kanca az önce bırakılan halkaya ya da onun altına mı gitti (geri), boşa mı gitti, ileri mi gitti.
//   node tools/geri.js [koşu sayısı, varsayılan 8]
const E = require('../js/engine.js');
const G = require('../js/gen.js');
const C = E.CFG;
const N = +process.argv[2] || 8;
function rng(seed) { let x = seed >>> 0 || 1; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }
const step = (s, sec, u) => { for (let i = 0; i < Math.round(sec / C.DT) && s.status === 'play'; i++) { E.step(s); if (u && u()) return; } };
function iyiTaraf(s) {
  const L = E.aim(s, 0.25), R = E.aim(s, 0.75), y = a => (a.bekle || a).y, ok = a => (a.kind !== 'none' && !a.miss) || a.bekle;
  return ok(L) && ok(R) ? (y(L) <= y(R) ? 0.25 : 0.75) : ok(L) ? 0.25 : ok(R) ? 0.75 : null;
}
// oyundaki bekleyen atış: hedef "bekle" taşıyorsa en çok BEKLE_SN tutulur, menzile girince ona atılır
function bas(s, f) {
  let a = E.aim(s, f);
  if (a.bekle) { const son = s.t + C.BEKLE_SN; while (s.status === 'play') { E.step(s); a = E.aim(s, f); if (!a.bekle || s.t >= son || s.p.y - s.p.py >= 0) break; } }
  E.press(s, a.x, a.y, { keep: !!a.miss });
  return a;
}
const kova = [[0.05, 0.25], [0.25, 0.45], [0.45, 0.75]].map(k => ({ k, n: 0, geri: 0, bos: 0 }));
let top = { n: 0, geri: 0, bos: 0 };
function olc(def, seed, maxT) {
  const s = E.createSim(def), r = rng(seed);
  while (s.status === 'play' && s.t < maxT) {
    if (!s.rope) { const f = iyiTaraf(s); if (f == null) { step(s, 0.1); continue; } bas(s, f); step(s, 0.8, () => (s.rope && !s.hook) || !s.hook); continue; }
    if (s.rope.kind !== 'anchor') { E.release(s); step(s, 0.2); continue; }
    const kala = 40 + r() * 90;
    step(s, 1.4, () => s.rope && s.rope.len <= kala);
    if (!s.rope) continue;
    const prev = { y: s.rope.y, ref: s.rope.ref }, f = iyiTaraf(s);
    E.release(s);
    if (f == null) { step(s, 0.3); continue; }
    const gec = 0.05 + r() * 0.7;
    step(s, gec);
    if (s.status !== 'play') break;
    const a = bas(s, f);
    step(s, 0.8, () => (s.rope && !s.hook) || !s.hook);
    const kb = kova.find(k => gec >= k.k[0] && gec < k.k[1]) || kova[2];
    kb.n++; top.n++;
    if (a.miss || !s.rope) { kb.bos++; top.bos++; continue; }
    if (s.rope.ref === prev.ref || s.rope.y > prev.y + 15) { kb.geri++; top.geri++; }
  }
}
for (let sd = 1; sd <= N; sd++) {
  const d = G.createEndless(sd); d.suTakip = null; d.water = 0; // suyu kapat: yalnız nişan ölçülür
  olc(d, sd * 31, 120);
}
for (let n = 17; n < 17 + N; n++) { const d = Object.assign({}, G.createLevel(n), { suTakip: null, water: 0 }); olc(d, n * 7, 60); }
const yz = (a, b) => (100 * a / Math.max(1, b)).toFixed(1) + '%';
console.log(`Geriye kanca: ${top.n} atış · geri ${yz(top.geri, top.n)} · boş ${yz(top.bos, top.n)}`);
kova.forEach(k => console.log(`  basış ${k.k[0]}–${k.k[1]} sn sonra: ${k.n} atış · geri ${yz(k.geri, k.n)} · boş ${yz(k.bos, k.n)}`));
