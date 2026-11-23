# İstişare 3 · Oynanış hissiyatı (23/11/2026)

> Kararlar Törehan'ın. Amaç: kontrol aynı kalırken her dokunuşun ve her anın daha tok, daha tatmin edici hissettirmesi; ardından üç yeni mekanik.

## Kararlar

| Konu | Karar |
|---|---|
| Hissiyat | Dördü de: vuruş hissi, ses ve müzik, titreşim desenleri, görsel ipuçları |
| Kontrol | **Değişmesin.** Tek el sol/sağ, bas-tut-bırak aynı; nişan kuralı ve uçuş/çekme hızı aynı |
| Yeni mekanik | Üçü de: kor halka, döner çark, akıntı sütunu (Hikâye'de kendi öğretici bölmesiyle) |
| Tatmin anları | Dördü de: kovaya varış, fener yanması, uzun akış, düşüş ve dönüş |

## Aşama A · His (fiziğe dokunmaz) ✅ v0.67 (23/11; telefonda denendi)

**Vuruş hissi**
- Tutunma anında halka parlar ve hafifçe titrer; Çıra ezilip esner (squash & stretch).
- TAM bırakışta 60–80 ms donma (hit-stop) ve kameranın kısa "nefesi" (hafif uzaklaşıp yaklaşma).
- Uzun akışta (x10 ve üstü) kısa ağır çekim anı. Zaman ölçeği değişir, uçuş hızı aynı kalır; hareket azaltma açıksa yok.

**Ses ve müzik**
- Akışta her tutunma bir nota yükselir: zincir bir melodiye döner.
- TAM'da parlak bir akor, zincir kopunca düşen bir ses.
- Müzik akış uzadıkça katman ekler (bugünkü yoğunluk ayarının üstüne).

**Titreşim desenleri:** tutunma kısa tık, TAM çift tık, alev uzun titreşim, düşüş ve su ayrı desen. Ayarlardaki titreşim anahtarı hepsini kapatır.

**Görsel ipuçları**
- İp kısalırken TAM bölgesi halkada parlar; oyuncu ne zaman bırakacağını görür.
- Sıradaki hedefin ötesindeki halka soluk önizlenir.
- Akış ve alev için ekranda küçük bir gösterge.

## Aşama B · Tatmin anları ✅ v0.68 (23/11; telefonda denendi)
- **Kovaya varış:** gün ışığı patlaması, ateşböcekleri kovaya akar, madalyalar tek tek yanar.
- **Fener yanması:** ışık dalgası duvar boyunca yayılır, kısa bir tını.
- **Uzun akış:** x10, x20, x30'da ekran kenarı ısınır, alev büyür, kısa unvan yazısı ("Alevlendin!", "Kor!").
- **Düşüş ve dönüş:** suya düşünce kor yumuşakça söner; fenerden dönüşte yeniden alevlenir. Hata cezalandırıcı değil, akıcı hissettirir.

## Aşama C · Yeni mekanikler (her biri ayrı sürüm)

Kararlar (23/11): mevcut bölümlere bölme olarak (bölüm sayısı 24 kalır); sıra kor → çark → akıntı; Hikâye'de öğretildikten sonra Günlük ve Haftalık'a da (yeni günden/haftadan itibaren).

- ✅ Kor halka v0.69 (1,5 sn; 7. bölüm öğretir; telefonda deneme `docs/telefon-testi.md` §15)
- Döner çark: sırada
- Akıntı sütunu
- **Kor halka:** Tutununca kızarır, 1,5 sn sonra söner ve seni bırakır. Asılı kalmadan akışı zorlar; tema ile uyumlu (Çıra bir kor).
- **Döner çark:** Yavaş dönen bir çarkın üzerindeki halkalar; doğru anda tutunursan seni yukarı taşır. Zamanlama ustalığı.
- **Akıntı sütunu:** Kuyuda yukarı esen bir hava sütunu; içinden geçerken Çıra hafifçe süzülür, yolu kestirmek için akışla kullanılır.

Her mekanik için:
- motor ve nişan kuralı (`nisan.js` "kurala aykırı" 0);
- üretici (`createBolum` bölme alanı);
- tanıtım kartı ve duvar ipucu;
- bot doğrulaması (`bot.js`), denge (`hikaye-denge.js`), spam ve tek taraf.

Hikâye'de nereye geleceği (yeni bölüm mü, mevcut bölmelere mi) Aşama C başında konuşulur.

## Sıra
A (his) → telefonda deneme → B (anlar) → telefonda deneme → C (mekanikler, birer birer).
