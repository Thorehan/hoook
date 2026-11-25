/* Kuyu — Hikâye bölümlerinin tarifleri (24 uzun, öğretici bölüm; plan: docs/hikaye-bolumleri-plan.md).
   Her bölüm bölmelerden oluşur; bölmeler arasında fener (kontrol noktası) durur. Üretici: gen.js → createBolum(no).

   Bölüm:  { no, ad, bolge (0 Taş, 1 Maden, 2 Kristal, 3 Kule), akis (Akış madalyası hedefi), ipucu, su (yükselme hızı, 0 = yok), bolmeler: [...] }
   Bölme:  {
     tur:     'ogret' | 'uygula' | 'sina' | 'ustalik'
     n:       ana yoldaki düğüm sayısı (fener hariç)
     dy:      [en az, en çok] düğümler arası yükseklik (birim; 20 birim = 1 m)
     duzen:   'zikzak' (halkalar sırayla iki yana) | yok (serbest)
     panel:   ahşap panel olasılığı (0–1)
     ff:      ateşböceği halkası sayısı (ana yolun alternatifi)
     hiz:     hız halkası sayısı
     yay, sarkac, kapi: yay halkası, sarkaç halka ve rüzgâr şeridi sayısı (v0.60)
     kutu:    true ise ilk bölmenin başında kutu-düğme-kapak bulmacası
     gecit, dal, zincir: geçit çifti, fırlatma yolu ve altın ateşböceği zinciri sayısı (v0.61)
     guc:     yolda bulunan güçlendirmeler, ör. ['kalkan'] (v0.61)
     kor:     kor halka sayısı (v0.69): tutununca 1,5 sn sonra söner ve bırakır
     cark:    döner çark sayısı (v0.70): ana yoldaki halka üç halkalı dönen çarka döner
     akinti:  akıntı sütunu sayısı (v0.71): akış sürerken içinden geçen yukarı süzülür
     yazilar: duvar ipuçları (bekçinin tebeşiri): [düğüm sırası | 'fener' | 'kova', metin]
   }
   Bölümde ayrıca: su (yükselme hızı, birim/sn), suFener (su kaç fener yanınca başlar; yoksa ilk tutunuşta), not (bekçinin notu, 1–12),
   takip (izleyen su: tutunulan en yüksek yerin bu kadar m altında; yanlış taraf ipi bırakır).
   Aşama 1 (v0.59): bölüm 1–3. Aşama 2 (v0.60): bölüm 4–12. Aşama 3 (v0.61): bölüm 13–24 (Kristal Mağara ve Eski Kule). Deneme olarak oynanır; eski bölümler değişmez. */
