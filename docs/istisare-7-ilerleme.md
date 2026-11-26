# İstişare 7 · İlerleme, üst panel ve 800–1000 bölüm (26/11/2026)

> Muhammed'in önerileri (26/11) üzerine değerlendirme. **Bu aşamada kod yok.** Onaylanan kararlar sonra geliştirme görevlerine dönüşür.
> §7 konuları (oynanış çekirdeği, yeni mekanikler, ekonomi, online, hikâye) Törehan'ın son sözüne bağlı; ilgili maddelerde ⚑ işareti var.

## 0 · Kısa özet

| # | Öneri | Görüşüm | Önerdiğim biçim |
|---|---|---|---|
| A | Sıradaki bölüme haritada atlayarak geçmek | ✅ Katılıyorum | Sonuç kartı → harita → Çıra atlar → bölüm sayfası (ipucu + hedefler) → OYNA. Atlama dokununca hızlanır. |
| B | Kilit: önceki geçilmeden sonraki açılmaz; "Bölümü atla" kalkar | ✅ Katılıyorum, bir şartla | Takılan oyuncu için atlama yerine **yol gösteren hayalet** (3 başarısız denemeden sonra, isteğe bağlı). |
| C | Üst panel okunaklı, her göstergenin kendine özgü ikonu | ✅ Katılıyorum | Üst panel = sonuç kartındaki **üç madalyanın canlı hâli** (aynı ikonlar). İlk bölümlerde ikonların altında küçük yazı. |
| D | 800–1000 bölüm | ✅ Hedef doğru, yol değişmeli | Tek seferde değil: **kuyu paketleri** (her biri ~70–80 bölüm, 1 yeni mekanik). Çıkışta ~250–400, güncellemelerle 1000. |
| E | Yeni halkalar ve dağılım | ⚠️ Az ve derin | 1000 bölüme ~6–8 yeni mekanik + mevcutların **çeşitlemeleri**. Her yeni halka öğretildiği bölümde açıkça işe yarar. ⚑ |
| F | Bölümler biraz uzasın (kuyu tepesine çok hızlı varılıyor) | ✅ Ölçülü | Süreyi yükseklikle değil **karar yoğunluğuyla** artır: insan süresi 45–75 sn, bölge sonları 90–120 sn (tek fener). ⚑ |
| G | Günlük = hız, Haftalık = tırmanış | ✅ Fikir güçlü, yöntem değişmeli | Günlük: **zamanlı hız parkuru** (sabit yükseklik, en kısa süre). Haftalık: bugünkü gibi yükseklik ve puan, tırmanışa göre halkalar. ⚑ |
| H | Alttaki ipucu yazısı kalksın | ✅ Katılıyorum | Yazı kalkar. İpucu **bölüm sayfasına** (A ile birlikte) ve öğret bölümlerinde **duvardaki tebeşir yazılarına** gider. Yapışkan not yok. |

## 1 · Bugünkü sistem (analiz)

- **Hikâye (v0.93):**
  - 166 kısa bölüm: 83 ilk yolculuk (4 bölge: Taş 1–18, Maden 19–36, Kristal 37–60, Kule 61–83) ve 83 ikinci yolculuk (84–166). İkinci yolculuk ilk yolculuğun otomatik zor hâli.
  - Tarifler elle yazıldı (`bolumler.js` → `KISA`), yerleşim üreticide (`gen.js`).
  - Süre: modelde 11–33 sn, insanda yaklaşık 20–60 sn. Fener yok; düşen bölümün başından başlar.
- **Kilit yok:** haritada ve listede her bölüme girilir. Duraklatmada "Bölümü atla" var.
- **Halka ve öğeler:** ateşböceği, hız, rüzgâr şeridi (kapı), yay, sarkaç, geçit, fırlatma yolu, ateşböceği zinciri, kor, çark, akıntı, ahşap panel, kutu, güç küreleri (kalkan, fener, kanat). 14 öğe; hepsi ilk yolculuğun ~70. bölümüne kadar öğretilmiş oluyor.
- **Günlük ve Haftalık:** ikisi de aynı sonsuz üretici (`createEndless`). Farkları:
  - Günlük'te altı "günün kuralı" sırayla değişir (yay, rüzgâr, ateşböceği, sarkaç, geçit, hız); yalnız halka türlerinin sıklığını oynatır.
  - Haftalık'ta su daha erken sıkışır (`HAFTALIK_SU`).
  - Puan: metre + akış + ateşböceği, sonra hız çarpanıyla çarpılır.
  - Yıldızlar: Günlük'te **metre** (600 / 900 / 1200 m), Haftalık'ta **puan**. Yani Günlük bugün "hız" değil "yükseklik" ölçüyor.
