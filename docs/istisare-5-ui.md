# İstişare 5 · Arayüz: "Askıda Menü" (24/11/2026)

Törehan'ın geri bildirimi (24/11): düğmeler ve mevcut yapı beğenilmedi; arayüz özgün olmalı ve hyper-casual bir oyun gibi görünmeli. Üç yön çizildi (`docs/istisare-5/yonler.html`): A Tek Dokunuş, B Askıda Menü, C Kuyu Haritası.

## Kararlar (Törehan, 24/11)

- **Yön: B · Askıda Menü.** Menü öğeleri kancalara asılı, hafifçe sallanan etiketlerdir.
- **Alt sekme çubuğu kalır** (Market · Koleksiyon · OYNA · Yarışma · Profil); yalnız görünüşü yeni dile göre değişir.
- **UI görseli yok;** çizimi Claude yapar. İleride bir görsel gelirse ona göre güncellenir.

## Tasarım dili

| Öğe | Kural |
|---|---|
| Renk | kor turuncusu `#ff7a2f`, ateşböceği sarısı `#ffe066`, gece moru `#1c1838`, taş yeşili; yardımcı: mavi `#5ec8ff`, mor `#9b6bff`, yeşil `#5fd38d`, pembe `#ff6fa8` |
| Çizgi | her etiket ve düğmede 3 px koyu çizgi (`#15112a`) |
| Gölge | bulanık değil, 4 px aşağı kaymış sert gölge (çıkartma hissi); cam efekti ve yumuşak gradyan yok |
| Biçim | etiketler hafif eğik (−4°…+4°); OYNA alt kenarı bombeli büyük etiket |
| Yazı | başlık ve düğme: Lilita One (tok, afiş gibi); küçük bilgi: Figtree 800 |
| Motif | "Hoook" adındaki üç "o" = halka; kanca ve ip her ekranda tekrar eder |
| Hareket | yakınlaşma ve büyüme yok. Etiketler ipinde yavaşça sallanır (±3°); dokununca savrulur; basınca sert gölge kapanıp etiket 4 px iner. Ekran geçişinde etiketler yukarıdan iple iner. Hareket azaltma açıksa salınım durur |

## Ekranlar

- **Ana ekran (OYNA sekmesi):** üstte ahşap kiriş. Kirişe asılı etiketler: ortada büyük **OYNA** (bölüm no ve adı), solda Günlük (altında zincirle Görev), sağda Haftalık (altında Sıralama). Ateşböceği bakiyesi ve ayarlar küçük çıkartmalar. Arkada canlı sahne, Çıra halkada asılı. Alt sekme çubuğu çıkartma diliyle.
- **Market, Koleksiyon, Yarışma, Profil:** başlık kirişten asılı tabela; kartlar çıkartma (kalın çizgi, sert gölge, hafif eğik); ürün penceresi alttan yükselen sayfa (bottom sheet), kancadan asılı gibi görünür.
- **Pencereler** (günlük giriş, hak bitti, ayarlar): yukarıdan iple inen tahta; kapanınca yukarı çekilir.
- **Durumlar:** yükleniyor (ip üstünde dönen kanca), boş (boş kanca + kısa yazı), hata (kopmuş ip), başarı (etiket sevinçle savrulur, ateşböceği parçacıkları).

## Korunanlar

Bütün özellikler ve akışlar aynı kalır: Hikâye, Günlük, Haftalık, Görevler, Sıralama, Market (vitrin, haftanın ürünü, video indirimi), Koleksiyon, Profil, Ayarlar, Android geri tuşu, dokunuş sesi ve titreşimi, dokunma alanları ≥44 px. Yalnız görünüş ve yerleşim değişir.

## Aşamalar

1. **Tasarım dili + ana ekran + alt sekme çubuğu** (asılı etiketler, salınım, yeni yazı tipi).
2. **Market ve Koleksiyon** (çıkartma kartlar, ürün sayfası).
3. **Yarışma, Profil, pencereler ve durumlar.**
4. Açılış, tanıtım ve sonuç kartları; dört ekran boyutunda tarama.

Her aşama ayrı sürüm; telefonda denenip onaylanınca sonraki.
