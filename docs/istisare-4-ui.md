# İstişare 4 · Arayüz, menü, market ve eşyalar (23/11/2026)

> Kararlar Törehan'ın. Arayüz baştan değişir: menü ve gezinme, market, eşyalar ve görsel stil (oyun içi çizim dahil).
> Bu, `CLAUDE.md`'deki "görsel tasarım korunur" kararını değiştirir. Oynanış, kontrol ve nişan kuralı aynı kalır.
> Görsel taslak: `docs/istisare-4/taslak.html` (tarayıcıda aç, 375 px telefon çerçeveleri).

## Kararlar

| Konu | Karar |
|---|---|
| Ana ekran | **Hybrid-casual:** ortada seçili karakter ve dev OYNA; üstte para çubuğu ve ayarlar; solda Günlük/Haftalık kartları, sağda Sezon ve Vitrin kartları; altta 5 sekme: **Market · Koleksiyon · OYNA · Yarışma · Profil** |
| Görsel stil | **Parlak çizgi film:** kalın hatlı, bombeli ve gölgeli düğmeler, doygun renkler, oyuncak gibi ikonlar, kalın yuvarlak başlıklar. Oyun içi çizim de buna uyar |
| Market | **Tek para (ateşböceği):** günlük dönen vitrin, haftalık sınırlı görünüm, nadirlik (Sıradan → Efsane), oynadıkça dolan **ücretsiz** sezon şeridi |
| Eşyalar | **Karakterler + aksesuar:** farklı korlar ve ateş yaratıkları (kendi biçimi, yüzü, animasyonu) + şapka, yüz, sırt takıları + kanca, ip, iz ve alev efektleri. Hepsi yalnız süs |

Değişmeyenler: tek el kontrol ve nişan kuralı, uçuş ve çekme hızı, Hikâye ve 24+24 bölüm, Günlük/Haftalık deneme hakları, skor tablosu. Güçlendirmeler satın alınmaz; video yalnız oyuncu seçerse oynar; **rastgele kutu (ganimet sandığı) yok**, her ürünün içeriği ve fiyatı görünür.

## Referanslar (türdeki oyunlardan çıkarılan desenler)

- **Helix Jump, Stickman Hook (hyper-casual):** ana menü üç şey (Oyna, Market, Ayarlar), tek dokunuşla oyunda. Stickman Hook'ta 23 görünüm; ilerlemeyle açılanlar, ana ekranda haftalık dönen sınırlı görünüm, her bölüm sonunda "sıradaki açılışa ilerleme" çubuğu.
- **Subway Surfers, Crossy Road (runner):** karakter koleksiyonu ana ödül; düzenli sezon içeriği; oynadıkça dolan sezon şeridi; sınırlı süreli market; günlük görevler ve seriler, art arda tamamlayınca büyüyen ödül.
- **Hybrid casual (2026 eğilimi):** market tasarımın baştan parçası, "hyper-casual + market" değil; market düğmesi kendi yerinde ve öne çıkar; önce yerleşim, sonra süs.
- Bizden: oynanış ekranı sade kalır (oyun içi arayüz az); süs ve teklifler yalnız menüde.