- **Üst panel (Hikâye):** bölüm adı; altında ateşböceği noktaları, atış (hedef ikonu, "0/45"), akış ("x0", dalga ikonu).
  - "0/45" kullanılan atış mı, kalan mı belli değil; Kusursuz madalyasıyla bağı görünmüyor.
  - Noktaların ne olduğu yazmıyor.
- **İpucu:** altta saydam balon, ilk atışta kayboluyor (v0.90). Öğret bölümlerinde ayrıca duvarda tebeşir yazıları var (en çok 3).

## 2 · Başlık başlık değerlendirme

### A · Haritada atlayarak sıradaki bölüme geçmek
- **Artı:** İlerleme görünür ve tatmin edici olur (harita zaten bu atlama animasyonunu yapıyor, `hrAtla`). Oyuncu her geçişte nerede olduğunu görür.
- **Eksi:** Her bölümde ~1–1,5 sn ve bir dokunuş eklenir; 1000 bölümde bu yorabilir.
- **Önerim:**
  - Sonuç kartındaki "Bölüm N ›" haritayı açar, Çıra bir üst halkaya atlar (0,8 sn; dokununca hemen biter).
  - Sonra **bölüm sayfası** alttan gelir: bölümün adı, tek cümlelik ipucu (H), üç madalya hedefi (C) ve OYNA.
  - "Tekrar" doğrudan başlar, haritaya gitmez.
  - Bölüm sayfası, alttaki yazının (H) ve hedeflerin anlatılacağı doğal yer olur; üç öneri tek akışta birleşir.

### B · Kilit ve "Bölümü atla"nın kalkması
- **Artı:** İlerleme sıralı ve kontrollü olur. Mekanikler sırayla öğretilir, harita anlam kazanır, yıldız toplama hedefi büyür.
- **Eksi:** Takılan oyuncunun gidecek yeri kalmaz. Bölümler kısa olsa da tek bir zor bölüm oyuncuyu bıraktırabilir; hyper-casual oyunlarda en sık çıkış nedeni bu.
- **Daha iyi alternatif:** atlama yerine **yol gösteren hayalet**.
  - Bot her bölümü zaten geçiyor (`tools/bot.js`).
  - Aynı bölümde 3 başarısız denemeden sonra bölüm sayfasında "Yolu göster" çıkar.
  - Seçilirse soluk bir Çıra doğru yolu bir kez oynar; mevcut hayalet sistemi (`hayalet.js`) kullanılır.
  - Ödülü azaltmaz, atlatmaz; yalnız öğretir. İstersek "video izle, yolu göster" olabilir (yalnız oyuncu seçerse).
- **Kurallar:**
  - Açık bölüm: geçilmiş olan, geçilmemiş ilk bölüm, ya da önceki bölümü geçilmiş olan.
  - Geçilmiş bölümler hep tekrar oynanabilir (yıldız toplamak için).
  - Kilitli halka haritada ve listede kilit ikonuyla görünür; dokununca "Önce N. bölümü geç" der.
- **Eksik nokta:** Günlük ve Haftalık bugün ilk gün açık, ama içlerinde kor, çark ve akıntı var; bunlar Hikâye'de ancak 20., 50. ve 69. bölümde öğretiliyor.
  - Önerim: Günlük ve Haftalık **Taş Kuyu bitince (18. bölüm)** açılsın.
  - Yeni oyuncu önce öğrenir, ana ekran sadeleşir; ilk dakikalarda tek bir yol olur.

### C · Üst panel
- **Sorun:** ikonlar kendini anlatmıyor; "0/45" belirsiz; üç gösterge eşit ağırlıkta ve küçük.
- **Önerim: üst panel = madalyaların canlı hâli.**
  - Sonuç kartında üç madalya var: Ateşböceği, Kusursuz, Akış. Üst panelde aynı üç ikon aynı sırada durur; oyuncu bağı kendiliğinden kurar.
  - **Ateşböceği:** parlayan böcek ikonu ve "1/3". Hepsi alınınca rozet sarı yanar.
  - **Kusursuz (atış):** kanca ikonu ve **kalan** atış ("12 kaldı"). Kalan sayı kullanılandan daha kolay okunur. Par aşılınca rozet söner, sayı kaybolur, madalya kaçtı demektir.
  - **Akış:** alev zinciri ikonu ve "x4 / 10". Hedefe ulaşınca rozet yanar.
- **Hiyerarşi:**
  - Bölüm adı küçülür (bölüm sayfasında zaten okundu).
  - Üç rozet büyür ve eşit aralıkla dizilir. Duraklat sağda kalır.
  - Günlük ve Haftalık'ta puan ortada en büyük; metre ve hız çarpanı küçük.
