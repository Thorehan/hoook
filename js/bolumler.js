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
     yazilar: duvar ipuçları (bekçinin tebeşiri): [düğüm sırası | 'fener' | 'kova', metin]
   }
   Bölümde ayrıca: su (yükselme hızı, birim/sn), suFener (su kaç fener yanınca başlar; yoksa ilk tutunuşta), not (bekçinin notu, 1–12).
   Aşama 1 (v0.59): bölüm 1–3. Aşama 2 (v0.60): bölüm 4–12 (Taş Kuyu ve Maden). Deneme olarak oynanır; eski bölümler değişmez. */
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
      ipucu: 'Madende su yükselir. Asılı bekleme, sıradakine atıl. Su yakalarsa son yanan fenerden dönersin.',
      bolmeler: [
        { tur: 'ogret', n: 12, dy: [170, 205], ff: 1, hiz: 1, yazilar: [
          [0, 'Su yükseliyor. Asılı bekleme, sıradakine atıl.'],
          [5, 'Acele et ama korkma: su yavaş.'],
          ['fener', 'Su yakalarsa buradan dönersin.']
        ] },
        { tur: 'uygula', n: 14, dy: [175, 215], ff: 2, hiz: 1, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 230], ff: 2, hiz: 2, yazilar: [] }
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
        { tur: 'sina', n: 16, dy: [180, 230], yay: 2, ff: 2, hiz: 1, yazilar: [] }
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
        { tur: 'sina', n: 16, dy: [185, 230], kapi: 3, yay: 1, ff: 2, yazilar: [] }
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
        { tur: 'sina', n: 16, dy: [180, 230], sarkac: 2, yay: 1, ff: 2, yazilar: [] }
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
        { tur: 'sina', n: 16, dy: [185, 232], kapi: 2, hiz: 1, ff: 2, yazilar: [] }
      ]
    },
    {
      no: 12, ad: 'Maden Ağzı', bolge: 1, akis: 12, su: 66, suFener: 1, not: 6,
      ipucu: 'Madenin son kuyusu: yay, sarkaç, rüzgâr ve hız. Öğrendiklerinin hepsi burada.',
      bolmeler: [
        { tur: 'uygula', n: 12, dy: [175, 215], yay: 1, sarkac: 1, ff: 2, yazilar: [
          [0, 'Madenin son kuyusu: öğrendiklerinin hepsi burada.'],
          ['fener', 'Bekçinin fenerleri seni bekliyor.']
        ] },
        { tur: 'sina', n: 14, dy: [180, 225], kapi: 2, hiz: 1, sarkac: 1, ff: 2, yazilar: [] },
        { tur: 'sina', n: 16, dy: [180, 232], yay: 2, kapi: 2, panel: 0.2, ff: 2, yazilar: [
          ['kova', 'Madenin ağzı yukarıda.']
        ] }
      ]
    }
  ];
  function bul(no) { for (var i = 0; i < BOLUMLER.length; i++) if (BOLUMLER[i].no === no) return BOLUMLER[i]; return null; }
  var api = { BOLUMLER: BOLUMLER, bul: bul, sayi: BOLUMLER.length };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KuyuBolumler = api;
})(typeof window !== 'undefined' ? window : this);
