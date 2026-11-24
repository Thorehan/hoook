# Hoook · Muhammed bey'e devir (24/11/2026)

> Törehan + Claude → Muhammed bey + Claude. Bu belge tek giriş noktasıdır: oyun nedir, depoya nasıl erişilir, ilk gün ne yazılır, ne yapılacak, nasıl geri devredilir.
> Kurallar `CLAUDE.md`'de (Claude her oturumda kendiliğinden okur), kalınan nokta `docs/DURUM.md`'de.
> Devir noktası **v0.83** (yayında), geri dönüş etiketi `geri-donus-v0.83`.

## 1 · Hoook nedir (2 dakikada)

Tek elle oynanan dikey bir tırmanma oyunu (Funday Morning Games). Çıra küçük bir kor; fenerinden kuyunun dibine düşmüş, ip atarak yukarı tırmanıyor, alttan su yükseliyor. Ekranın sol yarısına basınca kanca soldaki halkaya, sağ yarısına basınca sağdakine atılır. Basılı tutunca halkaya çekilirsin, bırakınca savrulursun. Ustalık, ipi doğru anda bırakıp havada bir sonraki halkaya zincir kurmaktır (akış).

- **Ana oyun Hikâye:** 24 uzun, öğretici bölüm + ikinci yolculuk (25–48). Çıra bölüme bir çengelde asılı başlar (v0.83).
- **Yarışma:** Günlük Kuyu (günde 3 deneme) ve Haftalık Kuyu (haftada 5 deneme, lig). Çıra dipten başlar, su yanlış kararda yakalar. Gerçek skor tablosu açık.
- **Ekonomi:** Tek para ateşböceği. Market'te kozmetik (karakter, renk, baş, yüz, sırt) satılır; güçlendirme satılmaz, rastgele kutu yok, video yalnız oyuncu seçerse oynar.
- **Arayüz:** "Askıda Menü" tasarım diline geçiliyor (İstişare 5). Ana ekran bitti, Market ve sonrası sırada.
- **Teknik:** Düz HTML + JavaScript, derleme yok. Fizik deterministik, botlar her değişikliği otomatik sınar.

Ayrıntılar `README.md`'de, hikâye `docs/hikaye.md`'de.

## 2 · Depoya erişim

Depo: https://github.com/Thorehan/hoook (herkese açık; okumak ve klonlamak için erişim gerekmez, **push için gerekir**). Yayın: https://thorehan.github.io/hoook/ (push edilince ~1 dk'da güncellenir; telefonda deneme bu adresten yapılır).

**Törehan yapar (bir kez):**
1. github.com/Thorehan/hoook → **Settings** → **Collaborators** → **Add people**.
2. Muhammed bey'in GitHub kullanıcı adını yaz → **Add to repository**. GitHub parola ya da iki adımlı doğrulama isteyebilir.

