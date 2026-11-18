// Hikâye denge tablosu (v0.63, Aşama 5): 48 bölümün her birinde oyuncu modelleri, spam ve tek taraf.
//   node tools/hikaye-denge.js [deneme sayısı, varsayılan 4] [ilk] [son]
// Ölünce son yanan fenerden dönülür (yoksa bölüm baştan); en çok 5 dk. Bölüm "geçildi" sayılır, dönüşler ve süre raporlanır.
// Modeller: temkinli %5 / %20 (tools/hikaye-olcum.js ile aynı), akış %5 (ipi erken bırakır), yavaş %5 (her halkada 1,35 sn bekler),
// spam (sıralı sol-sağ, tools/hata.js gibi), sadeceSag / sadeceSol (hep aynı yana basar; tools/oyuncu.js gibi).
// Kurallar: hatasız oyuncu her bölümü geçer; tek taraf hiçbir bölümü geçmez; spam düşünen oyuncudan (akış) belirgin yavaş, ortalama (temkinli) düzeyinde ya da kötü.
//   SADE=1 node tools/hikaye-denge.js 0 7 48   → yalnız temkinli / akış / spam
const E = require('../js/engine.js');
const G = require('../js/gen.js');
const C = E.CFG;
const N = +process.argv[2] || 4, ILK = +process.argv[3] || 1, SON = +process.argv[4] || 48, MAXT = 300;
function rng(seed) { let x = seed >>> 0 || 1; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }
const step = (s, sec, u) => { for (let i = 0; i < Math.round(sec / C.DT) && s.status === 'play'; i++) { E.step(s); if (u && u()) return; } };
function bekle(s, f, a) { if (!a.bekle) return a; const son = s.t + C.BEKLE_SN; while (s.status === 'play') { E.step(s); a = E.aim(s, f); if (!a.bekle || s.t >= son || s.p.y - s.p.py >= 0) break; } return a; }
function iyiTaraf(s) {
  const L = E.aim(s, 0.25), R = E.aim(s, 0.75), y = a => (a.bekle || a).y, ok = a => (a.kind !== 'none' && !a.miss) || a.bekle;
  if (L.rescue || R.rescue) return L.rescue ? 0.25 : 0.75;
  return ok(L) && ok(R) ? (y(L) <= y(R) ? 0.25 : 0.75) : ok(L) ? 0.25 : ok(R) ? 0.75 : null;
}
function oyna(def, tarz, p, seed) {
  let s = E.createSim(def), ek = 0, donus = 0, bastan = 0, kutu = !(def.boxes && def.boxes.length), k = 0;
  const r = rng(seed * 977 + Math.round(p * 1000) + 5);
  while (s.t + ek < MAXT) {
    if (s.status === 'won') break;
    if (s.status === 'dead') {
      if (E.fenerDon(s)) { donus++; ek += 1; continue; }
      const t0 = s.t + ek; s = E.createSim(def); ek = t0 + 1; bastan++; kutu = !(def.boxes && def.boxes.length); continue;
    }
    if (!kutu && s.rope && s.rope.kind === 'anchor' && tarz !== 'spam' && tarz !== 'sag' && tarz !== 'sol') {
      const b = s.boxes[0]; E.release(s); E.press(s, b.x, b.y); step(s, 0.6, () => s.rope || !s.hook);
      step(s, 1.2); E.release(s); step(s, 1.0); kutu = true; continue;
    }
    if (tarz === 'spam') { // sıralı sol-sağ: düşünmeden sırayla iki yana, kısa basış
      const f = k++ % 2 ? 0.75 : 0.25, a = bekle(s, f, E.aim(s, f));
      E.press(s, a.x, a.y, { keep: !!a.miss }); step(s, 0.15 + (r() * 2 - 1) * 0.05); E.release(s); step(s, Math.max(0.02, 0.1 + (r() * 2 - 1) * 0.05)); continue;
    }
    if (tarz === 'sag' || tarz === 'sol') { // hep aynı yana: tutun, sarıl, bırak
      const f = tarz === 'sag' ? 0.75 : 0.25, a = E.aim(s, f);
      if (!a.miss) E.release(s);
      E.press(s, a.x, a.y, { keep: !!a.miss, rescue: !!a.rescue });
      step(s, 0.8, () => (s.rope && !s.hook) || !s.hook);
      if (a.miss || !s.rope) { step(s, 0.3); continue; }
      step(s, 1.6, () => (s.rope && s.rope.len <= C.MIN_LEN + 0.01 && Math.hypot(s.p.x - s.p.px, s.p.y - s.p.py) / C.DT < 120) || (!s.rope && !s.hook && s.springs > 0 && s.p.y - s.p.py > -0.4));
      continue;
    }
    let f = iyiTaraf(s);
    if (f == null) { step(s, 0.1); continue; }
    const havada = !s.rope;
    if (r() < p) { if (!havada || r() < 0.5) f = 1 - f; else step(s, 0.9); }
    const a = bekle(s, f, E.aim(s, f));
    if (!a.miss && tarz !== 'akis') E.release(s);
    E.press(s, a.x, a.y, { keep: !!a.miss, rescue: !!a.rescue });
    step(s, 0.8, () => (s.rope && !s.hook) || !s.hook);
    if (!s.rope || a.miss) { step(s, 0.3); continue; }
    if (tarz === 'akis') { step(s, 1.2, () => s.rope && s.rope.len <= 60); E.release(s); step(s, 0.08); continue; } // düşünen ve hızlı: ipi erken bırakır
    // yayla fırlayınca ip yoktur: tepe noktasında (düşmeye başlarken) sıradakine basılır (tools/denge.js gibi)
    step(s, 1.6, () => (s.rope && s.rope.len <= C.MIN_LEN + 0.01 && Math.hypot(s.p.x - s.p.px, s.p.y - s.p.py) / C.DT < 120) || (!s.rope && !s.hook && s.springs > 0 && s.p.y - s.p.py > -0.4));
    if (!s.rope) continue;
    step(s, 0.35); if (tarz === 'yavas' && s.rope) step(s, 1.35);
  }
  return { won: s.status === 'won', t: s.t + ek, donus, bastan, metre: Math.max(0, Math.round((s.startY - s.topY) / 20)), boy: Math.round((s.startY - s.goal.y) / 20) };
}
const orta = a => a.slice().sort((x, y) => x - y)[a.length >> 1];
const SADE = process.env.SADE === '1'; // yalnız spam karşılaştırması: temkinli, akış, spam
const MOD = SADE ? [['temkinli %5', 'temkinli', 0.05, 2], ['akış %5', 'akis', 0.05, 2], ['spam', 'spam', 0, 4]]
  : [['temkinli %5', 'temkinli', 0.05, N], ['temkinli %20', 'temkinli', 0.2, N], ['akış %5', 'akis', 0.05, N], ['yavaş %5', 'yavas', 0.05, N], ['spam', 'spam', 0, 3], ['sağ', 'sag', 0, 1], ['sol', 'sol', 0, 1]];
