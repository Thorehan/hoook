# İstişare 6 · Bölüm haritası ve Funday hesabı (24/11/2026)

> **Durum: kararlar verildi (24/11).** Muhammed ile istişarede çıktı. İki konu da devir kapsamının dışındaydı (`DEVIR-MUHAMMED.md` §6, §7: oynanış çekirdeği; online ve hesaplar). Törehan'ın kararları aşağıda; Muhammed'in oturumunda verildi. Uygulama aşama aşama yapılır, her aşama ayrı sürüm ve önce onay.

## Kararlar (Törehan, 24/11)

| Konu | Karar |
|---|---|
| Bölüm yapısı | **Kısa bölümlere böl.** Her bölme ayrı bir bölüm olur (24 → ~84, 30–90 sn). Önce yalnız Taş Kuyu ile denenir. |
| Yıldızlar | **Madalyalardan, ödülsüz.** 1★ geçiş, 2★ bir madalya, 3★ üç madalya. Ekonomi değişmez. |
| Harita | **Ayrı ekran.** Kuyu duvarındaki halkalar; ana ekrandaki "harita ›" çipi açar, OYNA yine sıradaki bölümü açar. Bölüm bitince Çıra bir üst halkaya atlar. |
| Skor tablosu | **Herkes görür ve gönderir.** Misafir de tabloya girer. Hesap, cihaz değişince ilerlemeyi korumak ve adı kalıcı yapmak için. |
| Funday hesabı | **Ayrı, ortak bir Firebase projesi** (hesap sahibi Törehan açar). Worker o projeye göre denetler, bugünkü oyuncular taşınır. |
| Giriş seçenekleri | **Misafir (anonim), Google, e-posta ve parola.** Apple ilk aşamada yok (iOS uygulaması gelirse eklenir). |
| Puan doğrulama | **Workers Paid (ayda 5 $) hesaplarla birlikte alınır** (hesap sahibi Törehan alır). |

### Uygulama sırası (öneri)

