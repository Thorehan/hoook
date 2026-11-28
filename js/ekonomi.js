/* Kuyu — ekonomi: cüzdan (ateşböceği), günlük giriş takvimi ve dolap (kozmetik mağaza).
   Kayıt nesnesi (save) üzerinde çalışır, DOM bilmez; Node'da da yüklenir (tools/ekonomi-test.js).
   Tarayıcıda window.KuyuEkonomi.

   Karar (2026-11-10): harcamalar kozmetik (v0.49'dan beri ayrıca devam hakkı); güçlendirme satılmaz. Para birimi ateşböceği.
   Kazanç: bölümde İLK KEZ alınan ateşböceği (aynı bölümü tekrar oynayıp kasılmaz), Sonsuz/Günlük koşuda
   toplanan her ateşböceği, görev, başarım kademesi, günlük giriş. Video ile ikiye katlama yalnızca oyuncu seçerse. */
(function (root) {
  'use strict';

  var GIRIS = [5, 5, 10, 10, 15, 15, 50];      // 7 günlük takvim; 7. günden sonra başa döner
  var GOREV_ATES = [5, 10, 15];                 // kolay / orta / zor görev
  var BASARIM_ATES = [10, 25, 50];              // bronz / gümüş / altın kademe

  // Dolap. Fiyatlar tools/ekonomi-olcum.js ile ölçülen kazanca göre (README → Ekonomi).
  var KATALOG = [
    // Karakterler (v0.76, İstişare 4 Aşama 2): renk alanı çizim anahtarıdır (js/karakter.js). Hepsi aynı boyut ve fizik, yalnız görünüş.
    // Nadirlik: Nadir · Destansı · Efsane; etkinlik karakterleri Market'te satılmaz (etkinlik: nereden geldiği).
    { id: 'kr-cira', tur: 'karakter', ad: 'Çıra', renk: 'cira', fiyat: 0, nadir: 'baslangic' },
    { id: 'kr-kibrit', tur: 'karakter', ad: 'Kibrit', renk: 'kibrit', fiyat: 240, nadir: 'nadir' },
    { id: 'kr-mum', tur: 'karakter', ad: 'Mum', renk: 'mum', fiyat: 260, nadir: 'nadir' },
    { id: 'kr-komur', tur: 'karakter', ad: 'Kömür', renk: 'komur', fiyat: 280, nadir: 'nadir' },
    { id: 'kr-bocek', tur: 'karakter', ad: 'Ateş böceği', renk: 'bocek', fiyat: 520, nadir: 'destansi' },
    { id: 'kr-ruh', tur: 'karakter', ad: 'Fener ruhu', renk: 'ruh', fiyat: 560, nadir: 'destansi' },
    { id: 'kr-volkan', tur: 'karakter', ad: 'Volkan taşı', renk: 'volkan', fiyat: 600, nadir: 'destansi' },
    { id: 'kr-yildiz', tur: 'karakter', ad: 'Yıldız kayması', renk: 'yildiz', fiyat: 1200, nadir: 'efsane' },
    { id: 'kr-anka', tur: 'karakter', ad: 'Anka yavrusu', renk: 'anka', nadir: 'efsane', etkinlik: 'Sezon 1 ödülü' },
    // Baş ve Yüz takıları (v0.76); "Yok" bedava varsayılan
    { id: 'bas-yok', tur: 'bas', ad: 'Yok', renk: '', fiyat: 0 },
    { id: 'bas-bere', tur: 'bas', ad: 'Bere', renk: 'bere', fiyat: 70 },
    { id: 'bas-kask', tur: 'bas', ad: 'Madenci kaskı', renk: 'kask', fiyat: 220 },
    { id: 'bas-silindir', tur: 'bas', ad: 'Silindir şapka', renk: 'silindir', fiyat: 300 },
    { id: 'bas-tac', tur: 'bas', ad: 'Taç', renk: 'tac', fiyat: 650 },
    { id: 'yuz-yok', tur: 'yuz', ad: 'Yok', renk: '', fiyat: 0 },
    { id: 'yuz-gozluk', tur: 'yuz', ad: 'Güneş gözlüğü', renk: 'gozluk', fiyat: 90 },
    { id: 'yuz-biyik', tur: 'yuz', ad: 'Bıyık', renk: 'biyik', fiyat: 100 },
    { id: 'yuz-monokl', tur: 'yuz', ad: 'Monokl', renk: 'monokl', fiyat: 200 },
    { id: 'yuz-maske', tur: 'yuz', ad: 'Kahraman maskesi', renk: 'maske', fiyat: 260 },
    // Renk (eski "Kahraman" gövdeleri, v0.76): her karaktere uygulanan boya. Özgün: her karakterin kendi rengi (Çıra'da turuncu).
    { id: 'govde-turuncu', tur: 'govde', ad: 'Özgün', renk: '#f26a3a', renk2: '#b8401b', fiyat: 0 },
    { id: 'govde-deniz', tur: 'govde', ad: 'Deniz', renk: '#3aa0f2', renk2: '#1b5fb8', fiyat: 60 },
    { id: 'govde-cimen', tur: 'govde', ad: 'Çimen', renk: '#5cc45a', renk2: '#2f7d2d', fiyat: 60 },
    { id: 'govde-lavanta', tur: 'govde', ad: 'Lavanta', renk: '#a77cf2', renk2: '#6a45b8', fiyat: 90 },
    { id: 'govde-pembe', tur: 'govde', ad: 'Pembe', renk: '#f27ab0', renk2: '#b8457a', fiyat: 90 },
    { id: 'govde-gece', tur: 'govde', ad: 'Gece', renk: '#4a5680', renk2: '#252b45', fiyat: 120 },
    { id: 'govde-altin', tur: 'govde', ad: 'Altın', renk: '#f2c23a', renk2: '#b88a1b', fiyat: 150 },
    { id: 'govde-nar', tur: 'govde', ad: 'Nar', renk: '#e23b4a', renk2: '#8f1d2a', fiyat: 220 },
    { id: 'govde-buz', tur: 'govde', ad: 'Buz', renk: '#bfeaff', renk2: '#6fb6d8', fiyat: 300 },
    { id: 'govde-golge', tur: 'govde', ad: 'Gölge', renk: '#3a3f52', renk2: '#14161f', fiyat: 450 },
    { id: 'govde-ay', tur: 'govde', ad: 'Ay ışığı', renk: '#f4f1e0', renk2: '#b9b39a', fiyat: 700 },
    { id: 'govde-koz', tur: 'govde', ad: 'Köz', renk: '#ff5a2a', renk2: '#7a1a0a', isik: 14 },
    { id: 'govde-gunes', tur: 'govde', ad: 'Güneş', renk: '#fff0a8', renk2: '#f2b23a', isik: 20 },
    // kanca biçimi (renk alanı biçim adı)
    { id: 'kanca-ok', tur: 'kanca', ad: 'Ok', renk: 'ok', fiyat: 0 },
    { id: 'kanca-capa', tur: 'kanca', ad: 'Çapa', renk: 'capa', fiyat: 50 },
    { id: 'kanca-yildiz', tur: 'kanca', ad: 'Yıldız', renk: 'yildiz', fiyat: 80 },
    { id: 'kanca-kalp', tur: 'kanca', ad: 'Kalp', renk: 'kalp', fiyat: 100 },
    { id: 'kanca-hilal', tur: 'kanca', ad: 'Hilal', renk: 'hilal', fiyat: 160 },
    { id: 'kanca-elmas', tur: 'kanca', ad: 'Elmas', renk: 'elmas', fiyat: 260 },
    { id: 'atki-turkuaz', tur: 'atki', ad: 'Turkuaz', renk: '#2fb3a6', fiyat: 0 },
    { id: 'atki-kiraz', tur: 'atki', ad: 'Kiraz', renk: '#e2445c', fiyat: 40 },
    { id: 'atki-mor', tur: 'atki', ad: 'Mor', renk: '#9b6bff', fiyat: 40 },
    { id: 'atki-altin', tur: 'atki', ad: 'Altın', renk: '#f2c23a', fiyat: 70 },
    { id: 'atki-gece', tur: 'atki', ad: 'Gece', renk: '#3b4fc4', fiyat: 70 },
    { id: 'atki-pembe', tur: 'atki', ad: 'Pembe', renk: '#ff8fc8', fiyat: 100 },
    { id: 'atki-kar', tur: 'atki', ad: 'Kar', renk: '#eef6f4', fiyat: 130 },
    { id: 'atki-zumrut', tur: 'atki', ad: 'Zümrüt', renk: '#35c27a', fiyat: 160 },
    { id: 'atki-gokkusagi', tur: 'atki', ad: 'Gökkuşağı', renk: 'gokkusagi', fiyat: 300 },
    { id: 'atki-fener', tur: 'atki', ad: 'Fener', renk: '#ffb84a', isik: 6 },
    // Sırt (v0.76): atkıların yanında pelerin ve kanat (sekil); renk takının rengi
    { id: 'atki-pelerin', tur: 'atki', ad: 'Mor pelerin', renk: '#9b5cff', sekil: 'pelerin', fiyat: 260 },
    { id: 'atki-pelerin-kor', tur: 'atki', ad: 'Kor pelerin', renk: '#e2392f', sekil: 'pelerin', fiyat: 360 },
    { id: 'atki-kanat', tur: 'atki', ad: 'Melek kanadı', renk: '#e8f6ff', sekil: 'kanat', fiyat: 600 },
    { id: 'ip-keten', tur: 'ip', ad: 'Keten', renk: '#eadfc4', fiyat: 0 },
    { id: 'ip-gok', tur: 'ip', ad: 'Gök', renk: '#8fd6ff', fiyat: 30 },
    { id: 'ip-zumrut', tur: 'ip', ad: 'Zümrüt', renk: '#5fd39a', fiyat: 50 },
    { id: 'ip-altin', tur: 'ip', ad: 'Altın', renk: '#ffd36b', fiyat: 60 },
    { id: 'ip-ates', tur: 'ip', ad: 'Ateş', renk: '#ff7a3a', fiyat: 90 },
    { id: 'ip-gumus', tur: 'ip', ad: 'Gümüş', renk: '#d6dee6', fiyat: 130 },
    { id: 'ip-mor', tur: 'ip', ad: 'Mor', renk: '#b58cff', fiyat: 160 },
    { id: 'ip-gokkusagi', tur: 'ip', ad: 'Gökkuşağı', renk: 'gokkusagi', fiyat: 400 },
    { id: 'ip-fitil', tur: 'ip', ad: 'Fitil', renk: '#ffe2a0', isik: 9 },
    { id: 'iz-atki', tur: 'iz', ad: 'Atkı rengi', renk: 'atki', fiyat: 0 },
    { id: 'iz-kar', tur: 'iz', ad: 'Kar', renk: '#e8f4f2', fiyat: 40 },
    { id: 'iz-mor', tur: 'iz', ad: 'Mor', renk: '#b58cff', fiyat: 60 },
    { id: 'iz-altin', tur: 'iz', ad: 'Altın', renk: '#ffd36b', fiyat: 80 },
    { id: 'iz-ates', tur: 'iz', ad: 'Ateş', renk: '#ff7a3a', fiyat: 120 },
    { id: 'iz-buz', tur: 'iz', ad: 'Buz', renk: '#8fd6ff', fiyat: 150 },
    { id: 'iz-gokkusagi', tur: 'iz', ad: 'Gökkuşağı', renk: 'gokkusagi', fiyat: 250 },
    { id: 'iz-kivilcim', tur: 'iz', ad: 'Kıvılcım', renk: '#ffe9a8', isik: 3 },
    { id: 'iz-samanyolu', tur: 'iz', ad: 'Samanyolu', renk: '#dfe9ff', isik: 17 },
    // alev rengi (v0.53): akışta alevlenince Çıra'nın çevresindeki alev; renk tabanı, renk2 ucu (TAM ALEV)
    { id: 'alev-kor', tur: 'alev', ad: 'Kor', renk: '#ff9a3c', renk2: '#ffe08a', fiyat: 0 },
    { id: 'alev-mavi', tur: 'alev', ad: 'Mavi alev', renk: '#3aa0f2', renk2: '#c8f0ff', fiyat: 200 },
    { id: 'alev-yesil', tur: 'alev', ad: 'Yeşil alev', renk: '#3ecf6a', renk2: '#d9ffb0', fiyat: 280 },
    { id: 'alev-mor', tur: 'alev', ad: 'Mor alev', renk: '#a05cff', renk2: '#f0d0ff', fiyat: 360 },
    { id: 'alev-beyaz', tur: 'alev', ad: 'Ak alev', renk: '#dfe9ff', renk2: '#ffffff', fiyat: 600 },
    { id: 'alev-altin', tur: 'alev', ad: 'Altın alev', renk: '#f2b23a', renk2: '#fff6c8', isik: 11 },
    // Haftalık lig görünümleri (v0.64): satın alınmaz, o lige ulaşınca açılır (lig: LIG sırası)
    { id: 'atki-altin-lig', tur: 'atki', ad: 'Altın lig', renk: '#f2c94c', lig: 2 },
    { id: 'iz-elmas', tur: 'iz', ad: 'Elmas', renk: '#9fe8ff', lig: 3 },
    { id: 'alev-fener-lig', tur: 'alev', ad: 'Fener alevi', renk: '#ffe08a', renk2: '#ffffff', lig: 4 }
  ];
  // Yuvalar (v0.76): sıra Koleksiyon ve Market sekmelerinin sırasıdır. İç adlar (govde, atki) eski kayıtlar için aynı kaldı.
  var TURLER = { karakter: 'Karakter', govde: 'Renk', bas: 'Baş', yuz: 'Yüz', atki: 'Sırt', kanca: 'Kanca', ip: 'İp', iz: 'Uçuş izi', alev: 'Alev' };
  var VARSAYILAN = { karakter: 'kr-cira', govde: 'govde-turuncu', bas: 'bas-yok', yuz: 'yuz-yok', atki: 'atki-turkuaz', ip: 'ip-keten', kanca: 'kanca-ok', iz: 'iz-atki', alev: 'alev-kor' };
  // Nadirlik (v0.76): açıkça verilmediyse fiyattan, ışık seviyesinden ya da ligden çıkar
  var NADIRLIK = { baslangic: 'Başlangıç', sira: 'Sıradan', nadir: 'Nadir', destansi: 'Destansı', efsane: 'Efsane' };
  function nadirlik(it) {
    if (!it) return 'sira';
    if (it.nadir) return it.nadir;
    if (it.lig != null) return it.lig >= 3 ? 'efsane' : 'destansi';
    if (it.isik) return it.isik >= 14 ? 'efsane' : it.isik >= 8 ? 'destansi' : 'nadir';
    var f = it.fiyat || 0;
    return f <= 150 ? 'sira' : f <= 420 ? 'nadir' : f <= 950 ? 'destansi' : 'efsane';
  }
  // Işık yolu (v0.53): ömür boyu kazanılan ateşböceği (harcamak düşürmez) 20 ışık seviyesine bölünür. İlk 10 seviye
  // v0.40'taki "Kuyunun ışığı"; 11–20 uzun vadeli hedef. Bazı seviyeler satın alınamayan bir görünüm açar (isik: N).
  var ISIK = [0, 25, 60, 120, 200, 320, 480, 700, 1000, 1400, 2000, 2700, 3500, 4400, 5400, 6500, 7700, 9000, 10500, 12000, 14000];
  function isikSeviye(save) {
    var n = (save.cuzdan && save.cuzdan.kazanilan) || 0, sv = 0;
    while (sv + 1 < ISIK.length && n >= ISIK[sv + 1]) sv++;
    return sv;
  }
  // Işık seviyesiyle açılan görünümler dolaba eklenir (kuşanmak oyuncunun seçimi). Yeni eklenenleri döner.
  function isikOdul(save) {
    var sv = isikSeviye(save), yeni = [];
    KATALOG.forEach(function (it) { if (it.isik && it.isik <= sv && save.dolap.sahip.indexOf(it.id) < 0) { save.dolap.sahip.push(it.id); yeni.push(it); } });
    return yeni;
  }
  function isikSiradaki(save) {
    var sv = isikSeviye(save), en = null;
    KATALOG.forEach(function (it) { if (it.isik && it.isik > sv && (!en || it.isik < en.isik)) en = it; });
    return en;
  }

  function item(id) { for (var i = 0; i < KATALOG.length; i++) if (KATALOG[i].id === id) return KATALOG[i]; return null; }

  // Eski kayıtlar: başlangıç bakiyesi bölümlerde toplanmış ateşböcekleri (zaten kazanılmıştı).
  function ensure(save) {
    if (!save.cuzdan) {
      var ff = 0, b = save.best || {};
      for (var k in b) ff += b[k].ff || 0;
      save.cuzdan = { ates: ff, kazanilan: ff, harcanan: 0 };
    }
    if (!save.dolap) save.dolap = { sahip: [], kusan: {} };
    // her türün bedava varsayılanı sahip olunur ve kuşanılır (sonradan eklenen türler eski kayıtlara da gelir)
    Object.keys(VARSAYILAN).forEach(function (t) {
      if (save.dolap.sahip.indexOf(VARSAYILAN[t]) < 0) save.dolap.sahip.push(VARSAYILAN[t]);
      if (!save.dolap.kusan[t]) save.dolap.kusan[t] = VARSAYILAN[t];
    });
    if (!save.giris) save.giris = { gun: 0, son: null, toplam: 0 };
    isikOdul(save);
    return save;
  }

  function kazan(save, n) {
    ensure(save);
    n = Math.max(0, Math.floor(n || 0));
    save.cuzdan.ates += n; save.cuzdan.kazanilan += n;
    isikOdul(save);
    return n;
  }
  // Bölüm sonu: yalnızca önceki en iyiyi aşan (ilk kez alınan) ateşböcekleri ödenir.
  function bolumOde(save, oncekiEnIyi, simdi) { return kazan(save, Math.max(0, (simdi || 0) - (oncekiEnIyi || 0))); }

  // ---------- günlük giriş ----------
  function girisDurum(save, key) {
    ensure(save);
    var g = save.giris;
    return { gun: g.gun, hazir: g.son !== key, odul: GIRIS[g.gun], takvim: GIRIS.slice(), toplam: g.toplam };
  }
  // kat: 1 ya da 2 (video). Bugün alındıysa 0 döner.
  function girisAl(save, key, kat) {
    var d = girisDurum(save, key);
    if (!d.hazir) return 0;
    var n = kazan(save, d.odul * (kat === 2 ? 2 : 1));
    save.giris.son = key; save.giris.gun = (save.giris.gun + 1) % GIRIS.length; save.giris.toplam++;
    return n;
  }

  // ---------- Haftalık Kuyu ligi (v0.54) ----------
  // Lig, haftanın en iyi puanına göre belirlenir (sahte rakip yok; online skor tablosu gelince aynı puan gönderilir).
  // Eşikler tools/denge.js ölçümünden: %20 hata yapan ~1000, %10 hata ~1600, akışla %10 hata ~11000, akışla %5 ~52000.
  // Ödül hafta bitince, bir sonraki açılışta ödenir (kayıt: save.haftalik = { key, best, meters, tries }).
  var LIG = [
    // v0.64: ödüller büyüdü (Sonsuz kalktı, yarışma Haftalık ve Günlük'te); Altın, Elmas ve Fener birer görünüm de açar
    { ad: 'Bronz', puan: 500, odul: 25 }, { ad: 'Gümüş', puan: 2000, odul: 50 }, { ad: 'Altın', puan: 6000, odul: 80 },
    { ad: 'Elmas', puan: 20000, odul: 120 }, { ad: 'Fener', puan: 50000, odul: 180 }
  ];
  function ligOf(puan) { var k = -1; for (var i = 0; i < LIG.length; i++) if (puan >= LIG[i].puan) k = i; return k; }
  function ligOdul(puan) { var k = ligOf(puan); return k < 0 ? 0 : LIG[k].odul; }
  function haftalikDurum(save, key) {
    var h = save.haftalik && save.haftalik.key === key ? save.haftalik : { key: key, best: 0, meters: 0, tries: 0 };
    var k = ligOf(h.best);
    return { key: key, best: h.best, meters: h.meters, tries: h.tries, lig: k, ligAd: k < 0 ? null : LIG[k].ad,
      sonraki: k + 1 < LIG.length ? LIG[k + 1] : null, odul: k < 0 ? 0 : LIG[k].odul };
  }
  // Koşu bitti: haftanın en iyisini güncelle. Döner: { rekor, lig, ligAtladi }
  function haftalikKaydet(save, key, puan, metre) {
    ensure(save);
    haftalikKapat(save, key); // önceki haftadan kalan varsa önce onu öde
    var h = save.haftalik && save.haftalik.key === key ? save.haftalik : { key: key, best: 0, meters: 0, tries: 0 };
    var once = ligOf(h.best), rekor = puan > h.best;
    h.tries++; h.best = Math.max(h.best, puan); h.meters = Math.max(h.meters, metre || 0);
    save.haftalik = h;
    // lig görünümleri: ulaşılan lige kadar olanlar açılır (bir kez)
    var k = ligOf(h.best), yeni = [];
    KATALOG.forEach(function (it) { if (it.lig != null && it.lig <= k && save.dolap.sahip.indexOf(it.id) < 0) { save.dolap.sahip.push(it.id); yeni.push(it); } });
    gecmisYaz(save, 'haftalik', key, { puan: h.best, lig: k });
    return { rekor: rekor, lig: k, ligAtladi: k > once, yeniGorunum: yeni };
  }
  // Yeni hafta başladıysa geçen haftanın lig ödülünü öde ve kaydı kapat. Ödenecek bir şey yoksa null.
  function haftalikKapat(save, key) {
    ensure(save);
    var h = save.haftalik;
    if (!h || h.key === key) return null;
    var k = ligOf(h.best), sonuc = k < 0 ? null : { lig: k, ligAd: LIG[k].ad, puan: h.best, odul: kazan(save, LIG[k].odul) };
    save.haftalik = null;
    return sonuc;
  }

  // ---------- dolap ----------
  function sahip(save, id) { ensure(save); return save.dolap.sahip.indexOf(id) >= 0; }
  // Devam hakkı (Sonsuz): bir koşuda en çok 3; bedel artar. Video yalnız ilk devamda (oyuncu seçerse).
  var DEVAM_BEDEL = [25, 50, 100];
  function devamBedel(n) { return n < DEVAM_BEDEL.length ? DEVAM_BEDEL[n] : null; }
  function devamOde(save, n) {
    ensure(save);
    var b = devamBedel(n);
    if (b == null || save.cuzdan.ates < b) return false;
    save.cuzdan.ates -= b; save.cuzdan.harcanan += b;
    return true;
  }
  // anahtar (v0.77): { gun, hafta } verilirse günün fiyatı (indirim) ve haftanın ürünü kuralı uygulanır
  function satinAl(save, id, anahtar) {
    ensure(save);
    var it = item(id);
    if (!it) return { ok: false, neden: 'yok' };
    if (sahip(save, id)) return { ok: false, neden: 'sahip' };
    if (it.isik) return { ok: false, neden: 'isik', seviye: it.isik }; // satın alınmaz: ışık seviyesiyle açılır
    if (it.lig != null) return { ok: false, neden: 'lig', lig: it.lig }; // satın alınmaz: Haftalık ligle açılır
    if (it.etkinlik) return { ok: false, neden: 'etkinlik', etkinlik: it.etkinlik }; // satın alınmaz: etkinlikten gelir
    if (anahtar && anahtar.hafta && !satista(id, anahtar.hafta)) return { ok: false, neden: 'haftalik' }; // Efsane: haftanın ürünü değil
    var fiyat = anahtar && anahtar.gun ? fiyatBugun(save, id, anahtar.gun) : it.fiyat;
    if (save.cuzdan.ates < fiyat) return { ok: false, neden: 'yetersiz', eksik: fiyat - save.cuzdan.ates };
    save.cuzdan.ates -= fiyat; save.cuzdan.harcanan += fiyat;
    save.dolap.sahip.push(id);
    save.dolap.kusan[it.tur] = id;
    return { ok: true };
  }
  // ---------- Market (v0.77, İstişare 4 Aşama 3) ----------
  // Günlük vitrin: herkes için aynı 4 ürün (tarihten): bir karakter, bir takı (baş/yüz/sırt), iki ürün daha; biri video ile %50.
  // Haftanın ürünü: Destansı ya da Efsane, pazartesi döner. Efsane ürünler yalnız haftanın ürünü oldukları hafta satılır.
  // v0.96: Market'te bir kutu var (aşağıda, Törehan onayı 27/11); kutunun olasılıkları üstünde yazar. Ürünlerin içeriği ve fiyatı görünür.
  // Video yalnız oyuncu seçerse.
  function satilir(it) { return !!(it && it.fiyat > 0 && !it.isik && it.lig == null && !it.etkinlik); }
  function tohumla(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rasgele(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function sec(r, liste) { return liste.length ? liste[Math.floor(r() * liste.length)] : null; }
  // Haftanın ürünü: Efsane ürünler ve Destansı karakter/takılar sabit karışık bir sırayla döner (her hafta bir sonraki; havuz bitince başa)
  function haftalikUrun(haftaKey) {
    // havuz: Efsane her şey + Destansı karakter ve takılar (renk, ip, iz gibi küçük ürünler vitrinde kalır)
    var havuz = KATALOG.filter(function (it) { var n = nadirlik(it), buyuk = it.tur === 'karakter' || it.tur === 'bas' || it.tur === 'yuz' || (it.tur === 'atki' && it.sekil); return satilir(it) && (n === 'efsane' || (n === 'destansi' && buyuk)); }).map(function (it) { return it.id; }).sort();
    if (!havuz.length) return null;
    var r = rasgele(tohumla('hoook-haftalik-sira'));
    for (var i = havuz.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), x = havuz[i]; havuz[i] = havuz[j]; havuz[j] = x; }
    var hafta = Math.floor(Date.parse(haftaKey + 'T12:00:00Z') / (7 * 864e5));
    return havuz[((hafta % havuz.length) + havuz.length) % havuz.length];
  }
  function haftaOf(gunKey) { var d = new Date(Date.parse(gunKey + 'T12:00:00Z')); d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7); return d.toISOString().slice(0, 10); }
  function oncekiGun(gunKey) { var d = new Date(Date.parse(gunKey + 'T12:00:00Z') - 864e5); return d.toISOString().slice(0, 10); }
  // dün vitrinde olanlar bugün çıkmaz (dünün ham seçimi; zincir kurmaz)
  function vitrin(gunKey, hamMi) {
    var r = rasgele(tohumla('hoook-vitrin-' + gunKey)), secilen = [], dun = hamMi ? [] : vitrin(oncekiGun(gunKey), true).urunler;
    var hu = haftalikUrun(haftaOf(gunKey)); // haftanın ürünü vitrinde ayrıca çıkmaz
    var olur = function (it) { return satilir(it) && nadirlik(it) !== 'efsane' && it.id !== hu && secilen.indexOf(it.id) < 0 && dun.indexOf(it.id) < 0; };
    var kar = sec(r, KATALOG.filter(function (it) { return olur(it) && it.tur === 'karakter'; })); if (kar) secilen.push(kar.id);
    var tak = sec(r, KATALOG.filter(function (it) { return olur(it) && (it.tur === 'bas' || it.tur === 'yuz' || (it.tur === 'atki' && it.sekil)); })); if (tak) secilen.push(tak.id);
    while (secilen.length < 4) { var x = sec(r, KATALOG.filter(function (it) { return olur(it) && it.tur !== 'karakter'; })); if (!x) break; secilen.push(x.id); }
    return { urunler: secilen, indirimli: secilen[Math.floor(r() * secilen.length)] || null };
  }
  // Satışta mı: Efsane yalnız haftanın ürünüyken; diğerleri her zaman (satılırsa)
  function satista(id, haftaKey) { var it = item(id); return satilir(it) && (nadirlik(it) !== 'efsane' || haftalikUrun(haftaKey) === id); }
  function marketDurum(save) { ensure(save); if (!save.market) save.market = { video: {}, gorulen: null }; return save.market; }
  // Bugünkü fiyat: vitrinin indirimli ürünü için video izlendiyse yarısı
  function fiyatBugun(save, id, gunKey) {
    var it = item(id); if (!it || !satilir(it)) return null;
    var m = marketDurum(save);
    return gunKey && m.video[gunKey] === id && vitrin(gunKey).indirimli === id ? Math.ceil(it.fiyat / 2) : it.fiyat;
  }
  function vitrinVideo(save, gunKey) {
    var m = marketDurum(save), v = vitrin(gunKey).indirimli; if (!v) return null;
    var y = {}; y[gunKey] = v; m.video = y; // yalnız bugün geçerli
    return v;
  }
  function vitrinGordu(save, gunKey) { marketDurum(save).gorulen = gunKey; }
  // ---------- Yeni ürün rozeti (v0.97) ----------
  // Yeni: bugünün vitrinine ya da bu haftanın ürününe gelen, sende olmayan ürün. Rozet üç yerde: ürünün üstünde, bölüm başlığında
  // ve kategori sekmesinde. Ürüne dokunmak (ürün sayfası) o ürünün bütün rozetlerini siler; kategori sekmesine dokunmak yalnız o
  // sekmenin rozetini siler. Görülen, ürünün geldiği gün/hafta anahtarıyla saklanır: ürün yeniden gelirse yine yeni olur.
  function yeniUrunler(save, gunKey, haftaKey) {
    var L = vitrin(gunKey).urunler.map(function (id) { return { id: id, key: gunKey, yer: 'vitrin' }; }), hu = haftalikUrun(haftaKey);
    if (hu) L.push({ id: hu, key: haftaKey, yer: 'haftalik' });
    return L.filter(function (y) { return satilir(item(y.id)) && !sahip(save, y.id); });
  }
  function yeniBul(save, id, gunKey, haftaKey) { var L = yeniUrunler(save, gunKey, haftaKey); for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  function gorulenler(save) { var m = marketDurum(save); if (!m.gorulenUrun) m.gorulenUrun = {}; if (!m.gorulenSekme) m.gorulenSekme = {}; return m; }
  function urunYeniMi(save, id, gunKey, haftaKey) { var y = yeniBul(save, id, gunKey, haftaKey); return !!y && gorulenler(save).gorulenUrun[id] !== y.key; }
  function urunGordu(save, id, gunKey, haftaKey) { var y = yeniBul(save, id, gunKey, haftaKey), m = gorulenler(save); if (y) { m.gorulenUrun[id] = y.key; m.gorulenSekme[id] = y.key; } }
  // kategori sekmesinde rozet: o türden, ne ürünü ne sekmesi görülmüş yeni ürün varsa
  function sekmeYeniMi(save, tur, gunKey, haftaKey) {
    var m = gorulenler(save);
    return yeniUrunler(save, gunKey, haftaKey).some(function (y) { return item(y.id).tur === tur && m.gorulenUrun[y.id] !== y.key && m.gorulenSekme[y.id] !== y.key; });
  }
  function sekmeGordu(save, tur, gunKey, haftaKey) { var m = gorulenler(save); yeniUrunler(save, gunKey, haftaKey).forEach(function (y) { if (item(y.id).tur === tur) m.gorulenSekme[y.id] = y.key; }); }
  // Market'te görülmemiş yeni ürün var mı (yer: 'vitrin' | 'haftalik' | boş = hepsi)
  function yeniVarMi(save, gunKey, haftaKey, yer) { var m = gorulenler(save); return yeniUrunler(save, gunKey, haftaKey).some(function (y) { return (!yer || y.yer === yer) && m.gorulenUrun[y.id] !== y.key; }); }

  function kusan(save, id) {
    var it = item(id);
    if (!it || !sahip(save, id)) return false;
    save.dolap.kusan[it.tur] = id;
    return true;
  }
  // Çizim için kuşanılan renkler: { atki, ip, iz } ('gokkusagi' canlı renk, iz 'atki' ise atkıyı izler)
  // ek (v0.76): { tur: id } kuşanılanın yerine (önizleme). Karakter, baş ve yüz çizim anahtarı; Sırt'ta sekil (atki/pelerin/kanat);
  // Renk "Özgün" (govde-turuncu) iken ozgun: her karakter kendi rengiyle çizilir.
  function gorunum(save, ek) {
    ensure(save);
    var k = save.dolap.kusan, out = {};
    Object.keys(VARSAYILAN).forEach(function (t) {
      var id = ek && ek[t] ? ek[t] : k[t], it = item(id) || item(VARSAYILAN[t]);
      out[t] = it.renk; if (it.renk2) out[t + '2'] = it.renk2; if (it.sekil) out[t + 'Sekil'] = it.sekil;
      if (t === 'govde') out.ozgun = it.id === 'govde-turuncu';
    });
    return out;
  }

  // ---------- Günlük ve Haftalık Kuyu: deneme hakları (v0.64) ----------
  // Serbest Sonsuz Kuyu kalktı; yarışma modlarında her koşu bir hak harcar (Yeniden dene ve Baştan başla dahil).
  // Hak bitince video ile +1 deneme: 1. yenileme 1 video, 2. yenileme 2 video, … 5. yenileme 5 video; sonra o gün/hafta
  // başka reklam ve deneme yok, oyuncu Hikâye'ye yönlendirilir. Video yalnız oyuncu seçerse oynar.
  var HAK = { gunluk: 3, haftalik: 5 }, YENILEME_EN = 5;
  function hakKayit(save, tur, key) {
    if (!save.haklar) save.haklar = {};
    var h = save.haklar[tur];
    if (!h || h.key !== key) h = save.haklar[tur] = { key: key, kullanilan: 0, ek: 0, yenileme: 0, izlenen: 0 };
    return h;
  }
  function hakDurum(save, tur, key) {
    var h = hakKayit(save, tur, key), toplam = HAK[tur] + h.ek;
    return { kalan: Math.max(0, toplam - h.kullanilan), toplam: toplam, kullanilan: h.kullanilan, yenileme: h.yenileme,
      bedel: h.yenileme < YENILEME_EN ? h.yenileme + 1 : null, izlenen: h.izlenen, son: h.yenileme >= YENILEME_EN };
  }
  function hakKullan(save, tur, key) {
    if (hakDurum(save, tur, key).kalan <= 0) return false;
    hakKayit(save, tur, key).kullanilan++;
    return true;
  }
  // Bir video izlendi. Döner: { yenilendi, kalanVideo } ya da sınır dolduysa null
  function hakVideo(save, tur, key) {
    var h = hakKayit(save, tur, key);
    if (h.yenileme >= YENILEME_EN) return null;
    h.izlenen++;
    if (h.izlenen >= h.yenileme + 1) { h.yenileme++; h.izlenen = 0; h.ek++; return { yenilendi: true, kalanVideo: 0 }; }
    return { yenilendi: false, kalanVideo: h.yenileme + 1 - h.izlenen };
  }
  // ---------- Günün hedefi (v0.64) ----------
  // Her gün bir hedef metre (600–1000, günün tarihinden); 1 yıldız hedef, 2 yıldız 1,5 kat, 3 yıldız 2 kat.
  // Her yıldız günde bir kez ödül verir.
  var YILDIZ_ODUL = [5, 5, 10]; // v0.64 ölçümü: daha büyükse ortalama gün ~120'den ~165'e çıkıyor
  // v0.96 (İstişare 7, Törehan onayı 27/11): Günlük Kuyu 28/11'den itibaren bitişli: kuyunun 500. metresinde bitiş çizgisi,
  // amaç tepeye en kısa sürede çıkmak. 1 yıldız bitirmek, 2 yıldız 75 sn, 3 yıldız 35 sn (ölçüm: temkinli bot ~46 sn,
  // akışla oynayan ~13 sn; insan ~1,5–2 kat yavaş). Puan süreden: 10000 − süre × 10 (0,1 sn hassas); bitiremeyen metresi kadar.
  // Haftalık Kuyu'nun sonu yok (puan ve lig aynı). Eski günler eski ölçüyle kalır (metre hedefi).
  // Ödül: bitişli koşu ~1 dk sürer (eskisi 3 dk'ya kadar), yolda daha az ateşböceği toplanır; yıldız ödülü bunu karşılar,
  // ortalama gün ~147 kalır (ölçüm node tools/ekonomi-olcum.js; eski günler ESKI_GUN=1).
  var GUN_BITIS = { metre: 500, sure: [75, 35], basla: '2026-11-28', odul: [25, 20, 15] };
  function gunYildizOdul(key) { return gunBitisli(key) ? GUN_BITIS.odul : YILDIZ_ODUL; }
  function gunBitisli(key) { return !!key && key >= GUN_BITIS.basla; }
  function gunBitisPuan(sn) { return Math.max(1000, 10000 - Math.round(sn * 10)); }
  function gunSureYildiz(sn) { return sn == null ? 0 : sn <= GUN_BITIS.sure[1] ? 3 : sn <= GUN_BITIS.sure[0] ? 2 : 1; }
  function gunHedef(key) {
    if (gunBitisli(key)) return { metre: GUN_BITIS.metre, bitis: true, sure: GUN_BITIS.sure.slice(), yazi: 'tepe ' + GUN_BITIS.metre + ' m' };
    var h = 2166136261 >>> 0;
    for (var i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var m = 600 + (h % 9) * 50;
    return { metre: m, esik: [m, Math.round(m * 1.5), m * 2], yazi: 'hedef ' + m + ' m' };
  }
  function yildizSay(key, metre) { var e = gunHedef(key).esik, n = 0; if (!e) return 0; for (var i = 0; i < 3; i++) if (metre >= e[i]) n = i + 1; return n; }
  // Koşu bitti: bugünün yıldızlarını güncelle, yeni yıldızların ödülünü öde. Döner: { yildiz, yeni, odul }
  // Bitişli günde sn: bitiş süresi (bitiremediyse null)
  function gunYildizKaydet(save, key, metre, sn) {
    ensure(save);
    var g = save.gunYildiz && save.gunYildiz.key === key ? save.gunYildiz : { key: key, yildiz: 0 };
    var n = gunBitisli(key) ? gunSureYildiz(sn) : yildizSay(key, metre), odul = 0, yeni = 0, YO = gunYildizOdul(key);
    for (var i = g.yildiz; i < n; i++) { odul += YO[i]; yeni++; }
    g.yildiz = Math.max(g.yildiz, n); save.gunYildiz = g;
    if (odul) kazan(save, odul);
    return { yildiz: g.yildiz, yeni: yeni, odul: odul };
  }
  function gunYildizDurum(save, key) { return save.gunYildiz && save.gunYildiz.key === key ? save.gunYildiz.yildiz : 0; }
  // ---------- Haftanın hedefi (v0.66) ----------
  // Haftalık Kuyu'da her hafta bir hedef PUAN (lig de puanla belirlenir; haftanın tarihinden). 1 yıldız hedef, 2 yıldız 1,5 kat,
  // 3 yıldız 2 kat; her yıldız haftada bir kez ödül verir. Haftanın ilk denemelerinden itibaren bir amaç olsun.
  var HAFTA_YILDIZ_ODUL = [10, 10, 20], HAFTA_HEDEF = [1200, 200]; // taban, adım (5 adım)
  function haftaHedef(key) {
    var h = 2166136261 >>> 0, s = 'hafta-' + key;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var p = HAFTA_HEDEF[0] + (h % 5) * HAFTA_HEDEF[1];
    return { puan: p, esik: [p, Math.round(p * 1.5), p * 2] };
  }
  function haftaYildizSay(key, puan) { var e = haftaHedef(key).esik, n = 0; for (var i = 0; i < 3; i++) if (puan >= e[i]) n = i + 1; return n; }
  function haftaYildizKaydet(save, key, puan) {
    ensure(save);
    var g = save.haftaYildiz && save.haftaYildiz.key === key ? save.haftaYildiz : { key: key, yildiz: 0 };
    var n = haftaYildizSay(key, puan), odul = 0, yeni = 0;
    for (var i = g.yildiz; i < n; i++) { odul += HAFTA_YILDIZ_ODUL[i]; yeni++; }
    g.yildiz = Math.max(g.yildiz, n); save.haftaYildiz = g;
    if (odul) kazan(save, odul);
    gecmisYaz(save, 'haftalik', key, { yildiz: g.yildiz });
    return { yildiz: g.yildiz, yeni: yeni, odul: odul };
  }
  function haftaYildizDurum(save, key) { return save.haftaYildiz && save.haftaYildiz.key === key ? save.haftaYildiz.yildiz : 0; }
  // ---------- Seri ödülü (v0.64) ----------
  // Art arda günlerde Günlük Kuyu: 3, 7, 14, 30. günde ateşböceği. Bir günlük donma hakkı: bir gün kaçırılınca seri sürer;
  // başlangıçta 1, her 7 günlük eşikte yeniden dolar (en çok 1).
  var SERI_ODUL = { 3: 20, 7: 50, 14: 100, 30: 200 };
  // ---------- Kişisel rekor duvarı (v0.64) ----------
  // Günlük ve Haftalık Kuyu'nun en iyileri; Profil'de takvim. Son 60 gün ve 16 hafta tutulur.
  function gecmisYaz(save, tur, key, deger) {
    if (!save.gecmis) save.gecmis = { gunluk: {}, haftalik: {} };
    var g = save.gecmis[tur] || (save.gecmis[tur] = {}), o = g[key] || {};
    Object.keys(deger).forEach(function (k) { o[k] = typeof deger[k] === 'number' ? Math.max(o[k] || 0, deger[k]) : deger[k]; });
    g[key] = o;
    var keys = Object.keys(g).sort(), sinir = tur === 'gunluk' ? 60 : 16;
    while (keys.length > sinir) delete g[keys.shift()];
  }

  // ---------- Kutu (v0.96, Törehan onayı 27/11; "rastgele kutu yok" kararı bu kurallarla değişti) ----------
  // Market'te art arda 3 video izlenince açılır, günde en çok 2; günlük girişin 7. günü bedava bir kutu (günlük sınıra sayılmaz).
  // İçinden eşya ya da ateşböceği çıkar; olasılıklar kutunun üstünde yazar. Işık, lig, etkinlik ve bedava eşyalar çıkmaz.
  // Efsane düşük olasılıkla çıkabilir. Sahip olunan eşya çıkarsa ateşböceğine döner. Para ile alınmaz, açılmaz.
  var KUTU = { video: 3, gunluk: 2, olasilik: [['sira', 45], ['nadir', 25], ['destansi', 8], ['efsane', 2], ['ates', 20]], ates: [20, 60] };
  var KUTU_DONUSUM = { sira: 15, nadir: 30, destansi: 60, efsane: 120 };
  function kutuHavuz(nad) { return KATALOG.filter(function (it) { return satilir(it) && nadirlik(it) === nad; }); }
  // v0.97: videolar art arda değil, tek tek: her video ayrı izlenir ve sayılır (save.kutu.izlenen, gün içinde saklanır);
  // 3. video bitince kutu açılır. Uygulamadan çıkılsa da izlenenler kaybolmaz.
  function kutuDurum(save, gunKey) {
    var k = save.kutu && save.kutu.gun === gunKey ? save.kutu : null, acilan = k ? k.acilan : 0, izlenen = k ? (k.izlenen || 0) : 0;
    return { video: KUTU.video, gunluk: KUTU.gunluk, acilan: acilan, izlenen: izlenen, kalan: Math.max(0, KUTU.gunluk - acilan), olasilik: KUTU.olasilik.slice(), ates: KUTU.ates.slice() };
  }
  // Bir kutu videosu izlendi. Döner: { izlenen, gerek, hazir } ya da bugünkü kutular bittiyse null
  function kutuVideo(save, gunKey) {
    var d = kutuDurum(save, gunKey); if (!d.kalan) return null;
    var k = save.kutu && save.kutu.gun === gunKey ? save.kutu : (save.kutu = { gun: gunKey, acilan: 0, izlenen: 0 });
    k.izlenen = Math.min(KUTU.video, (k.izlenen || 0) + 1);
    return { izlenen: k.izlenen, gerek: KUTU.video, hazir: k.izlenen >= KUTU.video };
  }
  // kaynak: 'market' (3 video izlendi, günlük sınır sayılır) | 'giris' (7. gün). rnd: [0, 1) üreten fonksiyon (test için)
  function kutuAc(save, gunKey, kaynak, rnd) {
    ensure(save); rnd = rnd || Math.random;
    if (kaynak === 'market') { var d = kutuDurum(save, gunKey); if (!d.kalan || d.izlenen < KUTU.video) return null; save.kutu = { gun: gunKey, acilan: d.acilan + 1, izlenen: 0 }; }
    var top = 0, x, sec = 'ates', i;
    KUTU.olasilik.forEach(function (o) { top += o[1]; });
    x = rnd() * top;
    for (i = 0; i < KUTU.olasilik.length; i++) { x -= KUTU.olasilik[i][1]; if (x < 0) { sec = KUTU.olasilik[i][0]; break; } }
    if (sec !== 'ates') {
      var havuz = kutuHavuz(sec);
      if (havuz.length) {
        var it = havuz[Math.min(havuz.length - 1, Math.floor(rnd() * havuz.length))];
        if (sahip(save, it.id)) return { tur: 'esya', id: it.id, nadir: sec, yinelenen: true, ates: kazan(save, KUTU_DONUSUM[sec]) };
        save.dolap.sahip.push(it.id);
        return { tur: 'esya', id: it.id, nadir: sec, yinelenen: false };
      }
    }
    return { tur: 'ates', ates: kazan(save, KUTU.ates[0] + Math.floor(rnd() * (KUTU.ates[1] - KUTU.ates[0] + 1))) };
  }
  // Günlük girişin 7. günü: ateşböceği yerine kutu (bugün alınmadıysa açılır, takvim ilerler)
  function girisKutuMu(save, key) { var d = girisDurum(save, key); return d.hazir && d.gun === GIRIS.length - 1; }
  function girisKutuAl(save, key, rnd) {
    if (!girisKutuMu(save, key)) return null;
    save.giris.son = key; save.giris.gun = 0; save.giris.toplam++;
    return kutuAc(save, key, 'giris', rnd);
  }

  // ---------- Video ile ateşböceği (v0.96, Törehan onayı): bir bölümden az verir, oyuncu oynamaya yönelsin ----------
  var VIDEO_ATES = { odul: 2, gunluk: 5 };
  function videoAtesDurum(save, gunKey) { var n = save.videoAtes && save.videoAtes.gun === gunKey ? save.videoAtes.n : 0; return { odul: VIDEO_ATES.odul, gunluk: VIDEO_ATES.gunluk, izlenen: n, kalan: Math.max(0, VIDEO_ATES.gunluk - n) }; }
  function videoAtesAl(save, gunKey) { var d = videoAtesDurum(save, gunKey); if (!d.kalan) return 0; save.videoAtes = { gun: gunKey, n: d.izlenen + 1 }; return kazan(save, VIDEO_ATES.odul); }

  // ---------- Ad değiştirme (v0.96): ilki bedava; sonrakiler art arda 2 video ya da 250 ateşböceği (video öne çıksın diye pahalı) ----------
  var ISIM = { bedava: 1, video: 2, ates: 250 };
  function isimDurum(save) { ensure(save); var n = save.isimDegisim || 0; return { degisim: n, bedava: n < ISIM.bedava, video: ISIM.video, izlenen: save.isimVideo || 0, ates: ISIM.ates, yeter: save.cuzdan.ates >= ISIM.ates }; }
  // v0.97: ad videoları da tek tek; izlenen sayı saklanır (save.isimVideo), 2. videodan sonra ad değişir
  function isimVideo(save) { var n = Math.min(ISIM.video, (save.isimVideo || 0) + 1); save.isimVideo = n; return { izlenen: n, gerek: ISIM.video, hazir: n >= ISIM.video }; }
  // yol: 'bedava' | 'video' (2 video izlendi) | 'ates'. Başarılıysa true
  function isimHakki(save, yol) {
    var d = isimDurum(save);
    if (yol === 'bedava' && !d.bedava) return false;
    if (yol === 'video') { if (d.izlenen < ISIM.video) return false; save.isimVideo = 0; }
    if (yol === 'ates') { if (!d.yeter) return false; save.cuzdan.ates -= ISIM.ates; save.cuzdan.harcanan += ISIM.ates; }
    save.isimDegisim = d.degisim + 1;
    return true;
  }

  var api = { HAK: HAK, YENILEME_EN: YENILEME_EN, hakDurum: hakDurum, hakKullan: hakKullan, hakVideo: hakVideo,
    YILDIZ_ODUL: YILDIZ_ODUL, gunHedef: gunHedef, yildizSay: yildizSay, GUN_BITIS: GUN_BITIS, gunBitisli: gunBitisli, gunBitisPuan: gunBitisPuan, gunSureYildiz: gunSureYildiz, gunYildizOdul: gunYildizOdul, gunYildizKaydet: gunYildizKaydet, gunYildizDurum: gunYildizDurum,
    SERI_ODUL: SERI_ODUL, gecmisYaz: gecmisYaz,
    HAFTA_YILDIZ_ODUL: HAFTA_YILDIZ_ODUL, haftaHedef: haftaHedef, haftaYildizSay: haftaYildizSay, haftaYildizKaydet: haftaYildizKaydet, haftaYildizDurum: haftaYildizDurum,
    GIRIS: GIRIS, GOREV_ATES: GOREV_ATES, BASARIM_ATES: BASARIM_ATES, KATALOG: KATALOG, TURLER: TURLER, VARSAYILAN: VARSAYILAN, NADIRLIK: NADIRLIK, nadirlik: nadirlik,
    satilir: satilir, satista: satista, vitrin: vitrin, haftalikUrun: haftalikUrun, fiyatBugun: fiyatBugun, vitrinVideo: vitrinVideo, vitrinGordu: vitrinGordu, marketDurum: marketDurum,
    yeniUrunler: yeniUrunler, urunYeniMi: urunYeniMi, urunGordu: urunGordu, sekmeYeniMi: sekmeYeniMi, sekmeGordu: sekmeGordu, yeniVarMi: yeniVarMi,
    ensure: ensure, kazan: kazan, bolumOde: bolumOde, girisDurum: girisDurum, girisAl: girisAl,
    LIG: LIG, ligOf: ligOf, ligOdul: ligOdul, haftalikDurum: haftalikDurum, haftalikKaydet: haftalikKaydet, haftalikKapat: haftalikKapat,
    ISIK: ISIK, isikSeviye: isikSeviye, isikOdul: isikOdul, isikSiradaki: isikSiradaki,
    item: item, sahip: sahip, satinAl: satinAl, kusan: kusan, gorunum: gorunum, DEVAM_BEDEL: DEVAM_BEDEL, devamBedel: devamBedel, devamOde: devamOde,
    KUTU: KUTU, KUTU_DONUSUM: KUTU_DONUSUM, kutuDurum: kutuDurum, kutuVideo: kutuVideo, kutuAc: kutuAc, girisKutuMu: girisKutuMu, girisKutuAl: girisKutuAl,
    VIDEO_ATES: VIDEO_ATES, videoAtesDurum: videoAtesDurum, videoAtesAl: videoAtesAl, ISIM: ISIM, isimDurum: isimDurum, isimVideo: isimVideo, isimHakki: isimHakki };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KuyuEkonomi = api;
})(this);
