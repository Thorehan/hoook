# Kuyu · Durum (kalınan nokta)

> Her oturumun başında okunur, iş bitince güncellenir. Kısa tutulur (~40 satır).

## Devir kimde: **Törehan** (Windows)

- Devir tarihi: 17/11/2026 · Mustafa → Törehan
- Devir noktası: v0.55 (yayında). Bu dönemin başı: v0.51, etiket `geri-donus-v0.51`; v0.52–v0.55'in her biri ayrı commit, `git revert` ile tek tek geri alınabilir.
- Devir Törehan'dayken Mustafa projede geliştirme yapmaz; devir `docs/DEVIR-MUSTAFA.md` §6'daki adımlarla yapılır.

## Son durum (v0.55)

- **Yayında v0.55** (12/11/2026'da Mustafa'nın onayıyla push edildi; v0.52–v0.55 birlikte çıktı).
- Bu dönemde yapılanlar (ayrıntı `docs/yol-haritasi.md`, `README.md`):
  - v0.52: bölge suyu (Hikâye'de zorluk eğrisi, 17. bölümden başlar)
  - v0.53: ekonomi dengesi, Dolap 47 görünüm, Alev rengi, ışık yolu 20 seviye
  - v0.54: Haftalık Kuyu ve lig
  - v0.55: meydan okuma bağlantısı, skor tablosu istemcisi (kapalı), yedek kodu, pazar araştırması
- Testler temiz (17/11/2026, devir öncesi tam koşu): bot çıkış 0 · nişanda kurala aykırı 0 · tek taraf 0/74 · spam ile geçilen bölüm 74 → 37/76 · hatasız oyuncu Sonsuz ve Haftalık'ta yanmıyor · ortalama gün ~119 ateşböceği · birim testleri (ekonomi, görev, hayalet, istatistik, online) tamam.
- Telefonda denenmedi: v0.50'den beri hiçbir şey. Liste: `docs/telefon-testi.md` §6.

## Sıradaki iş

0. **Törehan'ın gözden geçirmesi:** v0.52–v0.55 Mustafa'nın tam yetkisiyle, Törehan'a sorulmadan yapıldı. Önce `docs/yol-haritasi.md` → "Törehan'ın gözden geçirmesi için" tablosu okunur; istenmeyen karar ilgili commit'in `git revert`'iyle geri alınır.
1. **Telefonda deneme**, özellikle bölge suyu mesafeleri ve Haftalık Kuyu.
2. **Skor tablosunu açmak:** Supabase hesabı + iki değer (`docs/online-kurulum.md`).
3. İstişare 2'nin kalanı: görsel akıcılık → 24 uzun bölüm (Törehan ile planlanır).

## Açık sorular (Törehan'a)

- Bu dönemde alınan ve oyunun hissine dokunan kararların gözden geçirilmesi: `docs/yol-haritasi.md` → "Törehan'ın gözden geçirmesi için".
- Online için arka uç: öneri Supabase (istemci bu biçimde yazıldı); hesap kimde açılacak?
- Ölçüm (analitik) eklensin mi, hangi hizmet?
- Bekçinin adı. İki para birimi mi, tek mi. Müzik parçaları (Mustafa'dan).

## Devir geçmişi

| Tarih | Kimden → kime | Sürüm | Not |
|---|---|---|---|
| 11/11/2026 | Törehan → Mustafa | v0.51 | İlk devir; `CLAUDE.md`, bu dosya ve `DEVIR-MUSTAFA.md` eklendi |
| 17/11/2026 | Mustafa → Törehan | v0.55 | Bölge suyu, ekonomi dengesi ve ışık yolu, Haftalık Kuyu ve lig, meydan okuma, skor tablosu istemcisi (kapalı); yayında, telefonda denenmedi |