- **Öğretme:** ilk 3 bölümde rozetlerin altında küçük yazı (ateşböceği / atış / akış), sonra yalnız ikon. Bölüm sayfasında aynı ikonlar hedefleriyle yazılı.

### D · 800–1000 bölüm
- **Doğru olan:** uzun vadeli ilerleme hyper-casual'da tutundurmanın temeli; 166 bölüm, iyi oynayana 2–3 haftalık içerik.
- **Riskler:**
  - Elle 1000 tarif yazmak gerçekçi değil (83 tarif dört sürüm sürdü).
  - Yalnız üreticiyle 1000 bölüm birbirine benzer, "level design'a önem" hedefiyle çelişir.
  - Hikâye Kule'de (83) fener yanınca bitiyor; 1000 bölüme hikâye çerçevesi gerekir. ⚑
  - Haritada 1000 halka tek sayfada ağırlaşır.
  - Ekonomi bölüm sayısından çok saatlik kazanca bağlı; o yüzden toplam artınca bozulmaz, ama Market kataloğu (72 eşya, ~12 hafta) uzun oyuncuya yetmez.
- **Önerim: kuyu paketleri.**
  - Her **kuyu** (yeni bölge) bir paket: ~70–80 bölüm, kendi görünüşü, **bir yeni mekanik**, kendi su karakteri.
  - Bugünkü dört bölge 1. kuyu olur: ilk yolculuk + ikinci yolculuk = 166 bölüm.
  - Sonraki kuyular sırayla eklenir: 2. kuyu (167–246), 3. kuyu (247–326) … 11–12 kuyu ≈ 1000.
  - Çıkışta 3–4 kuyu (~250–400 bölüm), sonra her güncellemede bir kuyu (~1–2 ayda bir).
- **Her paketin üretimi (karma yöntem):**
  - ~15–20 **imza bölümü** elle tasarlanır: öğret, bölge finali, her 10. bölüm "sına".
  - Arası **şablonlu bölüm**: bölge şablonu (mekanik seti, su kuralı, zorluk eğrisi) ve tohumla üretilir.
  - Bot doğrular (tek taraf 0, spam kötü değil, hatasız oyuncu yanmaz), elle göz atılır.
