# Kısa bölümler · tasarım kuralları (24/11/2026)

> İstişare 6, Yol A. Kararlar Törehan'ın (24/11, `docs/istisare-6-bolum-hesap.md`): uzun bölümler kısa bölümlere bölünür, yıldızlar madalyalardan gelir ve ödülsüzdür, harita ayrı ekrandır. Bu belge kuralları ve Taş Kuyu denemesini tanımlar.
>
> **Durum:** ✅ A1 kurallar. ✅ A2 (v0.85, telefonda deneme bekliyor): Taş Kuyu'nun 18 kısa bölümü Hikâye ekranının başında deneme olarak; ölçümler §6'da. ✅ A3 (v0.86): yıldızlar sonuç kartında, bölüm kartlarında, grup başlıklarında ve özette (§3). ✅ A4 (v0.87): kuyu duvarı haritası, bugünkü 48 bölümle; A5'te kısa bölümlere geçince aynı harita kullanılır. ✅ A5.1 (v0.88, telefonda deneme bekliyor): Maden, Kristal ve Kule'nin 65 kısa bölümü deneme olarak; tablo ve ölçümler §9'da. ✅ A5.2 (v0.92): geçiş; kısa bölümler 1–83 asıl Hikâye, ikinci yolculuk 84–107 (uzun, A5.3'e kadar), kayıt taşındı (§10).

## 1 · Bölüm kuralları

| Kural | Değer |
|---|---|
| Kaynak | Her kısa bölüm bugünkü bir **bölmeden** doğar (fener arası). Tarif, tek bölmeli bir bölüm tarifidir. |
| Süre (insan) | Taş Kuyu 30–45 sn · Maden 40–60 sn · Kristal ve Kule 45–90 sn. **Öğret bölümleri bilerek daha kısa** (20–30 sn): yeni şey hızlı öğrenilir, hemen başarı gelir. Model insandan ~1,8 kat hızlı (`hikaye-olcum.js`): Taş Kuyu modelde öğret 11–16 sn, diğerleri 16–25 sn. Kısa kalırsa bölmenin düğüm sayısı (`n`) artırılır. |
| Tek fikir | Her bölüm bir şey öğretir ya da bir şeyi sınar. Bölüm adı o fikri söyler. |
| Başlangıç | Bugünkü gibi geçici çengelde asılı (`asiliBasla`, v0.83). |
| Bitiş | Kova (gün ışığı). TAM kova bugünkü gibi +50. |
| Fener | **Yok.** Bölüm kısa; düşen ya da yanan oyuncu bölümün başından başlar. |
| Duvar ipuçları | Yalnız öğret bölümlerinde, en çok 3 yazı. İlk karşılaşmada tanıtım kartı bugünkü gibi çıkar. |
| Ateşböceği | Her bölümde en az 1 (Ateşböceği madalyası her bölümde anlamlı olsun). Bölgenin toplam ateşböceği sayısı bugünküyle aynı kalır (±%10), böylece ekonomi değişmez. |
| Kusursuz | Atış sayısı ≤ par. Fener olmadığı için "fenere dönmeden" şartı düşer. |
| Akış hedefi | Bölmenin düğüm sayısının yaklaşık yarısı; bot ölçümüyle ayarlanır (ortalama oyuncu ulaşabilmeli, spam ulaşamamalı). |
| Su | Bölgenin bugünkü su kuralı aynen geçerli (Taş Kuyu susuz, Maden yükselen, Kristal ve Kule izleyen). |

## 2 · Özel halkaların dağılımı

Her mekanik bölgesinde dört adımda görünür:

1. **Öğret:** tek başına, güvenli yerde, duvar yazısıyla.
2. **Pekiştir:** aynı mekanik daha sık ve daha sıkışık.
3. **Birleştir:** önceki mekaniklerle bir arada.
4. **Sürpriz:** sonraki bir bölümde beklenmedik yerde (bir ya da iki tane).

Kor halka, döner çark ve akıntı sütunu Maden, Kristal ve Kule'de bu kurala göre yayılır (A5). Bugün her biri tek bir bölmede yoğun; kısa bölümlerde en az 3–4 bölüme dağılır.

