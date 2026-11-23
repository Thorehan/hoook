# Kuyu · Online kurulum (skor tablosu)

Durum (23/11/2026): arka uç **Firebase (kimlik) + Cloudflare Worker ve D1 (sunucu, veritabanı)**. Supabase'in yerine geçti (Törehan, 23/11). Kod hazır ve yerelde uçtan uca denendi; hesaplar açılana kadar **kapalı**. `js/online.js` → `AYAR` boşken hiçbir istek atılmaz, arayüzde skor tablosu görünmez. Meydan okuma bağlantısı arka uç istemez, şimdiden çalışır.

## Parçalar

| Parça | Ne yapar | Dosya |
|---|---|---|
| Firebase Authentication | Oyuncu ilk gönderimde arka planda **anonim** hesap alır (ekranda bir şey çıkmaz). SDK yok: iki REST çağrısı (hesap aç, belge yenile). | `js/online.js` |
| Cloudflare Worker | `POST /skor` (Firebase kimlik belgesi ister), `GET /tablo`. Belgeyi Google'ın açık anahtarlarıyla (RS256) denetler. | `sunucu/src/index.js` |
| Cloudflare D1 | SQLite veritabanı: `skorlar` (tahta başına oyuncu başına tek satır), `gonderim` (hız sınırı). | `sunucu/schema.sql` |

Sunucu kuralları: yalnız daha iyi puan yazılır (ad her gönderimde güncellenir) · yalnız şu anki gün ve hafta tahtasına yazılır (gün/hafta bittikten sonra 30 dk pay) · oyuncu başına 5 sn'de bir gönderim · puan 0–5.000.000, metre 0–200.000 · kaba ad "Tırmanıcı" olur · listede oyuncu kimliği dönmez (kendi sıran gönderim yanıtından gelir) · istekler yalnız `thorehan.github.io` ve `localhost:8766`'dan kabul edilir.

## Hesap açmadan deneme (yerelde)
İki terminal (proje klasöründe):
```bash
python -m http.server 8766
```
```bash
node tools/sahte-sunucu.js 8767 --dolu
```
Sahte sunucu **gerçek Worker kodunu** Node'da bellekteki SQLite ile çalıştırır ve Firebase'in iki giriş çağrısını taklit eder. Tarayıcıda `http://localhost:8766/?online=yerel` aç, Haftalık ya da Günlük Kuyu'yu oyna; sonuç kartında "Skor tablosu · N. sıradasın" çıkar (`--dolu` adında "örnek" yazan oyuncular ekler). Kapatmak için `?online=kapat`. Otomatik test: `node tools/online-test.js` (istemci, sunucu kuralları, Firebase belge doğrulaması).

## Gerçek kurulum (ücretsiz katmanlar)
Hesaplar stüdyonun Google hesabıyla açılır (hesap sahibi açar; e-posta ve parola dosyalara yazılmaz).

**Firebase** (console.firebase.google.com)
1. Yeni proje (`kuyu`), Google Analytics gerekmez. Spark (ücretsiz) planı yeter.
2. Build → Authentication → Get started → Sign-in method: **Anonymous** aç (Google'ı da açabilirsin; Aşama 3'te bağlama için).
3. Authentication → Settings → Authorized domains: `thorehan.github.io` ekle.
4. Project settings → Your apps → Web uygulaması ekle. `apiKey` ve `projectId` değerlerini al. İkisi de herkese açık olacak şekilde tasarlanmıştır (gizli anahtar değildir); yine de Google Cloud konsolunda apiKey'i "Identity Toolkit API" ve `thorehan.github.io` ile sınırlamak iyi olur.

**Cloudflare** (dash.cloudflare.com)
1. Hesap aç. Terminalde: `npx wrangler@4 login`
2. `sunucu/` klasöründe:
   ```bash
   npx wrangler@4 d1 create kuyu-skor
   ```
   Çıkan `database_id`'yi `sunucu/wrangler.toml`'a yaz; `FIREBASE_PROJE`'ye Firebase `projectId`'yi yaz.
3. Tabloları kur ve yayınla:
   ```bash
   npx wrangler@4 d1 execute kuyu-skor --remote --file=schema.sql
   npx wrangler@4 deploy
   ```
   Çıkan adres `https://kuyu-skor.<hesap>.workers.dev` olur.
4. `js/online.js` → `AYAR = { url: '<Worker adresi>', firebase: '<apiKey>' }`. Sürümü artır, commit ve push. Canlıda Haftalık Kuyu'yu oyna; sonuç kartında tablo görünmeli.

Ücretsiz sınırlar: Workers günde 100 bin istek, istek başına 10 ms işlemci; D1 günde 5 milyon satır okuma, 100 bin yazma; Firebase anonim giriş ücretsiz. Bir tablo açılışı (100 satır) ~100 satır okuma sayılır.

## Ne gönderilir
Firebase kimlik belgesi (anonim hesap; e-posta yok), oyuncu adı, puan, metre ve tahta adı (`h-2026-11-23` gibi). Oturum cihazda ayrı anahtarda (`kuyu.oturum`) durur; kayda ve yedek koduna girmez. Mağazaya çıkmadan önce gizlilik metnine bu satır eklenmeli.

## Sıradaki aşamalar
- **Aşama 1 kalanı (arayüz):** Haftalık menüsünde tam tablo (ilk 50 + senin çevren), sonuç kartında "100+ oyuncu" yazısının gerçek sayıya dönmesi. `js/game.js` ve `index.html`'e dokunur.
- **Aşama 2 · puan doğrulama:** istemci tohum + dokunuş günlüğü gönderir, Worker `js/engine.js` ile koşuyu yeniden oynatıp puanı kendi hesaplar. Ölçüm (23/11): motor oyun dakikası başına ~30 ms işlemci harcıyor; 3–6 dk'lık koşu 100–200 ms. Ücretsiz Workers'ta sınır 10 ms, bu yüzden **Workers Paid (ayda 5 $)** gerekir. Risk: motor `sin/cos/tan/atan2/hypot` kullanıyor; iPhone Safari ile Cloudflare'in JS motoru son basamakta farklı sonuç verebilir, koşu kayar. Çözüm: küçük bir payla kabul ya da bu işlevleri motorda kendimiz yazmak.
- **Aşama 3:** Google/Apple ile bağlama (skor cihaz değişince kaybolmaz), ad değiştirme, gizlilik metni.

## Meydan okuma bağlantısı
`?meydan=s-<tohum>-<puan>-<ad>` (Sonsuz kuralları) ya da `h-...` (Haftalık kuralları). Sonuç kartındaki **Meydan oku** düğmesi telefonun paylaşım menüsünü açar (yoksa bağlantıyı panoya kopyalar). Açan aynı kuyuyu oynar, sonuç iki puanı karşılaştırır; **Karşılık ver** kendi puanınla yeni bağlantı üretir. Puan beyana dayanır (arkadaşlar arası).
