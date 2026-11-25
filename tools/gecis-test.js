// Kısa bölümlere geçiş testi (v0.92, A5.2; js/gecis.js): eski kayıtlar doğru taşınıyor mu?
//   node tools/gecis-test.js
const assert = require('assert');
const GC = require('../js/gecis.js');
const G = require('../js/gen.js');
const T = require('../js/bolumler.js');
const GOREV = require('../js/gorevler.js');

const ffSay = d => (d.rings || []).filter(r => r[2] === 'ff').length;
const dep = {
  kisaSayi: T.kisaSayi,
  kaynak: c => { const t = T.kisaBul(c); return t && t.kaynak ? t.kaynak[0] : 0; },
  ffKisa: c => ffSay(G.createKisa(c)), ffUzun: k => ffSay(G.createBolum(k))
};
const dep2 = { kisaSayi: T.kisaSayi, kaynak: dep.kaynak, ffKisaIkinci: c => ffSay(G.createKisaIkinci(c)), ffUzunIkinci: u => ffSay(G.createBolum(u)) };
const cocuk = k => { const o = []; for (let c = 1; c <= T.kisaSayi; c++) if (dep.kaynak(c) === k) o.push(c); return o; };

assert.strictEqual(T.kisaSayi, 83, '83 kısa bölüm');
// her uzun bölümün (1–24) en az bir kısa çocuğu var, her kısa bölümün kaynağı 1–24
for (let k = 1; k <= 24; k++) assert(cocuk(k).length >= 3, 'uzun ' + k + ' çocuksuz');
for (let c = 1; c <= 83; c++) { const k = dep.kaynak(c); assert(k >= 1 && k <= 24, 'kaynak ' + c); }

// eşleme
assert.strictEqual(GC.esle(101, 83), 1); assert.strictEqual(GC.esle(183, 83), 83);
assert.strictEqual(GC.esle(25, 83), 84); assert.strictEqual(GC.esle(48, 83), 107);
assert.strictEqual(GC.esle(7, 83), null); assert.strictEqual(GC.esle(184, 83), null);

// 1) Taş Kuyu ve Maden'in ilk iki uzun bölümü geçilmiş; 2. bölümde ateşböceklerinin yarısı; denemede 4. kısa bölüm (gerçek kayıt)
const ffU2 = dep.ffUzun(2);
const save = {
  hikayeV: 2,
  best: { 1: { done: true, ff: dep.ffUzun(1), perfect: true, flow: true, reward: 300 }, 2: { done: true, ff: Math.floor(ffU2 / 2), reward: 200 },
    7: { done: true, ff: 0 }, 8: { done: false }, 25: { done: true, ff: 2, perfect: true, reward: 400 } },
  kisaBest: { 104: { done: true, ff: 1, perfect: true, flow: false, time: 12.3, reward: 150 } },
  istat: { bolum: { 1: { deneme: 3 }, 104: { deneme: 2 }, 30: { deneme: 5 } } }
};
const hk = { v: 1, bolum: { 1: { d: 'a' }, 104: { d: 'b' }, 25: { d: 'c' } } };
assert.strictEqual(GC.kisaGecis(save, dep, hk), true);
const B = save.best;
// 1. uzun → 1, 2, 3 geçildi, madalyasız, bütün ateşböcekleri ödenmiş sayılır
cocuk(1).forEach(c => { assert(B[c].done && B[c].tasindi && !B[c].perfect && !B[c].flow && B[c].ff === 0, 'taşınan ' + c); assert.strictEqual(B[c].odenen, dep.ffKisa(c)); });
// 2. uzun: 4 denemede gerçekten geçilmiş (aynen), diğerleri yarı oranla ödenmiş
assert.deepStrictEqual(B[4], save.kisaDeneme[104]);
cocuk(2).filter(c => c !== 4).forEach(c => { assert(B[c].tasindi); assert.strictEqual(B[c].odenen, Math.min(dep.ffKisa(c), Math.round(dep.ffKisa(c) * Math.floor(ffU2 / 2) / ffU2))); });
// 7. uzun (Maden 1) → 19, 20, 21 geçildi; 8 geçilmemiş → 22–24 yok
cocuk(7).forEach(c => assert(B[c] && B[c].done, 'maden ' + c));
cocuk(8).forEach(c => assert(!B[c], 'geçilmemiş uzun 8 → ' + c));
// ikinci yolculuk birebir
assert.deepStrictEqual(B[84], save.uzunBest[25]);
// geçilmemiş taş kuyu bölümü yok; sıradaki: Taş Kuyu 3. uzundan doğan ilk kısa bölüm
const sira = Math.min(...cocuk(3));
assert.strictEqual(save.last, sira); assert.strictEqual(save.haritaSon, sira);
// arşivler, anahtarlar
assert(save.uzunBest[1] && save.uzunBest[7] && !save.kisaBest && save.kisaDeneme[104]);
assert.deepStrictEqual(Object.keys(save.istat.bolum).sort(), ['4', '89']);
assert.deepStrictEqual(Object.keys(hk.bolum).sort(), ['4', '84']);
assert.strictEqual(save.hikayeV, 3);
// ikinci kez çalışmaz
const kopya = JSON.stringify(save);
assert.strictEqual(GC.kisaGecis(save, dep, hk), false);
assert.strictEqual(JSON.stringify(save), kopya);

