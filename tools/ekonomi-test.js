// Ekonomi mantığı testi: node tools/ekonomi-test.js
const K = require('../js/ekonomi.js');
let bad = 0;
const ok = (c, m) => { if (!c) { bad++; console.log('HATA:', m); } };

// eski kayıt: başlangıç bakiyesi bölüm ateşböcekleri
const save = { best: { 1: { ff: 3, done: true }, 2: { ff: 2, done: true } } };
K.ensure(save);
ok(save.cuzdan.ates === 5, 'başlangıç bakiyesi 5');
ok(K.gorunum(save).atki === '#2fb3a6' && K.gorunum(save).iz === 'atki', 'varsayılan görünüm');

// bölüm ödemesi yalnızca yeni ateşböceği
ok(K.bolumOde(save, 1, 3) === 2 && save.cuzdan.ates === 7, 'bölüm: 1 → 3 iki yeni');
ok(K.bolumOde(save, 3, 3) === 0 && save.cuzdan.ates === 7, 'bölüm tekrar: kasılmaz');

// günlük giriş
let d = K.girisDurum(save, '2026-11-10');
ok(d.hazir && d.gun === 0 && d.odul === 5, 'ilk gün hazır, 5');
ok(K.girisAl(save, '2026-11-10', 2) === 10 && save.cuzdan.ates === 17, 'video ile ×2');
ok(K.girisAl(save, '2026-11-10', 1) === 0, 'aynı gün ikinci kez alınmaz');
ok(K.girisDurum(save, '2026-11-11').gun === 1 && K.girisDurum(save, '2026-11-11').odul === 5, 'ertesi gün 2. gün');
// gün kaçırmak sıfırlamaz
ok(K.girisAl(save, '2026-11-15', 1) === 5 && save.giris.gun === 2, 'gün kaçırınca kaldığı yerden');
for (let i = 0; i < 5; i++) K.girisAl(save, '2026-12-0' + (i + 1), 1);
ok(save.giris.gun === 0 && save.giris.toplam === 7, '7. günden sonra başa döner');