console.log('Bölüm · ' + MOD.map(m => m[0]).join(' · ') + '   (geçen/deneme süre-ortanca dönüş; spam ve tek tarafta geçemediyse çıktığı yükseklik %)');
const ozet = { tekGecen: 0, spamGecen: 0, hatasizKalan: 0 };
for (let no = ILK; no <= SON; no++) {
  const def = G.createBolum(no);
  const hucre = MOD.map(([ad, tarz, p, n]) => {
    const o = []; for (let k = 1; k <= n; k++) o.push(oyna(def, tarz, p, no * 31 + k));
    const kaz = o.filter(x => x.won).length;
    if ((tarz === 'sag' || tarz === 'sol') && kaz) ozet.tekGecen++;
    if (tarz === 'spam' && kaz) ozet.spamGecen++;
    if (tarz === 'temkinli' && p === 0.05 && kaz < n) ozet.hatasizKalan++;
    if (tarz === 'spam' || tarz === 'sag' || tarz === 'sol') return kaz ? `${kaz}/${n} ${orta(o.map(x => x.t)).toFixed(0)}s` : `0/${n} %${Math.round(100 * orta(o.map(x => x.metre)) / Math.max(1, o[0].boy))}`;
    return `${kaz}/${n} ${orta(o.map(x => x.t)).toFixed(0)}s d${orta(o.map(x => x.donus))}`;
  });
  console.log(`${String(no).padStart(2)} ${def.name.slice(0, 16).padEnd(16)} ${hucre.join(' · ')}`);
}
console.log(`Özet: tek taraf geçen bölüm ${ozet.tekGecen}, spam geçen bölüm ${ozet.spamGecen}, temkinli %5'in bitiremediği bölüm ${ozet.hatasizKalan}`);
