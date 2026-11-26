# Hoook (eski adı Kuyu) · Claude için çalışma kuralları

Funday Morning Games'in 2D mobil oyunu **Hoook** (23/11/2026'ya kadar adı Kuyu'ydu; depo `Thorehan/hoook`; eski `/kuyu/` adresi ve `Thorehan/kuyu` yönlendirme deposu 24/11/2026'da kaldırıldı, testler yalnız /hoook/ adresinden). İç adlar (`window.Kuyu*`, `kuyu.*` kayıt anahtarları, `KUYU1.` yedek kodu, `css/kuyu.css`) uyumluluk için değişmez. Düz HTML + JS (derleme yok), GitHub Pages'te yayında: https://thorehan.github.io/hoook/ (`main`'e push edilince ~1 dk'da güncellenir). Ortaklar **sırayla** çalışır: **Törehan** (Windows), **Muhammed** (24/11/2026'dan beri devir onda) ve **Mustafa** (Mac). Yanıtlar Türkçe.

## 1 · Devir kuralı (en önemli kural)

Projede aynı anda **yalnız bir kişi** geliştirir. Kimin sırası olduğu `docs/DURUM.md` dosyasındaki **"Devir kimde"** satırında yazar; tek doğru kaynak budur.

Her oturumun başında, başka hiçbir şey yapmadan önce:
1. `git pull` (yerelde commit'lenmemiş değişiklik varsa önce kullanıcıya sor, üstüne yazma).
2. `docs/DURUM.md` → "Devir kimde" satırını oku.
3. Karşındaki kişiyi belirle: `git config user.name` ipucu verir; emin değilsen kullanıcıya "Sen kimsin: Törehan, Muhammed, Mustafa?" diye sor.
4. **Devir bu kişide değilse geliştirme yapma:** dosya düzenleme, commit ve push yok. Yalnız okuma, soru yanıtlama ve öneri yapılabilir. Kullanıcıya "Devir şu an X'te; önce X devretmeli (bkz. docs/DEVIR-MUHAMMED.md §8)" de. Devri elinde tutmayan kişiyle yalnız istişare edilir (fikir, plan, öneri; dosyaya dokunmadan). Kullanıcı ısrar etse bile devri kendin değiştirme: devri yalnız devri elinde tutan kişi devredebilir.

Devir elindeyken iş bitirme ve devretme adımları `docs/DEVIR-MUHAMMED.md` §8'de (güncel devir belgesi; eski devir `docs/DEVIR-MUSTAFA.md`).

## 2 · Kaynaklar (okuma sırası)

| Dosya | Ne var |
|---|---|
| `docs/DURUM.md` | Devir kimde, son sürüm, sıradaki iş, açık sorular (kısa tutulur) |
| `docs/DEVIR-MUHAMMED.md` | Güncel devir belgesi: kurulum, ilk oturum, yapılacaklar listesi, arayüz ilkeleri, nasıl devredilir |
| `README.md` | Oyunun bütün mekanikleri ve sürüm sürüm açıklaması (uzun; gerektiğinde bölüm bölüm oku) |
| `docs/gelistirme-sureci.md` | Geliştirme sırası, yapılanlar günlüğü, yapılacaklar |
| `docs/hikaye.md` | Hikâye "Çıra": tek kaynak, metin kuralları |
| `docs/telefon-testi.md` | Telefonda deneme listesi |

Kod: `js/engine.js` (deterministik fizik ve kurallar, DT 1/120), `js/gen.js` (bölüm, Sonsuz ve Günlük üreticisi), `js/game.js` (çizim, ses, oyun döngüsü, sonuç kartları), `js/screens.js` (menüler), `js/ekonomi.js`, `js/gorev.js`, `js/hayalet.js`, `js/notlar.js`, `js/muzik.js`, `js/online.js` (meydan okuma bağlantısı, skor tablosu istemcisi), `js/karakter.js` (karakter ve takı çizimi, v0.76), `js/ikon.js` (arayüz SVG ikonları, v0.90); stil `css/` (`css/arayuz.css`: İstişare 4 tasarım dili).

## 3 · Kalıcı tasarım kararları (Törehan'ın kararları; değiştirmeden önce sor)

- **Mobil, tek elle oynanır.** Ekranın sol yarısı sol hedefe, sağ yarısı sağ hedefe kanca atar. Her özellik 375 px genişlikte denenir.
- **Nişan kuralı:** Yukarısı belirli şartlarda önceliklidir, şartlar sağlanmazsa aşağıdaki seçilir. Sıra: bu taraftaki dik yukarı hedef → yandaki sığ hedef → aşağıdaki. Hattı başka bir dik yukarı halka kesiyorsa o halka alınır. Çıra'nın değdiği halka engel sayılmaz. Yükselirken yukarı hedef 0,35 sn içinde menzile girecekse kanca bekler. Her mekanik değişiklikten sonra `node tools/nisan.js` çalıştırılır, "kurala aykırı" 0 olmalı.
- **Sıralı ilerleme (v0.94, İstişare 7 Faz 1, Muhammed 26/11):** bölüm, önceki geçilmeden açılmaz (`game.js` → `acikMi`); "Bölümü atla" yok; sıradaki bölüme haritada atlanarak geçilir. Oyunda alt ipucu yazısı yok (ipucu haritadaki bölüm sayfasında). Üst panel üç madalya rozeti. Plan `docs/istisare-7-ilerleme.md`.
- **Halka ustalığı (v0.90, Törehan onayı 25/11):** özel halkayı işine yarayacak biçimde kullanmak (hız halkasından bırakış, çark itişi, yay, kordan akışla ayrılma, akıntı) TAM bırakış gibi ustalık payına katılır (ortak tavan); menzildeki özel halkada hale yalnız çizimdir, nişan kuralı aynı. Yarışma modlarında yeni günden/haftadan itibaren (`game.js` → `HALKA_GUNLUK`, `HALKA_HAFTALIK`).
- **Karar önemli olmalı:** Düşünmeden sol-sağ spam ilerletmemeli (`node tools/spam.js`). Tek tarafa basan oyuncu bölüm geçememeli (`node tools/oyuncu.js`: sadeceSag/Sol 0/74).
- **Uçuş ve ip çekme hızı sabit** (`CFG.REEL` 760). İtişler serbest, ama yalnız ustalıkla gelir: TAM bırakış, alevlenme, hız halkası, kanat.
- **Ana oyun Hikâye (v0.64, Törehan 19/11):** dokun ve başla Hikâye'de sıradaki bölümü açar. Serbest Sonsuz Kuyu kalktı; yarışma modları Günlük ve Haftalık Kuyu, ikisi de sınırlı denemeli (günde 3, haftada 5; hak bitince video ile +1, yenileme bedeli 1→5 video, 5 yenilemeden sonra reklam ve deneme yok, Hikâye'ye yönlendirilir). Günün hedefi (yıldız), seri ödülü (donma hakkı), büyüyen lig ödülü ve lig görünümleri, Profil'de rekor duvarı. Devam hakkı kalktı.
- **Günlük ve Haftalık Kuyu'nun suyu:** Yanmak zamanla değil yanlış karardan gelir: su, tutunulan en yüksek noktanın 30 → 18 m altında takip eder (`gen.js` → `suTakip`). Ölçüm `node tools/hata.js`: hatasız oyuncu hiç yanmamalı.
- **Hedef his:** Acele değil, akıcı ve sürekli oynanabilir (Subway Surfers gibi).
- **Ekonomi:** Para birimi ateşböceği. Kozmetik için harcanır (v0.64: devam hakkı kalktı). Güçlendirmeler satın alınmaz, yolda bulunur. Video yalnız oyuncu kendisi seçerse oynar.
- **Arayüz ve görsel stil (İstişare 4, Törehan 23/11):** arayüz baştan değişiyor: hybrid-casual ana ekran (OYNA ortada, 5 sekme: Market · Koleksiyon · OYNA · Yarışma · Profil), parlak çizgi film stili (oyun içi çizim dahil), tek para ile günlük vitrin + haftalık sınırlı + nadirlik + ücretsiz sezon şeridi, karakterler + aksesuarlar (yalnız süs). Rastgele kutu yok. Plan ve aşamalar `docs/istisare-4-ui.md`, taslak `docs/istisare-4/taslak.html`. **İstişare 5 (24/11):** görünüş "Askıda Menü" diline geçiyor (kancalara asılı çıkartma etiketler, kalın çizgi, sert gölge, Lilita One, büyüme yerine salınım); 5 sekmeli alt çubuk kalır. Plan `docs/istisare-5-ui.md`. Hikâye metninde ölüm yok, cümleler kısa.
- **Zorluk yok:** Diken ve taş yok, tek tehlike su.
- **Başlangıç (v0.83, Törehan 24/11):** Hikâye bölümlerinde Çıra geçici bir çengelde asılı başlar (`asiliBasla`, ilk başka tutunmada çengel düşer); sonsuz modlar (Günlük, Haftalık) dipten, zeminden başlar. Böylece bölüm ve sonsuz mod ilk bakışta ayrılır.
- **Yeni mekanikler (İstişare 3 Aşama C, 23/11):** mevcut Hikâye bölümlerine bölme olarak girer (bölüm sayısı 24 kalır), sıra kor halka (v0.69) → döner çark (v0.70) → akıntı sütunu (v0.71, yalnız akışla çalışır); Hikâye'de öğretildikten sonra Günlük/Haftalık'a yeni günden/haftadan itibaren girer (eski tohumlar aynı kalmalı; yeni mekanik rastgele sayı çekmez). Kor halka 1,5 sn sonra söner ve bırakır.
- **Kısa bölümler asıl Hikâye (v0.92, İstişare 6 A5.2, Törehan onayı 25/11):** 83 kısa bölüm 1–83 (`gen.createKisa`, tarifler `bolumler.js` → `KISA`) + ikinci yolculuk 84–166 (v0.93, A5.3: `gen.createKisaIkinci(n − 83)`, ilk yolculuğun kısa bölümleri ikinci yolculuk kurallarıyla; test `IKINCI=1 node tools/hikaye-denge.js 4 1 83`). Eski uzun bölümler oyundan kalktı (`save.uzunBest`, `save.uzunIkinci`). Kayıt taşıma `js/gecis.js` (test `node tools/gecis-test.js`); ateşböceği tekrar ödenmez (`odenen`). Plan `docs/kisa-bolumler-plan.md` §10. Aşağıdaki v0.62 maddesi uzun bölümlerin ve ikinci yolculuğun kurallarıdır.
- **Hikâye (v0.62, Törehan'ın planı, 18–19/11):** 24 uzun öğretici bölüm (`js/bolumler.js` tarifleri, `gen.createBolum`) + ikinci yolculuk 25–48. Bölmeler arasında fener (kontrol noktası). Taş Kuyu susuz, Maden zamanla yükselen su (ilk fenerden sonra), Kristal 15'ten sonra ve Kule izleyen su (22/18/15 m, yanlış taraf ipi bırakır), ikinci yolculukta su baştan izler. Plan `docs/hikaye-bolumleri-plan.md`. Eski bölümler ve v0.52 bölge suyu oyundan kalktı; eski kayıtlar `save.eskiBest`.
  - Test: `node tools/bot.js` 48 bölümü dener; denge tablosu `node tools/hikaye-denge.js` (modeller, spam, tek taraf; `SADE=1` yalnız spam karşılaştırması); süre ve fener `node tools/hikaye-olcum.js`.
  - Denge kuralı (v0.63): boş atış her bölümde 0,4 sn kilit; Maden'den sonra yanlış taraf ipi bırakır; Maden'den sonra halkalar %40 aynı yanda (spam sırayla basarak geçmesin).
- **Ekonomi (v0.53, onaylı; v0.77'de güncellendi):** Tek para birimi; Market ~12 haftalık (Törehan 24/11: katalog 72 eşyaya büyüdü), günlük vitrin + haftanın ürünü, Efsane yalnız haftanın ürünüyken satılır, rastgele kutu yok; ölçüm hata yapan oyuncuyla (`ekonomi-olcum.js`, ortalama gün ~119). **Haftalık Kuyu + lig (v0.54, onaylı):** sahte rakip yok. **Online (23/11, Törehan):** arka uç Firebase (anonim kimlik) + Cloudflare Worker ve D1 (`sunucu/`), Supabase yerine; skor tablosu hesaplar açılana kadar kapalı (`js/online.js` → `AYAR` boş). Kurulum `docs/online-kurulum.md`.

## 4 · Çalışma biçimi

- **Arayüz işleri (Törehan'ın ilkesi, 24/11):** Kıdemli mobil UI/UX tasarımcısı ve frontend geliştiricisi gibi çalış. Her arayüz işinde önce tasarım yaklaşımını yaz ve onay al, sonra uygula. Çalışan bir özelliği izinsiz değiştirme ya da kaldırma. Dokunma alanı ≥44 px, güvenli alanlar, Android geri tuşu; yükleniyor/boş/hata/başarı durumları; "web uygulaması" ve yapay zekâ şablonu görünümünden kaçın; büyüme ve yakınlaşma (zoom) animasyonu yok, salınım ve kayma var; 360×640, 375×667, 390×844, 430×932'de dene. Ayrıntı `docs/DEVIR-MUHAMMED.md` §5.

- Üretici (`gen.js`) rastgele sayı çağrılarının sırasını değiştirmeden ekleme yapar; böylece eski bölümler ve Günlük tohumları aynı kalır.
- **Her değişiklikten sonra:** `node tools/kontrol.js` (sözdizimi ve sürüm etiketi). Mekanik değişiklikte ayrıca şunlar çalıştırılır:
  - `node tools/bot.js` (çıkış 0 olmalı)
  - `node tools/nisan.js`
  - `node tools/oyuncu.js`
  - `node tools/spam.js`
  - `node tools/hata.js 6`
  - `node tools/geri.js 16` (geriye kanca: v0.57'de %4,1; artmamalı) ve Hikâye bölümleri için `node tools/hikaye-olcum.js`
  - ekonomi ölçümü: `node tools/ekonomi-olcum.js` (v0.92: kısa bölümler 19–60 ile, ortalama oyuncu günde ~147 ateşböceği; `UZUN=1` eski uzun bölüm ölçümü ~157; v0.53'ten beri hata yapan oyuncularla ölçülür)
  - zorluk eğrisi: `node tools/denge.js` (bölümlerde geçme oranı bölgeyle düşmeli, hatasız oyuncu geçmeli)
  - birim testleri: `node tools/ekonomi-test.js`, `node tools/gorev-test.js`, `node tools/hayalet-test.js`, `node tools/istatistik-test.js`, `node tools/online-test.js`, `node tools/gecis-test.js` (kısa bölümlere kayıt taşıma)
- **Yerelde deneme:** Proje klasöründe `python3 -m http.server 8766` (Windows'ta `python`), sonra http://localhost:8766. Tarayıcıda servis çalışanı önbellekler; değişiklik görünmüyorsa kayıtlı servis çalışanını sil ve sayfayı yenile.
- **Sürüm:** Her yayında `index.html` içindeki `?v=0.xx` ve "Hoook v0.xx" etiketleri birlikte artırılır (`kontrol.js` denetler). README'nin başındaki sürüm ve `docs/gelistirme-sureci.md` "Yapılanlar" bölümü güncellenir.
- **Git:**
  - Commit mesajı "Hoook v0.xx: kısa başlık" ve madde madde açıklama.
  - Yalnız `main` var. Push edilince Pages yayınlar; `curl https://thorehan.github.io/hoook/index.html` ile yeni sürüm etiketi doğrulanır.
  - **`main`'e zorla push (force push) yok.** Geri dönüş gerekirse `git revert` ya da etiketten yeni dal açılır.
  - Geri dönüş etiketleri (`geri-donus-v0.17`, `v0.45`, `v0.47`, `v0.51`, … `v0.91`) silinmez.
- **Gizlilik:** E-posta, anahtar ya da parola dosyalara ve commit'lere yazılmaz.
