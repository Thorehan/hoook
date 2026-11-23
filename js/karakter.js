/* Hoook — karakter ve takı çizimi (İstişare 4 Aşama 2, v0.76). Tarayıcıda window.KuyuKarakter.
   Bütün karakterler aynı boyutta ve aynı fizikle oynar; yalnız görünüş. Tek büyük göz Çıra'nın imzası, hepsinde ortak.
   Katmanlar: 'arka' (pelerin, kanat) → 'govde' (oyunda esneme dönüşüyle çizilir) → 'ust' (atkı, göz, yüz takısı, baş takısı).
   Ölçüler r (gövde yarıçapı) cinsinden; oyunda r = CFG.R (11), menüde daha büyük.
   L: ekonomi.gorunum() çıktısı { karakter, govde, govde2, ozgun, atki, atkiSekil, bas, yuz, ... }.
   Çıra'nın gövdesi oyundaki korCiz ile çizilir (kur({ korCiz, renk }) ile verilir). */
(function (root) {
  'use strict';
  var KONTUR = '#1a0f2e';
  var dis = { korCiz: null, renk: function (c) { return c; } };
  function kur(o) { if (o.korCiz) dis.korCiz = o.korCiz; if (o.renk) dis.renk = o.renk; }

  // "Özgün" renk (Renk yuvasında Turuncu/Özgün seçiliyken) her karakterin kendi rengi: [ana, koyu]
  var OZGUN = {
    cira: ['#f26a3a', '#b8401b'], kibrit: ['#e2392f', '#8f1d2a'], mum: ['#f6efe2', '#d9c7a6'], komur: ['#ff6a2a', '#b8401b'],
    bocek: ['#fff36a', '#e0a800'], ruh: ['#8fe3ff', '#3a9fd0'], volkan: ['#ff5a2a', '#a8300f'], yildiz: ['#ffd23f', '#e09a00'], anka: ['#ffb03f', '#ff5a2a']
  };
  // gözün yeri (r cinsinden, gövde merkezine göre), baş takısının oturduğu yükseklik, atkının yüksekliği
  var GOZ = { cira: -0.18, kibrit: -0.3, mum: -0.05, komur: -0.1, bocek: -0.3, ruh: -0.2, volkan: 0.05, yildiz: -0.02, anka: -0.25 };
  var BAS = { cira: -0.82, kibrit: -0.98, mum: -0.62, komur: -0.9, bocek: -0.88, ruh: -0.98, volkan: -0.72, yildiz: -0.95, anka: -0.82 };
  var ATKI = { cira: 0.18, kibrit: 0.5, mum: 0.42, komur: 0.3, bocek: 0.2, ruh: 0.3, volkan: 0.35, yildiz: 0.3, anka: 0.35 };

  function hex(h) { var m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return [242, 106, 58]; var n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function karis(a, b, k) { return [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * k); }); }
  function rgb(a, al) { return al == null ? 'rgb(' + a.join(',') + ')' : 'rgba(' + a.join(',') + ',' + al + ')'; }
  function renkler(L, kim) {
    var o = OZGUN[kim] || OZGUN.cira;
    if (L.ozgun || !L.govde || L.govde === 'gokkusagi') return { ana: o[0], koyu: o[1] };
    return { ana: L.govde, koyu: L.govde2 || rgb(karis(hex(L.govde), [20, 10, 30], 0.4)) };
  }
  function cizgi(c, r) { c.lineWidth = Math.max(1, r * 0.11); c.strokeStyle = KONTUR; c.lineJoin = 'round'; c.lineCap = 'round'; }
  function bob(kim, t, r) { return kim === 'ruh' ? Math.sin(t * 3) * r * 0.08 : 0; }
  function alevUcu(c, x, y, r, t, olcek) {
    var h = r * olcek * (1 + 0.15 * Math.sin(t * 8)), w = r * olcek * 0.42, sw = Math.sin(t * 5.3) * r * 0.08;
    c.fillStyle = '#ffb03f'; c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x - w * 0.5 + sw, y - h * 0.7, x + sw * 1.5, y - h); c.quadraticCurveTo(x + w * 0.5 + sw, y - h * 0.6, x + w, y); c.closePath(); c.fill();
    c.fillStyle = '#fff0b0'; c.beginPath(); c.moveTo(x - w * 0.45, y); c.quadraticCurveTo(x + sw, y - h * 0.5, x + sw, y - h * 0.62); c.quadraticCurveTo(x + w * 0.3, y - h * 0.3, x + w * 0.45, y); c.closePath(); c.fill();
  }
  function hale(c, x, y, r, renk, al) {
    var g = c.createRadialGradient(x, y, r * 0.5, x, y, r * 2.2);
    g.addColorStop(0, rgb(hex(renk), al)); g.addColorStop(1, rgb(hex(renk), 0));
    c.fillStyle = g; c.fillRect(x - r * 2.3, y - r * 2.3, r * 4.6, r * 4.6);
  }

  // ---------- gövdeler ----------
  var KOMUR_N = [0.95, 1.0, 0.88, 1.02, 0.92, 0.98, 0.86, 1.0];
  var GOVDE = {
    cira: function (c, x, y, r, t, R) { if (dis.korCiz) dis.korCiz(c, x, y, r, t, R.ana, R.koyu); else { c.fillStyle = R.ana; c.beginPath(); c.arc(x, y, r, 0, 6.29); c.fill(); } },
    kibrit: function (c, x, y, r, t, R) {
      hale(c, x, y - r * 0.4, r * 0.8, '#ffb03f', 0.22);
      alevUcu(c, x, y - r * 0.92, r, t, 0.8);
      cizgi(c, r); c.fillStyle = '#e8c48a';
      c.beginPath(); c.rect(x - r * 0.22, y + r * 0.25, r * 0.44, r * 1.1); c.fill(); c.stroke();
      c.fillStyle = R.ana; c.beginPath(); c.arc(x, y - r * 0.25, r * 0.78, 0, 6.29); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.arc(x - r * 0.25, y - r * 0.5, r * 0.22, 0, 6.29); c.fill();
    },
    mum: function (c, x, y, r, t, R) {
      hale(c, x, y - r * 1.1, r * 0.7, '#ffb03f', 0.25);
      cizgi(c, r); c.strokeStyle = KONTUR; c.beginPath(); c.moveTo(x, y - r * 0.62); c.lineTo(x, y - r * 0.85); c.stroke();
      alevUcu(c, x, y - r * 0.82, r, t, 0.9);
      var w = r * 0.72, ust = y - r * 0.62, alt = y + r * 0.98;
      cizgi(c, r); c.fillStyle = R.ana;
      c.beginPath(); c.moveTo(x - w, ust + r * 0.1); c.lineTo(x - w, alt - r * 0.15); c.quadraticCurveTo(x - w, alt, x - w + r * 0.15, alt); c.lineTo(x + w - r * 0.15, alt); c.quadraticCurveTo(x + w, alt, x + w, alt - r * 0.15); c.lineTo(x + w, ust + r * 0.1);
      c.quadraticCurveTo(x, ust - r * 0.12, x - w, ust + r * 0.1); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = R.koyu; // akan mum damlaları
      [[-0.45, 0.45], [0.1, 0.3], [0.48, 0.55]].forEach(function (d) { c.beginPath(); c.ellipse(x + d[0] * r, ust + d[1] * r, r * 0.12, r * 0.22, 0, 0, 6.29); c.fill(); });
    },
    komur: function (c, x, y, r, t, R) {
      var nb = 0.7 + 0.3 * Math.sin(t * 2.5);
      hale(c, x, y, r, R.ana, 0.18 * nb);
      cizgi(c, r); c.fillStyle = '#2e2624';
      c.beginPath(); KOMUR_N.forEach(function (k, i) { var a = i / 8 * 6.283 + 0.2, px = x + Math.cos(a) * r * k, py = y + Math.sin(a) * r * k; if (i) c.lineTo(px, py); else c.moveTo(px, py); }); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = rgb(hex(R.ana), 0.6 + 0.4 * nb); c.lineWidth = r * 0.12;
      [[[-0.6, 0.2], [-0.25, 0.45], [0.05, 0.3]], [[0.3, 0.6], [0.5, 0.3], [0.75, 0.25]], [[-0.4, -0.6], [-0.15, -0.45]]].forEach(function (l) { c.beginPath(); l.forEach(function (q, i) { if (i) c.lineTo(x + q[0] * r, y + q[1] * r); else c.moveTo(x + q[0] * r, y + q[1] * r); }); c.stroke(); });
    },
    bocek: function (c, x, y, r, t, R) {
      var cirp = 0.55 + 0.45 * Math.abs(Math.sin(t * 16));
      cizgi(c, r); c.fillStyle = 'rgba(210,240,255,.75)';
      [-1, 1].forEach(function (s) { c.save(); c.translate(x + s * r * 0.55, y - r * 0.55); c.rotate(s * 0.55); c.scale(1, cirp); c.beginPath(); c.ellipse(0, 0, r * 0.62, r * 0.36, 0, 0, 6.29); c.fill(); c.stroke(); c.restore(); });
      hale(c, x, y + r * 0.55, r * 0.7, R.ana, 0.35);
      cizgi(c, r); var g = c.createRadialGradient(x, y + r * 0.5, r * 0.1, x, y + r * 0.55, r * 0.7);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, R.ana); g.addColorStop(1, R.koyu);
      c.fillStyle = g; c.beginPath(); c.ellipse(x, y + r * 0.55, r * 0.62, r * 0.55, 0, 0, 6.29); c.fill(); c.stroke();
      c.fillStyle = '#3a2f78'; c.beginPath(); c.arc(x, y - r * 0.25, r * 0.7, 0, 6.29); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(x - r * 0.3, y - r * 0.85); c.lineTo(x - r * 0.5, y - r * 1.25); c.moveTo(x + r * 0.3, y - r * 0.85); c.lineTo(x + r * 0.5, y - r * 1.25); c.stroke();
      c.fillStyle = R.ana; [-0.5, 0.5].forEach(function (s) { c.beginPath(); c.arc(x + s * r, y - r * 1.27, r * 0.14, 0, 6.29); c.fill(); });
    },
    ruh: function (c, x, y, r, t, R) {
      y += bob('ruh', t, r);
      hale(c, x, y, r, R.ana, 0.3);
      cizgi(c, r); var g = c.createRadialGradient(x, y - r * 0.25, r * 0.1, x, y, r * 1.1);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, R.ana); g.addColorStop(1, R.koyu);
      c.fillStyle = g; c.globalAlpha *= 0.92;
      c.beginPath(); c.arc(x, y - r * 0.15, r * 0.85, Math.PI, 0);
      var alt = y + r * 0.85, n = 3;
      c.lineTo(x + r * 0.85, alt);
      for (var i = n; i > 0; i--) { var x1 = x + r * 0.85 - (n - i + 0.5) * (1.7 * r / n), x2 = x + r * 0.85 - (n - i + 1) * (1.7 * r / n); c.quadraticCurveTo(x1, alt - r * (0.35 + 0.1 * Math.sin(t * 4 + i)), x2, alt); }
      c.closePath(); c.fill(); c.globalAlpha /= 0.92; c.stroke();
    },
    volkan: function (c, x, y, r, t, R) {
      hale(c, x, y - r * 0.6, r * 0.8, R.ana, 0.3);
      cizgi(c, r); c.fillStyle = '#4a3a33';
      c.beginPath(); c.moveTo(x - r * 1.0, y + r * 0.85); c.quadraticCurveTo(x - r * 0.95, y - r * 0.3, x - r * 0.45, y - r * 0.62); c.lineTo(x + r * 0.45, y - r * 0.62); c.quadraticCurveTo(x + r * 0.95, y - r * 0.3, x + r * 1.0, y + r * 0.85); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = R.ana; // lav taç ve akıntılar
      c.beginPath(); c.moveTo(x - r * 0.5, y - r * 0.58); c.quadraticCurveTo(x - r * 0.25, y - r * 0.95 - 0.06 * r * Math.sin(t * 5), x, y - r * 0.7); c.quadraticCurveTo(x + r * 0.25, y - r * 0.98, x + r * 0.5, y - r * 0.58); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(x - r * 0.35, y - r * 0.6); c.quadraticCurveTo(x - r * 0.42, y - r * 0.1, x - r * 0.28, y + r * 0.05); c.quadraticCurveTo(x - r * 0.18, y - r * 0.2, x - r * 0.1, y - r * 0.6); c.fill();
      for (var k = 0; k < 2; k++) { var ph = (t * 0.9 + k * 0.5) % 1; c.fillStyle = rgb(hex(R.ana), 1 - ph); c.beginPath(); c.arc(x + (k ? 0.2 : -0.15) * r, y - r * (0.9 + ph * 0.6), r * 0.09 * (1 - ph * 0.5), 0, 6.29); c.fill(); }
    },
    yildiz: function (c, x, y, r, t, R) {
      hale(c, x, y, r, R.ana, 0.32);
      cizgi(c, r); c.fillStyle = R.ana;
      c.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.52 : r * 1.12; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.98); } c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.arc(x - r * 0.25, y - r * 0.3, r * 0.18, 0, 6.29); c.fill();
      var p = (t * 1.3) % 1; c.fillStyle = 'rgba(255,255,255,' + (1 - p) + ')'; c.beginPath(); c.arc(x + r * (0.9 + p * 0.4), y - r * (0.9 + p * 0.3), r * 0.1, 0, 6.29); c.fill();
    },
    anka: function (c, x, y, r, t, R) {
      hale(c, x, y, r, R.koyu, 0.25);
      var cirp = Math.sin(t * 9) * 0.25;
      cizgi(c, r); c.fillStyle = R.koyu;
      [-1, 1].forEach(function (s) { c.save(); c.translate(x + s * r * 0.8, y + r * 0.05); c.rotate(s * (0.3 + cirp)); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(s * r * 0.75, -r * 0.55, s * r * 0.55, r * 0.35); c.closePath(); c.fill(); c.stroke(); c.restore(); });
      [-0.3, 0, 0.3].forEach(function (d, i) { c.beginPath(); c.moveTo(x + d * r - r * 0.12, y - r * 0.8); c.quadraticCurveTo(x + d * r * 1.6, y - r * (1.35 + (i === 1 ? 0.2 : 0)), x + d * r + r * 0.12, y - r * 0.82); c.closePath(); c.fill(); c.stroke(); });
      c.fillStyle = R.ana; c.beginPath(); c.arc(x, y, r * 0.9, 0, 6.29); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,240,200,.6)'; c.beginPath(); c.ellipse(x, y + r * 0.4, r * 0.5, r * 0.35, 0, 0, 6.29); c.fill();
      cizgi(c, r); c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(x - r * 0.16, y + r * 0.12); c.lineTo(x + r * 0.16, y + r * 0.12); c.lineTo(x, y + r * 0.36); c.closePath(); c.fill(); c.stroke();
    }
  };

  // ---------- takılar ----------
  var BAS_CIZ = {
    bere: function (c, x, y, r) { cizgi(c, r); c.fillStyle = '#ff3b4e'; c.beginPath(); c.moveTo(x - r * 0.62, y); c.quadraticCurveTo(x - r * 0.6, y - r * 0.75, x, y - r * 0.78); c.quadraticCurveTo(x + r * 0.6, y - r * 0.75, x + r * 0.62, y); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#fff'; c.beginPath(); c.rect(x - r * 0.68, y - r * 0.12, r * 1.36, r * 0.24); c.fill(); c.stroke(); c.beginPath(); c.arc(x, y - r * 0.82, r * 0.17, 0, 6.29); c.fill(); c.stroke(); },
    kask: function (c, x, y, r, t) { cizgi(c, r); c.fillStyle = '#ffc233'; c.beginPath(); c.arc(x, y, r * 0.66, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.rect(x - r * 0.8, y - r * 0.06, r * 1.6, r * 0.16); c.fill(); c.stroke();
      var g = c.createRadialGradient(x, y - r * 0.38, 1, x, y - r * 0.38, r * 0.8); g.addColorStop(0, 'rgba(255,250,200,.55)'); g.addColorStop(1, 'rgba(255,250,200,0)'); c.fillStyle = g; c.fillRect(x - r, y - r * 1.2, r * 2, r * 1.6);
      c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(x, y - r * 0.38, r * 0.18, 0, 6.29); c.fill(); c.stroke(); },
    silindir: function (c, x, y, r) { cizgi(c, r); c.fillStyle = '#26203a'; c.beginPath(); c.ellipse(x, y, r * 0.78, r * 0.16, 0, 0, 6.29); c.fill(); c.stroke();
      c.beginPath(); c.rect(x - r * 0.45, y - r * 0.95, r * 0.9, r * 0.92); c.fill(); c.stroke(); c.fillStyle = '#e2392f'; c.fillRect(x - r * 0.45, y - r * 0.32, r * 0.9, r * 0.18); },
    tac: function (c, x, y, r) { cizgi(c, r); c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(x - r * 0.6, y + r * 0.05); c.lineTo(x - r * 0.65, y - r * 0.55); c.lineTo(x - r * 0.3, y - r * 0.25); c.lineTo(x, y - r * 0.7); c.lineTo(x + r * 0.3, y - r * 0.25); c.lineTo(x + r * 0.65, y - r * 0.55); c.lineTo(x + r * 0.6, y + r * 0.05); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#35d0e8'; c.beginPath(); c.arc(x, y - r * 0.18, r * 0.12, 0, 6.29); c.fill(); }
  };
  var YUZ_CIZ = {
    gozluk: function (c, x, y, r) { cizgi(c, r); c.beginPath(); c.moveTo(x - r * 0.95, y - r * 0.1); c.lineTo(x - r * 0.45, y); c.moveTo(x + r * 0.95, y - r * 0.1); c.lineTo(x + r * 0.45, y); c.stroke();
      c.fillStyle = '#1a0f2e'; c.beginPath(); c.arc(x, y, r * 0.5, 0, 6.29); c.fill(); c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(x - r * 0.18, y - r * 0.18, r * 0.14, r * 0.08, -0.6, 0, 6.29); c.fill(); },
    biyik: function (c, x, y, r) { cizgi(c, r); c.fillStyle = '#5a3a24'; var yy = y + r * 0.5;
      [-1, 1].forEach(function (s) { c.beginPath(); c.moveTo(x, yy); c.quadraticCurveTo(x + s * r * 0.35, yy - r * 0.2, x + s * r * 0.62, yy - r * 0.05); c.quadraticCurveTo(x + s * r * 0.4, yy + r * 0.16, x, yy + r * 0.08); c.closePath(); c.fill(); c.stroke(); }); },
    maske: function (c, x, y, r) { cizgi(c, r); c.fillStyle = '#e2392f'; c.beginPath(); c.rect(x - r * 0.95, y - r * 0.24, r * 1.9, r * 0.48); c.arc(x, y, r * 0.44, 0, 6.29, true); c.fill('evenodd'); c.beginPath(); c.rect(x - r * 0.95, y - r * 0.24, r * 1.9, r * 0.48); c.stroke(); },
    monokl: function (c, x, y, r) { c.lineWidth = Math.max(1, r * 0.1); c.strokeStyle = '#ffc233'; c.beginPath(); c.arc(x, y, r * 0.47, 0, 6.29); c.stroke();
      c.lineWidth = Math.max(1, r * 0.05); c.beginPath(); c.moveTo(x + r * 0.45, y + r * 0.15); c.quadraticCurveTo(x + r * 0.7, y + r * 0.6, x + r * 0.5, y + r * 0.95); c.stroke(); }
  };
  function sirtArka(c, sekil, x, y, r, t, renk) {
    if (sekil === 'pelerin') {
      var sal = Math.sin(t * 3) * r * 0.08;
      cizgi(c, r); c.fillStyle = renk;
      c.beginPath(); c.moveTo(x - r * 0.55, y + r * 0.05); c.lineTo(x + r * 0.55, y + r * 0.05); c.lineTo(x + r * 1.0 + sal, y + r * 1.25);
      c.quadraticCurveTo(x + r * 0.5, y + r * 1.05, x, y + r * 1.3); c.quadraticCurveTo(x - r * 0.5, y + r * 1.05, x - r * 1.0 + sal, y + r * 1.25); c.closePath(); c.fill(); c.stroke();
    } else if (sekil === 'kanat') {
      var cp = Math.sin(t * 6) * 0.18;
      cizgi(c, r); c.fillStyle = renk;
      [-1, 1].forEach(function (s) { c.save(); c.translate(x + s * r * 0.5, y - r * 0.1); c.rotate(s * (-0.35 + cp));
        c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(s * r * 0.6, -r * 1.0, s * r * 1.35, -r * 0.7); c.quadraticCurveTo(s * r * 1.05, -r * 0.35, s * r * 1.25, -r * 0.15);
        c.quadraticCurveTo(s * r * 0.9, r * 0.05, s * r * 1.05, r * 0.3); c.quadraticCurveTo(s * r * 0.5, r * 0.35, 0, r * 0.2); c.closePath(); c.fill(); c.stroke(); c.restore(); });
    }
  }

  // ---------- birleşik çizim ----------
  // bak: { x, y } (gözün baktığı yön, -1..1); s: { kirp: göz kırpma }
  function ciz(c, x, y, r, t, L, bak, katman, s) {
    L = L || {}; s = s || {};
    var kim = GOVDE[L.karakter] ? L.karakter : 'cira', R = renkler(L, kim), hepsi = !katman;
    var by = bob(kim, t, r);
    if (hepsi || katman === 'arka') if (L.atkiSekil === 'pelerin' || L.atkiSekil === 'kanat') sirtArka(c, L.atkiSekil, x, y + by, r, t, dis.renk(L.atki, t * 1000));
    if (hepsi || katman === 'govde') GOVDE[kim](c, x, y, r, t, R);
    if (!(hepsi || katman === 'ust')) return;
    y += by;
    if (!L.atkiSekil || L.atkiSekil === 'atki') { c.fillStyle = dis.renk(L.atki, t * 1000) || '#2fb3a6'; c.fillRect(x - r * 0.73, y + ATKI[kim] * r, r * 1.45, r * 0.36); }
    var bx = bak ? bak.x : 0, byk = bak ? bak.y : -1, gy = y + GOZ[kim] * r;
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x + bx * r * 0.27, gy + byk * r * 0.18, r * 0.4, 0, 6.29); c.fill();
    if (r > 14) { c.lineWidth = r * 0.06; c.strokeStyle = KONTUR; c.stroke(); }
    c.fillStyle = '#1a1210'; c.beginPath(); c.arc(x + bx * r * 0.45, gy + byk * r * 0.31, r * 0.18, 0, 6.29); c.fill();
    if (s.kirp) { c.fillStyle = R.koyu; c.fillRect(x + bx * r * 0.27 - r * 0.45, gy - r * 0.46 + byk * r * 0.18, r * 0.9, r * 0.45); }
    if (L.yuz && YUZ_CIZ[L.yuz]) YUZ_CIZ[L.yuz](c, x + bx * r * 0.2, gy + byk * r * 0.12, r);
    if (L.bas && BAS_CIZ[L.bas]) BAS_CIZ[L.bas](c, x, y + BAS[kim] * r, r, t);
  }

  var api = { kur: kur, ciz: ciz, OZGUN: OZGUN, KARAKTERLER: Object.keys(GOVDE), BASLAR: Object.keys(BAS_CIZ), YUZLER: Object.keys(YUZ_CIZ) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KuyuKarakter = api;
})(typeof window !== 'undefined' ? window : this);
