# Kuyu · Durum (kalınan nokta)

> Her oturumun başında okunur, iş bitince güncellenir. Kısa tutulur (~40 satır).

## Devir kimde: **Törehan** (Windows)

- Devir tarihi: 17/11/2026 · Mustafa → Törehan
- Devir noktası: v0.55 (yayında). Bu dönemin başı: v0.51, etiket `geri-donus-v0.51`; v0.52–v0.55'in her biri ayrı commit, `git revert` ile tek tek geri alınabilir.
- Devir Törehan'dayken Mustafa projede geliştirme yapmaz; devir `docs/DEVIR-MUSTAFA.md` §6'daki adımlarla yapılır.

## Son durum (v0.59)

- **Yayında v0.59** (19/11/2026, Törehan): Yeni Hikâye deneme (Aşama 1, bölüm 1–3; Hikâye ekranının üstünde). Telefonda denenecek: `docs/telefon-testi.md` §7.
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
2. **Skor tablosunu açmak:** Supabase seçildi, şimdilik kapalı. Açma kararı ve hesap sonra (`docs/online-kurulum.md`).
3. İstişare 2'nin kalanı: ✅ görsel akıcılık (v0.56) → **24 uzun bölüm: plan hazır (18/11), `docs/hikaye-bolumleri-plan.md`**. Tarifli üretim, fener kontrol noktası, ikinci yolculuk, bölgeye göre taşıma. Aşama 1 ✅ (v0.59): bölüm 1–3 oynanır (deneme kartları), fener ve fenerden devam, duvar ipuçları. **Sıradaki: telefonda deneme (uzunluk, fener sıklığı, ipuçları) → Törehan onaylayınca Aşama 2 (Taş Kuyu ve Maden, 1–12).**

## Açık sorular (Törehan'a)

- Supabase hesabı ne zaman, kimde açılacak (arka uç Supabase, 18/11).
- Ölçüm (analitik) eklensin mi, hangi hizmet?
- Bekçinin adı. İki para birimi mi, tek mi. Müzik parçaları (Mustafa'dan).

## Devir geçmişi

| Tarih | Kimden → kime | Sürüm | Not |
|---|---|---|---|
| 11/11/2026 | Törehan → Mustafa | v0.51 | İlk devir; `CLAUDE.md`, bu dosya ve `DEVIR-MUSTAFA.md` eklendi |
| 17/11/2026 | Mustafa → Törehan | v0.55 | Bölge suyu, ekonomi dengesi ve ışık yolu, Haftalık Kuyu ve lig, meydan okuma, skor tablosu istemcisi (kapalı); yayında, telefonda denenmedi |