**Muhammed bey yapar (bir kez):**
1. GitHub hesabı yoksa github.com'da aç. Gelen davet e-postasından ya da https://github.com/Thorehan/hoook/invitations adresinden daveti **kabul et** (7 gün geçerli).
2. Kurulum:
   - **Windows:** Git for Windows (git-scm.com), Node.js 18 ya da üstü (nodejs.org, LTS), Python 3 (python.org; kurarken "Add to PATH" işaretli), Claude Code (claude.ai/code ya da Claude masaüstü uygulamasının Code sekmesi; kendi Claude hesabıyla).
   - **Mac:** `git --version` çalışmıyorsa `xcode-select --install`; Node.js 18+ (nodejs.org ya da `brew install node`); Python 3 (Mac'te var); Claude Code.
3. Depoyu klonla (bir klasörde terminal aç):
   ```bash
   git clone https://github.com/Thorehan/hoook.git
   cd hoook
   ```
4. Git'e kim olduğunu söyle (bu klasör için yeterli):
   ```bash
   git config user.name "Muhammed"
   git config user.email "<kendi GitHub e-postan>"
   ```
5. İlk push'ta GitHub girişi istenir: tarayıcıyla giriş yap (Windows'ta Git Credential Manager, Mac'te anahtar zinciri hatırlar).

## 3 · İlk oturum: Claude'a yazılacak başlangıç metni

`hoook` klasöründe Claude Code'u aç ve şunu olduğu gibi yapıştır:

> Hoook'u Törehan'dan devralıyorum, adım Muhammed. CLAUDE.md'deki devir kuralını uygula: önce git pull yap ve docs/DURUM.md'de devrin bende olduğunu doğrula. Sonra docs/DEVIR-MUHAMMED.md'yi, docs/DURUM.md'yi ve docs/istisare-5-ui.md'yi oku. node tools/kontrol.js, node tools/bot.js ve birim testlerini bir kez çalıştırıp sonucu bana kısaca söyle. Oyunu yerelde başlatıp telefon boyutunda (375 px) göster. Sonra DEVIR-MUHAMMED.md §6'daki yapılacaklar listesinden ilk işi benimle konuş; §7'deki alanlara dokunma; kod yazmadan önce yaklaşımını anlat ve onayımı al.

Claude önce `git pull` yapar, `docs/DURUM.md`'de "Devir kimde: **Muhammed**" yazdığını görür ve çalışmaya başlar.

Yerelde oynamak için (Claude da yapabilir):
```bash
python -m http.server 8766
```
Sonra tarayıcıda http://localhost:8766 adresini aç ve telefon boyutunu (375 px) seç. Mac'te komut `python3`.

Sonraki oturumlarda kısa başlangıç yeterli:

> git pull yap, DURUM.md'yi oku, kaldığımız yerden devam edelim.

## 4 · Nasıl çalışılır (bir iş paketinin döngüsü)

1. İşi Claude ile konuş. Oyunun hissini ciddi değiştiren kararlar (tempo, zorluk, ekonomi, nişan kuralı, kontrol) için önce Törehan ile istişare et; açık sorular `DURUM.md`'de.
2. Claude değişikliği yapar ve testleri çalıştırır (`CLAUDE.md` §4). Mekanik bir değişiklikte hepsi yeşil olmalı:
   - bot çıkış 0
   - nişanda "kurala aykırı" 0
   - tek tarafa basan oyuncu 0/74
   - hatasız oyuncu yanmıyor
3. Tarayıcıda 375 px'te dene (arayüz işinde dört boyut: 360×640, 375×667, 390×844, 430×932).
4. Sürüm etiketini artır (`index.html`). `README.md`'yi, `docs/gelistirme-sureci.md`'yi ve gerekiyorsa `docs/telefon-testi.md`'yi güncelle.
5. Commit ("Hoook v0.84: ...") + push. Pages'te yeni sürümü doğrula.
6. Telefonda dene. Paket bitince `docs/DURUM.md`'nin "Son durum" ve "Sıradaki iş" bölümlerini güncelle.

Büyük bir değişiklikten önce geri dönüş noktası: `git tag geri-donus-v0.xx && git push origin geri-donus-v0.xx`.

## 5 · Arayüz çalışma ilkeleri (Törehan'ın istediği biçim)

Claude arayüz işlerinde kıdemli bir mobil UI/UX tasarımcısı ve frontend geliştiricisi gibi çalışır:

1. iOS ve Android standartları: dokunma alanı en az 44 px, güvenli alanlar, Android geri tuşu.
2. Önce mobil ekran; masaüstü ikinci planda.
3. Görsel hiyerarşi, okunabilirlik, kullanım kolaylığı.
4. Tutarlı renk, yazı, boşluk ve bileşen sistemi (`docs/istisare-5-ui.md` → Tasarım dili).
5. Düğme, pencere, alttan açılan sayfa, gezinme ve hareket etkileşimleri planlanır.
6. Yükleniyor, boş, hata ve başarı durumları tasarlanır.
7. Görsel kalabalık ve standart "yapay zekâ şablonu" görünümünden kaçınılır (Törehan "web uygulaması gibi" görünümü istemiyor).
8. Animasyon performansı bozmaz. **Büyüme ve yakınlaşma (zoom) yok**; salınım, sekme, kayma var.
9. Dört ekran boyutunda denenir.
10. Kod yazmadan önce mevcut yapı incelenir.

**Her arayüz işinde önce tasarım yaklaşımı yazılır ve onaylanır, sonra uygulanır. Çalışan bir özellik izinsiz değiştirilmez ya da kaldırılmaz.**

## 6 · Yapılacaklar listesi (kapsam: arayüz Aşama 2–4)

Törehan'ın kararı (24/11): bu devirde kapsam **yalnız arayüzün Askıda Menü diline geçişi** (Aşama 2–4). Liste bitince ya da yeni bir iş gerekince önce Törehan ile planlanır.

0. **Telefonda deneme** (`docs/telefon-testi.md` §24, §25, §26): kamera nefesi, yeni ana ekran, bölümde asılı başlangıç ve "Başlamak için dokun". Notlar Törehan'a iletilir.
1. **Aşama 2: Market ve Koleksiyon** (`docs/istisare-5-ui.md`). Öneri (henüz uygulanmadı): sayfaların zemini kuyu duvarı; başlık tahta kiriş; ürün kartları bir ipe asılı çıkartmalar gibi (kalın çizgi, sert gölge, hafif eğik); kategori düğmeleri çıkartma; ürün penceresi alttan açılan sayfa. Önce yaklaşım, sonra uygulama.
2. **Aşama 3:** Yarışma, Profil, pencereler (günlük giriş, hak bitti, ayarlar) ve durumlar (yükleniyor, boş, hata, başarı).
3. **Aşama 4:** açılış, tanıtım ve sonuç kartları; dört ekran boyutunda tarama.

**Kapsam dışı (Törehan ile ayrıca planlanır):** ücretsiz sezon şeridi ve görevler, oyun içi çizimin yeni stile geçmesi, puan doğrulama (Workers Paid, ayda 5 $), analitik, bekçinin adı, müzik.

### İstişare: her aşama sonunda

1. Muhammed bey bir aşamayı bitirir, testleri geçirir ve yayınlar (her aşama ayrı sürüm).
2. `docs/telefon-testi.md`'ye o aşamanın deneme maddelerini ekler ve Törehan'a "Aşama X yayında, v0.xx" der.
3. Törehan telefonda dener; onay ya da not verir.
4. Notlar varsa önce onlar yapılır; onaydan sonra sonraki aşamaya geçilir.

## 7 · Son söz Törehan'da (sormadan yapılmaz)

- **Online ve hesaplar:** Firebase (proje `hoook-6fed5`), Cloudflare (Worker `hoook-skor`, D1 `hoook-skor`), `sunucu/` klasörü, ücretli plan kararları.
- **Ekonomi ve fiyatlar:** Market fiyatları, ödüller, video kuralları, para birimi; rastgele kutu yok, güçlendirme satılmaz.
- **Oynanış çekirdeği:** uçuş ve ip çekme hızı (`CFG.REEL` 760), nişan kuralı, tek el kontrol, zorluk (tek tehlike su), yeni mekanikler.
- **Görsel yön ve hikâye:** Askıda Menü dilinden sapma, karakterler ve takılar, hikâye metni (`docs/hikaye.md`; ölüm yok, cümleler kısa).

Bu alanlara dokunan bir iş çıkarsa Claude durur ve "Bu Törehan'a sorulmalı" der; soru `docs/DURUM.md` → "Açık sorular"a yazılır.

## 8 · Devir kuralı ve geri devir

**Kural:** Projede aynı anda yalnız devri elinde tutan kişi geliştirir. Devir Muhammed bey'deyken Törehan dosya düzenlemez, commit ve push yapmaz; yalnız oynar, not alır ve istişare eder. İki kişi aynı anda çalışırsa aynı dosyalarda çakışma çıkar ve yayındaki oyun bozulabilir.

**Devri geri vermek (Muhammed → Törehan):**
1. Yarım iş bırakma: açık paketi bitir ya da geri al. Testler yeşil olmalı.
2. `git status` temiz olmalı (commit'lenmemiş satır kalmasın).
3. `docs/DURUM.md` dosyasını güncelle:
   - "Devir kimde: **Törehan**"
   - devir tarihi
   - son yapılanlar
   - sıradaki iş
   - devir geçmişi tablosuna bir satır
4. Commit ("Devir: Muhammed → Törehan") + push.
5. Törehan'a tek mesaj at: "Devrettim, git pull yap."

Claude'a şunu yazmak yeter: "Devri Törehan'a geri veriyorum, DEVIR-MUHAMMED.md §8'i uygula."

**Devralan kişi** her zaman önce `git pull` yapar, sonra `DURUM.md`'de devrin kendisinde olduğunu görür ve başlar.

## 9 · Yapma listesi

- `main`'e zorla push (`git push --force`) yapma; geri dönüş etiketlerini (`geri-donus-v0.17`, `v0.45`, `v0.47`, `v0.51`, `v0.56`, `v0.61`, `v0.83`) silme.
- Testsiz mekanik değişiklik gönderme.
- Anahtar, parola ya da e-posta adresini dosyalara ve commit'lere yazma.
- Devir sende değilken geliştirme yapma (Claude da yapmaz; `CLAUDE.md` §1).