- **Teknik şart:**
  - Bölüm numaraları kalıcı ve **yalnız sona eklenir**. Araya bölüm sokulmaz; yoksa her seferinde kayıt taşımak gerekir (A5.2'de gördük).
  - Harita kuyu kuyu sayfalanır.
  - Araçlar 1000 bölümde örnekleme ile hızlı, gece tam çalışır.
- **"İkinci yolculuk" kalıbı:** 1. kuyuda kalsın; yeni kuyular kendi zorluk eğrisiyle gelsin. Her kuyuyu ikiye katlamak içeriği tekrarlar.

### E · Yeni halkalar ve dağılım ⚑
- Bugün 14 öğe 70 bölümde öğretiliyor; 1000 bölüm için yoğunluk doğru ama sıklık değil.
- **Önerim:** her kuyuda **1 yeni mekanik**, ayrıca mevcut mekaniklerin **çeşitlemeleri**. Çeşitleme yeni öğretim gerektirmez, taze his verir; örnekler: çift çark, hızlı sönen kor, ters akıntı, uzun sarkaç.
- **Kimliğe uyan adaylar** (tek tehlike su, diken yok, tek el, uçuş ve ip çekme hızı sabit):

  | Aday | Ne yapar | Kime iyi gelir |
  |---|---|---|
  | **Ray halkası** | Yatayda bir rayda gidip gelir; doğru anda tutun | Zamanlama; Günlük hız parkuru |
  | **Akış halkası** | Yalnız akış sürerken (x2+) belirir, kestirme açar | Akışı ödüllendirir; halka ustalığıyla uyumlu |
  | **Tek kullanımlık halka** | Bir kez tutulur, bırakınca düşer | Geri dönüşü keser, karar ağırlaşır; Haftalık |
  | **Yüzen halka** | Suyla birlikte yükselir | Suyu tehlikeden araca çevirir; tırmanış |
  | **Hız zinciri** | Art arda hız halkaları itişi büyütür | Günlük hız parkuru |
  | **Kova asansörü** | Tutunduğun kova birkaç saniye yukarı taşır, sonra bırakır | Dinlenme anı; uzun bölümlerde nefes |

- **İlk açıldığı bölümde işe yarasın:**
  - Öğret bölümü, yeni halkanın **en iyi yol** olduğu biçimde kurulur: kestirme, ateşböceği ya da madalya ona bağlı.
  - Halka ustalığı (v0.90) bunu ödülle destekler.
  - Her yeni mekanik öğret → pekiştir → birleştir → sürpriz yolunu izler (A1 kuralı).

### F · Bölüm süresi ("kuyu tepesine çok hızlı varılıyor") ⚑
- **Doğru:** kısa bölümler ilk dakikalarda iyi, ama ileride "bitti mi?" hissi verir.
- **Risk:** süreyi yükseklikle uzatmak suyla birlikte stres ve tekrar yükü getirir; düşen oyuncu baştan başlar.
- **Önerim:** süreyi **karar yoğunluğuyla** artır.
  - Hedef (insan): öğret 30–40 sn, normal 45–75 sn, kuyu ortası ve sonu 90–120 sn. Bunlarda **tek fener** geri gelir, böylece uzun bölümde düşen her şeyi kaybetmez.
  - Uzatma yolları: iki yol (kısa ama zor / uzun ama güvenli), ateşböceği yan yolları, mekanik birleşimleri. Boş tırmanış eklenmez.
  - Zorluk eğrisi her kuyuda dalgalı gider (zor → nefes → zor); düz artmaz.
  - Ölçüm: `hikaye-olcum` ve `hikaye-denge` hedef aralıkları bu tabloya göre güncellenir.

### G · Günlük = hız, Haftalık = tırmanış ⚑
- **Doğru olan:** iki modun bugün aynı üreticiden çıkması onları birbirine benzetiyor; ayrışma ikisine de kimlik verir.
- **Önerinin eksiği:** Günlük'ün hedefi metre. Haritayı hıza göre değiştirip hedefi metre bırakırsak oyuncu neyin önemli olduğunu anlamaz.
- **Önerim:**
  - **Günlük = Hız Parkuru.**
    - Sabit yükseklikte (ör. 400 m) bir parkur; amaç tepeye **en kısa sürede** çıkmak. Puan süreden gelir, yıldızlar süre eşiklerinden.
    - Hayalet zaten var: en iyi koşunla yarışırsın.
    - Harita hıza göre kurulur: hız halkası koridorları, akıntı, çark, ray halkası, momentum için geniş aralıklar.
    - Günün kuralı kalabilir ama hepsi hız temasında olur (ör. "çark günü", "akıntı günü").
    - Skor tablosu "en kısa süre" olur. ⚑ online
  - **Haftalık = Tırmanış.**
    - Bugünkü gibi yükseklik ve puan; su sıkıştırır.
    - Halkalar dikey ilerlemeye göre: yay, geçit, yüzen halka, tek kullanımlık halka, kova asansörü.
    - Lig ve hedefler aynı kalır.
- **Kural:** yeni üretici eski tohumları bozmaz. Günlük yeni günden, Haftalık yeni haftadan itibaren geçer (bugünkü "yeni mekanik" kuralı gibi).

### H · Alttaki ipucu yazısı
- **Önerim:** yazı kalkar.
  - İpucu bölüm sayfasında tek cümle (A); öğret bölümlerinde duvardaki tebeşir yazıları (oyunun içinde, görüşü kapatmaz).
  - Yeni mekanikte tanıtım kartı bugünkü gibi kalır.
  - Yapışkan not önerisine katılmıyorum: sen de dediğin gibi alan kaplar ve görüşü daraltır.
- Günlük ve Haftalık'ın açıklaması zaten açılışta kısa kart olarak çıkıyor; alttaki yazı orada da gereksiz.

## 3 · Birbirine bağlı sistemler

- **A + B + H + C:**
  - Harita akışı kilidi anlamlı kılar.
  - Bölüm sayfası ipucunun ve madalya hedeflerinin yeri olur.
  - Üst panel aynı ikonları oyunda tekrar eder.
  - Dördü tek iş olarak yapılmalı (Faz 1).
- **E + G:** yeni halkaların bir kısmı modlara kimlik verir (ray ve hız zinciri Günlük'e; yüzen, tek kullanımlık ve kova Haftalık'a). Yeni mekanik önce Hikâye'de öğretilir, sonra modlara girer.
- **D + E + F:** kuyu paketi = 1 yeni mekanik + süre eğrisi + görünüş. 1000 bölüm bu üçünün tekrar eden kalıbıdır.
- **B + G:** Günlük ve Haftalık'ın kilidi (18. bölüm) yeni oyuncunun ilk yolunu sadeleştirir.
- **D + ekonomi:** bölüm başına ateşböceği bugünkü düzeyde kalırsa günlük kazanç değişmez. Uzun oyuncu için Market'e her kuyu paketiyle yeni eşyalar gerekir. ⚑
- **D + hikâye:** her kuyuya kısa bir hikâye çerçevesi gerekir; bekçi, köyün başka kuyuları, ateşböceklerinin geldiği yerler. ⚑

## 4 · Eksik gördüğüm noktalar

1. **Takılan oyuncu:** kilit gelirse bir çıkış yolu şart (B: yol gösteren hayalet).
2. **Mod kilidi:** Günlük ve Haftalık yeni oyuncuya öğretilmemiş mekaniklerle açılıyor.
3. **Kalıcı bölüm numaraları:** 1000 bölüm planında en önemli teknik karar; bir daha kayıt taşımamak için.
4. **Harita performansı ve gezinme:** kuyu başına sayfa, kuyu seçici.
5. **Araç süreleri:** bot ve denge araçları 1000 bölümde dakikalar sürer; örnekleme gerekir.
6. **Hikâye çerçevesi:** fener 83. bölümde yanıyor; sonrası için anlatı gerekiyor.
7. **Market ve ödül derinliği:** 1000 bölüm oynayan oyuncu 12 haftalık kataloğu bitirir.
8. **Ölçüm (analitik):** hangi bölümde takılındığını görmeden 1000 bölüm dengelenmez. Yerel istatistik var ama oyuncudan gelmiyor (açık soru ⚑).

## 5 · Önerdiğim sıra

1. **Faz 1 · İlerleme ve okunurluk (arayüz, Muhammed):** kilit, haritada atlama akışı, bölüm sayfası (ipucu + hedefler), alttaki yazı kalkar, "Bölümü atla" kalkar, yol gösteren hayalet, yeni üst panel, Günlük ve Haftalık 18. bölümden sonra. Tek sürüm.
2. **Faz 2 · Level design derinleşir ⚑:** mevcut 166 bölümün süre ve karar yoğunluğu (F), öğret bölümlerinin "işe yarar" kuralı (E), zorluk eğrisi. Araçların hedef aralıkları güncellenir.
3. **Faz 3 · Modlar ayrışır ⚑:** Günlük Hız Parkuru, Haftalık Tırmanış (yeni üreticiler, tarihle geçiş, skor tablosu kuralı).
4. **Faz 4 · İçerik altyapısı:** kalıcı numaralar ve kuyu paketi biçimi, bölge şablonu, kuyu kuyu harita, araçlarda örnekleme.
5. **Faz 5+ · Kuyu paketleri ⚑:** 2. kuyu ilk yeni mekanikle (ör. ray halkası) ve yeni bir görünüşle; sonra her güncellemede bir kuyu.

## 6 · Kararlar

**Faz 1 (26/11, Muhammed) ✅ v0.94:**
- Haritada atlama: atlamadan sonra bölüm **kendiliğinden başlar** (bölüm sayfası yalnız haritadan elle açılınca; ipucu orada).
- "Yolu göster" yardımı **yok**; "Bölümü atla" kalktı, bölümler kilitli.
- Günlük ve Haftalık **hep açık** kalır.
- Üst panel: üç madalya rozeti, kalan atış (önerildiği gibi).

**Bekleyen (Faz 2–5):** aşağıdaki 5–8. sorular.

## 6b · Karar soruları (ilk liste)

1. Haritada atlama akışı: sonuç kartı → harita → atlama → bölüm sayfası → OYNA (bir dokunuş fazla). Uygun mu, yoksa atlamadan sonra bölüm kendiliğinden mi başlasın?
2. "Bölümü atla" yerine "Yolu göster" hayaleti (3 başarısız denemeden sonra, isteğe bağlı) uygun mu? Video ile mi olsun, ücretsiz mi?
3. Günlük ve Haftalık 18. bölümden sonra mı açılsın?
4. Üst panel = üç madalya rozeti (ateşböceği, kalan atış, akış/hedef). Uygun mu?
5. Günlük: zamanlı Hız Parkuru mu (önerim), yoksa bugünkü puanla hıza göre kurulmuş harita mı? ⚑
6. 1000 bölüm: kuyu paketleri (çıkışta ~250–400, sonra güncellemelerle) uygun mu? 1. kuyunun "ikinci yolculuk" kalıbı yeni kuyularda tekrar etmesin mi? ⚑
7. Bölüm süresi: insan 45–75 sn, kuyu ortası ve sonu 90–120 sn (tek fenerle) hedefi uygun mu? ⚑
8. Yeni halka adaylarından hangileri? (Ray, akış halkası, tek kullanımlık, yüzen halka, hız zinciri, kova asansörü) ⚑
