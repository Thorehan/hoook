# Hoook (Kuyu) · Durum (kalınan nokta)

> Her oturumun başında okunur, iş bitince güncellenir. Kısa tutulur (~40 satır).

## Devir kimde: **Muhammed**

- Devir tarihi: 24/11/2026 · Törehan → Muhammed
- Devir noktası: v0.83 (yayında), etiket `geri-donus-v0.83`. Bu dönemdeki her sürüm ayrı commit; `git revert` ile tek tek geri alınabilir.
- Devir Muhammed'deyken Törehan (ve Mustafa) projede geliştirme yapmaz; yalnız oynar, not alır, istişare eder. Geri devir `docs/DEVIR-MUHAMMED.md` §8'deki adımlarla.
- **Muhammed için başlangıç:** `docs/DEVIR-MUHAMMED.md` (kurulum, ilk oturum metni, yapılacaklar listesi §6, arayüz ilkeleri §5).
- **Kapsam (Törehan, 24/11):** yalnız arayüz Aşama 2–4 (Market, Koleksiyon, Yarışma, Profil, pencereler, açılış ve sonuç kartları). Her aşama sonunda Törehan telefonda dener, onaylar. Online, ekonomi, oynanış çekirdeği, görsel yön ve hikâyede son söz Törehan'da (`DEVIR-MUHAMMED.md` §7).

## Son durum (v0.83)