- **Yol A · Bölümler (kod, Muhammed yapabilir):** A1 tasarım kuralları (✅ `docs/kisa-bolumler-plan.md`) → A2 Taş Kuyu kısa bölümleri (+ botlar; ✅ v0.85, deneme) → A3 yıldızlar → A4 kuyu duvarı haritası → A5 diğer bölgeler, ikinci yolculuk, kayıt taşıma.
- **Yol B · Hesap (Törehan'ın hesaplarında adım gerekir):** B1 Törehan ortak Firebase projesini açar, Google ve e-posta girişini açar, Workers Paid'i alır → B2 Worker yeni projeye ve ortak oyuncu tablosuna geçer → B3 oyunda ad yönetimi ve hesap bağlama (Profil) → B4 puan doğrulama → B5 hesap silme ve gizlilik metni.
- İki yol birbirinden bağımsız; Arayüz Aşama 3–4 (İstişare 5) de sürüyor.

## Gelen istek

- **Bölüm tasarımı:** Özel halkalar bölümlere daha çok yayılsın. Bölüm sayısı artsın. Her bölümün kendi başarma hissi olsun.
- **Harita:** Candy Crush'taki gibi bir bölüm haritası olsun. Bölüm bitince karakter bir sonraki bölümün halkasına atlasın. Bölümler yeniden oynanıp yıldız artırılabilsin.
- **Skor tablosu ve hesap:** Online skor tablosu için giriş gereksin. Firebase ve Cloudflare kurulu. Funday Morning Games'in bütün oyunları için tek bir **Funday hesabı** olsun. Oyuncu Gmail'ini bağlayabilsin, e-posta ile hesap açabilsin ya da misafir (anonim) oynayıp adını kendisi yönetebilsin.

## 1 · Bölümler, yıldızlar ve harita

### Bugün

- 24 uzun bölüm ve ikinci yolculuk (25–48), `js/bolumler.js` tariflerinden üretiliyor (`docs/hikaye-bolumleri-plan.md`).
- Her bölüm 3–4 bölmeden oluşuyor, bölmeler arasında fener var. Süre 60–180 sn.
- Kor halka, döner çark ve akıntı sütunu mevcut bölümlere birer bölme olarak girdi (bölüm sayısı 24 kaldı).
- Her bölümde üç madalya var: Ateşböceği, Kusursuz, Akış.

### Öneriler

| # | Öneri | Neden |
|---|---|---|
| 1.1 | **Uzun bölümleri kısa bölümlere böl:** her bölme (fener arası) kendi başına bir bölüm olsun. İlk yolculuk 24 → ~84 bölüm, ikinci yolculukla ~170. | Bölüm sayısı yeni içerik yazmadan artar. Her bölüm 30–90 sn ve tek bir başarma anı olur. Fener gerekmez; ölünce bölüm baştan başlar ve zaten kısadır. |
| 1.2 | **Her özel halka dört adımda gelsin:** öğret → pekiştir → başka mekanikle birleştir → sürpriz. Örnek: çark tek başına → çark ve akış → çark ve kor zinciri → beklenmedik yerde çark. | Özel halkalar tek bir bölmede kalmaz, bölgeye yayılır. |
| 1.3 | **Önemli bölümler elle tasarlansın:** yeni mekaniğin ilk göründüğü bölüm ve bölge sonları. Aradakiler tarifle üretilmeye devam etsin. | İş büyümez, kilit anlar özenli olur. |
| 1.4 | **Yıldızlar mevcut madalyalardan gelsin:** 1★ geçiş, 2★ bir madalya, 3★ üç madalya (ya da 3★ kusursuz). | Yeni kural yazmadan "geri dön, yıldızı artır" döngüsü çıkar. |
| 1.5 | **Harita kuyunun duvarı olsun:** harita aşağıdan yukarı kayar, bölümler duvardaki halkalardır. Bölüm bitince Çıra ip atıp bir üst halkaya atlar. Bölgeler (Taş Kuyu, Maden, Kristal, Kule) renk ve dokuyla ayrılır. Ana ekrandaki "harita ›" çipi buraya açılır. | Oyun zaten yukarı tırmanmak; Candy Crush yapısı bu oyunda doğal oturur ve Askıda Menü diliyle uyumlu. |

### Riskler

- **Kayıt taşıma:** Eski oyuncunun ilerlemesi yeni bölüm numaralarına doğru aktarılmalı. v0.62'de benzer bir taşıma yapılmıştı (`save.eskiBest`).
- **Testler:** Botlar her kısa bölümü ayrı denemeli. Spam ile geçilmemeli, tek tarafa basan oyuncu 0 kalmalı, hatasız oyuncu geçmeli. Bölüm sayısı artınca test süresi de uzar.
- **Ekonomi:** Yıldıza ödül (ateşböceği ya da kozmetik) verilecekse ekonomi dengesi değişir (`ekonomi-olcum.js`, ortalama gün ~119).
- **Günlük ve Haftalık Kuyu etkilenmemeli:** tohumlar ve üretici aynı kalır.

### Önerilen sıra

1. Tasarım kurallarını yaz (bölüm uzunluğu, yıldız kuralı, özel halkaların dağılımı).
2. Tek bölgeyle dene: Taş Kuyu, 6 uzun bölüm → ~18 kısa bölüm. Telefonda oyna.
3. Beğenilirse kuyu duvarı haritasını yap.
4. Sonra diğer bölgeler, en son kayıt taşıma ve ikinci yolculuk.

## 2 · Funday hesabı ve skor tablosu

### Bugün

- Skor tablosu açık (v0.72): Firebase `hoook-6fed5` (anonim giriş, SDK yok, REST) + Cloudflare Worker `hoook-skor` ve D1 (`docs/online-kurulum.md`).
- Oyuncu ilk gönderimde arka planda anonim hesap alır; ekranda bir şey çıkmaz. Kaba adlar "Tırmanıcı" olur.
- Planlı olan: Aşama 2 puan doğrulama (Workers Paid), Aşama 3 Google/Apple bağlama, ad değiştirme, gizlilik metni.

### Öneriler

| # | Öneri | Neden |
|---|---|---|
| 2.1 | **Herkes misafir başlasın, hesap sonradan bağlansın.** Anonim hesap, Firebase'in hesap bağlama özelliğiyle Google'a ya da e-postaya bağlanır; oyuncu kimliği aynı kalır, ilerleme kaybolmaz. İlk açılışta giriş zorunlu olmasın. | Oyuncu oyuna takılmadan girer. Bugünkü anonim altyapı olduğu gibi kullanılır. |
| 2.2 | **Tabloyu herkes görsün, misafir de puan göndersin.** Hesap, cihaz değiştirince ilerlemeyi korumak ve adı kalıcı yapmak için olsun. | "Giriş gerekli" kuralı oyuncuyu tablodan uzaklaştırabilir. Karar Törehan'ın (aşağıda soru). |
| 2.3 | **Funday için ayrı, ortak bir Firebase projesi.** Hesaplar tek bir Firebase projesine bağlıdır; bütün oyunlar aynı hesabı paylaşacaksa `hoook-6fed5` yerine ortak bir "funday" projesi gerekir. Worker kimliği o projeye göre denetler; D1'de ortak bir oyuncular tablosu ve her oyuna ayrı skor tabloları olur. | Sonraki oyunlar hesabı baştan hazır bulur. Bugünkü oyuncular ortak projeye taşınmalı; bu iş planın parçası. |
| 2.4 | **Ad yönetimi:** misafir ve hesaplı oyuncu adını Profil'den değiştirebilsin. Bugünkü kaba söz süzgeci genişletilsin, gerekirse ad değiştirme sıklığı sınırlansın. | Tabloda görünen adlar herkese açık. |
| 2.5 | **Puan doğrulama bu işle birlikte karara bağlansın.** Hesaplar gelince tablo daha değerli olur, hile daha önemli hâle gelir. | Açık soru: Workers Paid (ayda 5 $). |

### Mağaza ve yasal yükümlülükler

İleride uygulama olarak mağazaya çıkılırsa:

- iOS'ta Google ile giriş sunan bir uygulama "Apple ile giriş"i de sunmalı.
- Hesap uygulama içinden silinebilmeli; silinince skorlar ve ad da silinir.
- Gizlilik politikası gerekli; Türkiye'de KVKK, Avrupa'da GDPR. Hangi veri tutuluyor (kimlik, ad, puan, e-posta) açıkça yazılmalı.
- E-posta ile hesap açılırsa e-posta doğrulama ve parola sıfırlama gerekir.

### Maliyet

Firebase anonim ve Google girişi ücretsiz. E-posta ve parola ile giriş de ücretsiz sınırlar içinde. Cloudflare ücretsiz planı bugünkü trafik için yetiyor (`docs/online-kurulum.md`). Ortak proje ve kullanıcı tablosu ek maliyet getirmez. Ücret yalnız puan doğrulama (Workers Paid) için çıkar.

## Törehan'a sorulanlar (yanıtlar yukarıda, "Kararlar")

1. Uzun bölümler kısa bölümlere bölünsün mü (24 → ~84)? Yoksa 24 bölüm kalıp yanına yeni bölümler mi eklensin?
2. Yıldızlar mevcut madalyalardan mı gelsin? Yıldızın ödülü olsun mu (ekonomi)?
3. Kuyu duvarı haritası ana ekranın parçası mı olsun, ayrı bir ekran mı?
4. Skor tablosunu görmek için mi, puan göndermek için mi giriş gereksin? Misafir tabloya girebilsin mi?
5. Funday hesabı için ayrı ortak bir Firebase projesi açılsın mı? Hangi Google hesabıyla?
6. Giriş seçenekleri: Google, e-posta, misafir. Apple ilk aşamada gerekli mi (iOS uygulaması planlanıyor mu)?
7. Puan doğrulama (Workers Paid, ayda 5 $) hesaplarla birlikte alınsın mı?
