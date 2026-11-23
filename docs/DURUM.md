# Kuyu · Durum (kalınan nokta)

> Her oturumun başında okunur, iş bitince güncellenir. Kısa tutulur (~40 satır).

## Devir kimde: **Törehan** (Windows)

- Devir tarihi: 17/11/2026 · Mustafa → Törehan
- Devir noktası: v0.55 (yayında). Bu dönemin başı: v0.51, etiket `geri-donus-v0.51`; v0.52–v0.55'in her biri ayrı commit, `git revert` ile tek tek geri alınabilir.
- Devir Törehan'dayken Mustafa projede geliştirme yapmaz; devir `docs/DEVIR-MUSTAFA.md` §6'daki adımlarla yapılır.

## Son durum (v0.71)

- **Yayında v0.71** (23/11/2026, Törehan): akıntı sütunu (İstişare 3 Aşama C, 3/3). Akış sürerken yukarı süzdürür, kestirme; 21. bölüm öğretir; Günlük/Haftalık kor ve çark ile aynı tarihten (24/11, 30/11 haftası). Telefonda denenecek: `docs/telefon-testi.md` §17.
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
2. **Skor tablosunu açmak (23/11):** arka uç Firebase + Cloudflare (Supabase yerine). Sunucu (`sunucu/`), istemci ve testler hazır, yerelde uçtan uca denendi; kapalı. Hesaplar stüdyonun Google hesabıyla açılacak, sonra kurulum `docs/online-kurulum.md`. Kalan arayüz: Haftalık menüsünde tam tablo.
3. İstişare 2'nin kalanı: ✅ görsel akıcılık (v0.56) → **24 uzun bölüm: plan hazır (18/11), `docs/hikaye-bolumleri-plan.md`**. Tarifli üretim, fener kontrol noktası, ikinci yolculuk, bölgeye göre taşıma. Aşama 1 ✅ (v0.59): bölüm 1–3 oynanır (deneme kartları), fener ve fenerden devam, duvar ipuçları. Telefonda onaylandı (19/11). Aşama 2 ✅ (v0.60): bölüm 4–12. Aşama 3 ✅ (v0.61): bölüm 13–24. Aşama 4 ✅ (v0.62): geçiş. Aşama 5 ✅ (v0.63): denge (`tools/hikaye-denge.js`). **Plan tamam.** Sıradaki: telefon geri bildirimiyle ince ayar (süre, su, fener sıklığı, ikinci yolculuğun zorluğu); sonra açık sorular (Supabase, analitik, bekçinin adı, müzik).

- **İstişare 3 (23/11): oynanış hissiyatı.** Plan `docs/istisare-3-his.md`: A his (vuruş, ses, titreşim, görsel ipuçları) → B tatmin anları (kova, fener, uzun akış, düşüş-dönüş) → C yeni mekanikler (kor halka, döner çark, akıntı sütunu). Kontrol değişmiyor. ✅ A (v0.67, telefonda denendi). ✅ B (v0.68, telefonda denendi). C: mevcut bölümlere bölme, sıra kor → çark → akıntı, sonra Günlük/Haftalık. ✅ Kor halka (v0.69). ✅ Döner çark (v0.70). ✅ Akıntı sütunu (v0.71). **İstişare 3 tamam.** Sıradaki: telefonda akıntı denemesi; sonra telefon geri bildirimiyle ince ayar ve açık sorular.

## Açık sorular (Törehan'a)

- Firebase ve Cloudflare hesapları (stüdyonun Google hesabıyla; 23/11). Puan doğrulama için Workers Paid (ayda 5 $) alınsın mı?
- Ölçüm (analitik) eklensin mi, hangi hizmet?
- Bekçinin adı. İki para birimi mi, tek mi. Müzik parçaları (Mustafa'dan).

## Devir geçmişi

| Tarih | Kimden → kime | Sürüm | Not |
|---|---|---|---|
| 11/11/2026 | Törehan → Mustafa | v0.51 | İlk devir; `CLAUDE.md`, bu dosya ve `DEVIR-MUSTAFA.md` eklendi |
| 17/11/2026 | Mustafa → Törehan | v0.55 | Bölge suyu, ekonomi dengesi ve ışık yolu, Haftalık Kuyu ve lig, meydan okuma, skor tablosu istemcisi (kapalı); yayında, telefonda denenmedi |