// 1b) v0.93 (A5.3): uzun ikinci yolculuk (84 = eski 25, tarif 1) kısa ikinci yolculuğa (84–166)
assert.strictEqual(GC.ikinciGecis(save, dep2, hk), true);
const B2 = save.best;
cocuk(1).forEach(c => { const r = B2[83 + c]; assert(r && r.done && r.tasindi && r.ff === 0, 'ikinci ' + c); assert.strictEqual(r.odenen, Math.min(dep2.ffKisaIkinci(c), Math.round(dep2.ffKisaIkinci(c) * 2 / dep2.ffUzunIkinci(25)))); });
assert(!B2[83 + Math.max(...cocuk(1)) + 1], 'tarif 2 ikinci geçilmedi');
assert.deepStrictEqual(save.uzunIkinci[84], save.uzunBest[25]);
assert.strictEqual(save.last, sira); // ilk yolculukta eksik bölüm var: sıradaki aynı
assert.deepStrictEqual(Object.keys(save.istat.bolum), ['4']);
assert.deepStrictEqual(Object.keys(hk.bolum), ['4']);
assert.strictEqual(save.hikayeV, 4);
assert.strictEqual(GC.ikinciGecis(save, dep2, hk), false);

// 2) Bütün Hikâye (24 uzun) geçilmiş eski oyuncu: 83 kısa geçildi, sıradaki 84 (ikinci yolculuk)
const hepsi = { best: {} };
for (let k = 1; k <= 24; k++) hepsi.best[k] = { done: true, ff: dep.ffUzun(k) };
GC.kisaGecis(hepsi, dep, null);
for (let c = 1; c <= 83; c++) assert(hepsi.best[c].done, 'hepsi ' + c);
assert.strictEqual(hepsi.last, 84);
// ikinci yolculuğun ilk 6 uzun bölümü de geçilmiş (v0.92'de 84–89): kısa ikinci yolculukta Taş Kuyu'nun hepsi (84–101) geçildi
for (let u = 25; u <= 30; u++) hepsi.best[u + 59] = { done: true, ff: dep2.ffUzunIkinci(u) };
GC.ikinciGecis(hepsi, dep2, null);
for (let c = 1; c <= 18; c++) assert(hepsi.best[83 + c] && hepsi.best[83 + c].done && hepsi.best[83 + c].odenen === dep2.ffKisaIkinci(c), 'ikinci taş ' + c);
assert(!hepsi.best[83 + 19], 'ikinci maden geçilmedi');
assert.strictEqual(hepsi.last, 83 + 19);
// ateşböceği: bütün kısa bölümler ödenmiş sayılır (tekrar ödeme yok)
let od = 0, top = 0; for (let c = 1; c <= 83; c++) { od += hepsi.best[c].odenen; top += dep.ffKisa(c); }
assert.strictEqual(od, top);
// Kâşif: 83 geçilen → Gümüş (60), Altın değil (107)
GOREV.ensure(hepsi);
const kasif = GOREV.achList(hepsi).find(a => a.id === 'kasif');
assert.strictEqual(kasif.val, 83 + 18); assert.strictEqual(kasif.tier, 2); // 18 / 83 / 166

// 3) Yeni oyuncu: boş kayıt
const yeni = { best: {} };
GC.kisaGecis(yeni, dep, null); GC.ikinciGecis(yeni, dep2, null);
assert.deepStrictEqual(yeni.best, {}); assert.strictEqual(yeni.last, 1); assert.strictEqual(yeni.hikayeV, 4);
assert(!('uzunBest' in yeni) && !('kisaDeneme' in yeni) && !('uzunIkinci' in yeni));
// v3 olmadan v4 çalışmaz
assert.strictEqual(GC.ikinciGecis({ best: {}, hikayeV: 2 }, dep2, null), false);

console.log('Tamam: kısa bölümlere geçiş (eşleme, taşınan bölümler, ödenmiş ateşböcekleri, ikinci yolculuk uzun → kısa, hayalet ve istatistik, Kâşif)');
