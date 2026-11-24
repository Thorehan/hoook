# Kısa bölümler · tasarım kuralları (24/11/2026)

> İstişare 6, Yol A. Kararlar Törehan'ın (24/11, `docs/istisare-6-bolum-hesap.md`): uzun bölümler kısa bölümlere bölünür, yıldızlar madalyalardan gelir ve ödülsüzdür, harita ayrı ekrandır. Bu belge kuralları ve Taş Kuyu denemesini tanımlar.
>
> **Durum:** ✅ A1 kurallar. ✅ A2 (v0.85, telefonda deneme bekliyor): Taş Kuyu'nun 18 kısa bölümü Hikâye ekranının başında deneme olarak; ölçümler §6'da.

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
4. **A5:** diğer bölgeler, özel halkaların yayılması, geçiş ve ikinci yolculuk.