Kaynaklar: [Pixune: hypercasual UI/UX](https://pixune.com/blog/hypercasual-games-ui-ux-design-guide/) · [Homa: game shop](https://hubspot.academy.homagames.com/game-design-game-shop-store) · [GameAnalytics: UI ve dönüşüm](https://www.gameanalytics.com/blog/how-to-make-your-game-ui-shine-and-increase-conversions) · [GameGrowthAdvisor: hybrid casual 2026](https://gamegrowthadvisor.com/blog/2026-04-16-hybrid-casual-game-design-strategy-2026/) · [Poki: Stickman Hook](https://poki.com/en/g/stickman-hook) · [InMobi: Subway Surfers](https://www.inmobi.com/blog/the-making-of-an-evergreen-title-subway-surfers)

## Bilgi mimarisi (yeni)

**Alt sekmeler** (ortadaki OYNA büyük ve yükseltilmiş):
1. **Market:** Günlük vitrin, Haftalık sınırlı, kategoriler.
2. **Koleksiyon:** Karakterler ve Aksesuarlar; giy, önizle, nasıl açılır.
3. **OYNA (ana ekran):** karakter sahnesi, sıradaki bölüm, kenar kartları.
4. **Yarışma:** Günlük Kuyu, Haftalık Kuyu, lig, skor tablosu (v0.74), meydan oku.
5. **Profil:** ad, istatistik, rekor duvarı, başarımlar, notlar. Ayarlar üst sağdaki çarktan.

**Ana ekran:** üst çubuk (ateşböceği, sezon kademesi, çark) · sol kartlar (Günlük, Haftalık: hak ve yıldız) · sağ kartlar (Sezon ilerlemesi, Vitrin: bugünün öne çıkan ürünü) · ortada karakter (boşta animasyon, dokununca tepki) · bölüm adı ve bölge · OYNA (Hikâye'de sıradaki bölüm; uzun basınca Hikâye haritası) · görevler bir rozetle Sezon kartında.

**Hikâye haritası:** OYNA'nın altındaki bölüm adına dokununca açılır. Dikey kuyu haritası; bölümler düğüm düğüm, bölge renkleri, finaller büyük düğüm.

## Eşyalar

**Nadirlik:** Sıradan (yeşil) · Nadir (mavi) · Destansı (mor) · Efsane (altın). Kart çerçevesi ve arka planı nadirliği gösterir.

**Karakterler** (taslak, adlar sonra kesinleşir). Her biri kendi biçimi, yüzü, boşta animasyonu ve ip bırakma tepkisiyle:
- Sıradan: Çıra (bugünkü kor) ve renk varyantları
- Nadir: Kibrit, Mum, Kömür
- Destansı: Ateş böceği, Fener ruhu, Volkan taşı
- Efsane: Anka yavrusu, Yıldız kayması (sezon ödülü)

**Aksesuarlar:** Baş (bere, taç, kask), Yüz (gözlük, bıyık), Sırt (atkı, pelerin, kanat), Kanca, İp, İz, Alev.

**Eski 56 görünümün taşınması:** sahip olunanlar kaybolmaz. Gövde renkleri → Çıra'nın renk varyantları (Sıradan) · atkılar → Sırt · kanca, ip, iz, alev → aynı kategori. Lig görünümleri lig ödülü olarak kalır. Cüzdan ve ışık yolu aynı.

## Market ve sezon

- **Günlük vitrin:** 4 ürün, her gün döner (herkes için aynı, tarihten). Biri video ile %50 indirimli (yalnız oyuncu seçerse).
- **Haftalık sınırlı:** 1 Destansı ya da Efsane ürün, pazartesi döner; ana ekranda sağ kartta.
- **Kategoriler:** Karakterler, Baş, Yüz, Sırt, Kanca, İp, İz, Alev; ızgara, nadirliğe göre sıralı, fiyat ve "sende var" etiketi.
- **Fiyat bantları (taslak):** Sıradan 60–150 · Nadir 250–400 · Destansı 600–900 · Efsane 1400–2000 ateşböceği. Hedef: ortalama oyuncu (~157/gün) haftada bir Nadir, ayda bir Destansı alabilir; `tools/ekonomi-olcum.js` ile ölçülür.
- **Sezon şeridi (ücretsiz, tek):** 4 haftalık sezon, 30 kademe. Sezon puanı Hikâye bölümleri, Günlük/Haftalık koşuları ve günlük görevlerden gelir. Ödüller: ateşböceği, aksesuarlar, son kademede sezon karakteri. Premium şerit yok (tek para kararı).

## Görsel stil (tasarım dili)

- Kalın koyu kontur (2–3 px), bombeli düğmeler (alt kenarda 4 px koyu gölge, basınca iner), büyük köşe yuvarlaklığı (14–20 px).
- Doygun palet: birincil turuncu-ateş, ateşböceği sarısı, kristal camgöbeği, maden moru; arka plan koyu lacivert-mor degrade.
- Başlıklar Baloo 2 ExtraBold (beyaz, koyu kontur), gövde Figtree.
- İkonlar dolgulu ve konturlu; sayı rozetleri kırmızı; ödül anlarında parıltı ve zıplama.
- Oyun içi: halka, duvar ve su aynı dile geçer (kalın kontur, doygun renk); karakterler çizgi film yüzlü. Arayüz oyun ekranında az kalır.

## Aşamalar (her biri ayrı sürüm, sonunda telefonda deneme)

1. ✅ (v0.75, telefonda deneme bekliyor) **Tasarım dili + ana ekran + alt gezinme:** yeni düğme, kart ve çubuk bileşenleri; OYNA ekranı; 5 sekme (eski ekranlar geçici olarak sekmelerin altında).
2. **Eşya modeli + Koleksiyon:** karakter ve aksesuar veri yapısı, nadirlik, eski görünümlerin taşınması, önizleme sahnesi.
3. **Market:** günlük vitrin, haftalık sınırlı, kategoriler, fiyatlar ve ekonomi ölçümü.
4. **Sezon şeridi + görevler:** sezon puanı, 30 kademe, görevlerin sezona bağlanması.
5. **Yarışma ve Profil sekmeleri:** Günlük, Haftalık, lig, skor tablosu ve rekor duvarı tek yerde.
6. **Oyun içi çizim:** karakterlerin oyunda çizimi ve animasyonu; halka, duvar ve su yeni stilde. Görsel olarak en büyük iş; botlar ve nişan etkilenmez (yalnız çizim).

Kalan karar (aşama 2 başında): karakter listesi ve adları, sezon teması ve sezon karakteri.
