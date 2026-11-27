/* Kuyu — kanca fiziği ve kurallar (çizimden bağımsız). Tarayıcıda window.KuyuEngine, Node'da module.exports.

   Dünya: genişlik 360 birim, y aşağı doğru artar. Bölüm modunda taban y = H, kova üstte.
   Sonsuz modda (def.endless) kuyu yukarı doğru def.extend(sim) ile üretilir, y eksiye gider.

   Kural: kanca hafif şeyi (kutu) sana çeker, ağır şeye (halka, ahşap) seni çeker.
   Taş kancayı tutmaz. Diken öldürür. Su aşağıdan yükselir.

   Denge: Asılı kalmak bedava değil.
   - Tutunma gücü: ipin ucunda asılıyken (tam sarılmış) süre sayar; def.grip saniyeyi geçince el kayar.
   - Akış: ip tam sarılmadan bırakıp (fırlayıp) havadayken sıradaki noktaya tutunursan akış sayacı artar.
     Uzun asılı kalmak, yere basmak ya da havada çok kalmak akışı bozar.
*/
(function (root) {
  'use strict';

  var CFG = {
    W: 360, WALL: 16,
    G: 1500,            // yerçekimi (birim/s²)
    R: 11,              // oyuncu yarıçapı
    HOOK_SPEED: 2600,   // kanca uçuş hızı
    HOOK_BACK: 3400,    // geri sarılma hızı
    HOOK_MAX: 300,      // menzil
    REEL: 760,          // ip sarma hızı
    MIN_LEN: 24,        // asılı kalınca ip boyu
    BOX_R: 13,
    BOX_ZEMIN: 0.85,    // yerdeki kutunun yatay hızı her adım bu oranla söner
    RING_R: 10,
    DT: 1 / 120,
    MAXV: 1150,
    GRIP: 2.2,          // varsayılan tutunma süresi (s); seviye def.grip ile değiştirir
    EARLY: 0.25,        // bu süreden kısa asılıp bırakmak "fırlama" sayılır
    COMBO_HANG: 0.45,   // bundan uzun asılı kalmak akışı bozar
    COMBO_AIR: 1.1,     // havada bundan uzun tutunmadan kalmak akışı bozar
    KOR_SN: 1.5,        // kor halka (v0.69): tutunduktan bu kadar sonra söner ve seni bırakır (yayı görüp davranan yavaş oyuncu geçer; hiç tepki vermeyen takılır)
    KOR_SOGUK: 1.0,
    CARK_R: 50,         // döner çark (v0.70): halkaların merkeze uzaklığı (birim)
    CARK_T: 4.5,        // bir tam tur (sn); yön çarkın yerinden (deterministik)
    CARK_N: 3,          // çarktaki halka sayısı
    AKINTI_A: 3200,     // akıntı sütunu (v0.71): akış sürerken (x2+) içindeyken yukarı ivme (yerçekimini yener; birim/s²)
    AKINTI_V: 600,      // ...en çok bu hızla yükseltir (birim/sn)
    AKINTI_W: 80,       // sütun genişliği (birim)
    CARK_ITIS: 300,     // halka yükselirken bırakınca ek yukarı itiş (en çok; halkanın yükselme payıyla orantılı)     // sönen kor halka bu kadar süre tutulamaz (kanca geçer, nişan saymaz), sonra yeniden kızarır
    UP_RISE: 60,        // nişan: bundan az yükselen hedef "yanda" sayılır (3 m)
    UP_ANGLE: 45,       // nişan: bundan düz açıdaki hedef "yanda" sayılır (derece)
    NEAR_V: 40,         // yatayda bu kadar yakın (tam tepedeki) hedef iki taraftan da alınır
    GATE_W: 56,         // rüzgâr şeridi: merkezden sağa-sola bu kadar (toplam 112 birim genişlik)
    YAY_V: 820,         // yay halkası: ulaşınca okun yönüne bu hızla fırlatır (birim/sn)
    YAY_FLOAT: 1.0,     // fırlatmanın tepesinde bu kadar süzülürsün (yavaş oyuncuya dokunma zamanı)
    YAY_FALL: 70,       // süzülürken en çok bu hızla alçalırsın (birim/sn)
    GECIT_LEN: 80,      // geçit: girişe bu kadar yaklaşınca çıkışa taşınırsın (akışla erken basan da girer)
    SARKAC_L: 100,      // sarkaç halka: zincir boyu (birim)
    SARKAC_AMP: 33,     // en büyük açı (derece): halka ±55 birim sallanır
    SARKAC_T: 2.6,      // bir tam salınım (sn)
    BOOST: 650,         // hız halkasından bırakınca eklenen yukarı hız (birim/sn)
    WATER_GRACE: 1.0,   // ilk halkaya tutunduktan bu kadar sonra su yükselmeye başlar
    RESCUE_MAX: 1000,   // kurtarma kancası: menzilde hedef yokken en yakın yukarıdaki hedefe bu kadar uzağa atılır
    SPEED_BASE: 200,    // hız çarpanı bu serbest uçuş hızından sonra başlar
    SPEED_TOP: 1150,    // bu hızda çarpan en yüksek (x1,5)
    TAM_PENCERE: 70,    // tam zamanında bırakma: ip halkaya bu kadar kala (≈0,09 sn) bırakılırsa
    TAM_SARIM: 80,      // ...ve o tutunuşta ip en az bu kadar sarıldıysa (yakın halkada kendiliğinden olmasın)
    TAM_PTS: 10,        // sonsuz mod: tam zamanında bırakma puanı (bölüm ödülünü değiştirmez)
    AKIS_PENCERE: 130,  // akış zamanlama ister: ip halkaya bundan uzaktayken (sarılırken) bırakmak akış sayılmaz
    BEKLE_VY: 150,      // nişan beklemesi: bundan hızlı yükselirken...
    BEKLE_EK: 110,      // ...yukarı hedef menzilin en çok bu kadar ötesindeyse kanca hemen aşağıya atılmaz
    BEKLE_SN: 0.35,     // en çok bu kadar beklenir; hedef menzile girmezse aşağıdakine atılır
    GEC_VY: 450,        // geç basma payı yalnız düşüş bu hızı geçmeden (tepe noktasının ~0,3 sn ardı)
    GEC_EK: 70,         // geç basma payı (v0.57): havada yukarı hedef menzilin bu kadar ötesindeyse ve kanca aksi hâlde geriye/boşa
                        // gidecekse kanca ona uzanır (tepe noktasını geçip düşmeye başlayan insan oyuncu geriye atılmasın)
    USTALIK_TAM: 0.05,  // çarpanın ustalık payı: her TAM bırakış...
    USTALIK_MAX: 0.5,   // ...en çok bu kadar (hız payıyla birlikte en çok x2,00)
    ZINCIR_N: 3,        // ateşböceği zinciri: sıralı bu kadar ateşböceği...
    ZINCIR_BONUS: 3,    // ...hepsi akış sürerken alınırsa bu kadar ateşböceği (tek tek alınanlar sayılmaz)
    GUC_FENER: 8,       // güçlendirme (Sonsuz/Günlük, İstişare 2): fener bu kadar saniye ateşböceklerini çeker...
    GUC_FENER_R: 150,   // ...bu yarıçaptan (zincir ve fırlatma yolu ateşböcekleri hariç: onlar beceri ister)
    GUC_KANAT: 3,       // kanat: bu kadar saniye otomatik yükseliş...
    GUC_KANAT_V: 460,   // ...bu hızla (birim/sn); kanca atılmaz, sonunda yukarı hızla serbest kalırsın
    TAM_ITIS: 200,      // tam zamanında bırakış ek yukarı itiş verir (birim/sn)
    TAM_SERI_ITIS: 150, // art arda her 3. tam bırakışta bunun kadar daha
    ALEV_ESIK: [2, 4, 7],        // alevlenme: akış sürerken bu kadar TAM bırakış yapınca Çıra alevlenir (1, 2, 3); akış bitince söner
    ALEV_ITIS: [150, 250, 350],  // alevliyken erken bırakış (fırlama) bu kadar ek yukarı itiş verir
    // (kanca uçuşu ve ip sarma hızı aynı kalır; hız halkası gibi yalnızca bırakış anında itiş: karar 2026-11-11)
    COMBO_PTS: 3,       // sonsuz mod: akışlı her tutunma min(akış, COMBO_CAP) × bu kadar puan
    COMBO_CAP: 12
  };

  // Sarkaç halka: (x, y) salınımın en alt noktası, pim onun SARKAC_L üstünde. Faz konumdan türetilir (deterministik).
  function makeSwing(o) {
    o.sw = { px: o.x, py: o.y - CFG.SARKAC_L, ph: ((o.x * 7 + o.y * 13) % 628) / 100 };
    swingAt(o, 0);
    return o;
  }
  function swingAt(o, t) {
    var th = CFG.SARKAC_AMP * Math.PI / 180 * Math.sin(2 * Math.PI * t / CFG.SARKAC_T + o.sw.ph);
    o.x = o.sw.px + CFG.SARKAC_L * Math.sin(th);
    o.y = o.sw.py + CFG.SARKAC_L * Math.cos(th);
  }

  // Döner çark (v0.70): (cx, cy) merkezli, CARK_R yarıçaplı çemberde dönen halkalar. Açı zamandan (deterministik).
  function makeCark(o, cx, cy, k, yon) {
    o.cark = { cx: cx, cy: cy, a0: k * 2 * Math.PI / CFG.CARK_N + ((cx * 3 + cy * 5) % 628) / 100, w: (yon < 0 ? -1 : 1) * 2 * Math.PI / CFG.CARK_T };
    carkAt(o, 0);
    return o;
  }
  function carkAt(o, t) {
    var a = o.cark.a0 + o.cark.w * t;
    o.x = o.cark.cx + CFG.CARK_R * Math.cos(a);
    o.y = o.cark.cy + CFG.CARK_R * Math.sin(a);
  }
  // halkanın o anki dikey hızı (birim/sn; eksi = yükseliyor)
  function carkVy(o, t) { return CFG.CARK_R * o.cark.w * Math.cos(o.cark.a0 + o.cark.w * t); }

  function rect(a) { return { x: a[0], y: a[1], w: a[2], h: a[3], type: a[4], dir: a[5] || 'u' }; }

  function p0(s, x, y) { s.p.x = s.p.px = x; s.p.y = s.p.py = y; s.startY = s.topY = y; }
  function createSim(def) {
    var H = def.H || 0;
    var rects = [
      { x: -60, y: -1e7, w: 60 + CFG.WALL, h: 2e7, type: 's', wall: true },
      { x: CFG.W - CFG.WALL, y: -1e7, w: 60 + CFG.WALL, h: 2e7, type: 's', wall: true }
    ].concat((def.rects || []).map(rect));
    var sx = def.start[0], sy = def.start[1];
    var s = {
      def: def, H: H, endless: !!def.endless, rects: rects, t: 0, status: 'play',
      p: { x: sx, y: sy, px: sx, py: sy },
      pressed: false, hook: null, rope: null, lastAnchor: null,
      rings: (def.rings || []).map(function (r) {
        var o = { x: r[0], y: r[1], ff: r[2] === 'ff', hiz: r[2] === 'hiz', kapi: r[2] === 'kapi', firlat: r[2] === 'firlat' };
        if (r[2] === 'ff' && r[3] === 'dal') o.dal = true; // fırlatma yolunun ateşböceği: yalnız akışla alınır
        if (r[2] === 'yay') o.yay = r[3] || 0; // okun dikeyden açısı (derece, eksi sol)
        if (r[2] === 'gecit') o.gecitId = r[3];  // geçit girişi; çıkışı aynı numaralı 'cikis'
        if (r[2] === 'cikis') o.cikisId = r[3];
        if (r[2] === 'sarkac') { o.sarkac = true; makeSwing(o); }
        if (r[2] === 'fener') o.fener = true; // Hikâye kontrol noktası (v0.57)
        if (r[2] === 'kor') o.kor = true; // kor halka (v0.69): 1,5 sn sonra söner ve bırakır
        if (r[2] === 'cark') makeCark(o, r[0], r[1], r[3] || 0, r[4] || 1); // döner çark halkası (v0.70): [merkez x, merkez y, 'cark', sıra, yön]
        return o;
      }),
      goal: def.goal ? { x: def.goal[0], y: def.goal[1] } : null,
      boxes: (def.boxes || []).map(function (b) { return { x: b[0], y: b[1], px: b[0], py: b[1] }; }),
      buttons: (def.buttons || []).map(function (b) { return { x: b[0], y: b[1], w: b[2], h: 8, pressed: false }; }),
      fireflies: [],
      gatesOpen: false,
      water: def.water || def.waterSpeed || def.suTakip ? (def.endless ? sy + (def.waterStart || 300) : H + 80) : null,
      // El kayması yalnızca Sonsuz Kuyu'da: bölümlerde asılı kalınabilir (akış yine bozulur).
      grip: def.endless ? (def.grip || CFG.GRIP) : Infinity,
      events: [],
      grounded: false,
      // akış ve skor
      hang: 0, air: 0, chain: false, combo: 0, maxCombo: 0, hooks: 0, shots: 0, slips: 0,
      startY: sy, topY: sy, bonus: 0, fireflyPts: 0, maxSpeed: 0, rescues: 0, misses: 0, boosts: 0, gates: 0, springs: 0, float: 0, portals: 0, swings: 0, ffGot: 0, tam: 0, tamSeri: 0, halkaUsta: 0, alev: 0, alevPuan: 0, itisler: 0,
      akintilar: (def.akintilar || []).map(function (a) { return { x: a[0], y: a[1], w: a[2], h: a[3] }; }), // akıntı sütunları (v0.71): sol, üst, genişlik, boy
      gucler: (def.gucler || []).map(function (g) { return { x: g[0], y: g[1], tur: g[2], got: false }; }), guc: { fener: 0, kanat: 0, kalkan: false }, gucSay: 0
    };
    // Bölümlerde asılı başlangıç (v0.83, Törehan 24/11): bölüm kuyunun ortasından bir kesit; Çıra başlangıcın üstündeki
    // bir halkada asılı başlar. Sonsuz modlar (Günlük, Haftalık) dipten, zeminden başlar: su hep dipten yükselir.
    // Halka listenin sonuna eklenir (üretici rastgele sayı çekmez; eski bölüm ve tohumlar aynı kalır).
    if (def.asiliBasla && !def.endless) {
      // Geçici çengel: Çıra başka bir yere tutununca düşüp kaybolur; ilk atıştan sonra bölüm eskisiyle aynıdır
      var bh = { x: sx, y: sy - def.asiliBasla, basHalka: true };
      s.rings.push(bh); s.basHalka = bh;
      s.rope = { kind: 'anchor', x: bh.x, y: bh.y, len: CFG.MIN_LEN, target: 'ring', ref: bh };
      p0(s, bh.x, bh.y + CFG.MIN_LEN);
    }
    // geçit çiftlerini bağla
    s.rings.forEach(function (g) {
      if (g.gecitId == null) return;
      for (var k = 0; k < s.rings.length; k++) if (s.rings[k].cikisId === g.gecitId) { g.gecit = s.rings[k]; s.rings[k].cikis = true; }
    });
    // Ateşböcekleri halkaların içinde: o halkaya tutunmak ya da içinden geçmek yeter.
    s.rings.forEach(function (rg) { if (rg.ff) s.fireflies.push({ x: rg.x, y: rg.y, got: false, ring: rg }); });
    (def.fireflies || []).forEach(function (f) { s.fireflies.push({ x: f[0], y: f[1], got: false, zincir: f[2], sira: f[3] }); });
    if (def.extend) def.extend(s);
    return s;
  }

  // ---------- geometri ----------
  function solid(s, r) {
    if (r.type === 'g') return !s.gatesOpen;
    return r.type === 's' || r.type === 'w';
  }

  function segRect(x0, y0, x1, y1, r) {
    var dx = x1 - x0, dy = y1 - y0, tmin = 0, tmax = 1;
    var axes = [[dx, x0, r.x, r.x + r.w], [dy, y0, r.y, r.y + r.h]];
    for (var i = 0; i < 2; i++) {
      var d = axes[i][0], o = axes[i][1], lo = axes[i][2], hi = axes[i][3];
      if (Math.abs(d) < 1e-9) { if (o < lo || o > hi) return null; continue; }
      var t1 = (lo - o) / d, t2 = (hi - o) / d;
      if (t1 > t2) { var tmp = t1; t1 = t2; t2 = tmp; }
      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) return null;
    }
    return { t: tmin };
  }

  function segCircle(x0, y0, x1, y1, cx, cy, r) {
    var dx = x1 - x0, dy = y1 - y0, fx = x0 - cx, fy = y0 - cy;
    var a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - r * r;
    if (c <= 0) return null; // başlangıç zaten içinde: bu nesneyi yok say
    var disc = b * b - 4 * a * c;
    if (disc < 0 || a < 1e-9) return null;
    var t = (-b - Math.sqrt(disc)) / (2 * a);
    return t >= 0 && t <= 1 ? t : null;
  }

  // Kanca ucunun bu adımda neye çarptığı. ignore: az önce tutunulan halka ya da ahşap.
  // Atış anında Çıra'nın değdiği (içinden geçtiği) halkalar: kanca onlara takılmaz, nişan da onları engel saymaz.
  // Değdiğin halkaya tutunmanın anlamı yok; aday listesi de 18 birimden yakın hedefleri zaten almaz.
  // Sönmüş kor halka (v0.69): soğuma süresince yokmuş gibi (kanca içinden geçer, nişan aday saymaz)
  // Aynı çarkın halkaları (v0.70): asılı olduğun ya da az önce bıraktığın çarkın diğer halkaları seninle döner; kanca onlara takılmaz
  function kardes(a, b) { return !!(a && b && a !== b && a.cark && b.cark && a.cark.cx === b.cark.cx && a.cark.cy === b.cark.cy); }
  function soguk(s, rg) { return !!(rg.kor && rg.korSon != null && s.t - rg.korSon < CFG.KOR_SOGUK); }
  function yakinHalkalar(s) {
    var out = [], lim = CFG.R + CFG.RING_R + 5;
    for (var i = 0; i < s.rings.length; i++) { var rg = s.rings[i]; if (!rg.kapi && dist(s.p.x, s.p.y, rg.x, rg.y) < lim) out.push(rg); }
    return out;
  }
  function hookRay(s, x0, y0, x1, y1, ignore, yakin) {
    var best = null, i;
    var minY = Math.min(y0, y1) - 40, maxY = Math.max(y0, y1) + 40;
    function consider(tt, hit) { if (tt != null && (!best || tt < best.t)) { hit.t = tt; best = hit; } }
    for (i = 0; i < s.rings.length; i++) {
      var rg = s.rings[i];
      if (rg === ignore || kardes(rg, ignore) || rg.kapi || soguk(s, rg) || rg.y < minY || rg.y > maxY || (yakin && yakin.indexOf(rg) >= 0)) continue;
      consider(segCircle(x0, y0, x1, y1, rg.x, rg.y, CFG.RING_R + (rg.sw ? 12 : 2)), { kind: 'ring', ring: rg });
    }
    if (s.goal) consider(segCircle(x0, y0, x1, y1, s.goal.x, s.goal.y, 16), { kind: 'goal' });
    for (i = 0; i < s.boxes.length; i++) consider(segCircle(x0, y0, x1, y1, s.boxes[i].x, s.boxes[i].y, CFG.BOX_R + 2), { kind: 'box', box: s.boxes[i] });
    for (i = 0; i < s.rects.length; i++) {
      var r = s.rects[i];
      if ((r.type === 'g' && s.gatesOpen) || r === ignore) continue;
      if (r.y > maxY || r.y + r.h < minY) continue;
      var h = segRect(x0, y0, x1, y1, r);
      if (h) consider(h.t, { kind: r.type === 'w' ? 'wood' : 'stone', rect: r });
    }
    if (best) { best.x = x0 + (x1 - x0) * best.t; best.y = y0 + (y1 - y0) * best.t; }
    return best;
  }

  // Daire ile dikdörtgen çakışmasını çöz. Döner: normal (ya da null).
  function collideCircle(b, r, R, friction) {
    var cx = Math.max(r.x, Math.min(b.x, r.x + r.w)), cy = Math.max(r.y, Math.min(b.y, r.y + r.h));
    var dx = b.x - cx, dy = b.y - cy, d2 = dx * dx + dy * dy;
    if (d2 >= R * R) return null;
    var d = Math.sqrt(d2), nx, ny;
    if (d < 1e-6) {
      var l = b.x - r.x, rr = r.x + r.w - b.x, t = b.y - r.y, bb = r.y + r.h - b.y, m = Math.min(l, rr, t, bb);
      if (m === t) { nx = 0; ny = -1; d = -t; } else if (m === bb) { nx = 0; ny = 1; d = -bb; }
      else if (m === l) { nx = -1; ny = 0; d = -l; } else { nx = 1; ny = 0; d = -rr; }
    } else { nx = dx / d; ny = dy / d; }
    b.x += nx * (R - d); b.y += ny * (R - d);
    var vx = b.x - b.px, vy = b.y - b.py, vn = vx * nx + vy * ny;
    if (vn < 0) {
      vx -= nx * vn; vy -= ny * vn;
      var f = ny < -0.5 ? friction : 0.985;
      vx *= f; vy *= f;
      b.px = b.x - vx; b.py = b.y - vy;
    }
    return { nx: nx, ny: ny };
  }

  function overlapsRect(b, r, R) {
    var cx = Math.max(r.x, Math.min(b.x, r.x + r.w)), cy = Math.max(r.y, Math.min(b.y, r.y + r.h));
    var dx = b.x - cx, dy = b.y - cy;
    return dx * dx + dy * dy < R * R;
  }

  function integrate(b, dt) {
    var vx = (b.x - b.px) * 0.9995, vy = (b.y - b.py) * 0.9995;
    var max = CFG.MAXV * dt, sp = Math.sqrt(vx * vx + vy * vy);
    if (sp > max) { vx *= max / sp; vy *= max / sp; }
    b.px = b.x; b.py = b.y;
    b.x += vx; b.y += vy + CFG.G * dt * dt;
  }

  // ---------- akış ----------
  function breakCombo(s, why) {
    if (s.combo >= 2) s.events.push({ type: 'comboBreak', combo: s.combo, why: why });
    s.combo = 0; s.chain = false; s.alevPuan = 0;
    alevGuncelle(s);
  }
  // Alevlenme basamağı akış içindeki TAM bırakış sayısından gelir (kör ritim değil zamanlama); değişince olay yazılır
  function alevGuncelle(s) {
    var a = 0, E = CFG.ALEV_ESIK;
    for (var i = 0; i < E.length; i++) if (s.alevPuan >= E[i]) a = i + 1;
    if (a !== s.alev) { s.events.push({ type: 'alev', seviye: a, onceki: s.alev }); s.alev = a; }
  }

  // Halka ustalığı (v0.90; Muhammed'in isteği, Törehan onayı 25/11): özel halkayı işine yarayacak biçimde kullanmak (hız halkasından bırakış, çark itişi,
  // yay fırlatması, akışla kordan ayrılma, akıntıda süzülme) ustalık payına TAM bırakış gibi katılır (ortak tavan USTALIK_MAX).
  // Fizik, nişan ve hızlar aynı; yalnız ödül çarpanı ve geri bildirim. def.halkaUstalik === false olan kuyularda sayılmaz
  // (yeni günden/haftadan önceki Günlük ve Haftalık tohumları eski puanla kalır).
  function halkaUstalik(s, tur, x, y) {
    s.halkaUsta = (s.halkaUsta || 0) + 1;
    s.events.push({ type: 'halkaUsta', tur: tur, x: x, y: y, n: s.halkaUsta });
  }
  // İpi bırak (parmak kalktı, yeni atış ya da el kaydı).
  function detach(s, why) {
    var rp = s.rope;
    if (!rp) return;
    if (rp.kind === 'anchor') {
      // Tam zamanında bırakma: ip halkaya varmadan hemen önce bırakılırsa küçük ödül (yalnızca geri bildirim + puan; fizik aynı)
      var tamOldu = false, itis = 0;
      if ((why === 'release' || why === 'repress') && rp.len0 != null && rp.len > CFG.MIN_LEN + 0.5 && rp.len <= CFG.MIN_LEN + CFG.TAM_PENCERE && rp.len0 - rp.len >= CFG.TAM_SARIM) {
        tamOldu = true; s.tam++; s.tamSeri++; s.bonus += CFG.TAM_PTS; s.alevPuan++;
        itis += CFG.TAM_ITIS;
        if (s.tamSeri % 3 === 0) itis += CFG.TAM_SERI_ITIS;
        s.events.push({ type: 'tam', x: s.p.x, y: s.p.y, seri: s.tamSeri });
      } else if (why !== 'repress') s.tamSeri = 0;
      s.sonTam = tamOldu;
      // boş atışla (yanlış taraf) bırakılan halka yok sayılmaz: hızlı davranan aynı halkayı yeniden yakalar
      if (why !== 'bos') { s.lastAnchor = rp; s.lastAnchorT = s.t; }
      s.chain = s.hang < CFG.EARLY && why !== 'slip';
      // Çok erken bırakış: ip daha halkaya varmadan, uzaktayken bırakmak akış sayılmaz (kör ritim akış kuramasın)
      if (s.chain && (why === 'release' || why === 'repress') && rp.len0 != null && rp.len > CFG.MIN_LEN + CFG.AKIS_PENCERE) {
        s.chain = false;
        s.events.push({ type: 'erken', x: s.p.x, y: s.p.y });
      }
      // Alevliyken erken bırakış (fırlama) ek yukarı itiş verir; asılı kalıp bırakan almaz
      if (s.chain && s.alev > 0) itis += CFG.ALEV_ITIS[s.alev - 1];
      // kor halka: sönmeden, akışla ayrılmak ustalıktır
      if (rp.korBas != null && s.chain && (why === 'release' || why === 'repress')) halkaUstalik(s, 'kor', rp.x, rp.y);
      // Döner çark (v0.70): halka yükselirken bırakırsan çarkın hızı seni fırlatır (doğru an: halka en hızlı yükselirken)
      if (rp.ref && rp.ref.cark && (why === 'release' || why === 'repress')) {
        var cpay = -carkVy(rp.ref, s.t) / (CFG.CARK_R * Math.abs(rp.ref.cark.w));
        if (cpay > 0.15) { var ci = Math.round(CFG.CARK_ITIS * cpay); itis += ci; s.carkItis = (s.carkItis || 0) + 1; s.events.push({ type: 'carkItis', x: s.p.x, y: s.p.y, guc: ci }); halkaUstalik(s, 'cark', s.p.x, s.p.y); }
      }
      if (itis > 0) {
        s.p.py += itis * CFG.DT; s.itisler++;
        s.events.push({ type: 'itis', x: s.p.x, y: s.p.y, guc: itis, alev: s.alev, tam: tamOldu });
      }
      s.air = 0;
      // Hız halkası: bırakınca yukarı fırlatır (el kayması hariç)
      if (rp.ref && rp.ref.hiz && why !== 'slip') {
        s.p.py += CFG.BOOST * CFG.DT;
        s.boosts++;
        s.events.push({ type: 'boost', x: s.p.x, y: s.p.y });
        halkaUstalik(s, 'hiz', s.p.x, s.p.y);
      }
    }
    s.events.push({ type: why === 'slip' ? 'slip' : 'release', box: rp.kind === 'box', chain: s.chain });
    s.rope = null;
    s.hang = 0;
  }

  function onAttach(s, x, y, what) {
    s.hooks++;
    // bölme suyu fener bekliyorsa (def.suFener > 0) "su başladı" olayı fener yanınca verilir (suAcik)
    if (s.waterFrom == null) { s.waterFrom = s.t; if (s.water != null && !(s.def.suFener > 0)) s.events.push({ type: 'waterStart' }); }
    if (!(s.chain && s.combo > 0)) s.alevPuan = 0; // zincir koptuysa alev sayacı da sıfırlanır
    s.combo = s.chain && s.combo > 0 ? s.combo + 1 : 1;
    s.chain = false;
    s.hang = 0;
    if (s.combo > s.maxCombo) s.maxCombo = s.combo;
    if (s.combo >= 2) {
      s.bonus += Math.min(s.combo, CFG.COMBO_CAP) * CFG.COMBO_PTS;
      s.events.push({ type: 'combo', combo: s.combo, x: x, y: y });
    }
    alevGuncelle(s);
    // TAM kova: kovaya akış sürerken ve son bırakış TAM iken tutunmak
    if (what === 'goal' && s.combo >= 2 && s.sonTam) { s.tamKova = true; s.events.push({ type: 'tamKova', x: x, y: y }); }
    s.events.push({ type: 'attach', x: x, y: y, what: what });
  }

  // ---------- tek el nişan yardımı ----------
  // Telefonda oyuncu hedefe dokunmaz: başparmağın ekranın neresine bastığı yalnızca yönü seçer.
  //   f = dokunuşun ekran genişliğindeki yeri (0 sol kenar, 1 sağ kenar)
  //   sol taraf sol yukarı, orta düz yukarı, sağ taraf sağ yukarı.
  // O yönde menzilde ve görüşte olan tutunma noktaları (halka, kova, ahşap, kutu) arasından en uygunu seçilir.
  // Dokunuş bir hedefin hemen üstündeyse (tablet, fare) doğrudan o hedef alınır.
  function currentIgnore(s) {
    if (s.rope && s.rope.kind === 'anchor') return s.rope.ref;
    if (s.lastAnchor) {
      var dl = dist(s.p.x, s.p.y, s.lastAnchor.x, s.lastAnchor.y);
      if (dl < 48 || (s.t - s.lastAnchorT < 0.45 && dl < 110)) return s.lastAnchor.ref;
    }
    return null;
  }

  function candidates(s, range) {
    var p = s.p, R = (range || CFG.HOOK_MAX) - 4, out = [], i;
    function add(x, y, kind, ref) { var d = dist(p.x, p.y, x, y); if (d <= R && d > 18) out.push({ x: x, y: y, kind: kind, ref: ref, d: d }); }
    var tutulan = s.rope && s.rope.kind === 'anchor' ? s.rope.ref : null;
    for (i = 0; i < s.rings.length; i++) { var rg = s.rings[i]; if (!rg.kapi && !soguk(s, rg) && !kardes(rg, tutulan) && Math.abs(rg.y - p.y) <= R) add(rg.x, rg.y, 'ring', rg); }
    if (s.goal) add(s.goal.x, s.goal.y, 'goal', 'goal');
    for (i = 0; i < s.boxes.length; i++) add(s.boxes[i].x, s.boxes[i].y, 'box', s.boxes[i]);
    for (i = 0; i < s.rects.length; i++) {
      var r = s.rects[i];
      if (r.type !== 'w' || r.y > p.y + R || r.y + r.h < p.y - R) continue;
      // ahşabın oyuncuya bakan yüzünde, menzile giren en yüksek nokta (en çok yükseklik kazandıran)
      var px = Math.max(r.x, Math.min(p.x, r.x + r.w));
      var hx = Math.abs(px - p.x);
      if (hx >= R) continue;
      var reachUp = Math.sqrt(R * R - hx * hx) * 0.96;
      var py = Math.max(r.y + 6, p.y - reachUp);
      if (py > r.y + r.h - 4) continue;
      add(px, py, 'wood', r);
    }
    return out;
  }

  // Bu noktaya atılan kanca gerçekten oraya mı takılır?
  function reachable(s, c, ignore) {
    var p = s.p, dx = c.x - p.x, dy = c.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
    var hit = hookRay(s, p.x, p.y, p.x + dx / d * (d + 6), p.y + dy / d * (d + 6), ignore, yakinHalkalar(s));
    if (!hit) return false;
    if (c.kind === 'goal') return hit.kind === 'goal';
    return (hit.ring || hit.rect || hit.box) === c.ref;
  }

  // Yukarıdaki c'ye atılan kancanın önce çarptığı şey; bu tarafta ve dik yukarıdaysa (yukarı koşulu) hedef olarak döner.
  function engel(s, c, ignore, side, refX, refY, slope) {
    var p = s.p, dx = c.x - p.x, dy = c.y - p.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
    var ex = p.x + dx / d * (d + 6), ey = p.y + dy / d * (d + 6);
    var hit = hookRay(s, p.x, p.y, ex, ey, ignore, yakinHalkalar(s));
    if (!hit) return null;
    var ref = hit.ring || hit.rect, kind = hit.ring ? 'ring' : hit.rect && hit.rect.type === 'w' ? 'wood' : null;
    if (!ref || !kind || ref === ignore || (hit.ring && hit.ring.kapi)) return null;
    var hx = hit.ring ? hit.ring.x : p.x + (ex - p.x) * hit.t, hy = hit.ring ? hit.ring.y : p.y + (ey - p.y) * hit.t;
    var hdx = hx - p.x, sideOk = side < 0 ? hdx <= CFG.NEAR_V : hdx >= -CFG.NEAR_V;
    var rise = refY - hy;
    if (!sideOk || rise < CFG.UP_RISE || rise < Math.abs(hx - refX) * slope) return null; // yalnızca dik yukarıdaki
    return { x: hx, y: hy, kind: kind, ref: ref };
  }

  // Nişan (tek el): önce bu taraftaki dik yukarı hedef, sonra yandaki sığ hedef, en son aşağıdaki.
  // Yükselirken yukarı hedef menzilin hemen ötesindeyse (bekleme koşulu): sonuç "bekle" taşır; oyun kancayı kısa süre
  // (BEKLE_SN) tutar, hedef menzile girince ona atar. Koşul bozulursa (süre biter, düşmeye başlarsın) aşağıdakine atar.
  function aim(s, f, tapX, tapY) {
    var r = aimTemel(s, f, tapX, tapY);
    if (r.rescue || !(r.tier === 2 || r.miss)) return r; // yalnızca aşağıdaki hedef ya da boş atış yerine beklenir (yan halka geçerli)
    var p = s.p, vy = (p.y - p.py) / CFG.DT;
    if (s.rope && s.rope.kind === 'anchor') return r;
    var side = f < 0.5 ? -1 : 1, ignore = currentIgnore(s), yakin = yakinHalkalar(s), en = null;
    if (vy > -CFG.BEKLE_VY) { var u0 = gecHedef(s, side, ignore, yakin); return u0 || r; }
    var list = candidates(s, CFG.HOOK_MAX + CFG.BEKLE_EK);
    // bekleme sonunda (ya da tepe noktasında) varılacak yer: yukarı hedef oradan menzile girecekse beklenir
    var vx = (p.x - p.px) / CFG.DT, tb = Math.min(CFG.BEKLE_SN, -vy / CFG.G);
    var bx = p.x + vx * tb, by = p.y + vy * tb + 0.5 * CFG.G * tb * tb;
    for (var i = 0; i < list.length; i++) {
      var c = list[i], dx = c.x - p.x;
      if (c.ref === ignore || c.d <= CFG.HOOK_MAX - 4) continue;                 // menzildeki zaten değerlendirildi
      if (!(side < 0 ? dx <= CFG.NEAR_V : dx >= -CFG.NEAR_V)) continue;
      if (p.y - c.y < CFG.UP_RISE) continue;                                   // yalnızca yukarıdaki
      var d = c.d, hit = hookRay(s, p.x, p.y, p.x + dx / d * (d + 6), p.y + (c.y - p.y) / d * (d + 6), ignore, yakin);
      if (!hit || (hit.ring || hit.rect || hit.box || (hit.kind === 'goal' ? 'goal' : null)) !== c.ref) continue;
      if (dist(bx, by, c.x, c.y) > CFG.HOOK_MAX - 16) continue;                // beklerken menzile girmeyecekse beklenmez
      if (!en || c.d < en.d) en = c;
    }
    if (en) r.bekle = { x: en.x, y: en.y, kind: en.kind, ref: en.ref };
    else { var u1 = gecHedef(s, side, ignore, yakin); if (u1) return u1; }
    return r;
  }
  // Geç basma payı: bu taraftaki dik yukarı hedef menzilin GEC_EK kadar ötesinde ve kanca hattı açıksa ona uzanılır
  function gecHedef(s, side, ignore, yakin) {
    // yalnız az önce bıraktığın halkanın hâlâ üstündeyken: daha aşağı düştüysen yakındaki halka kurtarır (uzun ipin sarkacı suya indirmesin)
    if (!s.lastAnchor || s.p.y >= s.lastAnchor.y + 30) return null;
    if ((s.p.y - s.p.py) / CFG.DT > CFG.GEC_VY) return null; // yalnız tepe noktasının hemen ardında (düşüş hızlanmadan)
    var p = s.p, list = candidates(s, CFG.HOOK_MAX + CFG.GEC_EK), en = null, slope = Math.tan(CFG.UP_ANGLE * Math.PI / 180);
    for (var i = 0; i < list.length; i++) {
      var c = list[i], dx = c.x - p.x, rise = p.y - c.y;
      if (c.ref === ignore || c.d <= CFG.HOOK_MAX - 4 || c.kind === 'box') continue;
      if (!(side < 0 ? dx <= CFG.NEAR_V : dx >= -CFG.NEAR_V)) continue;
      if (rise < CFG.UP_RISE || rise < Math.abs(dx) * slope) continue;           // yalnızca dik yukarıdaki
      var d = c.d, hit = hookRay(s, p.x, p.y, p.x + dx / d * (d + 6), p.y + (c.y - p.y) / d * (d + 6), ignore, yakin);
      if (!hit || (hit.ring || hit.rect || hit.box || (hit.kind === 'goal' ? 'goal' : null)) !== c.ref) continue;
      if (!en || c.d < en.d) en = c;
    }
    return en ? { x: en.x, y: en.y, kind: en.kind, ref: en.ref, tier: 0, assisted: true, gec: true } : null;
  }

  function aimTemel(s, f, tapX, tapY) {
    var p = s.p, ignore = currentIgnore(s), list = candidates(s), i, c;
    // hassas dokunuş: hedefin üstüne basıldıysa onu al
    if (tapX != null) {
      var near = null;
      for (i = 0; i < list.length; i++) {
        c = list[i];
        if (c.ref === ignore) continue;
        var dt = dist(tapX, tapY, c.x, c.y);
        if (dt < 40 && (!near || dt < near.dt) && reachable(s, c, ignore)) near = { c: c, dt: dt };
      }
      if (near) return { x: near.c.x, y: near.c.y, kind: near.c.kind, assisted: true };
    }
    // Ekran ikiye bölünür: sol yarı sol, sağ yarı sağ. Taraf seçimi oyuncunun kararıdır.
    var side = f < 0.5 ? -1 : 1;
    var th = (side < 0 ? -120 : -60) * Math.PI / 180;
    var dirX = Math.cos(th), dirY = Math.sin(th);
    // "Yukarı" asılı olduğun noktaya göre ölçülür: aynı yükseklikteki yan halka yukarı sayılmaz.
    var refY = s.rope && s.rope.kind === 'anchor' ? s.rope.y : p.y;
    var holding = s.rope && s.rope.kind === 'anchor';
    var refX = holding ? s.rope.x : p.x, slope = Math.tan(CFG.UP_ANGLE * Math.PI / 180);
    // Yukarıdakiler ikiye ayrılır: dik (gerçekten yukarı) ve sığ (neredeyse aynı hizada, yanda).
    // Yandaki yakın hedef, aynı taraftaki daha yukarıdaki hedefin önüne geçmesin.
    var upSide = [], flatSide = [], downSide = [], anyReach = false;
    for (i = 0; i < list.length; i++) {
      c = list[i];
      if (c.ref === ignore) continue;
      var dx = c.x - p.x;
      // yalnızca bastığın taraf; tam tepedeki hedef (±NEAR_V) iki taraftan da alınır
      var sideOk = side < 0 ? dx <= CFG.NEAR_V : dx >= -CFG.NEAR_V;
      // tam tepedeki hedef ikinci sırada: o tarafta başka hedef varsa işaret onu gösterir (iki seçenek ayrışır)
      c.strict = side < 0 ? dx < -CFG.NEAR_V : dx > CFG.NEAR_V;
      var rise = refY - c.y, up = rise > 30;
      var flat = up && (rise < CFG.UP_RISE || rise < Math.abs(c.x - refX) * slope);
      if (sideOk) (flat ? flatSide : up ? upSide : downSide).push(c);
      else if (!anyReach && (up || !holding) && reachable(s, c, ignore)) anyReach = true;
    }
    // Öncelik: bu taraftaki en yakın dik yukarı hedef, sonra yandaki sığ hedef; tutunmuyorsan en son aşağıdaki.
    // Tutunurken aşağıya hiç atılmaz.
    // Kutu çekmek oyuncuyu aşağı indirmez: asılıyken alttaki kutu da seçilir (en son kademe; tek elle kutu bulmacası, v0.60)
    var tiers = holding ? [upSide, flatSide, downSide.filter(function (cc) { return cc.kind === 'box'; })] : [upSide, flatSide, downSide];
    for (var tI = 0; tI < tiers.length; tI++) {
      var tier = tiers[tI].sort(function (u, v) { return (u.strict === v.strict) ? u.d - v.d : (u.strict ? -1 : 1); });
      for (i = 0; i < tier.length; i++) {
        if (reachable(s, tier[i], ignore)) return { x: tier[i].x, y: tier[i].y, kind: tier[i].kind, ref: tier[i].ref, tier: tI, assisted: true };
      }
      // Yukarıdaki hedefin hattını başka bir halka/ahşap kesiyorsa ve o da bu tarafta, dik yukarıdaysa onu al:
      // kanca o yöne atılınca zaten ona takılır. Yukarı koşulu sağlanmazsa sıradaki kademeye (yan, sonra aşağı) geçilir.
      if (tI === 0) {
        for (i = 0; i < tier.length; i++) {
          var e = engel(s, tier[i], ignore, side, refX, refY, slope);
          if (e) return { x: e.x, y: e.y, kind: e.kind, ref: e.ref, tier: 0, assisted: true };
        }
      }
    }
    var missAt = { x: p.x + dirX * CFG.HOOK_MAX, y: p.y + dirY * CFG.HOOK_MAX, kind: 'none', miss: true, assisted: false };
    // Bu tarafta hedef yok. Diğer tarafta varsa ya da tutunuyorsan: kanca bu yöne boşa gider, ip bırakılmaz.
    if (holding || anyReach) return missAt;
    // İki tarafta da menzilde hiç hedef yok (dipte tıkanma): kurtarma kancası en yakın yukarıdaki hedefe uzanır.
    if (s.def.kurtarmaYok) return missAt; // Sonsuz: düşüş gerçek (İstişare 2); bölümlerde kurtarma kancası kalır
    var far = candidates(s, CFG.RESCUE_MAX).filter(function (cc) { return cc.ref !== ignore && cc.y < p.y - 12; })
      .sort(function (u, v) { return u.d - v.d; });
    for (i = 0; i < far.length; i++) {
      if (reachable(s, far[i], ignore)) return { x: far[i].x, y: far[i].y, kind: far[i].kind, ref: far[i].ref, rescue: true, assisted: true };
    }
    return missAt;
  }

  // ---------- girdi ----------
  function press(s, tx, ty, opts) {
    if (s.status !== 'play') return;
    if (s.guc && s.guc.kanat > 0) return; // kanatla uçarken kanca atılmaz
    s.pressed = true;
    // Tutunduğun ya da az önce bıraktığın noktaya yeni atış takılmasın (zincirlerken ipin yolu üstünde kalır).
    var ignore = currentIgnore(s);
    var keep = !!(opts && opts.keep), havada = !(s.rope && s.rope.kind === 'anchor');
    // Boş atış (bu tarafta hedef yok): kanca gidip döner, tutunduğun ip bırakılmaz.
    if (s.rope && !keep) detach(s, 'repress');
    var dx = tx - s.p.x, dy = ty - s.p.y, d = Math.sqrt(dx * dx + dy * dy);
    if (d < 4) { dx = 0; dy = -1; d = 1; }
    var rescue = !!(opts && opts.rescue);
    // Boş atışın bedeli: kanca geri dönene kadar yeni atış yok, akış biter (yanlış tarafa basmak bedava olmasın)
    if (kilitli(s)) {
      // Giriş tamponu (v0.58): kilitliyken basılan dokunuşun tarafı saklanır; kilit bitince parmak hâlâ basılıysa kanca o yana atılır
      s.tampon = { f: tx < s.p.x ? 0.25 : 0.75, t: s.t };
      s.events.push({ type: 'kilit' }); return;
    }
    s.tampon = null;
    if (keep && !rescue) {
      s.tamSeri = 0; breakCombo(s, 'boş atış');
      // Sonsuz (İstişare 2): yanlış taraf ipi bırakır; düşüş gerçek. Bölümlerde ip kalır (öğretici).
      if (s.def.bosBirak && s.rope) { detach(s, 'bos'); s.chain = false; }
      if (s.def.bosKilit) s.kilitSon = s.t + s.def.bosKilit; // Sonsuz: boş atıştan sonra kısa kilit (spam düşüşü birikir)
    }
    s.hook = { x: s.p.x, y: s.p.y, ox: s.p.x, oy: s.p.y, dx: dx / d, dy: dy / d, state: 'fly', ignore: ignore,
      max: rescue ? CFG.RESCUE_MAX : (havada && !keep && d > CFG.HOOK_MAX - 4 && ty < s.p.y - CFG.UP_RISE ? Math.min(d + 12, CFG.HOOK_MAX + CFG.GEC_EK) : CFG.HOOK_MAX), rescue: rescue, keep: keep, yakin: yakinHalkalar(s) };
    s.shots++;
    if (keep) s.misses++;
    if (rescue) { s.rescues++; if (s.combo > 0) breakCombo(s, 'kurtarma'); }
    s.events.push({ type: rescue ? 'rescue' : keep ? 'missShot' : 'fire' });
  }

  function kilitli(s) { return !!((s.hook && s.hook.keep) || (s.kilitSon && s.t < s.kilitSon)); }
  // Tampondaki dokunuşu at: parmak kalktıysa silinir; yukarı hedef birazdan menzile girecekse (nişan beklemesi) kısa süre beklenir
  function tamponAt(s) {
    var tp = s.tampon;
    if (!s.pressed || s.status !== 'play') { s.tampon = null; return; }
    if (kilitli(s)) { tp.acik = s.t; return; }
    var a = aim(s, tp.f), vy = (s.p.y - s.p.py) / CFG.DT;
    if (a.bekle && vy < 0 && s.t - (tp.acik || s.t) < CFG.BEKLE_SN) return;
    s.tampon = null;
    s.tamponla = (s.tamponla || 0) + 1;
    press(s, a.x, a.y, { keep: !!a.miss, rescue: !!a.rescue });
    s.events.push({ type: 'tampon' });
  }
  function release(s) {
    s.pressed = false; s.tampon = null;
    detach(s, 'release');
    if (s.hook && s.hook.state !== 'back') s.hook.state = 'back';
  }

  // ---------- adım ----------
  function step(s) {
    if (s.status !== 'play') return;
    var dt = CFG.DT, i, j, p = s.p;
    s.t += dt;
    if (s.endless && s.def.extend) s.def.extend(s);
    // sarkaç halkalar sallanır; tutunduğun sarkacın ipi de onunla gider
    for (i = 0; i < s.rings.length; i++) {
      var sg = s.rings[i];
      if (sg.carkKur && !sg.cark) { // Sonsuz/Günlük üreticisi çarkı işaretler (v0.70): halka merkez olur, üç halka kurulur
        var ccx = sg.x, ccy = sg.y;
        makeCark(sg, ccx, ccy, 0, sg.carkKur);
        for (var ck = 1; ck < CFG.CARK_N; ck++) s.rings.push(makeCark({ x: ccx, y: ccy, ff: false, hiz: false, kapi: false, firlat: false }, ccx, ccy, ck, sg.carkKur));
      }
      if (sg.sarkac && !sg.sw) makeSwing(sg);
      if (sg.sw) swingAt(sg, s.t);
      else if (sg.cark) carkAt(sg, s.t);
    }
    if (s.rope && s.rope.kind === 'anchor' && s.rope.ref && (s.rope.ref.sw || s.rope.ref.cark)) { s.rope.x = s.rope.ref.x; s.rope.y = s.rope.ref.y; }

    if (s.tampon) tamponAt(s);
    // kanca uçuşu
    var hk = s.hook;
    if (hk && hk.state === 'fly') {
      var hs = hk.rescue ? CFG.HOOK_SPEED * 2 : CFG.HOOK_SPEED;
      var nx = hk.x + hk.dx * hs * dt, ny = hk.y + hk.dy * hs * dt;
      // Sarkaç kancanın üstüne kayarsa kanca onun içinde kalır; çizgi testi içeriden başlayanı saymaz, burada yakala.
      var hit = null;
      for (i = 0; i < s.rings.length && !hit; i++) {
        var sgr = s.rings[i];
        if ((sgr.sw || sgr.cark) && sgr !== hk.ignore && !kardes(sgr, hk.ignore) && dist(hk.x, hk.y, sgr.x, sgr.y) < CFG.RING_R + (sgr.sw ? 12 : 8)) hit = { kind: 'ring', ring: sgr, x: hk.x, y: hk.y };
      }
      if (!hit) hit = hookRay(s, hk.x, hk.y, nx, ny, hk.ignore, hk.yakin);
      if (hit) {
        if ((hit.kind === 'ring' || hit.kind === 'wood' || hit.kind === 'goal' || hit.kind === 'box') && s.rope) detach(s, 'repress');
        if (hit.kind === 'ring' || hit.kind === 'wood' || hit.kind === 'goal') {
          var ax = hit.kind === 'ring' ? hit.ring.x : hit.kind === 'goal' ? s.goal.x : hit.x;
          var ay = hit.kind === 'ring' ? hit.ring.y : hit.kind === 'goal' ? s.goal.y : hit.y;
          s.rope = { kind: 'anchor', x: ax, y: ay, len: dist(p.x, p.y, ax, ay), target: hit.kind, ref: hit.ring || hit.rect || null };
          s.rope.len0 = s.rope.len;
          if (hit.ring && hit.ring.kor) { s.rope.korBas = s.t; s.korSay = (s.korSay || 0) + 1; s.events.push({ type: 'kor', x: ax, y: ay }); }
          if (s.basHalka && hit.ring !== s.basHalka) { // başlangıç çengeli düşer (v0.83)
            var bi = s.rings.indexOf(s.basHalka); if (bi >= 0) s.rings.splice(bi, 1);
            s.events.push({ type: 'basDus', x: s.basHalka.x, y: s.basHalka.y }); s.basHalka = null;
          }
          s.hook = null;
          onAttach(s, ax, ay, hit.kind);
          if (hit.ring && hit.ring.sw) s.swings++;
          if (hit.ring && hit.ring.cark) s.carkSay = (s.carkSay || 0) + 1;
          if (hit.ring && hit.ring.ff) collectRing(s, hit.ring);
          if (hit.ring && hit.ring.fener) fenerYak(s, hit.ring);
          if (hit.kind === 'goal') { s.status = 'won'; s.events.push({ type: 'won' }); return; }
        } else if (hit.kind === 'box') {
          s.rope = { kind: 'box', box: hit.box, len: dist(p.x, p.y, hit.box.x, hit.box.y) };
          s.hook = null;
          s.events.push({ type: 'attach', x: hit.box.x, y: hit.box.y, what: 'box' });
        } else {
          hk.x = hit.x; hk.y = hit.y; hk.state = 'back';
          s.events.push({ type: 'clink', x: hit.x, y: hit.y });
        }
      } else {
        hk.x = nx; hk.y = ny;
        if (dist(hk.ox, hk.oy, hk.x, hk.y) >= (hk.max || CFG.HOOK_MAX)) { hk.state = 'back'; s.events.push({ type: 'miss' }); }
      }
    } else if (hk && hk.state === 'back') {
      var bx = p.x - hk.x, by = p.y - hk.y, bd = Math.sqrt(bx * bx + by * by), stepLen = CFG.HOOK_BACK * dt;
      if (bd <= stepLen) s.hook = null; else { hk.x += bx / bd * stepLen; hk.y += by / bd * stepLen; }
    }

    // oyuncu
    integrate(p, dt);
    // kanat: kancasız, sabit hızla yukarı; yatayda kuyunun ortasına doğru süzül
    if (s.guc && s.guc.kanat > 0) {
      s.guc.kanat -= dt;
      s.rope = null; s.hook = null;
      p.py = p.y + CFG.GUC_KANAT_V * dt;
      p.x += (CFG.W / 2 - p.x) * 1.5 * dt; p.px = p.x; // yatay hız yok, ortaya doğru süzül
      s.ilerlemeT = s.t;
      if (s.guc.kanat <= 0) { s.guc.kanat = 0; s.events.push({ type: 'gucBitti', tur: 'kanat' }); }
    }
    // Yay süzülmesi: fırlatmanın tepesinden sonra yavaşça alçalırsın (ipe ya da kancaya kadar)
    if (s.float > 0) {
      if (s.rope || s.hook) s.float = 0;
      else if (p.y - p.py >= 0) {
        s.float -= dt;
        if (p.y - p.py > CFG.YAY_FALL * dt) p.py = p.y - CFG.YAY_FALL * dt;
      }
    }
    // Akıntı sütunu (v0.71): akış sürerken (x2 ve üstü) ipsiz içinden geçen Çıra yukarı süzülür; akış yokken sütun sönüktür.
    // İçindeyken havada kalma süresi saymaz (akış kopmaz). Yolu kestirmek içindir; ip, kanca hızı ve nişan aynı.
    if (s.akintilar && s.akintilar.length) {
      var akIc = null;
      for (i = 0; i < s.akintilar.length; i++) { var ak = s.akintilar[i]; if (p.x > ak.x && p.x < ak.x + ak.w && p.y > ak.y && p.y < ak.y + ak.h) { akIc = ak; break; } }
      var akAcik = akIc && !s.rope && !s.hook && s.combo >= 2 && !(s.guc && s.guc.kanat > 0); // kanca atılınca akıntı bırakır
      if (akAcik) {
        var akVy = (p.y - p.py) / dt;
        if (akVy > -CFG.AKINTI_V) { var akDv = Math.min(CFG.AKINTI_A * dt, akVy + CFG.AKINTI_V); p.py += akDv * dt; }
        // yana hız söner, sütunun ortasına hafifçe çekilir (süzülürken sütundan savrulup çıkma)
        var akVx = (p.x - p.px) * (1 - 6 * dt) + ((ak.x + ak.w / 2) - p.x) * 8 * dt * dt;
        p.px = p.x - akVx;
        s.air = 0;
        if (s.akintiSon !== akIc) { s.akintiSon = akIc; s.akintiSay = (s.akintiSay || 0) + 1; s.events.push({ type: 'akinti', x: p.x, y: p.y }); halkaUstalik(s, 'akinti', p.x, p.y); }
      } else if (!akIc) s.akintiSon = null;
    }
    var rp = s.rope;
    if (rp && rp.kind === 'anchor') {
      rp.len = Math.max(CFG.MIN_LEN, rp.len - CFG.REEL * dt);
      var ddx = p.x - rp.x, ddy = p.y - rp.y, dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
      var atMin = rp.len <= CFG.MIN_LEN + 0.01;
      if (dd > rp.len || atMin) {
        p.x = rp.x + ddx / dd * rp.len; p.y = rp.y + ddy / dd * rp.len;
        if (atMin) {
          var vx = (p.x - p.px) * 0.97, vy = (p.y - p.py) * 0.97;
          p.px = p.x - vx; p.py = p.y - vy;
        }
      }
      // Kor halka: tutunduktan KOR_SN sonra söner ve ipi bırakır (asılı beklemek yerine sıradakine atıl)
      if (rp.korBas != null && s.t - rp.korBas >= CFG.KOR_SN) {
        rp.ref.korSon = s.t; s.korSondu = (s.korSondu || 0) + 1;
        s.events.push({ type: 'korSondu', x: rp.x, y: rp.y });
        detach(s, 'kor'); rp = null;
      }
      // Geçit girişi: yaklaşınca çıkış halkasına taşınır, orada asılı kalırsın (akış sürer).
      if (rp && rp.ref && rp.ref.gecit && rp.len <= CFG.GECIT_LEN) { usePortal(s, rp.ref); rp = s.rope; atMin = false; }
      // Yay halkası: ulaştığın an seni okun yönüne fırlatır; ip kendiliğinden bırakılır, akış sürer.
      if (rp && atMin && rp.ref && rp.ref.yay != null) { launchSpring(s, rp.ref); rp = null; }
      // tutunma gücü ve akış
      else if (rp && atMin) {
        s.hang += dt;
        if (s.hang > CFG.COMBO_HANG && s.combo > 0) breakCombo(s, 'asılı');
        if (s.hang > s.grip) { s.slips++; detach(s, 'slip'); }
      }
    } else if (!rp) {
      s.air += dt;
      if (s.air > CFG.COMBO_AIR && s.combo > 0) breakCombo(s, 'hava');
    }
    s.grounded = false;
    for (j = 0; j < 2; j++) {
      for (i = 0; i < s.rects.length; i++) {
        var r = s.rects[i];
        if (!solid(s, r)) continue;
        if (r.y > p.y + 40 || r.y + r.h < p.y - 40) continue;
        var n = collideCircle(p, r, CFG.R, 0.86);
        if (n && n.ny < -0.5) s.grounded = true;
      }
    }
    if (s.grounded && !s.rope && s.combo > 0) breakCombo(s, 'yer');

    // kutular
    for (i = 0; i < s.boxes.length; i++) {
      var b = s.boxes[i];
      integrate(b, dt);
      if (rp && rp.kind === 'box' && rp.box === b) {
        rp.len = Math.max(CFG.MIN_LEN + 6, rp.len - CFG.REEL * dt);
        var ex = b.x - p.x, ey = b.y - p.y, ed = Math.sqrt(ex * ex + ey * ey) || 1;
        if (ed > rp.len) { b.x = p.x + ex / ed * rp.len; b.y = p.y + ey / ed * rp.len; }
      }
      var zemin = false;
      for (j = 0; j < 2; j++) for (var k = 0; k < s.rects.length; k++) if (solid(s, s.rects[k])) { var cn = collideCircle(b, s.rects[k], CFG.BOX_R, 0.6); if (cn && cn.ny < -0.5) zemin = true; }
      // Yerde duran kutuda sürtünme: collideCircle sürtünmeyi yalnızca yüzeye doğru giderken uygular; duran kutunun
      // dikey hızı her adım sıfırlandığı için kutu buz gibi kayıyor, düğmeden çıkıyordu (4. bölüm). Ip kutuyu çekerken uygulanmaz.
      if (zemin && !(rp && rp.kind === 'box' && rp.box === b)) b.px = b.x - (b.x - b.px) * CFG.BOX_ZEMIN;
    }

    // düğmeler ve kapılar
    var wasOpen = s.gatesOpen, any = false;
    for (i = 0; i < s.buttons.length; i++) {
      var bt = s.buttons[i];
      bt.pressed = s.boxes.some(function (bb) { return bb.x > bt.x - 4 && bb.x < bt.x + bt.w + 4 && bb.y + CFG.BOX_R > bt.y - 3 && bb.y < bt.y + bt.h; });
      if (bt.pressed) any = true;
    }
    s.gatesOpen = any;
    if (any !== wasOpen) s.events.push({ type: any ? 'gateOpen' : 'gateClose' });

    // güçlendirmeler: yoldan toplanır; fener süresi işler (yakındaki ateşböcekleri çekilir)
    for (i = 0; i < s.gucler.length; i++) {
      var gc = s.gucler[i];
      if (!gc.got && Math.abs(gc.y - p.y) < 40 && dist(p.x, p.y, gc.x, gc.y) < CFG.R + 18) gucAl(s, gc);
    }
    if (s.guc && s.guc.fener > 0) {
      s.guc.fener -= dt;
      if (s.guc.fener <= 0) { s.guc.fener = 0; s.events.push({ type: 'gucBitti', tur: 'fener' }); }
    }
    // ateşböcekleri
    for (i = 0; i < s.fireflies.length; i++) {
      var f = s.fireflies[i];
      var cekR = s.guc && s.guc.fener > 0 && f.zincir == null && !(f.ring && f.ring.dal) ? CFG.GUC_FENER_R : 0;
      if (!f.got && Math.abs(f.y - p.y) < Math.max(40, cekR) && dist(p.x, p.y, f.x, f.y) < Math.max(CFG.R + (f.ring ? 20 : 12), cekR) && !(f.ring && f.ring.dal && !akista(s))) {
        if (cekR) s.events.push({ type: 'cekildi', x: f.x, y: f.y });
        f.got = true;
        // zincir ateşböceği tek başına sayılmaz (herkes ip sarılırken geçer): ödül yalnızca zincir akışla tamamlanınca
        if (f.zincir != null) { zincirAl(s, f); continue; }
        if (f.ring) f.ring.got = true; s.fireflyPts += 25; s.ffGot++;
        s.events.push({ type: 'firefly', x: f.x, y: f.y });
      }
    }

    // Rüzgâr şeritleri (kapı) yolun üstünde durur; yalnızca akış sürerken (x2 ve üstü) içinden geçmek sayılır:
    // akış bir artar, havada kalma süresi tazelenir. Asılı kalıp akışı bozan için kapı sönüktür.
    var moving = !s.rope || (s.rope.kind === 'anchor' && s.rope.len > CFG.MIN_LEN + 1);
    if (moving && s.combo >= 2) {
      for (i = 0; i < s.rings.length; i++) {
        var gt = s.rings[i];
        // şeridi aşağıdan yukarı geçmek: bu adımda çizginin altından üstüne çıktıysan ve şerit genişliğindeysen
        if (gt.kapi && !gt.got && p.py > gt.y && p.y <= gt.y && Math.abs(p.x - gt.x) < CFG.GATE_W) passGate(s, gt);
      }
    }

    if (p.y < s.topY) s.topY = p.y;
    // Günlük Kuyu bitişi (v0.96, İstişare 7): def.bitisM metreye çıkılınca koşu kazanılır; süre s.bitisT (puan ve yıldız süreden)
    if (s.def.bitisM && meters(s) >= s.def.bitisM) { s.status = 'won'; s.bitisT = s.t; s.events.push({ type: 'won', bitis: true }); return; }
    // Raunttaki en yüksek hız: ipte değilken, yukarı ya da yana giderken. Kancanın çekme hızı ve düşüş sayılmaz.
    if (!s.rope) {
      var fvx = (p.x - p.px) / dt, fvy = (p.y - p.py) / dt;
      if (fvy <= 0) { var fv = Math.sqrt(fvx * fvx + fvy * fvy); if (fv > s.maxSpeed) s.maxSpeed = fv; }
    }

    // ölüm
    for (i = 0; i < s.rects.length; i++) {
      var hr = s.rects[i];
      if (hr.type === 'k' && hr.y < p.y + 30 && hr.y + hr.h > p.y - 30 && overlapsRect(p, hr, CFG.R * 0.8)) return die(s, 'diken');
    }
    if (s.water != null) {
      // Su ilk halkaya tutununca tetiklenir (oyuncu başlamadan beklerken yükselmez), kısa bir payla başlar.
      if (s.def.suTakip && s.waterFrom != null) suTakip(s, dt);
      else if (s.waterFrom != null && s.t - s.waterFrom > CFG.WATER_GRACE && suAcik(s)) {
        var speed = s.def.waterSpeed ? s.def.waterSpeed(s) : s.def.water;
        s.water -= speed * dt;
        // sonsuz modda su çok geride kalmasın
        if (s.endless && s.water > p.y + 950) s.water = p.y + 950;
      }
      if (p.y + CFG.R * 0.5 > s.water) {
        if (s.guc && s.guc.kalkan && s.sonGuvenli) kalkanKullan(s); // kalkan bir düşüşü affeder
        else return die(s, 'su');
      }
    }
    // Hikâye (v0.57): tutunulan en yüksek yerin def.dusus birim altına düşmek ölümdür (su olmayan bölmelerde de karar önemli)
    if (s.def.dusus) {
      if (s.rope && s.rope.kind === 'anchor') { var hy = s.rope.y + CFG.MIN_LEN; if (s.dusTop == null || hy < s.dusTop) s.dusTop = hy; }
      if (s.dusTop != null && p.y > s.dusTop + s.def.dusus) return die(s, 'düşüş');
    }
    if (!s.endless && p.y > s.H + 220) return die(s, 'düşüş');
  }

  // Takip eden su: hedef = tutunduğun en yüksek nokta + mesafe (yükseldikçe daralır); su yalnız yukarı, en çok 'hiz'
  // ile yaklaşır. 'bekle' saniye yükselmezsen (asılı bekleme ya da bir yerde dönüp durma) su 'surunme' ile sürünür.
  function suTakip(s, dt) {
    var T = s.def.suTakip, p = s.p, m = meters(s), k = Math.min(1, m / T.daralma);
    var asili = s.rope && s.rope.kind === 'anchor';
    // tutunma yüksekliği: oyuncunun yeri ama halkanın asılma noktasından (ip en kısa) yukarısı değil;
    // sarkacın tepesi sayılırsa sallanırken dipte su yaklaşır
    var tutY = asili ? Math.max(p.y, s.rope.y + CFG.MIN_LEN) : null;
    if (asili && (s.tutTop == null || tutY < s.tutTop - 1)) {
      s.tutTop = tutY; s.ilerlemeT = s.t;
      // devam hakkında buradan sürer (yay ve geçit halkası değil: tutununca fırlatır/taşır)
      var gr = s.rope.ref;
      if (!(gr && (gr.yay != null || gr.gecit || gr.cikis || gr.cark))) s.sonGuvenli = { x: s.rope.x, y: s.rope.y, ref: s.rope.ref, hedef: s.rope.target };
    }
    if (s.ilerlemeT == null) s.ilerlemeT = s.t;
    var mesafe = (T.bas + (T.son - T.bas) * k) * 20;
    var hedef = (s.tutTop != null ? s.tutTop : s.startY) + mesafe;
    var bekle = T.bekle + (T.bekleSon - T.bekle) * k;
    s.surunuyor = s.t - s.ilerlemeT > bekle; // bir süre yükselmezsen (asılı bekleme ya da döngü) su sürünür
    if (s.surunuyor) hedef = Math.min(hedef, s.water - T.surunme * dt);
    // hedefe uzaklıkla orantılı yetiş (en az T.hiz): hızlı tırmanışta su geride kalmasın, düşüş hep ~mesafe kadar sürsün
    if (s.water > hedef) s.water = Math.max(hedef, s.water - Math.max(T.hiz, (s.water - hedef) * 6) * dt);
    s.suMesafe = s.water - p.y;
  }

  function usePortal(s, g) {
    var o = g.gecit, p = s.p;
    p.x = p.px = o.x; p.y = p.py = o.y + CFG.MIN_LEN;
    s.rope = { kind: 'anchor', x: o.x, y: o.y, len: CFG.MIN_LEN, target: 'ring', ref: o };
    s.hang = 0;
    s.portals++;
    if (o.ff) collectRing(s, o);
    s.events.push({ type: 'gecit', x: g.x, y: g.y, x2: o.x, y2: o.y });
  }

  function launchSpring(s, rg) {
    var a = rg.yay * Math.PI / 180, vx = Math.sin(a) * CFG.YAY_V, vy = -Math.cos(a) * CFG.YAY_V, p = s.p;
    detach(s, 'yay');               // asılı kalma 0: zincir sürer
    p.px = p.x - vx * CFG.DT; p.py = p.y - vy * CFG.DT;
    s.springs++;
    s.float = CFG.YAY_FLOAT;
    s.events.push({ type: 'yay', x: rg.x, y: rg.y });
    halkaUstalik(s, 'yay', rg.x, rg.y);
  }

  function passGate(s, gt) {
    gt.got = true;
    s.gates++;
    s.combo++; alevGuncelle(s);
    s.air = 0;        // havada kalma süresi tazelenir
    if (s.combo > s.maxCombo) s.maxCombo = s.combo;
    if (s.combo >= 2) s.bonus += Math.min(s.combo, CFG.COMBO_CAP) * CFG.COMBO_PTS;
    s.events.push({ type: 'kapi', x: gt.x, y: gt.y, combo: s.combo });
  }

  // Ateşböceği zinciri: sıralı üç ateşböceği; hepsi akış sürerken alınırsa ZİNCİR_BONUS ateşböceği daha
  function zincirAl(s, f) {
    var z = (s.zincirler || (s.zincirler = {}))[f.zincir] || (s.zincirler[f.zincir] = { n: 0, tamam: false, bozuk: false });
    z.n++;
    if (!akista(s)) z.bozuk = true;
    s.events.push({ type: 'zincirAdim', x: f.x, y: f.y, n: z.n, bozuk: z.bozuk });
    if (z.n === CFG.ZINCIR_N && !z.bozuk && !z.tamam) {
      z.tamam = true; s.zincir = (s.zincir || 0) + 1;
      s.ffGot += CFG.ZINCIR_BONUS; s.fireflyPts += 25 * CFG.ZINCIR_BONUS;
      s.events.push({ type: 'zincir', x: f.x, y: f.y });
    }
  }
  // Akış sürüyor mu: zincir en az x2, ya da pencere içinde erken bırakıp havadasın (zincir sürüyor)
  function akista(s) { return s.combo >= 2 || (!s.rope && s.chain); }
  function collectRing(s, rg) {
    if (rg.dal && !akista(s)) return; // fırlatma yolunun ateşböceği akışsız alınmaz
    for (var i = 0; i < s.fireflies.length; i++) {
      var f = s.fireflies[i];
      if (f.ring === rg && !f.got) { f.got = true; rg.got = true; s.fireflyPts += 25; s.ffGot++; s.events.push({ type: 'firefly', x: f.x, y: f.y }); }
    }
  }
  // Çarpan = hız payı (1,00 – 1,50, 0,05 adımlarla) + ustalık payı (her TAM bırakış ve her halka ustalığı +0,05, en çok +0,50).
  // Hızın tavanına akışla kolay varılıyor; ustalık payı zamanlamayı da ayrıştırır (en çok x2,00).
  function hizPay(s) {
    var k = Math.max(0, Math.min(1, (s.maxSpeed - CFG.SPEED_BASE) / (CFG.SPEED_TOP - CFG.SPEED_BASE)));
    return 1 + Math.round(k * 10) / 20;
  }
  function ustalikSay(s) { return (s.tam || 0) + (s.def && s.def.halkaUstalik === false ? 0 : (s.halkaUsta || 0)); }
  function ustalikPay(s) { return Math.min(CFG.USTALIK_MAX, Math.round(ustalikSay(s) * CFG.USTALIK_TAM * 100) / 100); }
  function speedMult(s) { return Math.round((hizPay(s) + ustalikPay(s)) * 100) / 100; }
  function speedMs(v) { return v / 20; } // birim/sn → m/sn (20 birim = 1 m)
  // Güçlendirme al: fener (süre), kanat (süre; ip bırakılır), kalkan (bir düşüşü affeder, bir tane tutulur)
  function gucAl(s, gc) {
    gc.got = true; s.gucSay++;
    if (gc.tur === 'fener') s.guc.fener = CFG.GUC_FENER;
    else if (gc.tur === 'kanat') { s.guc.kanat = CFG.GUC_KANAT; s.rope = null; s.hook = null; s.combo = Math.max(s.combo, 1); }
    else if (gc.tur === 'kalkan') s.guc.kalkan = true;
    s.events.push({ type: 'guc', tur: gc.tur, x: gc.x, y: gc.y });
  }
  // Kalkan: suya değince en yüksek güvenli halkaya sıçra (devam hakkı gibi, ama ücretsiz ve kendiliğinden)
  function kalkanKullan(s) {
    s.status = 'dead'; // dirilt ölü durumdan çalışır
    var d = s.devam;
    if (!dirilt(s)) { s.status = 'play'; return; }
    s.devam = d; s.guc.kalkan = false;
    s.events.pop(); // dirilt'in 'devam' olayı yerine kalkan olayı
    s.events.push({ type: 'kalkan', x: s.p.x, y: s.p.y });
  }
  // Devam hakkı (Sonsuz, İstişare 2): yakalanınca en yüksek tutunulan halkaya asılı geri dön; su güvenli mesafeye çekilir.
  function dirilt(s) {
    var a = s.sonGuvenli;
    if (!a || s.status !== 'dead') return false;
    var g = a.ref && a.ref.x != null && a.hedef === 'ring' ? a.ref : null, ax = g ? g.x : a.x, ay = g ? g.y : a.y;
    s.status = 'play';
    s.p.x = s.p.px = ax; s.p.y = s.p.py = ay + CFG.MIN_LEN;
    s.rope = { kind: 'anchor', x: ax, y: ay, len: CFG.MIN_LEN, target: a.hedef || 'ring', ref: a.ref };
    s.hook = null; s.hang = 0; s.air = 0; s.combo = 0; s.chain = false; s.alevPuan = 0; s.alev = 0; s.tamSeri = 0;
    s.kilitSon = 0; s.ilerlemeT = s.t; s.lastAnchor = null;
    s.tutTop = ay + CFG.MIN_LEN; // su hedefi dirilme noktasına göre (güvenli halka en yüksek noktanın altında olabilir)
    if (s.def.suTakip) s.water = Math.max(s.water, ay + CFG.MIN_LEN + s.def.suTakip.bas * 20);
    else if (s.water != null) s.water = Math.max(s.water, ay + 400);
    s.devam = (s.devam || 0) + 1;
    s.events.push({ type: 'devam', x: ax, y: ay + CFG.MIN_LEN, n: s.devam });
    return true;
  }
  // Fener (Hikâye kontrol noktası, v0.57): tutununca yanar; ölünce son yanan fenerden dönülür
  function fenerYak(s, g) {
    if (g.yandi) return;
    g.yandi = true; s.kontrol = { x: g.x, y: g.y, ref: g }; s.fenerSay = (s.fenerSay || 0) + 1;
    s.events.push({ type: 'fener', x: g.x, y: g.y, n: s.fenerSay });
  }
  // Bölme suyu (Hikâye, v0.60): def.suFener kadar fener yanınca su yükselmeye başlar; başladığı an son fenerin altından gelir
  function suAcik(s) {
    var k = s.def.suFener;
    if (k == null) return true;
    if ((s.fenerSay || 0) < k) return false;
    if (!s.suAcildi) { s.suAcildi = true; if (s.kontrol) s.water = Math.min(s.water, s.kontrol.y + 420); if (k > 0) s.events.push({ type: 'waterStart' }); }
    return true;
  }
  function fenerDon(s) {
    var k = s.kontrol;
    if (!k || s.status !== 'dead') return false;
    s.status = 'play'; s.pressed = false;
    s.p.x = s.p.px = k.x; s.p.y = s.p.py = k.y + CFG.MIN_LEN;
    s.rope = { kind: 'anchor', x: k.x, y: k.y, len: CFG.MIN_LEN, target: 'ring', ref: k.ref };
    s.hook = null; s.hang = 0; s.air = 0; s.combo = 0; s.chain = false; s.alevPuan = 0; s.alev = 0; s.tamSeri = 0; s.kilitSon = 0; s.lastAnchor = null;
    s.dusTop = k.y + CFG.MIN_LEN; s.tutTop = k.y + CFG.MIN_LEN; s.ilerlemeT = s.t;
    if (s.def.suTakip) s.water = Math.max(s.water, k.y + CFG.MIN_LEN + s.def.suTakip.bas * 20);
    else if (s.water != null) s.water = Math.max(s.water, k.y + 400);
    s.donus = (s.donus || 0) + 1;
    s.events.push({ type: 'fenerDon', x: k.x, y: k.y + CFG.MIN_LEN, n: s.donus });
    return true;
  }
  function die(s, why) { s.status = 'dead'; s.rope = null; s.hook = null; s.events.push({ type: 'dead', why: why }); }
  function dist(ax, ay, bx, by) { var x = ax - bx, y = ay - by; return Math.sqrt(x * x + y * y); }
  // Toplanan ateşböceği sayısı. Liste sayılmaz: Sonsuz kuyu suyun altında kalanları listeden siler.
  function fireflyCount(s) { return s.ffGot || 0; }
  // Sonsuz mod puanı: tırmanılan metre + akış bonusu + ateşböcekleri
  function meters(s) { return Math.max(0, Math.floor((s.startY - s.topY) / 20)); }
  function score(s) { return meters(s) + s.bonus + s.fireflyPts; }
  function finalScore(s) { return Math.round(score(s) * speedMult(s)); }

  var api = {
    CFG: CFG, createSim: createSim, step: step, press: press, release: release,
    fireflyCount: fireflyCount, kilitli: kilitli, akista: akista, dirilt: dirilt, fenerDon: fenerDon, hookRay: hookRay, meters: meters, score: score, segRect: segRect, aim: aim,
    candidates: candidates, reachable: reachable, currentIgnore: currentIgnore, makeSwing: makeSwing,
    speedMult: speedMult, hizPay: hizPay, ustalikPay: ustalikPay, speedMs: speedMs, finalScore: finalScore
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KuyuEngine = api;
})(typeof window !== 'undefined' ? window : this);