// dolap (temiz kayıt)
const save2 = K.ensure({ best: {} });
const y = K.satinAl(save2, 'atki-pembe');
ok(y.neden === 'yetersiz' && y.eksik === 100 && save2.cuzdan.ates === 0, 'yetersiz bakiye');
Object.assign(save, save2);
K.kazan(save, 500);
const r = K.satinAl(save, 'atki-kiraz');
ok(r.ok && K.sahip(save, 'atki-kiraz') && save.dolap.kusan.atki === 'atki-kiraz', 'satın al ve kuşan');
ok(save.cuzdan.harcanan === 40, 'harcanan 40');
ok(K.satinAl(save, 'atki-kiraz').neden === 'sahip', 'iki kez alınmaz');
ok(K.kusan(save, 'atki-turkuaz') && K.gorunum(save).atki === '#2fb3a6', 'eskisine dön');
ok(!K.kusan(save, 'ip-ates'), 'sahip olunmayan kuşanılmaz');
ok(K.KATALOG.every(i => K.TURLER[i.tur]), 'her ürünün türü var');
ok(Object.keys(K.VARSAYILAN).every(t => K.item(K.VARSAYILAN[t]).fiyat === 0), 'varsayılanlar bedava');
// ışık yolu (v0.53): kazanılan ateşböceği seviyeyi yükseltir, seviye görünüm açar; harcamak düşürmez; satın alınmaz
const is = K.ensure({ best: {} });
ok(K.isikSeviye(is) === 0 && !K.sahip(is, 'iz-kivilcim'), 'ışık 0, ödül kapalı');
ok(K.satinAl(is, 'iz-kivilcim').neden === 'isik', 'ışık ödülü satın alınmaz');
K.kazan(is, 120);
ok(K.isikSeviye(is) === 3 && K.sahip(is, 'iz-kivilcim') && !K.sahip(is, 'atki-fener'), 'ışık 3: Kıvılcım izi açılır');
ok(is.dolap.kusan.iz === 'iz-atki' && K.kusan(is, 'iz-kivilcim'), 'ödül kuşanılmaz, oyuncu kuşanır');
K.satinAl(is, 'ip-gok');
ok(K.isikSeviye(is) === 3, 'harcamak ışığı düşürmez');
ok(K.isikSiradaki(is).id === 'atki-fener', 'sıradaki ödül');
ok(K.KATALOG.filter(i => i.isik).every(i => i.fiyat == null && i.isik < K.ISIK.length), 'ışık ödüllerinin fiyatı yok, seviyesi geçerli');
ok(new Set(K.KATALOG.map(i => i.id)).size === K.KATALOG.length, 'ürün kimlikleri tekil');
ok(K.gorunum(is).alev === '#ff9a3c' && K.gorunum(is).alev2 === '#ffe08a', 'varsayılan alev');
// Haftalık Kuyu ligi (v0.54): en iyi puan ligi belirler, ödül hafta bitince bir kez ödenir
const hf = K.ensure({ best: {} });
ok(K.ligOf(0) === -1 && K.ligOf(500) === 0 && K.ligOf(5999) === 1 && K.ligOf(1e6) === K.LIG.length - 1, 'lig eşikleri');
ok(K.LIG.every((l, i) => !i || (l.puan > K.LIG[i - 1].puan && l.odul > K.LIG[i - 1].odul)), 'ligler artan');
let hk = K.haftalikKaydet(hf, '2026-11-09', 2400, 900);
ok(hk.rekor && hk.lig === 1 && hk.ligAtladi && hf.cuzdan.ates === 0, 'ilk koşu: Gümüş, ödül hemen ödenmez');
hk = K.haftalikKaydet(hf, '2026-11-09', 1200, 500);
ok(!hk.rekor && !hk.ligAtladi && K.haftalikDurum(hf, '2026-11-09').best === 2400 && K.haftalikDurum(hf, '2026-11-09').tries === 2, 'kötü koşu en iyiyi düşürmez');
ok(K.haftalikKapat(hf, '2026-11-09') === null, 'hafta sürerken ödeme yok');
const od = K.haftalikKapat(hf, '2026-11-16');
ok(od && od.ligAd === 'Gümüş' && od.odul === 50 && hf.cuzdan.ates === 50, 'yeni haftada geçen haftanın ödülü');
ok(K.haftalikKapat(hf, '2026-11-16') === null && hf.cuzdan.ates === 50, 'ödül bir kez');
ok(K.haftalikDurum(hf, '2026-11-16').best === 0 && K.haftalikDurum(hf, '2026-11-16').lig === -1, 'yeni hafta sıfırdan');
K.haftalikKaydet(hf, '2026-11-16', 100, 40);
ok(K.haftalikKapat(hf, '2026-11-23') === null && hf.cuzdan.ates === 50, 'ligsiz hafta ödül vermez');
// devam hakkı (v0.49): 25 / 50 / 100, en çok 3, yetmezse ödenmez
const dv = {}; K.ensure(dv); dv.cuzdan.ates = 100;
ok(K.devamBedel(0) === 25 && K.devamBedel(1) === 50 && K.devamBedel(2) === 100 && K.devamBedel(3) == null, 'devam bedelleri');
ok(K.devamOde(dv, 0) && dv.cuzdan.ates === 75, '1. devam 25');
ok(K.devamOde(dv, 1) && dv.cuzdan.ates === 25, '2. devam 50');
ok(!K.devamOde(dv, 2) && dv.cuzdan.ates === 25, '3. devam yetmezse ödenmez');
ok(!K.devamOde(dv, 3), '4. devam yok');
ok(dv.cuzdan.harcanan === 75, 'harcanan sayılır');
// v0.64: deneme hakları (3/gün), video ile artan yenileme (1..5 video), günün hedefi yıldızları
{
  const hs = {}; K.ensure(hs);
  for (let i = 0; i < 3; i++) ok(K.hakKullan(hs, 'gunluk', 'G'), 'üç hak');
  ok(!K.hakKullan(hs, 'gunluk', 'G'), 'dördüncü deneme yok');
  ok(K.hakVideo(hs, 'gunluk', 'G').yenilendi && K.hakDurum(hs, 'gunluk', 'G').kalan === 1, '1. yenileme 1 video');
  ok(!K.hakVideo(hs, 'gunluk', 'G').yenilendi && K.hakVideo(hs, 'gunluk', 'G').yenilendi, '2. yenileme 2 video');
  let v = 0; while (K.hakVideo(hs, 'gunluk', 'G')) v++;
  ok(v === 12 && K.hakDurum(hs, 'gunluk', 'G').son && K.hakVideo(hs, 'gunluk', 'G') === null, 'en çok 5 yenileme (toplam 15 video)');
  ok(K.hakDurum(hs, 'gunluk', 'H').kalan === 3, 'yeni gün yeni haklar');
  const g = K.gunHedef('2026-11-20');
  ok(K.gunYildizKaydet(hs, '2026-11-20', g.metre * 2).yildiz === 3 && K.gunYildizKaydet(hs, '2026-11-20', g.metre * 2).odul === 0, 'yıldız ödülü bir kez');
  // v0.96: bitişli Günlük (28/11'den): yıldız süreden, puan süreden, bitiremeyen yıldızsız
  const gb = K.gunHedef('2026-11-28');
  ok(gb.bitis && gb.metre === 500 && !K.gunBitisli('2026-11-27') && K.gunHedef('2026-11-27').esik, 'bitişli gün 28/11, öncesi metre hedefi');
  ok(K.gunYildizKaydet(hs, '2026-11-28', 480, null).yildiz === 0, 'bitiremeyen yıldız almaz');
  ok(K.gunYildizOdul('2026-11-28')[0] === K.GUN_BITIS.odul[0] && K.gunYildizOdul('2026-11-27') === K.YILDIZ_ODUL, 'bitişli günde kendi yıldız ödülü');
  ok(K.gunYildizKaydet(hs, '2026-11-28', 500, 90).yildiz === 1 && K.gunYildizKaydet(hs, '2026-11-28', 500, 60).yildiz === 2 && K.gunYildizKaydet(hs, '2026-11-28', 500, 30).yildiz === 3, 'süreyle 1–3 yıldız');
  ok(K.gunBitisPuan(30) > K.gunBitisPuan(31) && K.gunBitisPuan(30.04) === 9700 && K.gunBitisPuan(5000) === 1000 && K.gunBitisPuan(5000) > 500, 'puan: kısa süre çok, bitiren bitiremeyenden önde');
  // v0.66: haftanın hedefi (puan)
  const hh = K.haftaHedef('2026-11-23'), once = hs.cuzdan.ates;
  ok(hh.esik[1] === Math.round(hh.puan * 1.5) && K.haftaYildizKaydet(hs, '2026-11-23', hh.puan).yildiz === 1 && hs.cuzdan.ates === once + K.HAFTA_YILDIZ_ODUL[0], 'haftanın hedefi 1 yıldız');
  ok(K.haftaYildizKaydet(hs, '2026-11-23', hh.puan * 2).odul === K.HAFTA_YILDIZ_ODUL[1] + K.HAFTA_YILDIZ_ODUL[2] && K.haftaYildizKaydet(hs, '2026-11-23', hh.puan * 2).odul === 0, 'hafta yıldızları birer kez');
  ok(K.haftaYildizDurum(hs, '2026-11-30') === 0, 'yeni hafta yıldızsız');
}
// ---------- Market (v0.77): vitrin, haftanın ürünü, indirim ----------
{
  const v1 = K.vitrin('2026-11-24'), v2 = K.vitrin('2026-11-24');
  ok(JSON.stringify(v1) === JSON.stringify(v2) && v1.urunler.length === 4 && new Set(v1.urunler).size === 4, 'vitrin: aynı gün herkes için aynı 4 farklı ürün');
  ok(v1.urunler.every(id => K.satilir(K.item(id)) && K.nadirlik(K.item(id)) !== 'efsane'), 'vitrinde yalnız satılan, Efsane olmayan ürünler');
  ok(v1.urunler.some(id => K.item(id).tur === 'karakter') && v1.urunler.indexOf(v1.indirimli) >= 0, 'vitrinde bir karakter ve bir indirimli ürün');
  ok(v1.urunler.indexOf(K.haftalikUrun('2026-11-23')) < 0, 'haftanın ürünü vitrinde ayrıca çıkmaz');
  const ef = K.KATALOG.find(i => K.satilir(i) && K.nadirlik(i) === 'efsane');
  let hafta = null, d = new Date('2026-11-23T12:00:00Z');
  for (let i = 0; i < 40 && !hafta; i++) { const k = d.toISOString().slice(0, 10); if (K.haftalikUrun(k) === ef.id) hafta = k; d.setUTCDate(d.getUTCDate() + 7); }
  ok(hafta && K.satista(ef.id, hafta) && !K.satista(ef.id, '2026-11-23') === (K.haftalikUrun('2026-11-23') !== ef.id), 'Efsane yalnız haftanın ürünüyken satışta');
  const s2 = {}; K.ensure(s2); s2.cuzdan.ates = 5000;
  const ind = K.item(v1.indirimli);
  ok(K.fiyatBugun(s2, ind.id, '2026-11-24') === ind.fiyat, 'video izlenmeden tam fiyat');
  ok(K.vitrinVideo(s2, '2026-11-24') === ind.id && K.fiyatBugun(s2, ind.id, '2026-11-24') === Math.ceil(ind.fiyat / 2), 'video sonrası indirimli ürün yarı fiyat');
  ok(K.fiyatBugun(s2, ind.id, '2026-11-25') === ind.fiyat, 'indirim yalnız o gün');
  const once = s2.cuzdan.ates, r = K.satinAl(s2, ind.id, { gun: '2026-11-24', hafta: '2026-11-23' });
  ok(r.ok && once - s2.cuzdan.ates === Math.ceil(ind.fiyat / 2), 'satın alma günün fiyatından düşer');
  if (ef && K.haftalikUrun('2026-11-23') !== ef.id) ok(K.satinAl(s2, ef.id, { gun: '2026-11-24', hafta: '2026-11-23' }).neden === 'haftalik', 'haftanın ürünü olmayan Efsane alınamaz');
  ok(K.satinAl(s2, 'kr-anka').neden === 'etkinlik', 'etkinlik karakteri satılmaz');
}
// kutu (v0.96): olasılıklar, günlük sınır, yinelenen eşya ateşböceğine döner, ışık/lig/etkinlik çıkmaz, 7. gün kutusu
{
  const sk = { best: {} }; K.ensure(sk);
  const top = K.KUTU.olasilik.reduce((a, o) => a + o[1], 0);
  ok(top === 100, 'kutu olasılıkları %100');
  const v3 = g => { let r; for (let i = 0; i < 3; i++) r = K.kutuVideo(sk, g); return r; };
  ok(K.kutuAc(sk, 'g1', 'market') === null && K.kutuVideo(sk, 'g1').izlenen === 1 && K.kutuAc(sk, 'g1', 'market') === null, 'v0.97: kutu videoları tek tek, 3 video olmadan açılmaz');
  ok(K.kutuVideo(sk, 'g1') && K.kutuVideo(sk, 'g1').hazir && K.kutuDurum(sk, 'g1').izlenen === 3 && K.kutuAc(sk, 'g1', 'market') && K.kutuDurum(sk, 'g1').izlenen === 0, '3. video bitince kutu açılır, sayaç sıfırlanır');
  ok(v3('g1').hazir && K.kutuAc(sk, 'g1', 'market') && K.kutuVideo(sk, 'g1') === null && K.kutuAc(sk, 'g1', 'market') === null, 'günde en çok 2 market kutusu');
  ok(K.kutuDurum(sk, 'g2').kalan === 2, 'ertesi gün kutu hakkı yenilenir');
  let r = 7; const rnd = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };
  let yasak = 0, sayac = {}, yin = 0;
  for (let i = 0; i < 1500; i++) {
    const o = K.kutuAc(sk, 'x' + i, 'giris', rnd), it = o.id && K.item(o.id);
    sayac[o.tur === 'ates' ? 'ates' : o.nadir] = (sayac[o.tur === 'ates' ? 'ates' : o.nadir] || 0) + 1;
    if (it && (it.isik || it.lig != null || it.etkinlik || !(it.fiyat > 0))) yasak++;
    if (o.yinelenen) { yin++; if (!(o.ates === K.KUTU_DONUSUM[o.nadir])) yasak++; }
    if (o.tur === 'ates' && !(o.ates >= K.KUTU.ates[0] && o.ates <= K.KUTU.ates[1])) yasak++;
  }
  ok(yasak === 0, 'kutudan ışık/lig/etkinlik/bedava eşya çıkmaz, yinelenen ve ateşböceği tutarları doğru');
  ok(yin > 0 && Math.abs(sayac.sira / 1500 - 0.45) < 0.05 && Math.abs(sayac.ates / 1500 - 0.2) < 0.04, 'dağılım olasılıklara yakın');
  const sg = { best: {} }; K.ensure(sg); sg.giris = { gun: 6, son: '2026-11-26', toplam: 6 };
  ok(K.girisKutuMu(sg, '2026-11-27') && !!K.girisKutuAl(sg, '2026-11-27') && sg.giris.gun === 0 && !K.girisKutuMu(sg, '2026-11-27'), '7. gün kutusu bir kez, takvim başa döner');
  ok(K.girisKutuAl(sg, '2026-11-28') === null, 'kutu günü değilse kutu yok');
}
// video ile ateşböceği (v0.96): 2 ateşböceği, günde 5
{
  const sv = { best: {} }; K.ensure(sv); const once = sv.cuzdan.ates; let t = 0;
  for (let i = 0; i < 7; i++) t += K.videoAtesAl(sv, 'g1');
  ok(t === 10 && sv.cuzdan.ates - once === 10 && K.videoAtesDurum(sv, 'g2').kalan === 5, 'video ateşböceği günde 5 × 2');
}
// ad değiştirme (v0.96): ilki bedava, sonra 2 video ya da 250 ateşböceği
{
  const si = { best: {} }; K.ensure(si); si.cuzdan.ates = 300;
  ok(K.isimDurum(si).bedava && K.isimHakki(si, 'bedava') && !K.isimDurum(si).bedava, 'ilk ad değişikliği bedava');
  ok(!K.isimHakki(si, 'bedava') && K.isimHakki(si, 'ates') && si.cuzdan.ates === 50 && !K.isimHakki(si, 'ates'), 'sonraki 250 ateşböceği, yetmezse olmaz');
  ok(!K.isimHakki(si, 'video') && K.isimVideo(si).izlenen === 1 && !K.isimHakki(si, 'video') && K.isimVideo(si).hazir && K.isimHakki(si, 'video') && si.isimDegisim === 3 && K.isimDurum(si).izlenen === 0, 'video ile ad değişikliği: 2 video tek tek');
}
// ---------- Yeni ürün rozeti (v0.97) ----------
{
  const sy = {}; K.ensure(sy);
  const g = '2026-11-28', h = '2026-11-23', L = K.yeniUrunler(sy, g, h);
  ok(L.length === 5 && L.every(y => K.urunYeniMi(sy, y.id, g, h)) && K.yeniVarMi(sy, g, h), 'vitrin (4) ve haftanın ürünü yeni');
  const a = L[0], tur = K.item(a.id).tur, ayniTur = L.filter(y => y.id !== a.id && K.item(y.id).tur === tur);
  ok(K.sekmeYeniMi(sy, tur, g, h), 'kategori sekmesinde rozet');
  K.sekmeGordu(sy, tur, g, h);
  ok(!K.sekmeYeniMi(sy, tur, g, h) && K.urunYeniMi(sy, a.id, g, h), 'sekmeye dokunmak yalnız sekme rozetini siler, ürün rozeti kalır');
  K.urunGordu(sy, a.id, g, h);
  ok(!K.urunYeniMi(sy, a.id, g, h) && ayniTur.every(y => K.urunYeniMi(sy, y.id, g, h)), 'ürünü görmek o ürünün rozetini siler, diğerleri kalır');
  L.forEach(y => K.urunGordu(sy, y.id, g, h));
  ok(!K.yeniVarMi(sy, g, h) && K.yeniUrunler(sy, '2026-11-29', h).some(y => y.yer === 'vitrin' && K.urunYeniMi(sy, y.id, '2026-11-29', h)), 'hepsi görülünce rozet yok; ertesi günün vitrini yine yeni');
  sy.dolap.sahip.push(K.yeniUrunler(sy, '2026-11-29', h)[0].id);
  ok(K.yeniUrunler(sy, '2026-11-29', h).length === 4, 'sende olan ürün yeni sayılmaz');
}
console.log(bad ? bad + ' hata' : 'Tamam: cüzdan, günlük giriş, dolap, lig, haklar, günün hedefi, kutu, video ateşböceği, ad değiştirme, yeni ürün rozeti');
process.exit(bad ? 1 : 0);
