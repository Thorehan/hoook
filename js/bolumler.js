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
     yazilar: duvar ipuçları (bekçinin tebeşiri): [düğüm sırası | 'fener' | 'kova', metin]
   }
   Aşama 1 (v0.57): bölüm 1–3 deneme olarak oynanır; eski bölümler değişmez. */
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
      no: 2, ad: 'Savrul', bolge: 0, akis: 10, su: 0,
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
    }
  ];
  function bul(no) { for (var i = 0; i < BOLUMLER.length; i++) if (BOLUMLER[i].no === no) return BOLUMLER[i]; return null; }
  var api = { BOLUMLER: BOLUMLER, bul: bul, sayi: BOLUMLER.length };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KuyuBolumler = api;
})(typeof window !== 'undefined' ? window : this);
