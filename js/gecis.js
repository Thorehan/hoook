/* Hoook — kısa bölümlere geçiş (v0.92, İstişare 6 A5.2; docs/kisa-bolumler-plan.md §5).
   83 kısa bölüm Hikâye'nin 1–83. bölümleri olur; ikinci yolculuğun uzun bölümleri (eski 25–48) 84–107 olur.
   Eski 24 uzun bölüm oyundan kalkar, kayıtları save.uzunBest'te arşivde durur (geri dönüş için).
   Kurallar (Muhammed, Törehan onayı 25/11):
   - Denemede gerçekten geçilen kısa bölümün kaydı (save.kisaBest[100 + no]) aynen taşınır.
   - Uzun bölüm k geçildiyse ondan doğan kısa bölümler "geçildi, madalyasız" (1 yıldız) sayılır.
   - Ateşböcekleri tekrar ödenmez: uzun bölümde toplanan oran kadarı kısa bölümde ödenmiş sayılır (odenen).
   - İkinci yolculuğun kayıtları birebir yeni numaraya geçer. Hayaletler ve bölüm istatistikleri de yeni numaraya taşınır;
     eski uzun bölümlerinki (1–24) bırakılır (o bölümler artık yok).
   Kayıt nesnesi üzerinde çalışır, DOM bilmez; Node'da da yüklenir (tools/gecis-test.js). */
(function (root) {
  'use strict';
  var KISA_DENEME = 100, IKINCI_FARK = 59, SURUM = 3;

  // eski bölüm numarası → yeni numara (null: artık yok)
  function esle(eski, kisaSayi) {
    var n = +eski;
    if (n > KISA_DENEME && n <= KISA_DENEME + kisaSayi) return n - KISA_DENEME; // kısa deneme 101–183 → 1–83
    if (n >= 25 && n <= 48) return n + IKINCI_FARK; // ikinci yolculuk 25–48 → 84–107
    return null; // eski uzun 1–24
  }
  function tasiAnahtar(nesne, kisaSayi) {
    var yeni = {};
    Object.keys(nesne || {}).forEach(function (k) { var y = esle(k, kisaSayi); if (y != null) yeni[y] = nesne[k]; });
    return yeni;
  }

  // dep: { kisaSayi, kaynak(no) → eski uzun bölüm no, ffKisa(no) → ateşböceği sayısı, ffUzun(k) → ateşböceği sayısı }
  // hayalet: { bolum: {...} } (kuyu.hayalet) ya da null. Değiştiyse true döner.
  function kisaGecis(save, dep, hayalet) {
    if ((save.hikayeV || 0) >= SURUM) return false;
    var eski = save.best || {}, deneme = save.kisaBest || {}, nb = {};
    for (var c = 1; c <= dep.kisaSayi; c++) {
      var dn = deneme[KISA_DENEME + c];
      if (dn && dn.done) { nb[c] = Object.assign({}, dn); continue; }
      var k = dep.kaynak(c), eb = k ? eski[k] : null;
      if (!(eb && eb.done)) continue;
      var cT = dep.ffKisa(c), kT = dep.ffUzun(k), oran = kT ? Math.min(1, (eb.ff || 0) / kT) : 0;
      nb[c] = { done: true, ff: 0, perfect: false, flow: false, reward: 0, speed: 0, tasindi: true, odenen: Math.min(cT, Math.round(cT * oran)) };
    }
    for (var u = 25; u <= 48; u++) if (eski[u]) nb[u + IKINCI_FARK] = Object.assign({}, eski[u]);
    if (Object.keys(eski).length) save.uzunBest = eski;
    if (Object.keys(deneme).length) save.kisaDeneme = deneme;
    delete save.kisaBest;
    save.best = nb;
    var son = dep.kisaSayi + 24, sira = 1;
    while (nb[sira] && nb[sira].done && sira < son) sira++;
    save.last = sira; save.maxLevel = sira; save.haritaSon = sira; // haritada Çıra sıradaki bölümde başlar (atlama yok)
    if (save.istat && save.istat.bolum) { save.istat.eskiBolum = save.istat.bolum; save.istat.bolum = tasiAnahtar(save.istat.bolum, dep.kisaSayi); }
    if (hayalet && hayalet.bolum) hayalet.bolum = tasiAnahtar(hayalet.bolum, dep.kisaSayi);
    save.hikayeV = SURUM;
    return true;
  }

  var api = { kisaGecis: kisaGecis, esle: esle, SURUM: SURUM, IKINCI_FARK: IKINCI_FARK };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KuyuGecis = api;
})(typeof window !== 'undefined' ? window : this);