## 3 · Yıldızlar (ödülsüz)

- 1★ bölümü geç · 2★ en az bir madalya · 3★ üç madalya (Ateşböceği, Kusursuz, Akış).
- Yıldız ateşböceği ya da eşya vermez. Ateşböceği ödemesi bugünkü gibi yalnız ilk kez toplanan ateşböcekleri için (`EKO.bolumOde`).
- Bölüm tekrar oynanabilir; en iyi madalyalar kalır, yıldız düşmez.
- Haritada her halkanın altında 0–3 yıldız; bölgenin üstünde toplam (ör. 31/54★).
- **v0.86 (A3):** sonuç kartında başlığın yanında üç yıldız (en iyi kayıttan; bu koşuda yeni yıldız gelirse "YENİ"), altında bir sonraki yıldız için ipucu. Bölüm kartlarında geçilmiş bölümün sağ üstünde ✓/★ yerine üç küçük yıldız; grup başlığında ve Hikâye özetinde toplam. Hesap `game.js` → `yildiz(b, ateşböceği sayısı)`, kayıtta yeni alan yok.

## 4 · Taş Kuyu: 6 uzun → 18 kısa (A2 taslağı)

Adlar taslak. Ateşböceği bugünkü bölmelerden (toplam 29). 0 olan dört bölüme 1 eklenir, 3 olan iki bölümden 1 düşülür: toplam 31 (+%7, sınırın içinde; A2'de `ekonomi-olcum.js` ile doğrulanır).

| Kısa | Kaynak | Tür | Öğrettiği / sınadığı | Ateşböceği | Not |
|---|---|---|---|---|---|
| 1 | 1·ogret | öğret | Sol/sağ seçimi, tut | 0 → 1 | |
| 2 | 1·uygula | pekiştir | Bırak ve savrul, ateşböceği halkası | 2 | |
| 3 | 1·sina | sına | Kova | 2 | |
| 4 | 2·ogret | öğret | Erken bırak, fırla, akış | 1 | |
| 5 | 2·uygula | pekiştir | Havadan tutun | 2 | |
| 6 | 2·sina | sına | Akış zinciri | 3 | Not 1 |
| 7 | 3·ogret | öğret | Ahşap panel, kanca taştan seker | 0 → 1 | |
| 8 | 3·uygula | pekiştir | Panelin karşısındaki ateşböceği | 2 | |
| 9 | 3·sina | birleştir | Panel + akış | 3 → 2 | |
| 10 | 4·ogret | öğret | Hız halkası | 0 → 1 | |
| 11 | 4·uygula | pekiştir | Çekilirken bırak | 2 | |
| 12 | 4·sina | birleştir | Hız + panel | 2 | Not 2 |
| 13 | 5·ogret | öğret | TAM bırakış | 1 | |
| 14 | 5·uygula | pekiştir | Uzun akış | 2 | |
| 15 | 5·sina | birleştir | Hepsi bir arada, sürpriz hız halkası | 3 → 2 | |
| 16 | 6·ogret | öğret | Kutu, düğme, kapak | 0 → 1 | |
| 17 | 6·uygula | birleştir | Panel + hız | 2 | |
| 18 | 6·sina | sına | Taş Kuyu finali | 2 | Not 3 · **final** |

Notlar ve final, eski uzun bölümün son kısa bölümüne taşınır.

## 5 · Teknik yaklaşım

- **Tarifler:** `js/bolumler.js` içine ayrı bir liste (`KISA`): her öğe tek bölmeli bir bölüm tarifi (`no`, `ad`, `bolge`, `akis`, `ipucu`, `su`, `not`, `bolmeler: [tek bölme]`). Bugünkü 24 tarif A5'e kadar değişmez.
- **Üretici:** bugünkü `gen.createBolum` tek bölmeli tarifle çalışıyor (son bölmeye fener konmuyor). Kısa bölümler kendi tohum alanını kullanır (`gen.createKisa` → `rng(900001 + no × 7919)`, ortak gövde `bolumKur`), böylece eski bölümler ve Günlük/Haftalık tohumları aynı kalır. Rastgele sayı sırası bozulmaz.
- **Kayıt:** kısa bölümler ayrı anahtarda (`save.kisaBest`). Hayaletler `k` önekiyle (`k1`, `k2` …), eski numaralarla çakışmaz.
- **A2'de deneme olarak:** v0.59'daki gibi. Hikâye ekranında "Yeni Taş Kuyu (deneme)" girişi; bugünkü 24 bölüm ve ilerleme olduğu gibi kalır. Beğenilirse A5'te geçiş.
- **A5 geçişi (sonra):** uzun bölüm *k* geçildiyse ondan doğan kısa bölümler "geçildi, madalyasız" sayılır (birebir eşleme; v0.62'deki oranlı taşımaya gerek yok). Notlar, finaller, cüzdan kalır. İkinci yolculuk (25–48) en son ele alınır.

## 6 · Doğrulama (A2'den önce Node kurulu olmalı)

- `node tools/kontrol.js`
- `node tools/bot.js`: her kısa bölüm geçilmeli (çıkış 0).
- `node tools/nisan.js`: "kurala aykırı" 0.
- `node tools/oyuncu.js`: tek tarafa basan oyuncu her kısa bölümde 0.
- `node tools/spam.js`: spam ile geçilen bölüm oranı bugünkünden kötü olmamalı.
- `node tools/hikaye-olcum.js`: süreler §1'deki aralıkta.
- `node tools/ekonomi-olcum.js`: ortalama gün ~119 ateşböceği korunmalı.
- Botlar kısa bölüm listesini de dolaşacak şekilde genişletilir.

**A2 ölçümleri (v0.85, 24/11):**
- `bot.js` çıkış 0: 18 kısa bölümün hepsi rahat, akış ve ateşböceği rotasıyla geçiliyor; ateşböceklerinin hepsi alınıyor, akış hedefi tutuyor.
- `KISA=1 node tools/hikaye-olcum.js`: temkinli %5 modelde öğret 12–16 sn, pekiştir ve sına 16–21 sn.
- `KISA=1 node tools/hikaye-denge.js`: tek taraf geçen 0/18, temkinli %5'in bitiremediği 0. Spam 18/18 geçiyor; bugünkü uzun Taş Kuyu'da da 6/6 (Taş Kuyu öğretici, yanlış taraf ipi bırakmaz). Spam düşünen oyuncudan (akış) yavaş, temkinliden hızlı: uzun bölümlerle aynı oran.
- Eski 48 bölüm, Sonsuz ve Haftalık üretici çıktısı birebir aynı. `nisan.js` kurala aykırı 0, `oyuncu.js` tek taraf ölüyor, `spam.js`, `hata.js 6`, `geri.js 16` (%4,4), `ekonomi-olcum.js`, `denge.js` ve birim testleri öncekiyle aynı.
- Ateşböceği toplamı 31 (eski 29). Deneme ayrı kayıtta olduğu için ekonomiye A5 geçişine kadar girmez.

## 7 · Değişmeyenler

Tek el kontrol, nişan kuralı, `CFG.REEL` 760, bölge su kuralları, Günlük ve Haftalık Kuyu (tohumlar ve üretici), ekonomi fiyatları, hikâye metinleri (notlar ve finaller yalnız yer değiştirir).

## 8 · Sıradaki adımlar

1. **A2:** Taş Kuyu'nun 18 kısa bölümü deneme olarak (tarifler, üretici bağlantısı, kayıt, deneme girişi, botlar). Ayrı sürüm, telefonda denenir.
2. **A3:** yıldızlar (sonuç kartı ve bölüm listesinde 0–3★).
3. **A4:** kuyu duvarı haritası (arayüz işi: önce yaklaşım ve onay).
4. **A5:** diğer bölgeler, özel halkaların yayılması, geçiş ve ikinci yolculuk. Üç sürümde (25/11, Muhammed onayladı): **A5.1** Maden, Kristal ve Kule'nin kısa bölümleri deneme olarak (§9) · **A5.2** geçiş: kısa bölümler asıl Hikâye olur, kayıt taşınır (Taş Kuyu denemesi telefonda beğenilip Törehan onaylayınca) · **A5.3** ikinci yolculuk kısa bölümlere (otomatik).

## 9 · Maden, Kristal ve Kule: 18 uzun → 65 kısa (A5.1 taslağı)

Adlar taslak (tablodaki "Ad: öğrettiği" sütununun başı bölüm adıdır); Muhammed onayladı (25/11), Törehan bakar. Numaralar ilk yolculuğun kısa bölüm sırası (Taş Kuyu 1–18'in devamı); denemede oyunda 100 eklenir (119–183), kayıt yine `save.kisaBest`.

**Kurallar (bu üç bölge için):**
- **Uzunluk:** Taş Kuyu'daki gibi bölmenin düğüm sayısı ~1,3–1,5 katına çıkar (öğret bölümleri kısa kalır), sonra `KISA=1 node tools/hikaye-olcum.js` ile §1'deki sürelere ayarlanır.
- **Su:**
  - Maden ve Kristal 13–14'te bugün su ilk fenerden sonra yükseliyor (`suFener: 1`). Bu yüzden yeni şey öğreten bölüm susuz, diğerleri yükselen suyla başlar (ilk tutunuşta, uzun bölümün hızıyla).
  - 19 "Yükselen Su" suyu öğrettiği için yavaş suyla başlar (bugünkü 7. bölüm gibi).
  - Kristal 15–18 ve Kule bugünkü gibi izleyen su (22 / 18 m, Fırtına 15 m); yanlış taraf ipi bırakır.
- **Ateşböceği:** 0 olan bölüme 1 eklenir. Bölge toplamı ±%10'u aşarsa öğret bölümlerinden biri 1 azalır: Fırlatma yolunun ateşböceği dahil: Taş 29 → 31, Maden 28 → 30, Kristal 39 → 42, Kule 42 → 44; dört bölge birlikte 138 → 147 (+%7).
- **Özel halkalar (§2):** kor halka Maden'de zaten öğret → pekiştir → birleştir olarak yayılı, değişmez. Eksik adımlar için tariflerde üç küçük değişiklik:
  - 51: çark 1 → 2 (pekiştir).
  - 56: +1 çark (sürpriz).
  - 71: akıntı 1 → 2 (pekiştir).
- **Duvar yazıları:** öğret bölümlerinde en çok 3 yazı; fener yazıları kalkar (fener yok).
- **Notlar ve finaller:** eski uzun bölümün son kısa bölümünde. Bölge finalleri 36, 60 ve 83.

### Maden (7–12 → 19–36)

| Kısa | Kaynak | Tür | Öğrettiği / sınadığı | Özel | Ateşböceği | Su | Not |
|---|---|---|---|---|---|---|---|
| 19 | 7·ogret | öğret | Yükselen su: asılı bekleme | | 1 | 45 | |
| 20 | 7·uygula | öğret | Kor halka 1,5 sn sonra söner | kor 4 | 2 → 1 | 45 | |
| 21 | 7·sina | pekiştir | Sönen korlar ve hız | kor 3 | 2 | 45 | |
| 22 | 8·ogret | öğret | Yay: tutunduğun an fırlatır | | 0 → 1 | yok | |
| 23 | 8·uygula | pekiştir | Tepede süzül, sıradakine bas | | 2 | 50 | |
| 24 | 8·sina | birleştir | Yay ve kor | kor 1 | 2 | 50 | Not 4 |
| 25 | 9·ogret | öğret | Rüzgâr şeridi: akış +1 | | 0 → 1 | yok | |
| 26 | 9·uygula | pekiştir | Rüzgârlı yol | | 2 | 54 | |
| 27 | 9·sina | birleştir | Rüzgâr, yay ve kor | kor 1 | 2 | 54 | |
| 28 | 10·ogret | öğret | Sarkaç: o yana bas, yakına gelince tutun | | 0 → 1 | yok | |
| 29 | 10·uygula | pekiştir | Sarkacı bekle | | 2 | 58 | |
| 30 | 10·sina | birleştir | Sarkaç, yay ve kor | kor 1 | 2 | 58 | Not 5 |
| 31 | 11·ogret | öğret | Alev: akışta TAM bırak | | 1 | yok | |
| 32 | 11·uygula | pekiştir | Alevli rüzgâr | | 2 | 62 | |
| 33 | 11·sina | birleştir | Alevi koru: rüzgâr, hız, kor | kor 1 | 2 | 62 | |
| 34 | 12·uygula | birleştir | Maden yolu: yay ve sarkaç | | 2 | 66 | |
| 35 | 12·sina | birleştir | Derin maden: rüzgâr, hız, sarkaç | kor 1 | 2 | 66 | |
| 36 | 12·sina | sına | Maden Ağzı | kor 2 | 2 | 66 | Not 6 · **final** |

### Kristal Mağara (13–18 → 37–60)

| Kısa | Kaynak | Tür | Öğrettiği / sınadığı | Özel | Ateşböceği | Su | Not |
|---|---|---|---|---|---|---|---|
| 37 | 13·ogret | öğret | Geçit: mor girdap yukarı taşır | | 0 → 1 | yok | |
| 38 | 13·uygula | pekiştir | Geçit ve yay | | 2 | 60 | |
| 39 | 13·sina | birleştir | Geçit ve sarkaç | | 2 | 60 | |
| 40 | 13·ustalik | birleştir | Mor kestirme: geçit ve rüzgâr | | 2 | 60 | |
| 41 | 14·ogret | öğret | Fırlatma yolu: akışta erken bırak | | 0 (fırlatma yolunun ateşböceği 1) | yok | |
| 42 | 14·uygula | pekiştir | Erken bırak | | 1 | 62 | |
| 43 | 14·sina | birleştir | Fırlatma yolu ve hız | | 1 | 62 | |
| 44 | 14·ustalik | birleştir | Cesur yol: fırlatma ve rüzgâr | | 1 | 62 | Not 7 |
| 45 | 15·ogret | öğret | Su seni izliyor, yanlış taraf ipi bırakır | | 1 | izler 22 | |
| 46 | 15·uygula | pekiştir | İzleyen su ve yay | | 2 | izler 22 | |
| 47 | 15·sina | birleştir | İşarete bak: sarkaç ve rüzgâr | | 2 | izler 22 | |
| 48 | 15·ustalik | birleştir | Geçit ve hız | | 2 | izler 22 | |
| 49 | 16·ogret | öğret | Altın zincir: 1, 2, 3 | | 0 → 1 | izler 22 | |
| 50 | 16·uygula | öğret | Döner çark: yükselirken bırak | çark 3 | 1 | izler 22 | |
| 51 | 16·sina | pekiştir | Çark ve zincir | çark 1 → **2** | 2 | izler 22 | |
| 52 | 16·ustalik | birleştir | Zincir ve fırlatma yolu | | 1 | izler 22 | Not 8 |
| 53 | 17·ogret | öğret | Kalkan küresi | | 1 | izler 22 | |
| 54 | 17·uygula | öğret | Fener küresi ateşböceklerini çeker | | 4 → 3 | izler 22 | |
| 55 | 17·sina | öğret | Kanat küresi | | 0 → 1 | izler 22 | |
| 56 | 17·ustalik | birleştir | Kalkan, geçit ve çark | **+çark 1** | 2 | izler 22 | |
| 57 | 18·uygula | birleştir | Kristal yolu: geçit ve sarkaç | | 2 | izler 22 | |
| 58 | 18·sina | birleştir | Fırlatma, yay, rüzgâr ve çark | çark 1 | 1 | izler 22 | |
| 59 | 18·sina | birleştir | Zincir ve sarkaç, sürpriz kor | kor 1 | 2 | izler 22 | |
| 60 | 18·ustalik | sına | Kristal Kalbi | | 1 | izler 22 | Not 9 · **final** |

### Eski Kule (19–24 → 61–83)

| Kısa | Kaynak | Tür | Öğrettiği / sınadığı | Özel | Ateşböceği | Su | Not |
|---|---|---|---|---|---|---|---|
| 61 | 19·uygula | pekiştir | Eski Kule: su daha yakın, ahşap ve sarkaç | | 2 | izler 18 | |
| 62 | 19·sina | birleştir | Dar merdiven: ahşap, sarkaç, rüzgâr | | 2 | izler 18 | |
| 63 | 19·sina | pekiştir | Ahşap sarkaç | | 2 | izler 18 | |
| 64 | 19·ustalik | birleştir | Kule basamakları | kor 1 | 2 | izler 18 | |
| 65 | 20·uygula | pekiştir | Yaylar art arda | | 1 | izler 18 | |
| 66 | 20·sina | birleştir | Yaylar ve geçitler | | 2 | izler 18 | |
| 67 | 20·sina | birleştir | Yay, geçit ve sürpriz çark | çark 1 | 2 | izler 18 | |
| 68 | 20·ustalik | birleştir | Kule kestirmesi: yay, geçit, fırlatma | | 1 | izler 18 | Not 10 |
| 69 | 21·uygula | öğret | Akıntı: akış sürerken süzül | akıntı 3 | 1 | izler 18 | |
| 70 | 21·sina | birleştir | Rüzgâr, zincir ve kor | kor 2 | 2 | izler 18 | |
| 71 | 21·sina | pekiştir | Akıntı zinciri | akıntı 1 → **2** | 1 | izler 18 | |
| 72 | 21·ustalik | birleştir | Uzun akış: rüzgâr, fırlatma, zincir | akıntı 1 | 1 | izler 18 | |
| 73 | 22·uygula | pekiştir | İki yol: kısa ama zor, uzun ama güvenli | | 1 | izler 18 | |
| 74 | 22·sina | pekiştir | Kısa mı, uzun mu | | 1 | izler 18 | |
| 75 | 22·sina | birleştir | İki yol ve çark | çark 1 | 1 | izler 18 | |
| 76 | 22·ustalik | birleştir | İki yol ve akıntı | akıntı 1 | 1 | izler 18 | Not 11 |
| 77 | 23·sina | sına | Fırtına: su çok yakın | kor 2 | 2 | izler 15 | |
| 78 | 23·sina | sına | Fırtınanın gözü | | 2 | izler 15 | |
| 79 | 23·ustalik | sına | Fırtınanın sonu | akıntı 1 | 2 | izler 15 | |
| 80 | 24·uygula | birleştir | Son kuyu: yay, sarkaç, rüzgâr | | 2 | izler 18 | |
| 81 | 24·sina | birleştir | Pencere: geçit, fırlatma, çark | çark 1 | 1 | izler 18 | |
| 82 | 24·sina | birleştir | Kalkan ve kor | kor 1 | 2 | izler 18 | |
| 83 | 24·ustalik | sına | Fener | akıntı 1 | 1 | izler 18 | Not 12 · **final** |

**Özel halkaların yolu:**
- **Kor:** 20 öğret → 21 pekiştir → 24, 27, 30, 33, 35 birleştir → 36 final → 59, 64, 70, 77, 82 sürpriz.
- **Çark:** 50 öğret → 51 pekiştir → 56, 58 birleştir → 67, 75, 81 sürpriz.
- **Akıntı:** 69 öğret → 71 pekiştir → 72, 76 birleştir → 79, 83 sürpriz.

**A5.1 ölçümleri (v0.88, 25/11):**
- Ateşböceği halkaları fırlatma yolununki dahil sayıldı: Maden 28 → 30 (+%7), Kristal 39 → 42 (+%8), Kule 42 → 44 (+%5). Bunun için 41'e ayrıca ateşböceği konmadı; fırlatma yolunun ateşböceği zaten var.
- **Uzunluk:**
  - Öğret bölümleri 13–17 düğüm (55 "Kanat" 20: kanat küresinin üstünde boş halka gerekiyor).
  - Maden'in diğer bölümleri 19–22 düğüm, Kristal 22–25, Kule 22–28.
  - `KISA=1 node tools/hikaye-olcum.js` (temkinli %5, model insandan ~1,8 kat hızlı): öğret 11–19 sn, Maden 21–26 sn, Kristal 23–27 sn, Kule 18–33 sn.
- Akış hedefi düğüm sayısının ~%45'i (Taş Kuyu'daki oran); rüzgâr, akıntı ve alev bölümlerinde +1.
- `bot.js` çıkış 0. 83 kısa bölüm rahat, akış ve ateşböceği rotasıyla geçiliyor. 74'te düz akış botu takılıyor, nişanla akış geçiyor.
- Her bölümde özel halkaların hepsi yerleşiyor (geçit, çark, akıntı, küre, zincir, kor).
- `KISA=1 node tools/hikaye-denge.js 4 19 83`:
  - Temkinli %5'in bitiremediği 0.
  - Tek taraf geçen 0. 22 "Yay" önce sağa basarak geçiliyordu, zikzak düzenle düzeldi.
  - Spam 65/65 geçiyor; bugünkü uzun bölümlerde de 18/18. Spam ile temkinli oyuncunun süre oranı kısa bölümlerde Maden 0,85, Kristal 0,90, Kule 1,19; uzun bölümlerde 0,80, 0,74, 0,81. Yani spam kısa bölümlerde uzun bölümlerden kolay değil.
- Eski 48 bölüm, Günlük ve Haftalık değişmedi (`gen.js` değişmedi). `nisan.js` kurala aykırı 0, `geri.js 16` %4,4. `oyuncu.js`, `spam.js`, `hata.js 6`, `ekonomi-olcum.js`, `denge.js` ve birim testleri öncekiyle aynı.

## 10 · A5.2 geçişi (v0.92, 25/11)

- **Numaralar:** kısa bölümler 1–83 (deneme numaraları 101–183 kalktı), ikinci yolculuk 84–107 (`gen.createBolum(n − 59)`, eski 25–48 birebir). Bölge aralıkları kısa tariflerin `bolge` alanından (`game.js` → `BOLGE_ARALIK`); ikinci yolculukta bölge başına 6.
- **Kayıt taşıma** (`js/gecis.js`, bir kez, `save.hikayeV` 3; test `tools/gecis-test.js`):
  - Denemede geçilen kısa bölüm (`save.kisaBest[100 + no]`) aynen taşınır; deneme kaydı `save.kisaDeneme`'de arşiv.
  - Uzun bölüm k geçildiyse ondan doğan kısa bölümler (tarifteki `kaynak`) "geçildi, madalyasız" (`tasindi`), 1 yıldız; ilk gerçek geçişte "ilk kez geçildi" sayılır.
  - Ateşböceği tekrar ödenmez: `odenen` = kısa bölümün ateşböceği × uzun bölümde toplanan oran; `EKO.bolumOde` önceki en iyiyi `max(ff, odenen)` alır.
  - İkinci yolculuğun kaydı 25–48 → 84–107. Eski uzun kayıtlar `save.uzunBest`'te.
  - Hayaletler (`kuyu.hayalet`) ve bölüm istatistikleri yeni numaraya geçer; eski uzun 1–24'ünkiler bırakılır (istatistikte `eskiBolum`).
  - `save.last`, `maxLevel`, `haritaSon` sıradaki bölüme kurulur (haritada uzun atlama gösterilmez).
- **Finaller ve notlar:** bölge finalleri 18, 36, 60, 83 (ilk yolculuk); bekçinin notları kısa tariflerdeki `not` ile (6, 12, 18, 24, 30, 36, 44, 52, 60, 68, 76, 83).
- **Kâşif:** 18 / 60 / 107 (kazanılmış kademe geri alınmaz).
- **Ölçüm:** `ekonomi-olcum.js` kısa bölümler 19–60 ile (`UZUN=1` eski uzun 7–18): ortalama gün ~147 ateşböceği (uzunla ~157). Bot notların 12/12'sini kısa bölümlerde ateşböceği rotasıyla alıyor.
- **Geri dönüş:** `geri-donus-v0.91` etiketi.

**A5.1'de (v0.88) yapılanlar:**
- 65 tarif `KISA` listesine eklenir.
- Hikâye ekranında Taş Kuyu denemesinin yanına "Yeni Maden", "Yeni Kristal Mağara" ve "Yeni Eski Kule" (deneme) grupları gelir. Harita ve asıl Hikâye değişmez.
- Botlar 83 kısa bölümü dener: `bot.js`, `KISA=1` ile `hikaye-olcum.js` ve `hikaye-denge.js`. Şartlar: tek taraf 0, hatasız oyuncu yanmaz, spam uzun bölümlerden kötü değil.
- Eski 48 bölüm, Günlük ve Haftalık üretici çıktısı birebir aynı kalır.