(function (root) {
  'use strict';
  var BOLUMLER = [
    {
      no: 1, ad: 'İlk Halka', bolge: 0, akis: 8, su: 0,
      ipucu: 'Halka hangi yandaysa ekranın o yanına bas. Basılı tut: ipe sarıl. Bırak: savrul. Fenere tutun; düşersen oradan dönersin.',
      bolmeler: [
        { tur: 'ogret', n: 10, dy: [150, 170], duzen: 'zikzak', ff: 0, yazilar: [
          [0, 'Halka hangi yandaysa ekranın o yanına bas.'],
          [2, 'Basılı tut: ipe sarılırsın.'],
          [5, 'Bırak: savrulursun. Sonra sıradakine bas.'],
          [8, 'Hep asılı kalma: bırak, savrul, tutun.'],
          ['fener', 'Fenere tutun. Düşersen buradan dönersin.']
        ] },
        { tur: 'uygula', n: 12, dy: [160, 195], ff: 2, yazilar: [
          [1, 'Parlayan halkada ateşböceği var. İçinden geç ya da tutun.']
        ] },
        { tur: 'sina', n: 14, dy: [170, 210], ff: 2, yazilar: [
          ['kova', 'En üstteki kovaya tutun: gün ışığı!']
        ] }
      ]
    },
    {
      no: 2, ad: 'Savrul', bolge: 0, akis: 10, su: 0, not: 1,
      ipucu: 'İpi halkaya varmadan bırak: fırlarsın. Havadayken sıradakine bas: akış başlar.',
      bolmeler: [
        { tur: 'ogret', n: 11, dy: [190, 222], duzen: 'zikzak', ff: 1, yazilar: [
          [0, 'İpi halkaya varmadan bırak: yukarı fırlarsın.'],
          [2, 'Havadayken sıradakine bas: akış!'],
          [5, 'Asılı kalmadan zincirle: x2, x3…'],
          [8, 'Akış koparsa dert değil: tutun, yeniden başla.'],
          ['fener', 'Fener yandı. Buradan devam edersin.']
        ] },
        { tur: 'uygula', n: 13, dy: [180, 225], ff: 2, yazilar: [
          [2, 'Ateşböceği uzaksa fırla, havadan tutun.']
        ] },
        { tur: 'sina', n: 15, dy: [185, 232], ff: 3, yazilar: [] }
      ]
    },
    {
      no: 3, ad: 'Ahşap ve Taş', bolge: 0, akis: 10, su: 0,
      ipucu: 'Kanca ahşaba saplanır, taştan seker. Kahverengi panelin olduğu yana bas.',
      bolmeler: [
        { tur: 'ogret', n: 11, dy: [165, 195], panel: 0.75, ff: 0, yazilar: [
          [0, 'Kanca ahşaba saplanır, taştan seker.'],
          [4, 'Panel hangi yandaysa o yana bas.'],
          [8, 'Panelden de fırlayabilirsin: erken bırak.'],
          ['fener', 'Fenerler yolu tutar. Düşersen buradan.']
        ] },
        { tur: 'uygula', n: 14, dy: [170, 210], panel: 0.35, ff: 2, yazilar: [
          [4, 'Ateşböceği halkaları bazen panelin karşısında.']
        ] },
        { tur: 'sina', n: 16, dy: [180, 230], panel: 0.3, ff: 3, yazilar: [] }
      ]
    },
    {
      no: 4, ad: 'Hız Halkası', bolge: 0, akis: 10, su: 0, not: 2,
      ipucu: 'Mavi oklu halkaya tutun ve bırak: yukarı fırlarsın. Çekilirken bırakırsan daha da hızlanırsın.',
      bolmeler: [
        { tur: 'ogret', n: 11, dy: [170, 205], hiz: 3, ff: 0, yazilar: [
          [0, 'Mavi oklu halka: tutun, bırak, yukarı fırla.'],
          [4, 'Çekilirken bırakırsan daha da hızlanırsın.'],
          [8, 'Hız halkası yolun yanında: istersen al.'],
          ['fener', 'Hız da fener de senin. Düşersen buradan.']
        ] },
        { tur: 'uygula', n: 13, dy: [175, 215], hiz: 2, ff: 2, yazilar: [] },
        { tur: 'sina', n: 15, dy: [180, 230], hiz: 2, ff: 2, yazilar: [] }
      ]
    },
    {
      no: 5, ad: 'Akış', bolge: 0, akis: 14, su: 0,
      ipucu: 'İp halkaya varmadan hemen önce bırak: TAM! Asılı kalmadan zincirle, akış uzadıkça puan artar.',
      bolmeler: [
        { tur: 'ogret', n: 11, dy: [185, 220], duzen: 'zikzak', ff: 1, yazilar: [
          [0, 'İp halkaya varmadan hemen önce bırak: TAM!'],
          [3, 'TAM bırakış seni biraz daha yükseğe iter.'],
          [6, 'Asılı kalmadan zincirle: akış uzadıkça puan artar.'],
          [9, 'Zincir koparsa dert değil, yeniden başla.']
        ] },
        { tur: 'uygula', n: 13, dy: [180, 225], ff: 2, hiz: 1, yazilar: [] },
        { tur: 'sina', n: 15, dy: [185, 232], ff: 3, hiz: 1, panel: 0.2, yazilar: [] }
      ]
    },
    {
      no: 6, ad: 'Kutu ve Kapak', bolge: 0, akis: 10, su: 0, not: 3,
      ipucu: 'Kanca hafif şeyleri sana çeker. Halkaya çık, sonra sağa bas: kanca raftaki kutuyu çeker, kutu düğmeye düşer, kapak açılır.',
      bolmeler: [
        { tur: 'ogret', n: 10, dy: [170, 205], kutu: true, ff: 0, yazilar: [
          [0, 'Önce halkaya çık.'],
          [1, 'Kapak kapalı. Kutu sağda: sağa bas, kanca onu sana çeker. Düğmeye düşünce kapak açılır.'],
          ['fener', 'Taş Kuyu bitmek üzere. Bir fener daha.']
        ] },
        { tur: 'uygula', n: 13, dy: [175, 215], panel: 0.3, hiz: 1, ff: 2, yazilar: [] },
        { tur: 'sina', n: 15, dy: [180, 230], panel: 0.3, hiz: 1, ff: 2, yazilar: [
          ['kova', 'Gün ışığı yukarıda.']
        ] }
      ]
    },
    {
      no: 7, ad: 'Yükselen Su', bolge: 1, akis: 10, su: 45,
      ipucu: 'Madende su yükselir. Asılı bekleme, sıradakine atıl. Kızıl kor halka 1,5 sn sonra söner ve seni bırakır. Su yakalarsa son yanan fenerden dönersin.',
      bolmeler: [
        { tur: 'ogret', n: 12, dy: [170, 205], ff: 1, hiz: 1, yazilar: [
          [0, 'Su yükseliyor. Asılı bekleme, sıradakine atıl.'],
          [5, 'Acele et ama korkma: su yavaş.'],
          [9, 'Madende yanlış tarafa basarsan ip bırakılır. Önce işarete bak.'],
          ['fener', 'Su yakalarsa buradan dönersin.']
        ] },
        { tur: 'uygula', n: 14, dy: [175, 215], ff: 2, hiz: 1, kor: 4, yazilar: [
          [0, 'Kızıl halka kordur: 1,5 sn sonra söner, seni bırakır.'],
          [6, 'Kor halkada bekleme: tutun, hemen sıradakine atıl.'],
          ['fener', 'Sönen kor bir an sonra yeniden kızarır.']
        ] },
        { tur: 'sina', n: 16, dy: [180, 230], ff: 2, hiz: 2, kor: 3, yazilar: [] }
      ]
    },
    {
      no: 8, ad: 'Yay', bolge: 1, akis: 10, su: 50, suFener: 1, not: 4,
      ipucu: 'Yeşil oklu halka yaydır: tutunduğun an seni okun yönüne fırlatır. Tepede süzülürken sıradakine bas.',
      bolmeler: [
        { tur: 'ogret', n: 12, dy: [175, 210], yay: 3, ff: 0, yazilar: [
          [0, 'Yeşil oklu halka yaydır: tutunduğun an fırlatır.'],
          [5, 'Fırlayınca tepede süzülürsün: sıradakine bas.'],
          ['fener', 'Fener yandı. Su artık buradan sonra yükselir.']
        ] },
        { tur: 'uygula', n: 14, dy: [175, 215], yay: 2, ff: 2, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 230], yay: 2, ff: 2, hiz: 1, kor: 1, yazilar: [] }
      ]
    },
    {
      no: 9, ad: 'Rüzgâr', bolge: 1, akis: 12, su: 54, suFener: 1,
      ipucu: 'Rüzgâr şeridini akış sürerken aşağıdan yukarı geç: akış +1. Akış yokken şerit sönüktür, geçmek bir şey vermez.',
      bolmeler: [
        { tur: 'ogret', n: 12, dy: [180, 215], duzen: 'zikzak', kapi: 4, ff: 0, yazilar: [
          [0, 'Rüzgâr şeridi: akış sürerken içinden geç, akış +1.'],
          [6, 'Akış yokken şerit sönük; geçmek bir şey vermez.'],
          ['fener', 'Şeritler akışı uzatır. Su buradan sonra yükselir.']
        ] },
        { tur: 'uygula', n: 14, dy: [180, 220], kapi: 3, ff: 2, yazilar: [] },
        { tur: 'sina', n: 16, dy: [185, 230], kapi: 3, yay: 1, ff: 2, kor: 1, yazilar: [] }
      ]
    },
    {
      no: 10, ad: 'Sarkaç', bolge: 1, akis: 10, su: 58, suFener: 1, not: 5,
      ipucu: 'Sarkaç halka zincirde sallanır. Hangi taraftaysa o yana bas; yakına gelince tutun.',
      bolmeler: [
        { tur: 'ogret', n: 12, dy: [175, 210], sarkac: 3, ff: 0, yazilar: [
          [0, 'Sarkaç halka sallanır: hangi taraftaysa o yana bas.'],
          [5, 'Yakına gelince tutun; ip sarkaçla birlikte gider.'],
          ['fener', 'Acele etme, sarkacı bekle. Su buradan sonra yükselir.']
        ] },
        { tur: 'uygula', n: 14, dy: [175, 215], sarkac: 2, ff: 2, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 230], sarkac: 2, yay: 1, ff: 2, kor: 1, yazilar: [] }
      ]
    },
    {
      no: 11, ad: 'Alev', bolge: 1, akis: 16, su: 62, suFener: 1,
      ipucu: "Akış sürerken TAM bırakışlar Çıra'yı alevlendirir (2, 4 ve 7 TAM). Alevliyken her bırakış seni daha yükseğe fırlatır.",
      bolmeler: [
        { tur: 'ogret', n: 12, dy: [185, 220], duzen: 'zikzak', ff: 1, yazilar: [
          [0, "Akışta TAM bırakışlar Çıra'yı alevlendirir."],
          [4, 'Alevliyken her bırakış seni daha yükseğe fırlatır.'],
          [8, 'Akış biterse alev de söner.'],
          ['fener', 'Alevi koru: asılı kalma. Su buradan sonra yükselir.']
        ] },
        { tur: 'uygula', n: 14, dy: [185, 225], kapi: 2, ff: 2, yazilar: [] },
        { tur: 'sina', n: 16, dy: [185, 232], kapi: 2, hiz: 1, ff: 2, kor: 1, yazilar: [] }
      ]
    },
    {
      no: 12, ad: 'Maden Ağzı', bolge: 1, akis: 12, su: 66, suFener: 1, not: 6,
      ipucu: 'Madenin son kuyusu: yay, sarkaç, rüzgâr, hız ve kor. Öğrendiklerinin hepsi burada.',
      bolmeler: [
        { tur: 'uygula', n: 12, dy: [175, 215], yay: 1, sarkac: 1, ff: 2, yazilar: [
          [0, 'Madenin son kuyusu: öğrendiklerinin hepsi burada.'],
          ['fener', 'Bekçinin fenerleri seni bekliyor.']
        ] },
        { tur: 'sina', n: 14, dy: [180, 225], kapi: 2, hiz: 1, sarkac: 1, ff: 2, kor: 1, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 232], yay: 2, kapi: 2, panel: 0.2, ff: 2, kor: 2, yazilar: [
          ['kova', 'Madenin ağzı yukarıda.']
        ] }
      ]
    },
    {
      no: 13, ad: 'Geçit', bolge: 2, akis: 12, su: 60, suFener: 1,
      ipucu: 'Mor girdaplı halka geçittir: tutun, yukarıdaki mor çıkış halkasından çıkarsın. Kestirmedir; ana yol da hep açık.',
      bolmeler: [
        { tur: 'ogret', n: 13, dy: [175, 210], gecit: 2, ff: 0, yazilar: [
          [0, 'Mor girdaplı halka geçittir: tutun, yukarıdaki çıkıştan çıkarsın.'],
          [7, 'Geçit kestirmedir. İstersen ana yoldan da gidebilirsin.'],
          ['fener', 'Kristal Mağara: su buradan sonra yükselir.']
        ] },
        { tur: 'uygula', n: 14, dy: [175, 215], gecit: 1, yay: 1, ff: 2, yazilar: [] },
        { tur: 'sina', n: 15, dy: [180, 225], gecit: 1, sarkac: 1, ff: 2, yazilar: [] },
        { tur: 'ustalik', n: 16, dy: [180, 230], gecit: 1, kapi: 2, ff: 2, yazilar: [] }
      ]
    },
    {
      no: 14, ad: 'Fırlatma Yolu', bolge: 2, akis: 14, su: 62, suFener: 1, not: 7,
      ipucu: 'Turuncu oklu halka fırlatma yoludur: akış sürerken tutun, ip halkaya varmadan bırak, yukarıdaki ateşböceğine uç. Asılıyken oraya ulaşılmaz.',
      bolmeler: [
        { tur: 'ogret', n: 13, dy: [180, 215], dal: 1, ff: 0, yazilar: [
          [0, 'Turuncu oklu halka fırlatma yoludur.'],
          [3, 'Akış sürerken tutun ve erken bırak: yukarıdaki ateşböceğine uçarsın.'],
          [8, 'Asılıyken oraya ulaşılmaz; ana yol her zaman açık.'],
          ['fener', 'Fırlatma yolları cesur olanın. Su buradan sonra yükselir.']
        ] },
        { tur: 'uygula', n: 14, dy: [180, 220], dal: 1, ff: 1, yazilar: [] },
        { tur: 'sina', n: 15, dy: [180, 225], dal: 1, hiz: 1, ff: 1, yazilar: [] },
        { tur: 'ustalik', n: 16, dy: [185, 230], dal: 1, kapi: 2, ff: 1, yazilar: [] }
      ]
    },
    {
      no: 15, ad: 'Su Seni İzliyor', bolge: 2, akis: 12, takip: 22,
      ipucu: 'Su artık seni izliyor: tutunduğun en yüksek yerin 22 m altında bekler, yalnız düşersen yakalar. Yanlış tarafa basarsan ip bırakılır; önce işarete bak.',
      bolmeler: [
        { tur: 'ogret', n: 13, dy: [175, 210], ff: 1, yazilar: [
          [0, 'Su artık seni izliyor: en yüksek tutunduğun yerin altında.'],
          [4, 'Yanlış tarafa basarsan ip bırakılır. Önce işarete bak.'],
          [8, 'Asılı beklemek serbest; su yalnız düşersen yakalar.'],
          ['fener', 'Su yakalarsa buradan dönersin.']
        ] },
        { tur: 'uygula', n: 14, dy: [175, 215], yay: 1, ff: 2, yazilar: [] },
        { tur: 'sina', n: 15, dy: [180, 225], sarkac: 1, kapi: 1, ff: 2, yazilar: [] },
        { tur: 'ustalik', n: 16, dy: [180, 230], gecit: 1, hiz: 1, ff: 2, yazilar: [] }
      ]
    },
    {
      no: 16, ad: 'Zincir', bolge: 2, akis: 16, takip: 22, not: 8,
      ipucu: 'Altın ateşböcekleri sıralıdır: 1, 2, 3. Hepsini akış kopmadan topla. Döner çark: halka yükselirken tutun, yükselirken bırak; çark seni fırlatır.',
      bolmeler: [
        { tur: 'ogret', n: 13, dy: [180, 215], duzen: 'zikzak', zincir: 2, ff: 0, yazilar: [
          [0, 'Altın ateşböcekleri sıralı: 1, 2, 3.'],
          [4, 'Hepsini akış kopmadan topla; zincir tamamlanınca sayılır.'],
          ['fener', 'Zincir koptuysa bir sonrakini dene.']
        ] },
        { tur: 'uygula', n: 14, dy: [175, 205], cark: 3, ff: 1, yazilar: [
          [0, 'Döner çark: üç halkası döner. Yükselen halkaya tutun.'],
          [5, 'Halka yükselirken bırak: çark seni fırlatır.'],
          ['fener', 'Çark acele etmez; doğru anı bekle.']
        ] },
        { tur: 'sina', n: 15, dy: [180, 225], zincir: 1, kapi: 1, ff: 2, cark: 1, yazilar: [] },
        { tur: 'ustalik', n: 16, dy: [185, 230], zincir: 1, dal: 1, ff: 1, yazilar: [] }
      ]
    },
    {
      no: 17, ad: 'Güçlendirmeler', bolge: 2, akis: 12, takip: 22,
      ipucu: 'Yolda küreler var. Mavi kalkan bir düşüşünü affeder, sarı fener yakındaki ateşböceklerini çeker, beyaz kanat seni 3 sn yukarı taşır.',
      bolmeler: [
        { tur: 'ogret', n: 13, dy: [175, 210], guc: ['kalkan'], ff: 1, yazilar: [
          [0, 'Mavi küre kalkandır: bir düşüşünü affeder.'],
          [6, 'Kalkan varken suya düşersen son güvenli halkaya sıçrarsın.'],
          ['fener', 'Küreler satılmaz; yolda bulunur.']
        ] },
        { tur: 'uygula', n: 14, dy: [175, 215], guc: ['fener'], ff: 4, yazilar: [
          [0, 'Sarı küre fenerdir: yakındaki ateşböceklerini sana çeker.']
        ] },
        { tur: 'sina', n: 15, dy: [180, 225], guc: ['kanat'], ff: 0, yazilar: [
          [0, 'Beyaz küre kanattır: 3 sn seni yukarı taşır.']
        ] },
        { tur: 'ustalik', n: 16, dy: [180, 230], guc: ['kalkan'], gecit: 1, ff: 2, yazilar: [] }
      ]
    },
    {
      no: 18, ad: 'Kristal Kalbi', bolge: 2, akis: 16, takip: 22, not: 9,
      ipucu: 'Mağaranın kalbi: geçitler, fırlatma yolları, zincirler ve izleyen su. Öğrendiklerinin hepsi burada.',
      bolmeler: [
        { tur: 'uygula', n: 13, dy: [180, 215], gecit: 1, sarkac: 1, ff: 2, yazilar: [
          [0, 'Kristaller ışığını hatırlıyor. Yol yukarıda.'],
          ['fener', 'Mağaranın kalbine yaklaştın.']
        ] },
        { tur: 'sina', n: 14, dy: [180, 220], dal: 1, yay: 1, kapi: 1, ff: 1, cark: 1, yazilar: [] },
        { tur: 'sina', n: 15, dy: [180, 225], zincir: 1, sarkac: 1, ff: 2, kor: 1, yazilar: [] },
        { tur: 'ustalik', n: 16, dy: [185, 232], gecit: 1, dal: 1, kapi: 2, ff: 1, yazilar: [
          ['kova', 'Mağaranın ağzı yukarıda.']
        ] }
      ]
    },
    {
      no: 19, ad: 'Dar Merdiven', bolge: 3, akis: 14, takip: 18,
      ipucu: 'Kulede su daha yakın: 18 m. Ahşap, sarkaç ve rüzgâr dar merdivende.',
      bolmeler: [
        { tur: 'uygula', n: 14, dy: [175, 215], panel: 0.4, sarkac: 2, kapi: 1, ff: 2, yazilar: [
          [0, 'Eski Kule: su burada daha yakın.'],
          ['fener', 'Kulenin fenerleri hâlâ yanıyor.']
        ] },
        { tur: 'sina', n: 15, dy: [180, 220], panel: 0.35, sarkac: 1, kapi: 2, ff: 2, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 225], panel: 0.3, sarkac: 2, ff: 2, yazilar: [] },
        { tur: 'ustalik', n: 17, dy: [185, 230], panel: 0.3, kapi: 2, sarkac: 1, ff: 2, kor: 1, yazilar: [] }
      ]
    },
    {
      no: 20, ad: 'Yaylar ve Geçitler', bolge: 3, akis: 14, takip: 18, not: 10,
      ipucu: 'Yaylar seni fırlatır, geçitler taşır. Art arda yönlendirme: her fırlayışta sıradakine hazır ol.',
      bolmeler: [
        { tur: 'uygula', n: 14, dy: [180, 215], yay: 3, gecit: 1, ff: 1, yazilar: [
          [0, 'Yaylar ve geçitler: her fırlayışta sıradakine hazır ol.']
        ] },
        { tur: 'sina', n: 15, dy: [180, 220], yay: 2, gecit: 1, ff: 2, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 225], yay: 2, gecit: 1, ff: 2, cark: 1, yazilar: [] },
        { tur: 'ustalik', n: 17, dy: [185, 230], yay: 2, gecit: 1, dal: 1, ff: 1, yazilar: [] }
      ]
    },
    {
      no: 21, ad: 'Uzun Akış', bolge: 3, akis: 20, takip: 18,
      ipucu: 'Rüzgâr şeritleri ve zincirler akışı uzatır. Mavi akıntı sütunu akış sürerken seni yukarı taşır. Asılı kalmadan, TAM bırakarak tırman; alevi koru.',
      bolmeler: [
        { tur: 'uygula', n: 14, dy: [185, 220], duzen: 'zikzak', kapi: 2, ff: 1, akinti: 3, yazilar: [
          [0, 'Bu kuyu akış için: asılı kalma, alevi koru.'],
          [3, 'Mavi akıntı: akış sürerken içinden geç, süzülürsün.'],
          [8, 'Akış yokken akıntı söner.'],
          ['fener', 'Akıntı yolu kestirir: sıradakini atlayabilirsin.']
        ] },
        { tur: 'sina', n: 15, dy: [185, 225], kapi: 2, zincir: 1, ff: 2, kor: 2, yazilar: [] },
        { tur: 'sina', n: 16, dy: [185, 228], kapi: 3, zincir: 1, ff: 1, akinti: 1, yazilar: [] },
        { tur: 'ustalik', n: 17, dy: [185, 232], kapi: 3, dal: 1, zincir: 1, ff: 1, akinti: 1, yazilar: [] }
      ]
    },
    {
      no: 22, ad: 'İki Yol', bolge: 3, akis: 16, takip: 18, not: 11,
      ipucu: 'Her bölmede iki yol: fırlatma yolu ve geçit kısa ama zor, ana yol uzun ama güvenli. Seçim senin.',
      bolmeler: [
        { tur: 'uygula', n: 14, dy: [180, 218], dal: 1, gecit: 1, ff: 1, yazilar: [
          [0, 'İki yol var: kısa ama zor, uzun ama güvenli.']
        ] },
        { tur: 'sina', n: 15, dy: [180, 222], dal: 1, gecit: 1, ff: 1, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 226], dal: 1, gecit: 1, ff: 1, cark: 1, yazilar: [] },
        { tur: 'ustalik', n: 17, dy: [185, 230], dal: 1, gecit: 1, ff: 1, akinti: 1, yazilar: [] }
      ]
    },
    {
      no: 23, ad: 'Fırtına', bolge: 3, akis: 16, takip: 15,
      ipucu: 'Fırtına: su 15 m altında izliyor ve fener az. Sakin kal, işarete bak, sonra dokun.',
      bolmeler: [
        { tur: 'sina', n: 19, dy: [180, 222], yay: 1, sarkac: 1, kapi: 2, ff: 2, kor: 2, yazilar: [
          [0, 'Fırtına: su çok yakın, fener az. Sakin kal.']
        ] },
        { tur: 'sina', n: 20, dy: [180, 226], kapi: 2, hiz: 1, gecit: 1, sarkac: 1, ff: 2, yazilar: [] },
        { tur: 'ustalik', n: 21, dy: [185, 230], dal: 1, yay: 1, zincir: 1, ff: 2, akinti: 1, yazilar: [] }
      ]
    },
    {
      no: 24, ad: 'Fener', bolge: 3, akis: 18, takip: 18, not: 12,
      ipucu: 'Son kuyu. Fener yukarıda, bekçi pencerede bekliyor.',
      bolmeler: [
        { tur: 'uygula', n: 14, dy: [180, 218], yay: 1, sarkac: 1, kapi: 1, ff: 2, yazilar: [
          [0, 'Son kuyu. Fener yukarıda.'],
          ['fener', 'Bekçi pencerede bekliyor.']
        ] },
        { tur: 'sina', n: 15, dy: [180, 222], gecit: 1, dal: 1, ff: 1, cark: 1, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 226], zincir: 1, kapi: 2, guc: ['kalkan'], ff: 2, kor: 1, yazilar: [] },
        { tur: 'ustalik', n: 17, dy: [185, 232], yay: 1, sarkac: 1, gecit: 1, dal: 1, ff: 1, akinti: 1, yazilar: [
          ['kova', 'Çıra, fenere hoş geldin.']
        ] }
      ]
    }
  ];
  // Kısa bölümler (v0.85, deneme; İstişare 6, docs/kisa-bolumler-plan.md): her biri bugünkü bir bölmeden doğan tek bölmeli bölüm.
  // Fener yok (bölüm kısa: düşen baştan başlar). Taş Kuyu: 6 uzun bölüm → 18 kısa (v0.85); Maden, Kristal, Kule: 18 → 65 (v0.88).
  // Oyunda 100 + no numarasıyla (101–183), ayrı kayıtta (save.kisaBest).
  // kaynak: [uzun bölüm, bölme sırası]. Notlar ve final eski uzun bölümün son kısa bölümünde.
  var KISA = [
    { no: 1, ad: 'İlk Halka', kaynak: [1, 0], bolge: 0, akis: 6, su: 0,
      ipucu: 'Halka hangi yandaysa ekranın o yanına bas. Basılı tut: ipe sarıl. Bırak: savrul.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [150, 170], duzen: 'zikzak', ff: 1, yazilar: [
        [0, 'Halka hangi yandaysa ekranın o yanına bas.'],
        [2, 'Basılı tut: ipe sarılırsın.'],
        [5, 'Bırak: savrulursun. Sonra sıradakine bas.']
      ] }] },
    { no: 2, ad: 'Bırak ve Savrul', kaynak: [1, 1], bolge: 0, akis: 7, su: 0,
      ipucu: 'Parlayan halkada ateşböceği var: içinden geç ya da tutun.',
      bolmeler: [{ tur: 'uygula', n: 18, dy: [160, 195], ff: 2, yazilar: [
        [1, 'Parlayan halkada ateşböceği var. İçinden geç ya da tutun.']
      ] }] },
    { no: 3, ad: 'Kova', kaynak: [1, 2], bolge: 0, akis: 8, su: 0,
      ipucu: 'En üstteki kovaya tutun: gün ışığı!',
      bolmeler: [{ tur: 'sina', n: 20, dy: [170, 210], ff: 2, yazilar: [
        ['kova', 'En üstteki kovaya tutun: gün ışığı!']
      ] }] },
    { no: 4, ad: 'Savrul', kaynak: [2, 0], bolge: 0, akis: 7, su: 0,
      ipucu: 'İpi halkaya varmadan bırak: fırlarsın. Havadayken sıradakine bas: akış başlar.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [190, 222], duzen: 'zikzak', ff: 1, yazilar: [
        [0, 'İpi halkaya varmadan bırak: yukarı fırlarsın.'],
        [2, 'Havadayken sıradakine bas: akış!'],
        [6, 'Asılı kalmadan zincirle: x2, x3…']
      ] }] },
    { no: 5, ad: 'Havadan Tutun', kaynak: [2, 1], bolge: 0, akis: 8, su: 0,
      ipucu: 'Ateşböceği uzaksa fırla, havadan tutun.',
      bolmeler: [{ tur: 'uygula', n: 18, dy: [180, 225], ff: 2, yazilar: [
        [2, 'Ateşböceği uzaksa fırla, havadan tutun.']
      ] }] },
    { no: 6, ad: 'Akış Zinciri', kaynak: [2, 2], bolge: 0, akis: 9, su: 0, not: 1,
      ipucu: 'Asılı kalmadan zincirle. Zincir koparsa dert değil, yeniden başla.',
      bolmeler: [{ tur: 'sina', n: 20, dy: [185, 232], ff: 3, yazilar: [] }] },
    { no: 7, ad: 'Ahşap ve Taş', kaynak: [3, 0], bolge: 0, akis: 7, su: 0,
      ipucu: 'Kanca ahşaba saplanır, taştan seker. Kahverengi panelin olduğu yana bas.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [165, 195], panel: 0.75, ff: 1, yazilar: [
        [0, 'Kanca ahşaba saplanır, taştan seker.'],
        [4, 'Panel hangi yandaysa o yana bas.'],
        [8, 'Panelden de fırlayabilirsin: erken bırak.']
      ] }] },
    { no: 8, ad: 'Panelin Karşısı', kaynak: [3, 1], bolge: 0, akis: 8, su: 0,
      ipucu: 'Ateşböceği halkaları bazen panelin karşısında.',
      bolmeler: [{ tur: 'uygula', n: 18, dy: [170, 210], panel: 0.35, ff: 2, yazilar: [
        [4, 'Ateşböceği halkaları bazen panelin karşısında.']
      ] }] },
    { no: 9, ad: 'Taş Duvar', kaynak: [3, 2], bolge: 0, akis: 9, su: 0,
      ipucu: 'Ahşap da halka da senin. Taşa atarsan kanca seker.',
      bolmeler: [{ tur: 'sina', n: 20, dy: [180, 230], panel: 0.3, ff: 2, yazilar: [] }] },
    { no: 10, ad: 'Hız Halkası', kaynak: [4, 0], bolge: 0, akis: 7, su: 0,
      ipucu: 'Mavi oklu halkaya tutun ve bırak: yukarı fırlarsın. Çekilirken bırakırsan daha da hızlanırsın.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [170, 205], hiz: 3, ff: 1, yazilar: [
        [0, 'Mavi oklu halka: tutun, bırak, yukarı fırla.'],
        [4, 'Çekilirken bırakırsan daha da hızlanırsın.'],
        [8, 'Hız halkası yolun yanında: istersen al.']
      ] }] },
    { no: 11, ad: 'Çekilirken Bırak', kaynak: [4, 1], bolge: 0, akis: 8, su: 0,
      ipucu: 'İp seni çekerken bırak: hız halkasından daha da hızlı fırlarsın.',
      bolmeler: [{ tur: 'uygula', n: 18, dy: [175, 215], hiz: 2, ff: 2, yazilar: [] }] },
    { no: 12, ad: 'Mavi Yol', kaynak: [4, 2], bolge: 0, akis: 9, su: 0, not: 2,
      ipucu: 'Hız halkası ve ahşap bir arada. Panelin yanına bas.',
      bolmeler: [{ tur: 'sina', n: 20, dy: [180, 230], hiz: 2, panel: 0.2, ff: 2, yazilar: [] }] },
    { no: 13, ad: 'TAM', kaynak: [5, 0], bolge: 0, akis: 8, su: 0,
      ipucu: 'İp halkaya varmadan hemen önce bırak: TAM! Seni biraz daha yükseğe iter.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [185, 220], duzen: 'zikzak', ff: 1, yazilar: [
        [0, 'İp halkaya varmadan hemen önce bırak: TAM!'],
        [3, 'TAM bırakış seni biraz daha yükseğe iter.'],
        [7, 'Asılı kalmadan zincirle: akış uzadıkça puan artar.']
      ] }] },
    { no: 14, ad: 'Uzun Akış', kaynak: [5, 1], bolge: 0, akis: 10, su: 0,
      ipucu: 'Asılı kalmadan zincirle: akış uzadıkça puan artar.',
      bolmeler: [{ tur: 'uygula', n: 18, dy: [180, 225], ff: 2, hiz: 1, yazilar: [] }] },
    { no: 15, ad: 'Hepsi Bir Arada', kaynak: [5, 2], bolge: 0, akis: 11, su: 0,
      ipucu: 'Halka, ahşap, hız halkası: hepsi bir arada. TAM bırak, akışı koru.',
      bolmeler: [{ tur: 'sina', n: 20, dy: [185, 232], ff: 2, hiz: 1, panel: 0.2, yazilar: [] }] },
    { no: 16, ad: 'Kutu ve Kapak', kaynak: [6, 0], bolge: 0, akis: 7, su: 0,
      ipucu: 'Kanca hafif şeyleri sana çeker. Halkaya çık, sonra sağa bas: kanca raftaki kutuyu çeker, kutu düğmeye düşer, kapak açılır.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [170, 205], kutu: true, ff: 1, yazilar: [
        [0, 'Önce halkaya çık.'],
        [1, 'Kapak kapalı. Kutu sağda: sağa bas, kanca onu sana çeker. Düğmeye düşünce kapak açılır.']
      ] }] },
    { no: 17, ad: 'Panel ve Hız', kaynak: [6, 1], bolge: 0, akis: 8, su: 0,
      ipucu: 'Ahşap ve hız halkası: panelin yanına bas, mavi halkadan fırla.',
      bolmeler: [{ tur: 'uygula', n: 18, dy: [175, 215], panel: 0.3, hiz: 1, ff: 2, yazilar: [] }] },
    { no: 18, ad: 'Gün Işığı', kaynak: [6, 2], bolge: 0, akis: 9, su: 0, not: 3,
      ipucu: 'Taş Kuyu\'nun sonu. Gün ışığı yukarıda.',
      bolmeler: [{ tur: 'sina', n: 20, dy: [180, 230], panel: 0.3, hiz: 1, ff: 2, yazilar: [
        ['kova', 'Gün ışığı yukarıda.']
      ] }] },
    // v0.88 (A5.1, deneme): Maden, Kristal Mağara ve Eski Kule → 19–83 (oyunda 119–183). Tablo: docs/kisa-bolumler-plan.md §9.
    // Su: yeni şey öğreten bölüm susuz (bugün su ilk fenerden sonra başlıyordu), diğerleri ilk tutunuşta yükselen suyla;
    // Kristal 15–18 ve Kule izleyen su. Ateşböceği: 0 olana 1 eklenir. Çark (51, 56) ve akıntı (71) dört adım için birer artar.
    // — Maden (7–12)
    { no: 19, ad: 'Yükselen Su', kaynak: [7, 0], bolge: 1, akis: 6, su: 45,
      ipucu: 'Madende su yükselir. Asılı bekleme, sıradakine atıl. Su yakalarsa bölümün başından dönersin.',
      bolmeler: [{ tur: 'ogret', n: 13, dy: [170, 205], ff: 1, hiz: 1, yazilar: [
        [0, 'Su yükseliyor. Asılı bekleme, sıradakine atıl.'],
        [5, 'Acele et ama korkma: su yavaş.'],
        [9, 'Madende yanlış tarafa basarsan ip bırakılır. Önce işarete bak.']
      ] }] },
    { no: 20, ad: 'Kor Halka', kaynak: [7, 1], bolge: 1, akis: 7, su: 45,
      ipucu: 'Kızıl kor halka 1,5 sn sonra söner ve seni bırakır. Tutun, hemen sıradakine atıl.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [175, 215], ff: 1, hiz: 1, kor: 4, yazilar: [
        [0, 'Kızıl halka kordur: 1,5 sn sonra söner, seni bırakır.'],
        [6, 'Kor halkada bekleme: tutun, hemen sıradakine atıl.'],
        [11, 'Sönen kor bir an sonra yeniden kızarır.']
      ] }] },
    { no: 21, ad: 'Sönen Korlar', kaynak: [7, 2], bolge: 1, akis: 10, su: 45,
      ipucu: 'Kor halkalar sık: tutun, hemen atıl. Hız halkası yolu kısaltır.',
      bolmeler: [{ tur: 'sina', n: 22, dy: [180, 230], ff: 2, hiz: 2, kor: 3, yazilar: [] }] },
    { no: 22, ad: 'Yay', kaynak: [8, 0], bolge: 1, akis: 6, su: 0,
      ipucu: 'Yeşil oklu halka yaydır: tutunduğun an seni okun yönüne fırlatır. Tepede süzülürken sıradakine bas.',
      bolmeler: [{ tur: 'ogret', n: 13, dy: [175, 210], duzen: 'zikzak', yay: 3, ff: 1, yazilar: [
        [0, 'Yeşil oklu halka yaydır: tutunduğun an fırlatır.'],
        [5, 'Fırlayınca tepede süzülürsün: sıradakine bas.']
      ] }] },
    { no: 23, ad: 'Tepede Süzül', kaynak: [8, 1], bolge: 1, akis: 9, su: 50,
      ipucu: 'Yaydan fırlayınca tepede süzül, sıradakine bas.',
      bolmeler: [{ tur: 'uygula', n: 20, dy: [175, 215], yay: 2, ff: 2, yazilar: [] }] },
    { no: 24, ad: 'Yay ve Kor', kaynak: [8, 2], bolge: 1, akis: 10, su: 50, not: 4,
      ipucu: 'Yay fırlatır, kor bırakır. İkisinde de bekleme.',
      bolmeler: [{ tur: 'sina', n: 22, dy: [180, 230], yay: 2, ff: 2, hiz: 1, kor: 1, yazilar: [] }] },
    { no: 25, ad: 'Rüzgâr Şeridi', kaynak: [9, 0], bolge: 1, akis: 7, su: 0,
      ipucu: 'Rüzgâr şeridini akış sürerken aşağıdan yukarı geç: akış +1. Akış yokken şerit sönüktür, geçmek bir şey vermez.',
      bolmeler: [{ tur: 'ogret', n: 13, dy: [180, 215], duzen: 'zikzak', kapi: 4, ff: 1, yazilar: [
        [0, 'Rüzgâr şeridi: akış sürerken içinden geç, akış +1.'],
        [6, 'Akış yokken şerit sönük; geçmek bir şey vermez.']
      ] }] },
    { no: 26, ad: 'Rüzgârlı Yol', kaynak: [9, 1], bolge: 1, akis: 10, su: 54,
      ipucu: 'Şeritlerden akışla geç: akış uzar.',
      bolmeler: [{ tur: 'uygula', n: 20, dy: [180, 220], kapi: 3, ff: 2, yazilar: [] }] },
    { no: 27, ad: 'Rüzgâr ve Yay', kaynak: [9, 2], bolge: 1, akis: 11, su: 54,
      ipucu: 'Rüzgâr, yay ve kor bir arada. Akışı koru.',
      bolmeler: [{ tur: 'sina', n: 22, dy: [185, 230], kapi: 3, yay: 1, ff: 2, kor: 1, yazilar: [] }] },
    { no: 28, ad: 'Sarkaç', kaynak: [10, 0], bolge: 1, akis: 6, su: 0,
      ipucu: 'Sarkaç halka zincirde sallanır. Hangi taraftaysa o yana bas; yakına gelince tutun.',
      bolmeler: [{ tur: 'ogret', n: 13, dy: [175, 210], sarkac: 3, ff: 1, yazilar: [
        [0, 'Sarkaç halka sallanır: hangi taraftaysa o yana bas.'],
        [5, 'Yakına gelince tutun; ip sarkaçla birlikte gider.']
      ] }] },
    { no: 29, ad: 'Sarkacı Bekle', kaynak: [10, 1], bolge: 1, akis: 9, su: 58,
      ipucu: 'Acele etme: sarkaç yakına gelince tutun.',
      bolmeler: [{ tur: 'uygula', n: 20, dy: [175, 215], sarkac: 2, ff: 2, yazilar: [] }] },
    { no: 30, ad: 'Sarkaç ve Kor', kaynak: [10, 2], bolge: 1, akis: 10, su: 58, not: 5,
      ipucu: 'Sarkacı bekle, korda bekleme.',
      bolmeler: [{ tur: 'sina', n: 22, dy: [180, 230], sarkac: 2, yay: 1, ff: 2, kor: 1, yazilar: [] }] },
    { no: 31, ad: 'Alev', kaynak: [11, 0], bolge: 1, akis: 7, su: 0,
      ipucu: "Akış sürerken TAM bırakışlar Çıra'yı alevlendirir (2, 4 ve 7 TAM). Alevliyken her bırakış seni daha yükseğe fırlatır.",
      bolmeler: [{ tur: 'ogret', n: 13, dy: [185, 220], duzen: 'zikzak', ff: 1, yazilar: [
        [0, "Akışta TAM bırakışlar Çıra'yı alevlendirir."],
        [4, 'Alevliyken her bırakış seni daha yükseğe fırlatır.'],
        [8, 'Akış biterse alev de söner.']
      ] }] },
    { no: 32, ad: 'Alevli Rüzgâr', kaynak: [11, 1], bolge: 1, akis: 10, su: 62,
      ipucu: 'Alevi rüzgâr şeritleriyle uzat: asılı kalma.',
      bolmeler: [{ tur: 'uygula', n: 20, dy: [185, 225], kapi: 2, ff: 2, yazilar: [] }] },
    { no: 33, ad: 'Alevi Koru', kaynak: [11, 2], bolge: 1, akis: 11, su: 62,
      ipucu: 'Akış sürerken TAM bırak, alevi koru. Korda bekleme.',
      bolmeler: [{ tur: 'sina', n: 22, dy: [185, 232], kapi: 2, hiz: 1, ff: 2, kor: 1, yazilar: [] }] },
    { no: 34, ad: 'Maden Yolu', kaynak: [12, 0], bolge: 1, akis: 9, su: 66,
      ipucu: 'Madenin son kuyuları: yay ve sarkaç bir arada.',
      bolmeler: [{ tur: 'uygula', n: 19, dy: [175, 215], yay: 1, sarkac: 1, ff: 2, yazilar: [
        [0, 'Madenin son kuyuları: öğrendiklerinin hepsi burada.']
      ] }] },
    { no: 35, ad: 'Derin Maden', kaynak: [12, 1], bolge: 1, akis: 10, su: 66,
      ipucu: 'Rüzgâr, hız, sarkaç ve kor. Önce işarete bak.',
      bolmeler: [{ tur: 'sina', n: 21, dy: [180, 225], kapi: 2, hiz: 1, sarkac: 1, ff: 2, kor: 1, yazilar: [] }] },
    { no: 36, ad: 'Maden Ağzı', kaynak: [12, 2], bolge: 1, akis: 11, su: 66, not: 6,
      ipucu: 'Madenin son kuyusu: yay, sarkaç, rüzgâr, hız ve kor. Öğrendiklerinin hepsi burada.',
      bolmeler: [{ tur: 'sina', n: 22, dy: [180, 232], yay: 2, kapi: 2, panel: 0.2, ff: 2, kor: 2, yazilar: [
        ['kova', 'Madenin ağzı yukarıda.']
      ] }] },
    // — Kristal Mağara (13–18)
    { no: 37, ad: 'Geçit', kaynak: [13, 0], bolge: 2, akis: 6, su: 0,
      ipucu: 'Mor girdaplı halka geçittir: tutun, yukarıdaki mor çıkış halkasından çıkarsın. Kestirmedir; ana yol da hep açık.',
      bolmeler: [{ tur: 'ogret', n: 14, dy: [175, 210], gecit: 2, ff: 1, yazilar: [
        [0, 'Mor girdaplı halka geçittir: tutun, yukarıdaki çıkıştan çıkarsın.'],
        [8, 'Geçit kestirmedir. İstersen ana yoldan da gidebilirsin.']
      ] }] },
    { no: 38, ad: 'Geçit ve Yay', kaynak: [13, 1], bolge: 2, akis: 10, su: 60,
      ipucu: 'Geçit taşır, yay fırlatır. Her çıkışta sıradakine hazır ol.',
      bolmeler: [{ tur: 'uygula', n: 22, dy: [175, 215], gecit: 1, yay: 1, ff: 2, yazilar: [] }] },
    { no: 39, ad: 'Geçit ve Sarkaç', kaynak: [13, 2], bolge: 2, akis: 11, su: 60,
      ipucu: 'Geçit ve sarkaç: sarkacı bekle, geçitten kestir.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 225], gecit: 1, sarkac: 1, ff: 2, yazilar: [] }] },
    { no: 40, ad: 'Mor Kestirme', kaynak: [13, 3], bolge: 2, akis: 12, su: 60,
      ipucu: 'Geçit ve rüzgâr şeritleri: kestir, akışı koru.',
      bolmeler: [{ tur: 'ustalik', n: 25, dy: [180, 230], gecit: 1, kapi: 2, ff: 2, yazilar: [] }] },
    { no: 41, ad: 'Fırlatma Yolu', kaynak: [14, 0], bolge: 2, akis: 6, su: 0,
      ipucu: 'Turuncu oklu halka fırlatma yoludur: akış sürerken tutun, ip halkaya varmadan bırak, yukarıdaki ateşböceğine uç. Asılıyken oraya ulaşılmaz.',
      bolmeler: [{ tur: 'ogret', n: 14, dy: [180, 215], dal: 1, ff: 0, yazilar: [
        [0, 'Turuncu oklu halka fırlatma yoludur.'],
        [3, 'Akış sürerken tutun ve erken bırak: yukarıdaki ateşböceğine uçarsın.'],
        [9, 'Asılıyken oraya ulaşılmaz; ana yol her zaman açık.']
      ] }] },
    { no: 42, ad: 'Erken Bırak', kaynak: [14, 1], bolge: 2, akis: 10, su: 62,
      ipucu: 'Fırlatma yolunda ip halkaya varmadan bırak.',
      bolmeler: [{ tur: 'uygula', n: 22, dy: [180, 220], dal: 1, ff: 1, yazilar: [] }] },
    { no: 43, ad: 'Hızlı Yol', kaynak: [14, 2], bolge: 2, akis: 11, su: 62,
      ipucu: 'Fırlatma yolu ve hız halkası: ikisi de cesur olanın.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 225], dal: 1, hiz: 1, ff: 1, yazilar: [] }] },
    { no: 44, ad: 'Cesur Yol', kaynak: [14, 3], bolge: 2, akis: 12, su: 62, not: 7,
      ipucu: 'Fırlatma yolu ve rüzgâr şeritleri. Fırlatma yolları cesur olanın.',
      bolmeler: [{ tur: 'ustalik', n: 25, dy: [185, 230], dal: 1, kapi: 2, ff: 1, yazilar: [] }] },
    { no: 45, ad: 'Su Seni İzliyor', kaynak: [15, 0], bolge: 2, akis: 6, takip: 22,
      ipucu: 'Su artık seni izliyor: tutunduğun en yüksek yerin 22 m altında bekler, yalnız düşersen yakalar. Yanlış tarafa basarsan ip bırakılır; önce işarete bak.',
      bolmeler: [{ tur: 'ogret', n: 14, dy: [175, 210], ff: 1, yazilar: [
        [0, 'Su artık seni izliyor: en yüksek tutunduğun yerin altında.'],
        [4, 'Yanlış tarafa basarsan ip bırakılır. Önce işarete bak.'],
        [8, 'Asılı beklemek serbest; su yalnız düşersen yakalar.']
      ] }] },
    { no: 46, ad: 'İzleyen Su', kaynak: [15, 1], bolge: 2, akis: 10, takip: 22,
      ipucu: 'Su altında bekliyor. Yaydan fırla, sıradakini kaçırma.',
      bolmeler: [{ tur: 'uygula', n: 22, dy: [175, 215], yay: 1, ff: 2, yazilar: [] }] },
    { no: 47, ad: 'İşarete Bak', kaynak: [15, 2], bolge: 2, akis: 11, takip: 22,
      ipucu: 'Sarkaç ve rüzgâr şeridi: önce işarete bak, sonra dokun.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 225], sarkac: 1, kapi: 1, ff: 2, yazilar: [] }] },
    { no: 48, ad: 'Geçit ve Hız', kaynak: [15, 3], bolge: 2, akis: 11, takip: 22,
      ipucu: 'Geçit ve hız halkası: kestirmeler yukarı taşır, su geride kalır.',
      bolmeler: [{ tur: 'ustalik', n: 25, dy: [180, 230], gecit: 1, hiz: 1, ff: 2, yazilar: [] }] },
    { no: 49, ad: 'Altın Zincir', kaynak: [16, 0], bolge: 2, akis: 6, takip: 22,
      ipucu: 'Altın ateşböcekleri sıralıdır: 1, 2, 3. Hepsini akış kopmadan topla.',
      bolmeler: [{ tur: 'ogret', n: 14, dy: [180, 215], duzen: 'zikzak', zincir: 2, ff: 1, yazilar: [
        [0, 'Altın ateşböcekleri sıralı: 1, 2, 3.'],
        [4, 'Hepsini akış kopmadan topla; zincir tamamlanınca sayılır.']
      ] }] },
    { no: 50, ad: 'Döner Çark', kaynak: [16, 1], bolge: 2, akis: 7, takip: 22,
      ipucu: 'Döner çark: halka yükselirken tutun, yükselirken bırak; çark seni fırlatır.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [175, 205], cark: 3, ff: 1, yazilar: [
        [0, 'Döner çark: üç halkası döner. Yükselen halkaya tutun.'],
        [5, 'Halka yükselirken bırak: çark seni fırlatır.'],
        [10, 'Çark acele etmez; doğru anı bekle.']
      ] }] },
    { no: 51, ad: 'Çark ve Zincir', kaynak: [16, 2], bolge: 2, akis: 11, takip: 22,
      ipucu: 'İki çark ve bir altın zincir. Çarkta doğru anı bekle, zinciri akışla topla.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 225], zincir: 1, kapi: 1, ff: 2, cark: 2, yazilar: [] }] },
    { no: 52, ad: 'Zincir Yolu', kaynak: [16, 3], bolge: 2, akis: 11, takip: 22, not: 8,
      ipucu: 'Altın zincir ve fırlatma yolu: ikisi de akış ister.',
      bolmeler: [{ tur: 'ustalik', n: 25, dy: [185, 230], zincir: 1, dal: 1, ff: 1, yazilar: [] }] },
    { no: 53, ad: 'Kalkan', kaynak: [17, 0], bolge: 2, akis: 6, takip: 22,
      ipucu: 'Mavi küre kalkandır: bir düşüşünü affeder. Küreler satılmaz, yolda bulunur.',
      bolmeler: [{ tur: 'ogret', n: 14, dy: [175, 210], guc: ['kalkan'], ff: 1, yazilar: [
        [0, 'Mavi küre kalkandır: bir düşüşünü affeder.'],
        [7, 'Kalkan varken suya düşersen son güvenli halkaya sıçrarsın.']
      ] }] },
    { no: 54, ad: 'Fener Küresi', kaynak: [17, 1], bolge: 2, akis: 7, takip: 22,
      ipucu: 'Sarı küre fenerdir: yakındaki ateşböceklerini sana çeker.',
      bolmeler: [{ tur: 'ogret', n: 16, dy: [175, 215], guc: ['fener'], ff: 3, yazilar: [
        [0, 'Sarı küre fenerdir: yakındaki ateşböceklerini sana çeker.']
      ] }] },
    { no: 55, ad: 'Kanat', kaynak: [17, 2], bolge: 2, akis: 9, takip: 22,
      ipucu: 'Beyaz küre kanattır: 3 sn seni yukarı taşır.',
      bolmeler: [{ tur: 'ogret', n: 20, dy: [180, 225], guc: ['kanat'], ff: 1, yazilar: [
        [0, 'Beyaz küre kanattır: 3 sn seni yukarı taşır.']
      ] }] },
    { no: 56, ad: 'Küreler', kaynak: [17, 3], bolge: 2, akis: 11, takip: 22,
      ipucu: 'Kalkan, geçit ve bir döner çark. Kalkanı al, sonra cesur ol.',
      bolmeler: [{ tur: 'ustalik', n: 25, dy: [180, 230], guc: ['kalkan'], gecit: 1, ff: 2, cark: 1, yazilar: [] }] },
    { no: 57, ad: 'Kristal Yolu', kaynak: [18, 0], bolge: 2, akis: 10, takip: 22,
      ipucu: 'Mağaranın kalbine yaklaştın: geçit ve sarkaç.',
      bolmeler: [{ tur: 'uygula', n: 22, dy: [180, 215], gecit: 1, sarkac: 1, ff: 2, yazilar: [
        [0, 'Kristaller ışığını hatırlıyor. Yol yukarıda.']
      ] }] },
    { no: 58, ad: 'Kristal Çarkı', kaynak: [18, 1], bolge: 2, akis: 10, takip: 22,
      ipucu: 'Fırlatma yolu, yay, rüzgâr ve döner çark bir arada.',
      bolmeler: [{ tur: 'sina', n: 23, dy: [180, 220], dal: 1, yay: 1, kapi: 1, ff: 1, cark: 1, yazilar: [] }] },
    { no: 59, ad: 'Kor ve Zincir', kaynak: [18, 2], bolge: 2, akis: 11, takip: 22,
      ipucu: 'Altın zincir ve sarkaç. Madenden bir kor halka da burada.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 225], zincir: 1, sarkac: 1, ff: 2, kor: 1, yazilar: [] }] },
    { no: 60, ad: 'Kristal Kalbi', kaynak: [18, 3], bolge: 2, akis: 12, takip: 22, not: 9,
      ipucu: 'Mağaranın kalbi: geçit, fırlatma yolu, rüzgâr ve izleyen su. Öğrendiklerinin hepsi burada.',
      bolmeler: [{ tur: 'ustalik', n: 25, dy: [185, 232], gecit: 1, dal: 1, kapi: 2, ff: 1, yazilar: [
        ['kova', 'Mağaranın ağzı yukarıda.']
      ] }] },
    // — Eski Kule (19–24)
    { no: 61, ad: 'Eski Kule', kaynak: [19, 0], bolge: 3, akis: 8, takip: 18,
      ipucu: 'Kulede su daha yakın: 22 m. Ahşap ve sarkaç dar merdivende.',
      bolmeler: [{ tur: 'uygula', n: 18, dy: [175, 215], panel: 0.4, sarkac: 2, kapi: 1, ff: 2, yazilar: [
        [0, 'Eski Kule: su burada daha yakın.']
      ] }] },
    { no: 62, ad: 'Dar Merdiven', kaynak: [19, 1], bolge: 3, akis: 12, takip: 18,
      ipucu: 'Ahşap, sarkaç ve rüzgâr dar merdivende.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 220], panel: 0.35, sarkac: 1, kapi: 2, ff: 2, yazilar: [] }] },
    { no: 63, ad: 'Ahşap Sarkaç', kaynak: [19, 2], bolge: 3, akis: 11, takip: 18,
      ipucu: 'Panel hangi yandaysa o yana bas; sarkacı bekle.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 225], panel: 0.3, sarkac: 2, ff: 2, yazilar: [] }] },
    { no: 64, ad: 'Kule Basamakları', kaynak: [19, 3], bolge: 3, akis: 13, takip: 18,
      ipucu: 'Ahşap, rüzgâr, sarkaç ve bir kor halka.',
      bolmeler: [{ tur: 'ustalik', n: 26, dy: [185, 230], panel: 0.3, kapi: 2, sarkac: 1, ff: 2, kor: 1, yazilar: [] }] },
    { no: 65, ad: 'Yaylar', kaynak: [20, 0], bolge: 3, akis: 10, takip: 18,
      ipucu: 'Yaylar seni fırlatır, geçitler taşır. Her fırlayışta sıradakine hazır ol.',
      bolmeler: [{ tur: 'uygula', n: 22, dy: [180, 215], yay: 3, gecit: 1, ff: 1, yazilar: [
        [0, 'Yaylar ve geçitler: her fırlayışta sıradakine hazır ol.']
      ] }] },
    { no: 66, ad: 'Yaylar ve Geçitler', kaynak: [20, 1], bolge: 3, akis: 11, takip: 18,
      ipucu: 'Art arda yönlendirme: yay, geçit, yine yay.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 220], yay: 2, gecit: 1, ff: 2, yazilar: [] }] },
    { no: 67, ad: 'Yay ve Çark', kaynak: [20, 2], bolge: 3, akis: 11, takip: 18,
      ipucu: 'Yaylar, bir geçit ve bir döner çark.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 225], yay: 2, gecit: 1, ff: 2, cark: 1, yazilar: [] }] },
    { no: 68, ad: 'Kule Kestirmesi', kaynak: [20, 3], bolge: 3, akis: 12, takip: 18, not: 10,
      ipucu: 'Yay, geçit ve fırlatma yolu: kestirmeler cesur olanın.',
      bolmeler: [{ tur: 'ustalik', n: 26, dy: [185, 230], yay: 2, gecit: 1, dal: 1, ff: 1, yazilar: [] }] },
    { no: 69, ad: 'Akıntı', kaynak: [21, 0], bolge: 3, akis: 8, takip: 18,
      ipucu: 'Mavi akıntı sütunu akış sürerken seni yukarı taşır. Akış yokken söner.',
      bolmeler: [{ tur: 'ogret', n: 15, dy: [185, 220], duzen: 'zikzak', kapi: 2, ff: 1, akinti: 3, yazilar: [
        [0, 'Bu kuyu akış için: asılı kalma, alevi koru.'],
        [3, 'Mavi akıntı: akış sürerken içinden geç, süzülürsün.'],
        [8, 'Akış yokken akıntı söner.']
      ] }] },
    { no: 70, ad: 'Rüzgâr ve Kor', kaynak: [21, 1], bolge: 3, akis: 12, takip: 18,
      ipucu: 'Rüzgâr şeritleri, altın zincir ve kor halkalar. Asılı kalma.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [185, 225], kapi: 2, zincir: 1, ff: 2, kor: 2, yazilar: [] }] },
    { no: 71, ad: 'Akıntı Zinciri', kaynak: [21, 2], bolge: 3, akis: 12, takip: 18,
      ipucu: 'İki akıntı, rüzgâr ve altın zincir: akışı hiç koparma.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [185, 228], kapi: 3, zincir: 1, ff: 1, akinti: 2, yazilar: [] }] },
    { no: 72, ad: 'Uzun Akış', kaynak: [21, 3], bolge: 3, akis: 13, takip: 18,
      ipucu: 'Rüzgâr, fırlatma yolu, zincir ve akıntı. TAM bırakarak tırman; alevi koru.',
      bolmeler: [{ tur: 'ustalik', n: 26, dy: [185, 232], kapi: 3, dal: 1, zincir: 1, ff: 1, akinti: 1, yazilar: [] }] },
    { no: 73, ad: 'İki Yol', kaynak: [22, 0], bolge: 3, akis: 10, takip: 18,
      ipucu: 'Fırlatma yolu ve geçit kısa ama zor, ana yol uzun ama güvenli. Seçim senin.',
      bolmeler: [{ tur: 'uygula', n: 22, dy: [180, 218], dal: 1, gecit: 1, ff: 1, yazilar: [
        [0, 'İki yol var: kısa ama zor, uzun ama güvenli.']
      ] }] },
    { no: 74, ad: 'Kısa mı, Uzun mu', kaynak: [22, 1], bolge: 3, akis: 11, takip: 18,
      ipucu: 'Kestirme mi, güvenli yol mu? Seçim senin.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 222], dal: 1, gecit: 1, ff: 1, yazilar: [] }] },
    { no: 75, ad: 'İki Yol ve Çark', kaynak: [22, 2], bolge: 3, akis: 11, takip: 18,
      ipucu: 'İki yol ve bir döner çark.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 226], dal: 1, gecit: 1, ff: 1, cark: 1, yazilar: [] }] },
    { no: 76, ad: 'İki Yol ve Akıntı', kaynak: [22, 3], bolge: 3, akis: 13, takip: 18, not: 11,
      ipucu: 'İki yol ve bir akıntı sütunu: akışla en kısa yol.',
      bolmeler: [{ tur: 'ustalik', n: 26, dy: [185, 230], dal: 1, gecit: 1, ff: 1, akinti: 1, yazilar: [] }] },
    { no: 77, ad: 'Fırtına', kaynak: [23, 0], bolge: 3, akis: 13, takip: 15,
      ipucu: 'Fırtına: su 15 m altında izliyor. Sakin kal, işarete bak, sonra dokun.',
      bolmeler: [{ tur: 'sina', n: 26, dy: [180, 222], yay: 1, sarkac: 1, kapi: 2, ff: 2, kor: 2, yazilar: [
        [0, 'Fırtına: su çok yakın. Sakin kal.']
      ] }] },
    { no: 78, ad: 'Fırtınanın Gözü', kaynak: [23, 1], bolge: 3, akis: 13, takip: 15,
      ipucu: 'Rüzgâr, hız, geçit ve sarkaç. Su çok yakın.',
      bolmeler: [{ tur: 'sina', n: 27, dy: [180, 226], kapi: 2, hiz: 1, gecit: 1, sarkac: 1, ff: 2, yazilar: [] }] },
    { no: 79, ad: 'Fırtınanın Sonu', kaynak: [23, 2], bolge: 3, akis: 14, takip: 15,
      ipucu: 'Fırlatma yolu, yay, zincir ve akıntı. Fırtına bitmek üzere.',
      bolmeler: [{ tur: 'ustalik', n: 28, dy: [185, 230], dal: 1, yay: 1, zincir: 1, ff: 2, akinti: 1, yazilar: [] }] },
    { no: 80, ad: 'Son Kuyu', kaynak: [24, 0], bolge: 3, akis: 10, takip: 18,
      ipucu: 'Son kuyular. Fener yukarıda: yay, sarkaç ve rüzgâr.',
      bolmeler: [{ tur: 'uygula', n: 22, dy: [180, 218], yay: 1, sarkac: 1, kapi: 1, ff: 2, yazilar: [
        [0, 'Son kuyular. Fener yukarıda.']
      ] }] },
    { no: 81, ad: 'Pencere', kaynak: [24, 1], bolge: 3, akis: 11, takip: 18,
      ipucu: 'Geçit, fırlatma yolu ve döner çark. Bekçi pencerede bekliyor.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 222], gecit: 1, dal: 1, ff: 1, cark: 1, yazilar: [] }] },
    { no: 82, ad: 'Kalkan ve Kor', kaynak: [24, 2], bolge: 3, akis: 12, takip: 18,
      ipucu: 'Altın zincir, rüzgâr, kalkan ve kor halka.',
      bolmeler: [{ tur: 'sina', n: 24, dy: [180, 226], zincir: 1, kapi: 2, guc: ['kalkan'], ff: 2, kor: 1, yazilar: [] }] },
    { no: 83, ad: 'Fener', kaynak: [24, 3], bolge: 3, akis: 13, takip: 18, not: 12,
      ipucu: 'Son kuyu. Fener yukarıda, bekçi pencerede bekliyor.',
      bolmeler: [{ tur: 'ustalik', n: 26, dy: [185, 232], yay: 1, sarkac: 1, gecit: 1, dal: 1, ff: 1, akinti: 1, yazilar: [
        ['kova', 'Çıra, fenere hoş geldin.']
      ] }] }
  ];
  function bul(no) { for (var i = 0; i < BOLUMLER.length; i++) if (BOLUMLER[i].no === no) return BOLUMLER[i]; return null; }
  function kisaBul(no) { for (var i = 0; i < KISA.length; i++) if (KISA[i].no === no) return KISA[i]; return null; }
  var api = { BOLUMLER: BOLUMLER, bul: bul, sayi: BOLUMLER.length, KISA: KISA, kisaBul: kisaBul, kisaSayi: KISA.length };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KuyuBolumler = api;
})(typeof window !== 'undefined' ? window : this);