- **v0.89** (25/11/2026, Muhammed): İstişare 5 Aşama 3 (ilk kısım): Yarışma sekmesi Sıralama oldu (lig tabelası, iple asılı ilk üç, şeritler, altta hep görünen kendi satırın, yükleniyor/boş/hata/kapalı durumları; açılır tablo penceresi ve sekmedeki Günlük/Haftalık kartları kalktı, ikisi ana ekranda). Profil oyuncu kartı (canlı Çıra, rozetler, çıkartma sayılar, açılır kapanır hikâye defteri). Bütün sayfa ekranlarında aynı simetrik tuğla duvar ve kirişe asılı başlık. Alt sekmenin adı "Yarışma" kaldı (Törehan'ın 5 sekme adları). Yalnız arayüz. Telefonda denenecek: `docs/telefon-testi.md` §32.
- **v0.88** (25/11/2026, Muhammed): İstişare 6 Yol A5.1: Maden, Kristal Mağara ve Eski Kule de kısa bölümlere bölündü, deneme olarak (18 uzun → 65 kısa; Taş Kuyu ile 83). Hikâye ekranında dört deneme grubu; asıl Hikâye, harita, kayıt ve ekonomi değişmez. Botlar 83 kısa bölümün hepsini geçiyor, tek taraf 0, hatasız oyuncu yanmıyor; spam uzun bölümlerden kolay değil. Telefonda denenecek: `docs/telefon-testi.md` §31.
- **v0.87** (25/11/2026, Muhammed): İstişare 6 Yol A4: Hikâye haritası. Ayrı ekranda kuyu duvarı (1. bölüm dipte, bölge dokuları, kirişe asılı bölge tabelaları, ikinci yolculuk gece hâli), halkalar bölümler (0–3★), dokununca bölüm sayfası, Çıra bölüm geçilince bir üst halkaya atlar. "harita ›" çipi ve sonuç kartındaki "Bölümler" haritayı açar; "Liste" bugünkü listeyi açar. Yalnız arayüz; oynanış ve kilit kuralı aynı. Telefonda denenecek: `docs/telefon-testi.md` §30.
- **v0.86** (25/11/2026, Muhammed): İstişare 6 Yol A3: yıldızlar. 1★ geçiş, 2★ en az bir madalya, 3★ üç madalya; kayıttaki en iyi madalyalardan, ödülsüz, düşmez, yeni kayıt alanı yok. Sonuç kartında başlığın yanında (yeni yıldıza "YENİ", altında bir sonraki yıldız için ipucu), bölüm kartlarında ✓/★ yerine, grup başlıklarında ve özette toplam. Yalnız görünüş; oynanış ve ekonomi aynı. Telefonda denenecek: `docs/telefon-testi.md` §29. Sırada A4 (harita) ya da İstişare 5 Aşama 3.
- **v0.85** (24/11/2026, Muhammed): İstişare 6 Yol A2: kısa bölümler denemesi. Hikâye ekranının başında "Yeni Taş Kuyu · deneme": 6 uzun bölüm → 18 kısa bölüm (fener yok, her bölümde ateşböceği, notlar ve final yerinde), ayrı kayıt; bugünkü bölümler, Günlük ve Haftalık birebir aynı. Bütün testler çalıştı (`docs/kisa-bolumler-plan.md` §6). Telefonda denenecek: `docs/telefon-testi.md` §28. Sırada A3 (yıldızlar) ya da İstişare 5 Aşama 3.
- **v0.84** (24/11/2026, Muhammed): İstişare 5 Aşama 2: Market, Koleksiyon ve ürün sayfası Askıda Menü dilinde (kuyu duvarı, kirişe asılı tabela, çiviye asılı eğik çıkartma kartlar, alttan açılan ürün sayfası, satın alma kutlaması). Yalnız görünüş; fiyat, ürün, kural aynı. Telefonda denenecek: `docs/telefon-testi.md` §27. Sırada Aşama 3 (Yarışma, Profil, pencereler, durumlar).
- **v0.83** (24/11/2026, Törehan): Hikâye bölümlerinde Çıra geçici bir çengelde asılı başlar, sonsuz modlar dipten (zeminden). Ana ekranda OYNA ortadaki duvar halkasından sarkar, Çıra yukarıda, "Başlamak için dokun" geri geldi (boş yere dokunmak başlatır). Bütün mekanik ölçümleri öncekiyle aynı. Telefonda denenecek: `docs/telefon-testi.md` §26.
- **v0.82** (24/11/2026, Törehan): İstişare 5 Aşama 1: Askıda Menü tasarım dili, yeni ana ekran (kirişe asılı sallanan etiketler) ve alt sekme çubuğu. 360×640, 375×667, 390×844, 430×932 tarandı. Telefonda denenecek: `docs/telefon-testi.md` §25. Sırada Aşama 2 (Market ve Koleksiyon).
- **v0.81** (24/11/2026, Törehan): kamera nefesi yenilendi: arka plan ve duvarlar artık büyümüyor; yalnız oyun katmanı mini yaklaş-uzaklaş yapıyor (%1,8, 0,34 sn). İstişare 5 (arayüz yeniden tasarımı): Törehan **B · Askıda Menü** yönünü seçti; alt sekme çubuğu kalır, çizim Claude'da. Plan `docs/istisare-5-ui.md`, sırada Aşama 1 (tasarım dili + ana ekran). Telefonda denenecek: `docs/telefon-testi.md` §24.
- **v0.80** (24/11/2026, Törehan): platform standartları: dokunma alanları ≥44 px, Android geri tuşu, dört ekran boyutunda tarama. Telefonda denenecek: `docs/telefon-testi.md` §23. Arayüz çalışma ilkeleri (Senior Mobile UI/UX): her arayüz işinde önce yaklaşım, sonra uygulama; çalışan özellik izinsiz değişmez.
- **v0.79** (24/11/2026, Törehan): menülerde yakınlaşma (büyüme) hissi kaldırıldı; pencere ve ekranlar solarak ve hafif kayarak gelir. Oyun içindeki kamera nefesi (TAM ve uzun akış, %3) duruyor.
- **v0.78** (24/11/2026, Törehan): yerel uygulama hissi (tarayıcı izleri kapalı, sabit başlıklar, dokunuş sesi ve titreşimi, ekran geçişleri). Arayüzün görsel yönü değişiyor: Törehan "web uygulaması ve yapay zekâ yapımı gibi" dedi; ekip bir UI görseli hazırlayacak, arayüz ondan ilerleyecek (Figma eklentisi önerildi). İstişare 4 Aşama 4–6 görsel gelince. Telefonda denenecek: `docs/telefon-testi.md` §22.
- **v0.77** (24/11/2026, Törehan): İstişare 4 Aşama 3, Market (haftanın ürünü, günlük vitrin ve video ile %50, kategoriler, ürün kartı), fiyat dengesi (~12 hafta, Törehan onayı). Telefonda denenecek: `docs/telefon-testi.md` §21.
- **v0.76** (23/11/2026, Törehan): İstişare 4 Aşama 2, karakterler ve takılar (9 karakter, Baş/Yüz/Sırt, nadirlik), Koleksiyon ekranı, oyunda seçili karakter. Telefonda denenecek: `docs/telefon-testi.md` §20. Not: katalog büyüdü, ortalama oyuncu için Dolap 83 günde biter (hedef ~8 hafta); fiyat dengesi Aşama 3'te.
- **v0.75** (23/11/2026, Törehan): İstişare 4 Aşama 1, yeni arayüz: tasarım dili, hybrid-casual ana ekran, 5 sekmeli alt gezinme, Yarışma ekranı. Telefonda denenecek: `docs/telefon-testi.md` §19.
- **v0.74** (23/11/2026, Törehan): skor tablosu ekranı (Günlük ve Haftalık sekmeleri, ilk 50 ve senin yerin; ana menüden ve sonuç kartından). Telefonda denenecek: `docs/telefon-testi.md` §18.
- **v0.73** (23/11/2026, Törehan): oyunun adı **Hoook**. Depo `Thorehan/hoook`, adres https://thorehan.github.io/hoook/. Eski /kuyu/ adresi 24/11'de kaldırıldı (yönlendirme deposu silindi). Mustafa'nın klonunda: `git remote set-url origin https://github.com/Thorehan/hoook.git`.
- **v0.72** (23/11/2026, Törehan): gerçek skor tablosu açık (Firebase + Cloudflare). Günlük ve Haftalık sonuç kartında gerçek sıra. Canlıda denendi.
- v0.71 (23/11/2026, Törehan): akıntı sütunu (İstişare 3 Aşama C, 3/3). Akış sürerken yukarı süzdürür, kestirme; 21. bölüm öğretir; Günlük/Haftalık kor ve çark ile aynı tarihten (24/11, 30/11 haftası). Telefonda denendi (23/11): yeni mekanikler, bölümler, his ve kontrol iyi; ince ayar gerekmedi.
- v0.70 (23/11/2026): döner çark (Aşama C, 2/3). Telefonda denendi.
- v0.69 (23/11/2026): kor halka (Aşama C, 1/3). Telefonda denendi.
- v0.68 (23/11/2026): İstişare 3 Aşama B, tatmin anları. Telefonda denendi.
- v0.67 (23/11/2026): İstişare 3 Aşama A, his (vuruş hissi, ses ve müzik, titreşim desenleri, görsel ipuçları). Telefonda denendi.
- v0.66 (23/11/2026): haftanın hedefi (Haftalık Kuyu puan hedefi, 1–3 yıldız).
- v0.65 (22/11/2026): denge; ikinci yolculuk ilk yolculuk kadar uzun ve su daha yakın. Spam önlemi sınırında: daha sert önlem düşünen oyuncuyu bozuyor.
- v0.64 (19/11/2026): Hikâye ana oyun (dokun → sıradaki bölüm); serbest Sonsuz kalktı; Günlük 3/gün, Haftalık 5/hafta deneme, video ile artan yenileme; günün hedefi, seri ödülü, lig görünümleri, rekor duvarı. Telefonda denenecek: `docs/telefon-testi.md` §12.
- v0.63: Hikâye denge (Aşama 5): spam ortalama oyuncu düzeyine indi (boş atış kilidi, Maden'den sonra yanlış taraf ipi bırakır, halkalar %40 aynı yanda). 24 bölüm planı tamam. Telefonda denenecek: `docs/telefon-testi.md` §11.
- v0.62: Hikâye geçişi. 24 bölüm + ikinci yolculuk (25–48) asıl Hikâye; eski bölümler kalktı, kayıt bölgeye göre taşındı. Geri dönüş: `geri-donus-v0.61`. Telefonda denenecek: `docs/telefon-testi.md` §10.
- v0.61: Yeni Hikâye Aşama 3, bölüm 13–24 (Kristal ve Kule; notlar 7–12, finaller). 24 bölüm deneme olarak tamam. Telefonda denenecek: `docs/telefon-testi.md` §9.
- v0.60: Yeni Hikâye Aşama 2, bölüm 4–12 (Taş Kuyu ve Maden; notlar 1–6, iki final). Telefonda denenecek: `docs/telefon-testi.md` §8.
- v0.59: Yeni Hikâye deneme (Aşama 1, bölüm 1–3; Hikâye ekranının üstünde). Telefonda denenecek: `docs/telefon-testi.md` §7.
- v0.58: giriş tamponu (kilitliyken basılan dokunuş kaybolmaz; hata yapan oyuncu daha geç yanıyor, spam neredeyse aynı).
- v0.57: geç basma payı, "geriye kanca" azaldı (%5,8 → %4,1; `tools/geri.js`).
- v0.56 (18/11/2026): görsel akıcılık (kamera ileri bakışı ve yayı, arka duvar paralaksı, toz, kenar gölgesi, kor ışığı, su katmanları ve yansıma, koşu ve ekran geçişleri).
- v0.55 12/11/2026'da Mustafa'nın onayıyla push edilmişti; v0.52–v0.55 birlikte çıktı.
- Bu dönemde yapılanlar (ayrıntı `docs/yol-haritasi.md`, `README.md`):
  - v0.52: bölge suyu (Hikâye'de zorluk eğrisi, 17. bölümden başlar)
  - v0.53: ekonomi dengesi, Dolap 47 görünüm, Alev rengi, ışık yolu 20 seviye
  - v0.54: Haftalık Kuyu ve lig
  - v0.55: meydan okuma bağlantısı, skor tablosu istemcisi (kapalı), yedek kodu, pazar araştırması
- Testler temiz (17/11/2026, devir öncesi tam koşu): bot çıkış 0 · nişanda kurala aykırı 0 · tek taraf 0/74 · spam ile geçilen bölüm 74 → 37/76 · hatasız oyuncu Sonsuz ve Haftalık'ta yanmıyor · ortalama gün ~119 ateşböceği · birim testleri (ekonomi, görev, hayalet, istatistik, online) tamam.
- Telefonda denenmedi: v0.50'den beri hiçbir şey. Liste: `docs/telefon-testi.md` §6.

## Sıradaki iş

- ✅ 18/11: Törehan v0.52–v0.55 kararlarını gözden geçirdi, hepsi kalıyor (bölge suyu, ekonomi, Haftalık + lig, Supabase istemcisi kapalı).
1. **Telefonda deneme**, özellikle bölge suyu mesafeleri ve Haftalık Kuyu.
2. **Skor tablosu açık (v0.72, 23/11):** Firebase (proje `hoook-6fed5`, stüdyo Google hesabı) + Cloudflare Worker `hoook-skor.torehan-anbarli.workers.dev` ve D1 `hoook-skor` (Cloudflare hesabı Törehan'ın). ✅ Tam tablo ekranı (v0.74). Sıradaki: Aşama 2 puan doğrulama (Workers Paid 5 $/ay); Aşama 3 Google/Apple bağlama.
3. İstişare 2'nin kalanı: ✅ görsel akıcılık (v0.56) → **24 uzun bölüm: plan hazır (18/11), `docs/hikaye-bolumleri-plan.md`**. Tarifli üretim, fener kontrol noktası, ikinci yolculuk, bölgeye göre taşıma. Aşama 1 ✅ (v0.59): bölüm 1–3 oynanır (deneme kartları), fener ve fenerden devam, duvar ipuçları. Telefonda onaylandı (19/11). Aşama 2 ✅ (v0.60): bölüm 4–12. Aşama 3 ✅ (v0.61): bölüm 13–24. Aşama 4 ✅ (v0.62): geçiş. Aşama 5 ✅ (v0.63): denge (`tools/hikaye-denge.js`). **Plan tamam.** Sıradaki: telefon geri bildirimiyle ince ayar (süre, su, fener sıklığı, ikinci yolculuğun zorluğu); sonra açık sorular (Supabase, analitik, bekçinin adı, müzik).

- **İstişare 3 (23/11): oynanış hissiyatı.** Plan `docs/istisare-3-his.md`: A his (vuruş, ses, titreşim, görsel ipuçları) → B tatmin anları (kova, fener, uzun akış, düşüş-dönüş) → C yeni mekanikler (kor halka, döner çark, akıntı sütunu). Kontrol değişmiyor. ✅ A (v0.67, telefonda denendi). ✅ B (v0.68, telefonda denendi). C: mevcut bölümlere bölme, sıra kor → çark → akıntı, sonra Günlük/Haftalık. ✅ Kor halka (v0.69). ✅ Döner çark (v0.70). ✅ Akıntı sütunu (v0.71). **İstişare 3 tamam** ve telefonda onaylandı (23/11: kor, çark, akıntı, bölüm süreleri, su, fener, his efektleri ve kontrol iyi; ince ayar gerekmedi). Sıradaki: açık sorular.

- **İstişare 4 (23/11): arayüz baştan.** Plan `docs/istisare-4-ui.md`, taslak `docs/istisare-4/taslak.html`. Hybrid-casual ana ekran (OYNA ortada, 5 sekme), parlak çizgi film stili (oyun içi dahil), tek para ile günlük vitrin + haftalık sınırlı + nadirlik + ücretsiz sezon şeridi, karakterler + aksesuarlar. 6 aşama. ✅ Aşama 1 (v0.75, telefonda denendi). ✅ Aşama 2 (v0.76, telefonda denendi). ✅ Aşama 3 (v0.77). Sıradaki: telefonda Aşama 3 denemesi, sonra Aşama 4 (sezon şeridi + görevler).

## Açık sorular (Törehan'a)

- Puan doğrulama için Workers Paid (ayda 5 $) alınsın mı?
- Ölçüm (analitik) eklensin mi, hangi hizmet?
- Bekçinin adı. İki para birimi mi, tek mi. Müzik parçaları (Mustafa'dan).
- ✅ **İstişare 6 (24/11) yanıtlandı:** kararlar `docs/istisare-6-bolum-hesap.md`. Kısa bölümler (önce Taş Kuyu), yıldız madalyalardan ve ödülsüz, harita ayrı ekran, tablo herkese açık (misafir de gönderir), ortak Funday Firebase projesi, giriş misafir + Google + e-posta, Workers Paid hesaplarla birlikte. Bekleyen: Törehan ortak Firebase projesini açacak ve Workers Paid'i alacak. ✅ A1 kısa bölüm kuralları: `docs/kisa-bolumler-plan.md`. ✅ A2 (v0.85): Taş Kuyu 18 kısa bölüm deneme olarak. ✅ A3 (v0.86): yıldızlar. ✅ A4 (v0.87): kuyu duvarı haritası. ✅ A5.1 (v0.88): Maden, Kristal ve Kule kısa bölümleri deneme olarak. Sırada A5.2 (geçiş: kısa bölümler asıl Hikâye olur, kayıt taşınır); önce Taş Kuyu ve yeni bölgeler telefonda denenir (§28, §31) ve Törehan onaylar. Ya da İstişare 5 Aşama 3.

## Devir geçmişi

| Tarih | Kimden → kime | Sürüm | Not |
|---|---|---|---|
| 11/11/2026 | Törehan → Mustafa | v0.51 | İlk devir; `CLAUDE.md`, bu dosya ve `DEVIR-MUSTAFA.md` eklendi |
| 17/11/2026 | Mustafa → Törehan | v0.55 | Bölge suyu, ekonomi dengesi ve ışık yolu, Haftalık Kuyu ve lig, meydan okuma, skor tablosu istemcisi (kapalı); yayında, telefonda denenmedi |
| 24/11/2026 | Törehan → Muhammed | v0.83 | İstişare 3 (his, yeni mekanikler), skor tablosu, Hoook adı, İstişare 4–5 arayüz (Askıda Menü Aşama 1), asılı başlangıç; `DEVIR-MUHAMMED.md` eklendi |
