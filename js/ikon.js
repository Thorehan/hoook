// Hoook · arayüz ikonları (v0.90, İstişare 5 Aşama 3). Yazı simgelerinin (★ ☆ ✓ ▶ ⏱ 🔒) yerine çıkartma dilinde
// küçük SVG'ler: düz renk dolgu, koyu (#15112a) kalın çizgi. Dışarıdan görsel yok; hepsi burada elle çizildi.
//   KuyuIkon.svg('yildiz')            → <svg class="ik ik-yildiz">…</svg>
//   KuyuIkon.svg('yildiz', 'bos')     → ek sınıf (CSS renk değiştirir)
//   KuyuIkon.yildizlar(2, 'sinif')    → üç yıldız, ilk ikisi dolu
(function () {
  var C = '#15112a';
  var P = {
    yildiz: '<path class="d" d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="#ffe066" stroke="' + C + '" stroke-width="2.4" stroke-linejoin="round"/>',
    tik: '<path d="M5 12.5l4.4 4.3L19 7.2" fill="none" stroke="' + C + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path class="d" d="M5 12.5l4.4 4.3L19 7.2" fill="none" stroke="#5fd38d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    oynat: '<path class="d" d="M8 4.8v14.4c0 .9 1 1.4 1.7.9l10-7.2c.6-.4.6-1.4 0-1.8l-10-7.2C9 3.4 8 3.9 8 4.8z" fill="#fff" stroke="' + C + '" stroke-width="2.4" stroke-linejoin="round"/>',
    video: '<rect class="d" x="2.6" y="5" width="18.8" height="14" rx="3.4" fill="#5ec8ff" stroke="' + C + '" stroke-width="2.4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="#fff" stroke="' + C + '" stroke-width="1.8" stroke-linejoin="round"/>',
    saat: '<circle class="d" cx="12" cy="13" r="8.2" fill="#fff4dc" stroke="' + C + '" stroke-width="2.4"/><path d="M12 8.6V13l3 2" fill="none" stroke="' + C + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 2.6h5" stroke="' + C + '" stroke-width="2.6" stroke-linecap="round"/>',
    kilit: '<path d="M7.6 10.5V8a4.4 4.4 0 0 1 8.8 0v2.5" fill="none" stroke="' + C + '" stroke-width="2.6"/><rect class="d" x="4.6" y="10.2" width="14.8" height="10.6" rx="2.6" fill="#ffd23f" stroke="' + C + '" stroke-width="2.4"/><circle cx="12" cy="15.4" r="1.7" fill="' + C + '"/>',
    disli: '<path class="d" d="M19.4 13.5l1.6 1.2-1.8 3.1-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-3.6l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-1.8-3.1 1.6-1.2a7.7 7.7 0 0 1 0-2.4L2.9 9.3l1.8-3.1 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h3.6l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 1.8 3.1-1.6 1.2a7.7 7.7 0 0 1 0 2.4z" fill="#fff4dc" stroke="' + C + '" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="#9b6bff" stroke="' + C + '" stroke-width="2"/>',
    geri: '<path d="M14.5 5.5L8 12l6.5 6.5" fill="none" stroke="' + C + '" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>',
    duraklat: '<rect class="d" x="5.5" y="4.5" width="4.6" height="15" rx="1.6" fill="#fff" stroke="' + C + '" stroke-width="2.2"/><rect class="d" x="13.9" y="4.5" width="4.6" height="15" rx="1.6" fill="#fff" stroke="' + C + '" stroke-width="2.2"/>',
    ev: '<path class="d" d="M3.5 11.2L12 4l8.5 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H9.1V21H4.5a1 1 0 0 1-1-1z" fill="#fff4dc" stroke="' + C + '" stroke-width="2.3" stroke-linejoin="round"/>',
    bastan: '<path d="M18.5 12a6.5 6.5 0 1 1-2-4.7" fill="none" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/><path d="M19.2 3.6v4.8h-4.8" fill="none" stroke="' + C + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    atla: '<path class="d" d="M5 5.5v13l8.5-6.5z" fill="#fff" stroke="' + C + '" stroke-width="2.2" stroke-linejoin="round"/><path d="M17.5 5.5v13" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/>',
    hediye: '<rect class="d" x="3.5" y="9" width="17" height="11.5" rx="2" fill="#ff7a2f" stroke="' + C + '" stroke-width="2.3"/><rect x="2.6" y="6.4" width="18.8" height="4.4" rx="1.6" fill="#ffe066" stroke="' + C + '" stroke-width="2.3"/><path d="M12 6.6v13.8" stroke="' + C + '" stroke-width="2.3"/><path d="M12 6.4c-1.6-3.6-5.6-3.4-5 0M12 6.4c1.6-3.6 5.6-3.4 5 0" fill="none" stroke="' + C + '" stroke-width="2.1" stroke-linecap="round"/>'
  };
  // v0.94 (İstişare 7 Faz 1): üç madalyanın kendine özgü ikonları; üst panelde, sonuç kartında ve bölüm sayfasında aynı
  // ateşböceği: kanatlı küçük böcek, kuyruğu yanar · atış (Kusursuz): kanca · akış: art arda tutulan iki halka ve hız çizgileri
  P.atesbocegi = '<circle cx="14.6" cy="14.6" r="7.4" fill="#ffe066" opacity=".3"/><path d="M5.6 6.2L3.4 3.6M7.6 5L6.8 1.9" stroke="' + C + '" stroke-width="1.6" stroke-linecap="round"/>' +
    '<ellipse cx="5.8" cy="11.6" rx="4" ry="2.3" transform="rotate(-25 5.8 11.6)" fill="#d9f0ff" stroke="' + C + '" stroke-width="1.6"/><ellipse cx="11.6" cy="5.8" rx="2.3" ry="4" transform="rotate(-65 11.6 5.8)" fill="#d9f0ff" stroke="' + C + '" stroke-width="1.6"/>' +
    '<ellipse cx="9.2" cy="9.2" rx="3" ry="4.4" transform="rotate(-45 9.2 9.2)" fill="#4b3f6e" stroke="' + C + '" stroke-width="1.8"/><circle class="d" cx="14.4" cy="14.4" r="4.2" fill="#ffe066" stroke="' + C + '" stroke-width="2"/>';
  P.kanca = '<circle cx="15.5" cy="3.6" r="2.2" fill="none" stroke="' + C + '" stroke-width="2"/><path d="M15.5 5.8v8.7a5 5 0 1 1-10 0l-1.6 2.4" fill="none" stroke="' + C + '" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path class="d" d="M15.5 5.8v8.7a5 5 0 1 1-10 0l-1.6 2.4" fill="none" stroke="#e4e9ec" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
  P.akis = '<path d="M1.6 7.2h4M1 11h3M1.6 14.8h2.4" stroke="#ff7a2f" stroke-width="2" stroke-linecap="round"/><circle cx="10.4" cy="13" r="5.2" fill="none" stroke="' + C + '" stroke-width="4.8"/><circle cx="16.6" cy="9.4" r="5.2" fill="none" stroke="' + C + '" stroke-width="4.8"/>' +
    '<circle class="d" cx="10.4" cy="13" r="5.2" fill="none" stroke="#ff7a2f" stroke-width="2.4"/><circle class="d" cx="16.6" cy="9.4" r="5.2" fill="none" stroke="#ffa24f" stroke-width="2.4"/>';
  // Günlük ve Haftalık rozetleri: yükseklik (ok ve çentikler), çarpan (çift ok)
  P.metre = '<path d="M12 21V4M6.5 9.5L12 4l5.5 5.5" fill="none" stroke="' + C + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path class="d" d="M12 21V4M6.5 9.5L12 4l5.5 5.5" fill="none" stroke="#7fe58e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
  P.hiz = '<path d="M5 12.5L12 6l7 6.5M5 19l7-6.5 7 6.5" fill="none" stroke="' + C + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path class="d" d="M5 12.5L12 6l7 6.5M5 19l7-6.5 7 6.5" fill="none" stroke="#5ec8ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
  function svg(ad, cls) {
    return '<svg class="ik ik-' + ad + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[ad] || '') + '</svg>';
  }
  function yildizlar(n, cls) {
    var h = '';
    for (var i = 0; i < 3; i++) h += svg('yildiz', i < n ? 'dolu' : 'bos');
    return '<span class="ik-yildizlar' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + h + '</span>';
  }
  window.KuyuIkon = { svg: svg, yildizlar: yildizlar };
  // Sayfadaki data-ik="ad" öğelerine ikon başa eklenir (düğme yazısı korunur)
  if (typeof document !== 'undefined') document.querySelectorAll('[data-ik]').forEach(function (el) { el.insertAdjacentHTML('afterbegin', svg(el.getAttribute('data-ik'))); });
})();
