/* Kuyu — ekran akışı: Funday Morning açılışı → (ilk açılışta) giriş → tanıtım → ana menü.
   Bölümler ve ayarlar sayfaları da burada. Oyunun kendisi js/game.js (window.KuyuGame). */
(function () {
  'use strict';
  var G = window.KuyuGame;
  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EKRANLAR = ['ekAcilis', 'ekGiris', 'ekTanitim', 'ekAna', 'ekBolumler', 'ekAyarlar', 'ekProfil', 'ekGorevler', 'ekDolap', 'ekIstat', 'ekYarisma', 'ekKoleksiyon', 'ekHarita'];
  var current = 'ekAcilis';
  var q = new URLSearchParams(location.search);
  var ONL = window.KuyuOnline;
  if (q.get('online') && ONL) ONL.ayarBaglanti(q.get('online')); // ?online=yerel: yerel sahte skor sunucusu; ?online=kapat
  var meydanLink = ONL && q.get('meydan') ? ONL.meydanCoz(q.get('meydan')) : null;
  var deepLink = meydanLink ? { mode: 'meydan', m: meydanLink } : q.get('mod') === 'gunluk' ? { mode: 'daily' } : q.get('mod') === 'haftalik' ? { mode: 'weekly' } : q.get('mod') === 'sonsuz' ? { mode: 'endless' } : q.get('bolum') ? { mode: 'level', n: parseInt(q.get('bolum'), 10) || 1 } : q.get('hikaye') ? { mode: 'hikaye', n: parseInt(q.get('hikaye'), 10) || 1 } : null;
  var save = function () { return G.save(); };
  var IK = window.KuyuIkon; // v0.90: çizilmiş SVG ikonlar (js/ikon.js), yazı simgeleri yerine
  function yildizTekrar(n) { var h = ''; for (var i = 0; i < n; i++) h += IK.svg('yildiz'); return h; }

  var SEKMELER = ['ekAna', 'ekBolumler', 'ekGorevler', 'ekDolap', 'ekProfil', 'ekAyarlar', 'ekIstat', 'ekYarisma', 'ekKoleksiyon', 'ekHarita'];
  // Ekran geçişi (v0.78): alt sekmeler arasında yöne göre kayma, diğer ekranlarda hafif büyüyerek gelme
  var SEKME_SIRA = { ekDolap: 0, ekKoleksiyon: 1, ekAna: 2, ekYarisma: 3, ekProfil: 4 };
  function gecis(onceki, id) {
    var el = $(id); if (!el || reduceMotion || onceki === id || id === 'oyun' || id === 'ekAcilis') return;
    var a = SEKME_SIRA[onceki], b = SEKME_SIRA[id], sinif = a != null && b != null ? (b > a ? 'gec-sag' : 'gec-sol') : 'gec-pop';
    el.classList.remove('gec-sag', 'gec-sol', 'gec-pop'); void el.offsetWidth; el.classList.add(sinif);
  }
  function show(id) {
    var onceki = current;
    current = id;
    gecis(onceki, id);
    EKRANLAR.forEach(function (e) { $(e).hidden = e !== id; });
    $('oyunEkrani').hidden = id !== 'oyun';
    // alt gezinme çubuğu yalnızca menü sekmelerinde
    $('altMenu').hidden = SEKMELER.indexOf(id) < 0;
    document.querySelectorAll('#altMenu [data-sekme]').forEach(function (b) {
      if (b.dataset.sekme === id && (!b.dataset.mod || b.dataset.mod === dolapMod)) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (id === 'ekAna' || id === 'ekTanitim') startScene(); else stopScene();
    if (id !== 'ekDolap' && !$('urunKatman').hidden) urunKapat(true);
    if (id === 'ekKoleksiyon') kolBaslat(); else kolDur();
    if (id === 'ekProfil') prBaslat(); else prDur();
    if (id !== 'ekHarita') hrDur();
    if (id !== 'oyun' && id !== 'ekAcilis') G.muzikSahne('menu'); // menülerde sakin müzik
    if (SEKMELER.indexOf(id) >= 0) { $('gorevNokta').hidden = !G.gorevBekleyen(); $('marketNokta').hidden = !G.vitrinYeni() || id === 'ekDolap'; } // Market: bugünün vitrini görülmedi
  }

  // Hikâye kartı: ekranın üstünde, oyunu durdurmaz; dokununca ya da birkaç saniye sonra kapanır.
  var hikayeT = null;
  function hikaye(baslik, metin, ms) {
    $('hkBaslik').textContent = baslik; $('hkMetin').textContent = metin;
    $('hikayeKart').hidden = false; $('hikayeKart').classList.remove('gizlen');
    clearTimeout(hikayeT);
    hikayeT = setTimeout(hikayeKapat, ms || 5200);
  }
  function hikayeKapat() { $('hikayeKart').classList.add('gizlen'); setTimeout(function () { $('hikayeKart').hidden = true; }, 300); }
  $('hikayeKart').addEventListener('click', function () { clearTimeout(hikayeT); hikayeKapat(); });
  var toastT = null;
  function toast(msg, ms) {
    var b = $('bildirim');
    b.textContent = msg; b.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { b.hidden = true; }, ms || 2400);
  }

  function cleanName(s) { return String(s || '').replace(/[<>&"]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16); }

  // ---------- açılış ----------
  function boot() {
    show('ekAcilis');
    var loaded = false;
    var logo = $('acilisLogo');
    var waits = [document.fonts && document.fonts.ready, logo.decode ? logo.decode() : null];
    Promise.all(waits.map(function (p) { return Promise.resolve(p).catch(function () {}); })).then(function () { loaded = true; });
    var t0 = performance.now(), MIN_MS = deepLink ? 900 : 2200;
    (function stepLoad(now) {
      var k = Math.min(1, (now - t0) / MIN_MS);
      var p = loaded ? k : Math.min(k, 0.9);
      $('yuklemeDolgu').style.width = (p * 100) + '%';
      if (p >= 1) setTimeout(afterSplash, 250);
      else requestAnimationFrame(stepLoad);
    })(t0);
  }
  function afterSplash() {
    if (!save().profile) { show('ekGiris'); $('oyuncuAd').focus({ preventScroll: true }); return; }
    if (deepLink) return openDeepLink();
    runIntro();
  }
  function openDeepLink() {
    var d = deepLink; deepLink = null;
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
    if (d.mode === 'meydan') G.startMeydan(d.m); else if (d.mode === 'daily') G.startDaily(); else if (d.mode === 'weekly') G.startWeekly(); else if (d.mode === 'endless') G.startEndless(); else if (d.mode === 'hikaye') G.startHikaye(d.n); else G.startLevel(d.n);
  }

  // ---------- giriş ----------
  $('girisForm').addEventListener('submit', function (e) {
    e.preventDefault();
    G.unlockAudio();
    var s = save();
    s.profile = { name: cleanName($('oyuncuAd').value) || 'Tırmanıcı', method: 'misafir', createdAt: Date.now() };
    G.persist();
    if (deepLink) openDeepLink(); else runIntro();
  });
  document.querySelectorAll('[data-saglayici]').forEach(function (b) {
    b.addEventListener('click', function () { toast(b.dataset.saglayici + ' ile giriş yakında. Şimdilik misafir olarak oynayabilirsin.', 2800); });
  });

  // ---------- tanıtım ----------
  var introStage = 0, introTimer = 0, dayStart = 0;
  function runIntro() {
    show('ekTanitim');
    $('ekTanitim').classList.remove('gun');
    introStage = 1;
    requestAnimationFrame(function () { $('sunar').classList.add('goster'); });
    introTimer = setTimeout(function () {
      $('sunar').classList.remove('goster');
      introTimer = setTimeout(introDay, 550);
    }, reduceMotion ? 900 : 2000);
  }
  function introDay() {
    clearTimeout(introTimer);
    introStage = 2;
    dayStart = performance.now();
    sceneT0 = performance.now();
    $('sunar').classList.remove('goster');
    $('ekTanitim').classList.add('gun');
    if (G.sfx && !save().mute) {
      var o = reduceMotion ? 0 : ONSOZ * 1000;
      setTimeout(function () { if (introStage === 2) G.sfx.firefly(); }, reduceMotion ? 0 : 1150); // kor dibe iner
      setTimeout(function () { if (introStage === 2) G.sfx.fire(); }, o + 300);
      setTimeout(function () { if (introStage === 2) G.sfx.attach(); }, o + 450);
      setTimeout(function () { if (introStage === 2) G.sfx.won(); }, o + 1350);
    }
  }
  $('ekTanitim').addEventListener('click', function () {
    G.unlockAudio();
    if (introStage === 1) introDay();
    else if (introStage === 2 && performance.now() - dayStart > 500) { introStage = 0; home(); }
  });

  // ---------- ana menü ----------
  function medalCount() {
    var s = save(), n = 0, done = 0;
    Object.keys(s.best || {}).forEach(function (k) {
      var b = s.best[k];
      n += (b.ff || 0) + (b.perfect ? 1 : 0) + (b.flow ? 1 : 0);
      if (b.done) done++;
    });
    return { medals: n, done: done };
  }
  // yalnizDoldur === true: yalnız kartları ve sayıları tazele, ekran değişmez (Yarışma sekmesi kullanır)
  function home(yalnizDoldur) {
    var s = save();
    $('tabloAcBtn').hidden = !G.onlineAcik(); // skor tablosu (v0.73): yalnız sunucu açıkken
    $('selamAd').textContent = (s.profile && s.profile.name) || 'Tırmanıcı';
    // dokun ve başla (v0.64): Hikâye'de sıradaki bölüm (geçilmemiş ilk bölüm); bölge ve bölgedeki ilerleme yazar
    var cur = G.siradaki(), bitti = G.hikayeBitti(), curDef = G.levelDef(cur), cb = (s.best || {})[cur] || {};
    var bA = G.bolgeAraligi(cur), gGec = 0; // v0.92: bölge kısa bölüm aralığı (Taş 1–18, Maden 19–36 …)
    for (var gn = bA.a; gn <= bA.b; gn++) if (s.best[gn] && s.best[gn].done) gGec++;
    $('dokunBaslik').textContent = bitti ? 'BÖLÜMLER' : 'OYNA';
    $('dokunAlt').textContent = bitti ? 'Bir bölümü yeniden oyna, hedefleri tamamla' : cur + '. bölüm · ' + curDef.name;
    $('dokunBolge').textContent = bitti ? G.bolumSayi + ' bölüm geçildi' : G.bolgeAdi(cur) + ' · ' + gGec + '/' + (bA.b - bA.a + 1);
    $('dokunIpucu').textContent = bitti ? 'Bölümler için dokun' : 'Başlamak için dokun';
    $('dokunBtn').setAttribute('aria-label', bitti ? 'Hikâye tamam: bölümleri aç' : 'Başla: ' + cur + '. bölüm, ' + curDef.name + ', ' + G.bolgeAdi(cur));
    $('oynaHedef').hidden = bitti;
    // bu bölümün hedefleri: ateşböceği noktaları + kusursuz + akış
    var ffN = (curDef.rings || []).filter(function (r) { return r[2] === 'ff'; }).length;
    var hd = '';
    for (var k = 0; k < ffN; k++) hd += '<i class="' + (k < (cb.ff || 0) ? 'var' : '') + '"></i>';
    hd += '<i class="m' + (cb.perfect ? ' var' : '') + '"></i><i class="m' + (cb.flow ? ' var' : '') + '"></i>';
    $('oynaHedef').innerHTML = hd;
    // üst şerit: toplam ödül ve ateşböceği
    var tot = 0, ates = 0;
    Object.keys(s.best || {}).forEach(function (k2) { tot += s.best[k2].reward || 0; ates += s.best[k2].ff || 0; });
    $('toplamOdul').textContent = tot + (s.odulEk || 0);
    $('toplamAtes').textContent = G.cuzdan().ates; // harcanabilir bakiye
    renderAnaGorev();
    var di = G.dailyInfo();
    // Haftalık Kuyu: geçen haftanın lig ödülü (varsa) ve bu haftanın durumu
    var gecen = G.haftalikKapat();
    if (gecen) { $('toplamAtes').textContent = G.cuzdan().ates; setTimeout(function () { toast('Geçen hafta ' + gecen.ligAd + ' ligindeydin · +' + gecen.odul + ' ateşböceği', 3600); }, 1600); }
    var hf = G.haftalikInfo();
    // ana ekranın yan kartları (v0.75): kısa durum. v0.89: Yarışma sekmesindeki kartlar kalktı (sekme Sıralama oldu)
    $('yanGunlukAlt').innerHTML = IK.yildizlar(di.yildiz, 'mini') + ' · ' + (di.hak.kalan > 0 ? di.hak.kalan + '/' + di.hak.toplam : 'bitti');
    $('yanGunlukNokta').hidden = !(di.hak.kalan > 0 && !di.playedToday);
    $('yanGunluk').setAttribute('aria-label', 'Günlük Kuyu: ' + di.kural.ad + ', hedef ' + di.hedef.metre + ' metre, ' + di.yildiz + ' yıldız, ' + hakYazi(di.hak, 'yarın') +
      (di.streak ? ', ' + di.streak + ' gün seri' : ''));
    $('yanHaftalikAlt').textContent = (hf.ligAd ? hf.ligAd + ' · ' : '') + (hf.hak.kalan > 0 ? hf.hak.kalan + '/' + hf.hak.toplam : 'bitti');
    $('yanHaftalik').setAttribute('aria-label', 'Haftalık Kuyu: hedef ' + hf.hedef.puan + ' puan, ' + hf.yildiz + ' yıldız, ' + (hf.ligAd ? hf.ligAd + ' ligi' : 'lig yok') + ', ' + hakYazi(hf.hak, 'pazartesi'));
    isikGuncelle();
    var ik = G.isik ? G.isik() : null;
    if (ik && ik.seviye > ik.gorulen) { G.isikGordu(ik.seviye); setTimeout(function () { toast('Kuyu biraz daha aydınlandı · Işık ' + ik.seviye + '/' + ik.en + (ik.odul ? ' · Dolap\'ta yeni: ' + ik.odul.ad + ' ' + window.KuyuEkonomi.TURLER[ik.odul.tur].toLocaleLowerCase('tr-TR') : ''), ik.odul ? 3600 : 2400); }, 700); }
    if (yalnizDoldur === true) return;
    show('ekAna');
    // günlük giriş: bugün alınmadıysa ana menüye ilk gelişte bir kez göster
    var gd = G.giris();
    if (gd.hazir && girisSorulan !== G.dailyInfo().key) { girisSorulan = G.dailyInfo().key; openGiris(); }
  }
  var girisSorulan = null;
  // Ana menüdeki görev şeridi: kaç görev bitti, tamamlanmaya en yakın görev, alınmamış ödül, yenilenmeye kalan süre.
  function renderAnaGorev() {
    var list = G.gorevler(), bitti = 0, bekleyen = 0, cubuk = '';
    list.forEach(function (m) {
      if (m.done) bitti++;
      if (m.done && !m.claimed) bekleyen++;
      cubuk += '<i class="' + (m.claimed ? 'alindi' : m.done ? 'bitti' : '') + '"><i style="width:' + Math.round(m.prog / m.target * 100) + '%"></i></i>';
    });
    var alt;
    if (bekleyen) alt = bekleyen === 1 ? 'Ödül hazır · almak için dokun' : bekleyen + ' ödül hazır · almak için dokun';
    else if (bitti === list.length) {
      var left = G.yeniGune(), hh = Math.floor(left / 3600000), mm = Math.floor(left % 3600000 / 60000);
      alt = 'Hepsi tamam · yenileri ' + (hh ? hh + ' sa ' : '') + mm + ' dk sonra';
    } else {
      // tamamlanmaya en yakın görev
      var en = list.filter(function (m) { return !m.done; }).sort(function (a, b) { return b.prog / b.target - a.prog / a.target; })[0];
      alt = window.KuyuGorev.missionText(en) + ' · ' + en.prog + '/' + en.target;
    }
    $('anaGorevBaslik').textContent = 'Görevler';
    $('anaGorevAlt').textContent = bekleyen ? 'Ödül hazır' : bitti + '/' + list.length;
    $('anaGorevNokta').hidden = !bekleyen;
    $('anaGorevCubuk').innerHTML = cubuk;
    $('anaGorevBtn').classList.toggle('hazir', bekleyen > 0);
    $('anaGorevBtn').setAttribute('aria-label', 'Bugünün görevleri: ' + bitti + ' / ' + list.length + ' tamam. ' + alt);
  }
  $('anaGorevBtn').addEventListener('click', function () { openTasks(); });
  // v0.75: ana ekranın yan kartları ve üst çubuğu
  $('yanGunluk').addEventListener('click', function () { G.startDaily(); });
  $('yanHaftalik').addEventListener('click', function () { G.startWeekly(); });
  $('paraBtn').addEventListener('click', function () { openDolap('market'); });
  $('ayarBtn').addEventListener('click', function () { openSettings(); });
  $('bolumHap').addEventListener('click', function () { openHarita(); }); // v0.87: "harita ›" çipi kuyu duvarı haritasını açar
  // Yarışma sekmesi = Sıralama (v0.89): skor tablosu tam sayfa. Günlük ve Haftalık Kuyu ana ekranda.
  // Ana ekrandaki "Sıralama" etiketi ve sonuç kartındaki "Tam tablo ›" da buraya gelir (tur: 'haftalik' | 'gunluk').
  function openYarisma(tur) {
    home(true); // geçen haftanın lig ödülü ve sayılar tazelensin
    if (tur) tabloTur = tur === 'gunluk' ? 'gunluk' : 'haftalik';
    show('ekYarisma'); $('ekYarisma').scrollTop = 0;
    tabloCiz();
  }
  // dokun ve başla: ilk bölüm geçilene dek öğretici (İlk Halka), sonra Sonsuz Kuyu
  function hakYazi(h, zaman) { return h.kalan > 0 ? h.kalan + '/' + h.toplam + ' deneme' : h.son ? zaman + ' yeni denemeler' : 'Deneme bitti, videoyla 1 deneme'; }
  $('dokunBtn').addEventListener('click', function () { if (G.hikayeBitti()) openLevels(); else G.startLevel(G.siradaki()); });
  // v0.83: "Başlamak için dokun": ana ekranda düğme olmayan her yere dokunmak OYNA ile aynı
  $('ekAna').addEventListener('click', function (e) { if (!e.target.closest('button, .ana-ust, .kiris')) { if (G.dokunus) G.dokunus(true); $('dokunBtn').click(); } });
  // ---------- pencereler (v0.90, İstişare 5 Aşama 3): yukarıdan iki iple inen pano; kapanınca yukarı çekilir ----------
  function pencereAc(id) { var k = $(id); clearTimeout(k._kapaT); k.classList.remove('kapaniyor'); k.hidden = false; }
  function pencereKapat(id) {
    var k = $(id); if (k.hidden) return; clearTimeout(k._kapaT);
    if (reduceMotion) { k.hidden = true; return; }
    k.classList.add('kapaniyor');
    k._kapaT = setTimeout(function () { k.hidden = true; k.classList.remove('kapaniyor'); }, 230);
  }
  function pencereAcik(id) { var k = $(id); return !k.hidden && !k.classList.contains('kapaniyor'); }
  // ---------- deneme hakkı penceresi (v0.64) ----------
  var hakTur = null;
  function openHak(tur) {
    hakTur = tur;
    var d = G.hakDurum(tur), ad = tur === 'gunluk' ? 'Günlük Kuyu' : 'Haftalık Kuyu', taban = window.KuyuEkonomi.HAK[tur];
    $('hakBaslik').textContent = 'Denemeler bitti'; // v0.90: kısa tabela; mod adı metnin başında
    if (d.son) {
      $('hakMetin').textContent = ad + ' · ' + (tur === 'gunluk' ? 'bugün' : 'bu hafta') + ' başka deneme yok. ' + (tur === 'gunluk' ? 'Yarın' : 'Pazartesi') + ' ' + taban + ' yeni deneme. Bu arada Hikâye seni bekliyor.';
      $('hakVideoBtn').hidden = true; $('hakVideoSay').innerHTML = '';
    } else {
      $('hakMetin').textContent = ad + ' · video izleyerek 1 deneme daha alabilirsin. Her yenilemede bir video daha gerekir (1, 2, 3, 4, 5); ' + window.KuyuEkonomi.YENILEME_EN + ' yenilemeden sonra ' + (tur === 'gunluk' ? 'yarına' : 'haftaya') + ' kadar başka deneme yok.';
      $('hakVideoSay').innerHTML = (d.yenileme + 1) + '. yenileme: ' + Array.apply(null, Array(d.bedel)).map(function (x, i) { return '<i class="' + (i < d.izlenen ? 'var' : '') + '"></i>'; }).join('');
      $('hakVideoBtn').hidden = false; $('hakVideoBtn').innerHTML = IK.svg('video') + 'Video izle (' + (d.izlenen + 1) + '/' + d.bedel + ')';
    }
    $('hakHikayeBtn').textContent = G.hikayeBitti() ? 'Hikâye' : 'Hikâye\'ye devam · ' + G.siradaki() + '. bölüm';
    pencereAc('hakKatman');
    ($('hakVideoBtn').hidden ? $('hakHikayeBtn') : $('hakVideoBtn')).focus({ preventScroll: true });
  }
  $('hakVideoBtn').addEventListener('click', function () {
    pencereKapat('hakKatman');
    video(function () {
      var r = G.hakVideo(hakTur);
      if (r && r.yenilendi) { toast('+1 deneme', 1800); if (hakTur === 'gunluk') G.startDaily(); else G.startWeekly(); }
      else openHak(hakTur);
    });
  });
  $('hakHikayeBtn').addEventListener('click', function () { pencereKapat('hakKatman'); if (G.hikayeBitti()) openLevels(); else G.startLevel(G.siradaki()); });
  $('hakKapat').addEventListener('click', function () { pencereKapat('hakKatman'); if (current === 'ekAna') home(); });
  // ---------- skor tablosu (v0.73; v0.89 Sıralama sekmesi) ----------
  // Haftalık | Günlük. Üstte lig (ya da günün) kartı; ilk 3 kancalara asılı etiketler, 4–50 şeritler.
  // Senin satırın altta hep görünür (50 dışındaysan da); dokununca listede kendi yerine kayar. Durumlar: yükleniyor, boş, hata, kapalı.
  var tabloTur = 'haftalik', tabloIstek = 0, tabloBen = null;
  var KANCA_SVG = '<svg viewBox="0 0 40 64" aria-hidden="true"><path d="M20 2v30a10 10 0 1 1-10 10" fill="none" stroke="#15112a" stroke-width="9" stroke-linecap="round"/><path d="M20 2v30a10 10 0 1 1-10 10" fill="none" stroke="#d9dde0" stroke-width="4.5" stroke-linecap="round"/><path d="M10 42l-4-5" stroke="#15112a" stroke-width="9" stroke-linecap="round"/><path d="M10 42l-4-5" stroke="#d9dde0" stroke-width="4.5" stroke-linecap="round"/></svg>';
  function sayi(n) { return (+n || 0).toLocaleString('tr-TR'); }
  function yeniEl(tag, cls, yazi) { var e = document.createElement(tag); if (cls) e.className = cls; if (yazi != null) e.textContent = yazi; return e; }
  function oynaTur(tur) { if (tur === 'gunluk') G.startDaily(); else G.startWeekly(); }
  function tabloSatir(sira, r, ben) {
    var li = yeniEl('li', ben ? 'ben' : '');
    li.appendChild(yeniEl('b', 'sr-halka', sira));
    var ad = yeniEl('span', 'sr-ad', r.ad); if (ben) ad.appendChild(yeniEl('i', 'sr-sen', 'sen'));
    li.appendChild(ad);
    li.appendChild(yeniEl('small', '', r.metre ? sayi(r.metre) + ' m' : ''));
    li.appendChild(yeniEl('em', '', sayi(r.puan)));
    return li;
  }
  function podyumEtiket(sira, r, ben) {
    var li = yeniEl('li', 'sr-p p' + sira + (ben ? ' ben' : ''));
    li.appendChild(yeniEl('b', 'sr-madalya', sira));
    var ad = yeniEl('span', 'sr-ad', r.ad); li.appendChild(ad);
    li.appendChild(yeniEl('em', '', sayi(r.puan)));
    li.appendChild(yeniEl('small', '', ben ? 'sen' : r.metre ? sayi(r.metre) + ' m' : ''));
    return li;
  }
  // üst kart: Haftalık'ta ligin ve sonraki lige kalan puan; Günlük'te bugünkü en iyin ve yıldızların
  function tabloKart(tur) {
    var k = $('srKart'), L = window.KuyuEkonomi.LIG;
    if (tur === 'haftalik') {
      var hf = G.haftalikInfo(), alt = hf.lig < 0 ? 0 : L[hf.lig].puan, ust = hf.sonraki ? hf.sonraki.puan : 0;
      var oran = ust ? Math.max(0, Math.min(1, (hf.best - alt) / (ust - alt))) : 1;
      k.className = 'sr-kart lig' + hf.lig;
      k.innerHTML = '<span class="sr-rozet" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2.5l8 3v6.2c0 4.6-3.3 8.3-8 9.8-4.7-1.5-8-5.2-8-9.8V5.5z"/><path class="yildiz" d="M12 7l1.5 3.1 3.4.4-2.5 2.3.7 3.4L12 14.5l-3.1 1.7.7-3.4-2.5-2.3 3.4-.4z"/></svg></span>' +
        '<span class="sr-kart-yazi"><small>Bu haftaki ligin</small><b>' + (hf.ligAd || 'Lig yok') + '</b>' +
        '<span class="sr-cubuk" aria-hidden="true"><i style="width:' + Math.round(oran * 100) + '%"></i></span>' +
        '<span>' + (hf.sonraki ? hf.sonraki.ad + ' ligine ' + sayi(hf.sonraki.puan - hf.best) + ' puan' : 'En üst lig') + (hf.best ? ' · en iyin ' + sayi(hf.best) : '') + '</span></span>' +
        '<span class="sr-odul"><small>Lig ödülü</small><b><i class="ikon-ates" aria-hidden="true"></i>' + (hf.odul || 0) + '</b><small>pazartesi</small></span>';
    } else {
      var di = G.dailyInfo();
      k.className = 'sr-kart gun';
      k.innerHTML = '<span class="sr-rozet gun" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path class="cizgi" d="M3 10h18M8 3v4M16 3v4"/></svg></span>' +
        '<span class="sr-kart-yazi"><small>Bugünkü en iyin</small><b>' + (di.best ? sayi(di.best) + ' puan' : 'Henüz yok') + '</b>' +
        '<span class="sr-yildiz">' + [0, 1, 2].map(function (i) { return '<i class="' + (i < di.yildiz ? 'var' : '') + '">' + IK.svg('yildiz') + '</i>'; }).join('') + '</span>' +
        '<span>' + di.kural.ad + ' · hedef ' + di.hedef.metre + ' m' + (di.streak ? ' · ' + di.streak + ' gün seri' : '') + '</span></span>' +
        '<span class="sr-odul"><small>Deneme</small><b>' + di.hak.kalan + '/' + di.hak.toplam + '</b><small>bugün</small></span>';
    }
  }
  function srDurum(tur, metin, dugme) {
    var d = $('srDurum');
    if (!tur) { d.hidden = true; d.innerHTML = ''; return; }
    d.hidden = false; d.className = 'sr-durum ' + tur;
    d.innerHTML = '<span class="sr-kanca" aria-hidden="true"><i class="ip"></i>' + KANCA_SVG + '</span>';
    d.appendChild(yeniEl('p', '', metin));
    if (dugme) { var b = yeniEl('button', 'ana', dugme.ad); b.type = 'button'; b.addEventListener('click', dugme.fn); d.appendChild(b); }
  }
  function benCiz(tur, ben) {
    var b = $('srBen'), s = save(), ad = (s.profile && s.profile.name) || 'Tırmanıcı';
    tabloBen = ben; b.hidden = false; b.innerHTML = '';
    b.className = 'sr-ben' + (ben ? '' : ' yok');
    if (ben) {
      b.appendChild(yeniEl('b', 'sr-halka', ben.sira));
      var a = yeniEl('span', 'sr-ad', ben.ad || ad); a.appendChild(yeniEl('i', 'sr-sen', ben.eski ? 'son gönderim' : 'sen')); b.appendChild(a);
      b.appendChild(yeniEl('em', '', sayi(ben.puan)));
      b.setAttribute('aria-label', 'Senin sıran ' + ben.sira + ', ' + sayi(ben.puan) + ' puan' + (ben.eski ? ', son gönderimindeki sıra' : '') + '. Listede göster');
    } else {
      b.appendChild(yeniEl('b', 'sr-halka', '–'));
      b.appendChild(yeniEl('span', 'sr-ad', (tur === 'haftalik' ? 'Bu hafta' : 'Bugün') + ' henüz puanın yok'));
      b.appendChild(yeniEl('em', 'sr-oyna', 'Oyna ›'));
      b.setAttribute('aria-label', (tur === 'haftalik' ? 'Haftalık' : 'Günlük') + ' Kuyu\'yu oyna: henüz puanın yok');
    }
  }
  function tabloCiz() {
    var tur = tabloTur, istek = ++tabloIstek, liste = $('tabloListe'), bilgi = $('tabloBilgi'), pod = $('srPodyum');
    $('tabloHaftalik').setAttribute('aria-selected', tur === 'haftalik'); $('tabloGunluk').setAttribute('aria-selected', tur === 'gunluk');
    tabloKart(tur);
    liste.innerHTML = ''; pod.innerHTML = ''; pod.hidden = true; bilgi.textContent = ''; $('srBen').hidden = true; tabloBen = null;
    if (!G.onlineAcik()) { srDurum('kapali', 'Sıralama şu an kapalı. Puanların bu cihazda kayıtlı; bağlantı açılınca burada görünür.'); return; }
    srDurum('yukleniyor', 'Sıralama yükleniyor…');
    var T = G.tahtalar();
    window.KuyuOnline.tamTablo(T[tur], 200).then(function (t) {
      if (istek !== tabloIstek) return;
      bilgi.textContent = (t.satirlar.length ? sayi(t.toplam) + ' oyuncu · ' : '') + (tur === 'haftalik' ? 'Hafta bitimine ' + T.haftaKalan : 'Gün bitimine ' + T.gunKalan);
      if (!t.satirlar.length) {
        srDurum('bos', (tur === 'haftalik' ? 'Bu hafta' : 'Bugün') + ' henüz kimse yok. İlk sen ol!', { ad: (tur === 'haftalik' ? 'Haftalık' : 'Günlük') + ' Kuyu\'yu oyna', fn: function () { oynaTur(tur); } });
        return;
      }
      srDurum(null);
      var ben = t.ben, benSira = ben && !ben.eski ? ben.sira : 0, n = Math.min(50, t.satirlar.length);
      pod.hidden = false;
      for (var i = 0; i < Math.min(3, n); i++) pod.appendChild(podyumEtiket(i + 1, t.satirlar[i], benSira === i + 1));
      for (i = 3; i < n; i++) liste.appendChild(tabloSatir(i + 1, t.satirlar[i], benSira === i + 1));
      benCiz(tur, ben);
    }).catch(function () {
      if (istek === tabloIstek) srDurum('hata', 'Sıralamaya ulaşılamadı. Bağlantını kontrol et.', { ad: 'Yeniden dene', fn: tabloCiz });
    });
  }
  $('srBen').addEventListener('click', function () {
    if (!tabloBen) { oynaTur(tabloTur); return; }
    var li = document.querySelector('#ekYarisma li.ben');
    if (!li) { toast(tabloBen.sira + '. sıradasın · ilk 50\'nin dışında', 2200); return; }
    li.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    li.classList.remove('vurgu'); void li.offsetWidth; li.classList.add('vurgu');
  });
  $('tabloHaftalik').addEventListener('click', function () { if (tabloTur !== 'haftalik') { tabloTur = 'haftalik'; tabloCiz(); } });
  $('tabloGunluk').addEventListener('click', function () { if (tabloTur !== 'gunluk') { tabloTur = 'gunluk'; tabloCiz(); } });
  $('tabloYenile').addEventListener('click', tabloCiz);
  $('tabloAcBtn').addEventListener('click', function () { openYarisma('haftalik'); });
  $('profilBtn').addEventListener('click', function () { openProfile(); });

  // ---------- profil kartı ----------
  function fmt(n, d) { return Number(n || 0).toFixed(d).replace('.', ','); }
  // Kişisel rekor duvarı (v0.64): son 28 günün Günlük Kuyu yıldızları, son 8 haftanın ligi
  function renderDuvar(bugun) {
    var g = G.gecmis(), gun = g.gunluk || {}, hf = g.haftalik || {}, h = '';
    for (var i = 27; i >= 0; i--) {
      var d = new Date(bugun + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - i);
      var k = d.toISOString().slice(0, 10), o = gun[k];
      h += '<i class="g' + (o ? ' y' + (o.yildiz || 0) : '') + (i === 0 ? ' bugun' : '') + '" title="' + d.getUTCDate() + ' · ' + (o ? (o.yildiz || 0) + ' yıldız, ' + (o.metre || 0) + ' m' : 'oynanmadı') + '"><b>' + d.getUTCDate() + '</b>' + (o && o.yildiz ? '<em>' + yildizTekrar(o.yildiz) + '</em>' : '') + '</i>';
    }
    $('pDuvar').innerHTML = h;
    var L = window.KuyuEkonomi.LIG;
    $('pHaftalar').innerHTML = Object.keys(hf).sort().reverse().slice(0, 8).map(function (k) {
      var o = hf[k]; return '<li><span>' + new Date(k + 'T12:00:00Z').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) + ' haftası' + (o.yildiz ? ' <i class="duvar-yildiz">' + yildizTekrar(o.yildiz) + '</i>' : '') + '</span><b>' + (o.lig >= 0 ? L[o.lig].ad : 'Lig yok') + '</b><em>' + (o.puan || 0) + '</em></li>';
    }).join('') || '<li class="bos">Henüz Haftalık Kuyu koşusu yok.</li>';
  }
  function openProfile() {
    var s = save(), st = s.stats || {}, rec = s.endless || {};
    var best = s.best || {}, keys = Object.keys(best);
    var done = keys.filter(function (k) { return best[k].done; }).map(Number);
    var ff = 0, perfect = 0, flow = 0, total = 0;
    keys.forEach(function (k) { var b = best[k]; ff += b.ff || 0; if (b.perfect) perfect++; if (b.flow) flow++; total += b.reward || 0; });
    $('pAd').textContent = (s.profile && s.profile.name) || 'Tırmanıcı';
    $('pHesap').textContent = 'Misafir · ilerleme bu cihazda';
    $('pHiz').textContent = fmt(st.maxSpeed, 1) + ' m/sn';
    var ik = G.isik();
    $('isikSeviye').textContent = 'Işık ' + ik.seviye + '/' + ik.en;
    $('isikYazi').textContent = ik.toplam + ' ateşböceği' + (ik.ust ? ' · sonraki ışığa ' + (ik.ust - ik.toplam) : ' · kuyu tümüyle aydınlık') +
      (ik.siradaki ? ' · Işık ' + ik.siradaki.isik + '\'te ' + ik.siradaki.ad + ' ' + window.KuyuEkonomi.TURLER[ik.siradaki.tur].toLocaleLowerCase('tr-TR') + ' açılır' : '');
    $('isikDolu').style.width = (ik.ust ? Math.round((ik.toplam - ik.alt) / (ik.ust - ik.alt) * 100) : 100) + '%';
    $('hikayeListe').innerHTML = G.hikaye().map(function (hb) {
      return '<div class="hk-sayfa' + (hb.acik ? '' : ' kilitli') + '" style="--isik:' + hb.isik + '"><b>' + hb.ad + '</b>' +
        '<span>' + (hb.acik ? hb.metin : hb.ilkBolum + '. bölümde açılır') + '</span>' +
        (hb.acik && hb.notlar && hb.notlar.length ? '<ul class="hk-notlar">' + hb.notlar.map(function (n) {
          return n.metin ? '<li class="bulundu"><i aria-hidden="true"></i><span><em>Bekçinin notu · ' + n.bolum + '. bölüm</em>' + n.metin + '</span></li>'
            : '<li><i aria-hidden="true"></i><span><em>Bulunmadı · ' + n.bolum + '. bölüm</em>Ateşböceği yolunda bir not asılı.</span></li>';
        }).join('') + '</ul>' : '') +
        (hb.son ? '<p class="hk-son"><em>' + hb.son.baslik + '</em>' + hb.son.metin + '</p>' : '') +
        (hb.ikinci ? '<p class="hk-son"><em>İkinci yolculuk</em>' + hb.ikinci + '</p>' : '') + '</div>';
    }).join('');
    $('pHizNot').textContent = st.maxSpeed >= 40 ? 'Akış ustası: ipi erken bırakıp zincir kuruyorsun.' : 'İpi tam sarılmadan bırak, havadayken sıradakine tutun: hız ve ödül artar.';
    $('pBolum').textContent = done.length ? Math.max.apply(null, done) : '–';
    $('pGecilen').textContent = done.length;
    $('pAtes').textContent = ff;
    $('pMadalya').textContent = perfect + ' · ' + flow;
    $('pOdul').textContent = total;
    $('pEnIyiOdul').textContent = st.bestReward || 0;
    $('pRekor').textContent = rec.score || 0;
    $('pMetre').textContent = (rec.meters || 0) + ' m';
    $('pKat').textContent = Math.floor((rec.meters || 0) / 3);
    $('pAkis').textContent = 'x' + (rec.combo || 0);
    var di = G.dailyInfo();
    $('pGunluk').textContent = di.best;
    $('pSeri').textContent = di.streak + ' gün';
    $('pMaxSeri').textContent = di.maxStreak + ' gün';
    $('pDeneme').textContent = di.tries;
    renderDuvar(di.key);
    // v0.89: kimlik panosunun rozetleri (lig, seri), haftanın en iyisi, defterdeki bulunan not sayısı
    var hf = G.haftalikInfo();
    $('prLig').textContent = hf.ligAd ? hf.ligAd + ' ligi' : 'Lig yok'; $('prLig').className = 'pr-rozet lig' + hf.lig;
    $('prSeri').textContent = di.streak ? di.streak + ' gün seri' + (di.donmada ? ' · donmada' : '') : 'Seri yok';
    $('prSeri').className = 'pr-rozet' + (di.streak ? ' seri' : '');
    $('pHafta').textContent = hf.best;
    var notVar = 0, notHep = 0;
    G.hikaye().forEach(function (hb) { (hb.notlar || []).forEach(function (n) { notHep++; if (n.metin) notVar++; }); });
    $('prNotSay').textContent = 'Hikâye · bekçinin notları ' + notVar + '/' + notHep;
    show('ekProfil'); $('ekProfil').scrollTop = 0;
  }
  // Ad değiştirme Ayarlar'da; kalem düğmesi oraya götürür ve ad kutusunu açar
  $('prAdBtn').addEventListener('click', function () { openSettings(); setTimeout(function () { var a = $('adDegis'); a.scrollIntoView({ block: 'center' }); a.focus({ preventScroll: true }); }, 60); });
  // Profil panosundaki canlı Çıra: kuşandığın görünüşle halkada sallanır (Koleksiyon önizlemesi gibi)
  var prRaf = 0;
  function prBaslat() {
    var cv = $('prCira'), dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth || 320, h = window.innerHeight <= 700 ? 130 : 150;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
    var c = cv.getContext('2d'), L = G.gorunum();
    cancelAnimationFrame(prRaf);
    (function tick(now) {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      onizlemeCiz(c, w, h, reduceMotion ? 900 : now, L, false, '#1c1838', 1.3);
      if (!reduceMotion) prRaf = requestAnimationFrame(tick);
    })(performance.now());
  }
  function prDur() { cancelAnimationFrame(prRaf); }
  document.querySelectorAll('[data-geri]').forEach(function (b) { b.addEventListener('click', home); });
  document.querySelectorAll('#altMenu [data-sekme]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.dataset.sekme;
      if (t === current && (t !== 'ekDolap' || b.dataset.mod === dolapMod)) return;
      if (t === 'ekAna') home(); else if (t === 'ekBolumler') openLevels(); else if (t === 'ekGorevler') openTasks(); else if (t === 'ekDolap') openDolap(b.dataset.mod); else if (t === 'ekProfil') openProfile(); else if (t === 'ekYarisma') openYarisma(); else if (t === 'ekKoleksiyon') openKol(); else openSettings();
    });
  });

  // ---------- görevler ve başarımlar ----------
  var KADEME_AD = ['', 'Bronz', 'Gümüş', 'Altın'], ZORLUK = ['Kolay', 'Orta', 'Zor'], ODUL = [5, 10, 15]; // ateşböceği
  var ROZET = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6.2" fill="currentColor" opacity=".22"/><circle cx="12" cy="9" r="6.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.6 14l-1.6 7.5L12 19l5 2.5-1.6-7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  function openTasks() { renderTasks(); show('ekGorevler'); $('ekGorevler').scrollTop = 0; }
  function renderGirisSatir() {
    var gd = G.giris();
    $('girisSatir').innerHTML = '<i class="ikon-ates" aria-hidden="true"></i><span><b>Günlük giriş · ' + (gd.gun + 1) + '. gün</b><small>' +
      (gd.hazir ? 'Bugünün ödülü ' + gd.odul + ' ateşböceği' : 'Bugün alındı · yarın ' + gd.odul + ' ateşböceği') + '</small></span>' +
      (gd.hazir ? '<button type="button" class="ana g-al" id="girisSatirBtn">Aç</button>' : '<span class="g-alindi" aria-label="alındı">' + IK.svg('tik') + '</span>');
    var b = $('girisSatirBtn'); if (b) b.onclick = openGiris;
  }
  function renderTasks() {
    renderGirisSatir();
    var left = G.yeniGune(), hh = Math.floor(left / 3600000), mm = Math.floor(left % 3600000 / 60000);
    $('gorevSure').textContent = 'yenisi ' + (hh ? hh + ' sa ' : '') + mm + ' dk sonra';
    $('gorevListe').innerHTML = G.gorevler().map(function (m, i) {
      var pct = Math.round(m.prog / m.target * 100), text = window.KuyuGorev.missionText(m);
      var sag = m.claimed ? '<span class="g-alindi">' + IK.svg('tik') + 'Alındı</span>'
        : m.done ? '<span class="g-al-ikili"><button type="button" class="ana g-al" data-al="' + i + '">Al +' + ODUL[m.tier] + '</button>' +
          '<button type="button" class="g-al video-btn" data-al2="' + i + '" aria-label="Video izle, ' + ODUL[m.tier] * 2 + ' ateşböceği al">' + IK.svg('video') + '+' + ODUL[m.tier] * 2 + '</button></span>'
        : '<span class="g-odul"><i class="ikon-ates" aria-hidden="true"></i>' + ODUL[m.tier] + '</span>';
      return '<div class="gorev' + (m.done ? ' tamam' : '') + (m.claimed ? ' alindi' : '') + '">' +
        '<div class="g-ic"><small class="g-zor z' + m.tier + '">' + ZORLUK[m.tier] + '</small><b>' + text + '</b>' +
        '<div class="cubuk ince" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
        '<span class="g-ilerleme">' + m.prog + ' / ' + m.target + '</span></div>' + sag + '</div>';
    }).join('');
    var list = G.basarimlar(), got = 0;
    list.forEach(function (a) { got += a.tier; });
    $('basarimSay').textContent = got + '/' + list.length * 3 + ' kademe';
    $('basarimListe').innerHTML = list.map(function (a) {
      var pct = a.next == null ? 100 : Math.round(Math.max(0, a.val - a.prev) / (a.next - a.prev) * 100);
      var pips = '';
      for (var k = 1; k <= 3; k++) pips += '<i class="' + (k <= a.tier ? 'var' : '') + '"></i>';
      return '<div class="basarim t' + a.tier + '" aria-label="' + a.ad + ', ' + (a.kademe || 'kazanılmadı') + ', ' + a.valText + '">' +
        '<span class="b-rozet">' + ROZET + '</span>' +
        '<div class="b-ic"><div class="b-ust"><b>' + a.ad + '</b><span class="b-pip" aria-hidden="true">' + pips + '</span></div>' +
        '<small>' + a.acik + ': ' + a.valText + (a.nextText ? ' · sıradaki ' + KADEME_AD[a.tier + 1] + ' ' + a.nextText : ' · tamamlandı') + '</small>' +
        '<div class="cubuk ince" aria-hidden="true"><i style="width:' + pct + '%"></i></div></div></div>';
    }).join('');
    $('gorevNokta').hidden = !G.gorevBekleyen();
  }
  $('gorevListe').addEventListener('click', function (e) {
    var b2 = e.target.closest('[data-al2]');
    if (b2) { video(function () { var r2 = G.gorevAl(+b2.dataset.al2, 2); if (r2) { if (G.sfx) G.sfx.firefly(); toast('+' + r2 + ' ateşböceği'); } renderTasks(); }); return; }
    var b = e.target.closest('[data-al]'); if (!b) return;
    var r = G.gorevAl(+b.dataset.al);
    if (r) { if (G.sfx) G.sfx.firefly(); toast('+' + r + ' ateşböceği'); }
    renderTasks();
  });

  // ---------- ödüllü video (yer tutucu) ----------
  // Web sürümünde reklam yok. Unity'de burada ödüllü reklam oynar; yalnızca oyuncu seçerse (Pofi kuralı).
  function video(done) {
    var n = 3;
    pencereAc('videoKatman'); $('videoSayac').textContent = n;
    var iv = setInterval(function () {
      n--; $('videoSayac').textContent = Math.max(0, n);
      if (n <= 0) { clearInterval(iv); pencereKapat('videoKatman'); done(); }
    }, 1000);
  }

  // ---------- günlük giriş ----------
  function openGiris() {
    var gd = G.giris(), h = '';
    for (var i = 0; i < gd.takvim.length; i++) {
      var durum = i < gd.gun ? 'alindi' : i === gd.gun ? (gd.hazir ? 'bugun' : 'alindi') : '';
      if (!gd.hazir && i === gd.gun) durum = 'yarin';
      // v0.90: her gün ipe asılı bir etiket (hafif eğik); alınanda yeşil damga, bugünkü sarı ve parlak, 7. gün hediye
      var egim = [-2.5, 2, -1.5, 2.5, -2, 1.5, -1][i % 7];
      h += '<div class="gun ' + durum + (i === 6 ? ' buyuk-gun' : '') + '" style="--e:' + egim + 'deg" aria-label="' + (i + 1) + '. gün, ' + gd.takvim[i] + ' ateşböceği' +
        (durum === 'alindi' ? ', alındı' : durum === 'bugun' ? ', bugün' : durum === 'yarin' ? ', yarın' : '') + '"><small>' + (i + 1) + '. gün</small>' +
        (i === 6 ? IK.svg('hediye') : '<i class="ikon-ates" aria-hidden="true"></i>') + '<b>' + gd.takvim[i] + '</b>' +
        (durum === 'alindi' ? '<span class="gun-damga" aria-hidden="true">' + IK.svg('tik') + '</span>' : durum === 'bugun' ? '<em aria-hidden="true">BUGÜN</em>' : durum === 'yarin' ? '<em aria-hidden="true">YARIN</em>' : '') + '</div>';
    }
    $('girisTakvim').innerHTML = h;
    $('girisAlBtn').hidden = $('girisVideoBtn').hidden = !gd.hazir;
    $('girisAlBtn').textContent = 'Al +' + gd.odul;
    $('girisVideoBtn').innerHTML = IK.svg('video') + 'Video izle, +' + gd.odul * 2 + ' al';
    $('girisKapat').textContent = gd.hazir ? 'Sonra' : 'Kapat';
    pencereAc('girisKatman');
  }
  function closeGiris() { pencereKapat('girisKatman'); if (current === 'ekAna') home2(); else if (current === 'ekGorevler') renderTasks(); }
  function home2() { $('toplamAtes').textContent = G.cuzdan().ates; }
  function girisAl(kat) {
    var r = G.girisAl(kat);
    if (r) { if (G.sfx) G.sfx.firefly(); toast('+' + r + ' ateşböceği'); }
    closeGiris();
  }
  $('girisAlBtn').addEventListener('click', function () { girisAl(1); });
  $('girisVideoBtn').addEventListener('click', function () { pencereKapat('girisKatman'); video(function () { girisAl(2); }); });
  $('girisKapat').addEventListener('click', closeGiris);

  // ---------- Market (v0.77, İstişare 4 Aşama 3) ----------
  // Haftanın ürünü (Destansı/Efsane, pazartesi döner), günlük vitrin (4 ürün, biri video ile %50), kategoriler.
  // Ürüne dokunmak ürün kartını açar: büyük önizleme, nadirlik, fiyat; Al ya da (sende varsa) Giy. Rastgele kutu yok.
  var dolapTur = 'karakter', dolapMod = 'market', urunId = null, urunRaf = 0;
  function openDolap() { renderMarket(); show('ekDolap'); $('ekDolap').scrollTop = 0; G.vitrinGordu(); $('marketNokta').hidden = true; }
  function urunDurum(it) {
    var EK = window.KuyuEkonomi, has = sahipMi(it.id), on = save().dolap.kusan[it.tur] === it.id, f = G.fiyat(it.id);
    if (on) return { metin: 'KUŞANILDI', sinif: 'sende' };
    if (has) return { metin: 'SENDE', sinif: 'sende' };
    if (it.etkinlik) return { metin: 'ETKİNLİK', sinif: 'kilit' };
    if (it.isik) return { metin: 'IŞIK ' + it.isik, sinif: 'kilit' };
    if (it.lig != null) return { metin: EK.LIG[it.lig].ad.toLocaleUpperCase('tr-TR'), sinif: 'kilit' };
    if (!G.satista(it.id)) return { metin: 'HAFTANIN ÜRÜNÜ OLUNCA', sinif: 'kilit' };
    return { metin: '<i class="ikon-ates" aria-hidden="true"></i>' + f + (f < it.fiyat ? ' <s>' + it.fiyat + '</s>' : ''), sinif: G.cuzdan().ates >= f ? 'al' : 'yetmez', fiyat: f };
  }
  function urunKart(it, ek) {
    var EK = window.KuyuEkonomi, nad = EK.nadirlik(it), d = urunDurum(it);
    return '<button type="button" class="m-urun n-' + nad + (d.sinif === 'kilit' ? ' kilit' : '') + '" data-urun="' + it.id + '" aria-label="' + it.ad + ', ' + EK.NADIRLIK[nad] + ', ' + d.metin.replace(/<[^>]+>/g, '') + '">' +
      '<span class="m-nad">' + EK.NADIRLIK[nad].toLocaleUpperCase('tr-TR') + '</span>' + (ek || '') + '<img src="' + resim(it) + '" alt=""><b>' + it.ad + '</b><span class="m-fiyat ' + d.sinif + '">' + d.metin + '</span></button>';
  }
  function renderMarket() {
    var EK = window.KuyuEkonomi, T = G.tahtalar();
    $('dolapBakiye').textContent = G.cuzdan().ates;
    // haftanın ürünü
    var hu = EK.item(G.haftaUrun());
    $('mHaftalik').hidden = !hu;
    if (hu) {
      var dh = urunDurum(hu);
      $('mHaftalik').className = 'm-haftalik n-' + EK.nadirlik(hu); $('mHaftalik').dataset.urun = hu.id;
      $('mHaftalikImg').src = resim(hu); $('mHaftalikAd').textContent = hu.ad;
      $('mHaftalikSure').innerHTML = IK.svg('saat') + T.haftaKalan;
      $('mHaftalikFiyat').innerHTML = dh.metin; $('mHaftalikFiyat').className = 'm-fiyat ' + dh.sinif;
    }
    // günlük vitrin: indirimli ürünün üstünde video şeridi
    var v = G.vitrin();
    $('mVitrinSure').innerHTML = IK.svg('saat') + T.gunKalan;
    $('mVitrin').innerHTML = v.urunler.map(function (id) {
      var it = EK.item(id), ind = id === v.indirimli && !sahipMi(id);
      return urunKart(it, ind ? '<span class="m-serit">' + (G.vitrinIndirimde(id) ? '%50 İNDİRİM' : IK.svg('video') + '%50') + '</span>' : '');
    }).join('');
    // kategoriler
    $('mSekmeler').innerHTML = Object.keys(EK.TURLER).map(function (t) { return '<button type="button" role="tab" data-mtur="' + t + '" aria-selected="' + (t === dolapTur) + '">' + EK.TURLER[t] + '</button>'; }).join('');
    var NS = { baslangic: 0, sira: 1, nadir: 2, destansi: 3, efsane: 4 };
    $('mIzgara').innerHTML = EK.KATALOG.filter(function (it) { return it.tur === dolapTur && it.fiyat !== 0; })
      .sort(function (a, b) { return (sahipMi(a.id) - sahipMi(b.id)) || (NS[EK.nadirlik(a)] - NS[EK.nadirlik(b)]) || ((a.fiyat || 0) - (b.fiyat || 0)); })
      .map(function (it) { return urunKart(it); }).join('');
  }
  // ürün kartı (katman)
  function urunAc(id) {
    var EK = window.KuyuEkonomi, it = EK.item(id); if (!it) return;
    urunId = id;
    var nad = EK.nadirlik(it), d = urunDurum(it), has = sahipMi(id), on = save().dolap.kusan[it.tur] === id, v = G.vitrin();
    $('urunAd').textContent = it.ad;
    $('urunNadir').textContent = EK.NADIRLIK[nad] + ' · ' + EK.TURLER[it.tur]; $('urunNadir').className = 'n-yazi n-' + nad;
    var not = it.tur === 'karakter' ? 'Aynı boyut ve hız, yalnız görünüş.' : '';
    if (it.etkinlik) not = it.etkinlik + ' olarak açılır; Market\'te satılmaz.';
    else if (it.isik) not = 'Kuyunun ışığı ' + it.isik + '. seviyeye gelince kendiliğinden açılır.';
    else if (it.lig != null) not = 'Haftalık Kuyu\'da ' + EK.LIG[it.lig].ad + ' ligine ulaşınca açılır.';
    else if (!has && !G.satista(id)) not = 'Efsane: yalnız haftanın ürünü olduğu hafta satılır.';
    else if (id === v.indirimli && !has) not = G.vitrinIndirimde(id) ? 'Bugün vitrinde %50 indirimli.' : 'Bugünün vitrin indirimi: video izlersen %50.';
    $('urunNot').textContent = not;
    var al = $('urunAl');
    al.disabled = false;
    if (on) { al.textContent = 'KUŞANILDI'; al.disabled = true; }
    else if (has) al.textContent = 'GİY';
    else if (d.sinif === 'kilit') { al.textContent = 'Satılmaz'; al.disabled = true; }
    else if (d.sinif === 'yetmez') { al.innerHTML = (d.fiyat - G.cuzdan().ates) + ' eksik'; al.disabled = true; }
    else al.innerHTML = 'AL · <i class="ikon-ates" aria-hidden="true"></i>' + d.fiyat;
    $('urunVideo').hidden = !(id === v.indirimli && !has && !G.vitrinIndirimde(id));
    clearTimeout(urunKapTimer); $('urunKatman').classList.remove('kapaniyor');
    $('urunSayfa').style.transition = ''; $('urunSayfa').style.transform = '';
    $('urunKatman').hidden = false;
    urunOnizle();
    (al.disabled ? $('urunKapat') : al).focus({ preventScroll: true });
  }
  // v0.84: alttan açılan sayfa aşağı kayarak kapanır (hemen = true: animasyonsuz, ör. sekme değişince)
  var urunKapTimer = 0;
  function urunKapat(hemen) {
    var k = $('urunKatman');
    cancelAnimationFrame(urunRaf); urunId = null; clearTimeout(urunKapTimer);
    if (k.hidden) return;
    if (hemen === true || reduceMotion) { k.hidden = true; k.classList.remove('kapaniyor'); return; }
    k.classList.add('kapaniyor');
    urunKapTimer = setTimeout(function () { k.hidden = true; k.classList.remove('kapaniyor'); $('urunSayfa').style.transform = ''; }, 220);
  }
  // aşağı çekerek kapatma: düğmeler dışında bir yerden tutulur; 90 px'ten fazla çekilirse kapanır, azsa geri yerine oturur
  var surukle = null;
  $('urunSayfa').addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    surukle = { y: e.clientY, dy: 0 }; this.setPointerCapture(e.pointerId); this.style.transition = 'none';
  });
  $('urunSayfa').addEventListener('pointermove', function (e) {
    if (!surukle) return;
    surukle.dy = Math.max(0, e.clientY - surukle.y);
    this.style.transform = surukle.dy ? 'translateY(' + surukle.dy + 'px)' : '';
  });
  function surukBitti() {
    if (!surukle) return;
    var dy = surukle.dy, s = $('urunSayfa'); surukle = null;
    if (dy > 90) { urunKapat(); return; }
    s.style.transition = 'transform .2s cubic-bezier(.3, 1.3, .5, 1)'; s.style.transform = '';
  }
  $('urunSayfa').addEventListener('pointerup', surukBitti);
  $('urunSayfa').addEventListener('pointercancel', surukBitti);
  // çıkartma kartı savrulur; kutla: üstüne ateşböceği parçacıkları da yükselir (satın alma ve giyme başarısı)
  function salla(el) {
    if (!el) return;
    var h = el.id === 'mHaftalik' ? el.parentNode : el; // haftanın ürünü askısıyla birlikte savrulur
    h.classList.remove('savrul'); void h.offsetWidth; h.classList.add('savrul');
    setTimeout(function () { h.classList.remove('savrul'); }, 650);
  }
  function kutla(el) {
    if (!el) return;
    salla(el);
    if (reduceMotion) return;
    for (var i = 0; i < 8; i++) {
      var p = document.createElement('i'), a = -Math.PI / 2 + (i - 3.5) * 0.34, d = 38 + (i % 3) * 14;
      p.className = 'bocek-parca'; p.setAttribute('aria-hidden', 'true');
      p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px'); p.style.setProperty('--dy', (Math.sin(a) * d - 12).toFixed(1) + 'px');
      el.appendChild(p);
      setTimeout(function (n) { n.remove(); }, 950, p);
    }
  }
  function marketKutla(id) {
    setTimeout(function () { document.querySelectorAll('#ekDolap [data-urun="' + id + '"]').forEach(kutla); }, 180);
  }
  function urunOnizle() {
    var cv = $('urunOnizleme'), dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth || 300, h = window.innerHeight <= 700 ? 150 : 180; // v0.84: sayfa küçük ekrana sığsın
    cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
    var c = cv.getContext('2d');
    cancelAnimationFrame(urunRaf);
    (function tick(now) {
      var it = urunId && window.KuyuEkonomi.item(urunId); if (!it) return;
      var ek = {}; ek[it.tur] = it.id;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      onizlemeCiz(c, w, h, now, G.gorunumIle(ek), it.tur === 'alev', '#1c1838', 1.3);
      urunRaf = requestAnimationFrame(tick);
    })(performance.now());
  }
  $('urunAl').addEventListener('click', function () {
    var it = window.KuyuEkonomi.item(urunId); if (!it) return;
    if (sahipMi(it.id)) { G.kusan(it.id); resimBellek = {}; toast(it.ad + ' kuşanıldı', 1600); urunKapat(); renderMarket(); marketKutla(it.id); return; }
    var r = G.satinAl(it.id);
    if (r.ok) { resimBellek = {}; if (G.sfx) G.sfx.won(); toast(it.ad + ' alındı ve kuşanıldı'); urunKapat(); renderMarket(); marketKutla(it.id); return; }
    if (r.neden === 'yetersiz') toast(r.eksik + ' ateşböceği eksik. Bölüm, Günlük ve Haftalık Kuyu, görev ve günlük girişten toplanır.');
    urunAc(it.id);
  });
  $('urunVideo').addEventListener('click', function () {
    var id = urunId; $('urunKatman').hidden = true; cancelAnimationFrame(urunRaf);
    video(function () { G.vitrinVideo(); toast('Bugün %50 indirimli', 1600); renderMarket(); urunAc(id); });
  });
  $('urunKapat').addEventListener('click', urunKapat);
  $('urunKatman').addEventListener('click', function (e) { if (e.target === $('urunKatman')) urunKapat(); });
  $('urunKatman').addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); urunKapat(); } });
  $('mSekmeler').addEventListener('click', function (e) { var b = e.target.closest('[data-mtur]'); if (!b) return; dolapTur = b.dataset.mtur; renderMarket(); });
  ['mVitrin', 'mIzgara'].forEach(function (k) { $(k).addEventListener('click', function (e) { var b = e.target.closest('[data-urun]'); if (b) { salla(b); urunAc(b.dataset.urun); } }); });
  $('mHaftalik').addEventListener('click', function () { if ($('mHaftalik').dataset.urun) { salla($('mHaftalik')); urunAc($('mHaftalik').dataset.urun); } });
  // Önizleme (Market ve Koleksiyon, v0.76): halkada sallanan kahraman; L görünüm, alevGoster alev basamaklarını döndürür
  function onizlemeCiz(c, w, h, now, L, alevGoster, zemin, olcek) {
      var t = now / 1000;
      c.fillStyle = zemin || '#121b1a'; c.fillRect(0, 0, w, h);
      var cx = w / 2, ringY = 26, rope = h * 0.52, r = h * 0.107 * (olcek || 1);
      var ang = Math.sin(t * 1.7) * 0.5, hx = cx + Math.sin(ang) * rope, hy = ringY + Math.cos(ang) * rope;
      // iz: sallanmanın gerisinde kalan kısa çizgi
      var izc = L.iz === 'atki' ? G.renk(L.atki, now) : G.renk(L.iz, now);
      c.strokeStyle = izc; c.lineCap = 'round';
      for (var i = 1; i < 7; i++) {
        var a2 = Math.sin((t - i * 0.05) * 1.7) * 0.5, a1 = Math.sin((t - (i - 1) * 0.05) * 1.7) * 0.5;
        c.lineWidth = 9 - i * 1.1; c.globalAlpha = 1 - i * 0.12;
        c.beginPath(); c.moveTo(cx + Math.sin(a1) * rope, ringY + Math.cos(a1) * rope + 5); c.lineTo(cx + Math.sin(a2) * rope, ringY + Math.cos(a2) * rope + 5); c.stroke();
      }
      c.globalAlpha = 1;
      c.lineWidth = 3; c.strokeStyle = '#d08a45'; c.beginPath(); c.arc(cx, ringY, 9, 0, 6.29); c.stroke();
      c.strokeStyle = G.renk(L.ip, now); c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx, ringY); c.lineTo(hx, hy - r * 0.2); c.stroke();
      c.save(); c.translate(cx, ringY - 13); c.scale(1.7, 1.7); G.kancaCiz(c, L.kanca, null, -Math.PI / 2); c.restore();
      // alev sekmesinde (ya da alev önizlenirken) Çıra alevli görünür; basamaklar sırayla döner
      if (alevGoster) G.alevCiz(c, hx, hy, r, now, 1 + Math.floor(t / 1.6) % 3, L.alev, L.alev2);
      hero(c, hx, hy, r, { x: Math.sin(t * 0.8) * 0.6, y: -0.5 }, null, L);
  }
  // ---------- Koleksiyon (v0.76, İstişare 4 Aşama 2) ----------
  // Karakterler ve takılar: nadirlik çerçeveli ızgara, büyük önizleme; sende olanı GİY, olmayanın nasıl açıldığı yazar.
  var kolTur = 'karakter', kolSecili = null, kolRaf = 0, resimBellek = {};
  var NAD_SIRA = { baslangic: 0, sira: 1, nadir: 2, destansi: 3, efsane: 4 };
  function kolEk(it) { var ek = {}; ek[it.tur] = it.id; if (it.tur === 'karakter') { ek.govde = 'govde-turuncu'; ek.bas = 'bas-yok'; ek.yuz = 'yuz-yok'; ek.atki = 'atki-turkuaz'; } return ek; }
  // küçük resim (data URL); görünüm değişince bellek temizlenir (takılar seçili karakterin üstünde görünür)
  function resim(it) {
    if (resimBellek[it.id]) return resimBellek[it.id];
    var cv = document.createElement('canvas'), d = 2, S = 76; cv.width = cv.height = S * d;
    var c = cv.getContext('2d'); c.scale(d, d);
    if (it.tur === 'kanca') { c.translate(S / 2, S / 2 + 4); c.scale(3, 3); G.kancaCiz(c, it.renk, '#e6eeec', -Math.PI / 2); }
    else if (it.tur === 'ip') { c.strokeStyle = G.renk(it.renk, 900); c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(16, 14); c.bezierCurveTo(60, 26, 16, 50, 60, 62); c.stroke(); }
    else if (it.tur === 'iz') { var iz = it.renk === 'atki' ? G.renk(G.gorunum().atki, 900) : G.renk(it.renk, 900); c.strokeStyle = iz; c.lineCap = 'round'; for (var q = 0; q < 5; q++) { c.globalAlpha = 1 - q * 0.17; c.lineWidth = 12 - q * 2; c.beginPath(); c.moveTo(14 + q * 10, 60 - q * 9); c.lineTo(24 + q * 10, 50 - q * 9); c.stroke(); } c.globalAlpha = 1; }
    else if (it.tur === 'alev') G.alevCiz(c, S / 2, S / 2 + 8, 15, 400, 2, it.renk, it.renk2);
    else G.kahramanCiz(c, S / 2, S / 2 + (it.tur === 'bas' ? 10 : 6), it.tur === 'bas' ? 19 : 21, 0.6, G.gorunumIle(kolEk(it)), { x: 0.25, y: -0.3 });
    return (resimBellek[it.id] = cv.toDataURL());
  }
  function sahipMi(id) { return save().dolap.sahip.indexOf(id) >= 0; }
  function openKol(tur, id) {
    if (tur) kolTur = tur;
    kolSecili = id || null;
    renderKol(); show('ekKoleksiyon'); $('ekKoleksiyon').scrollTop = 0;
  }
  function renderKol() {
    var EK = window.KuyuEkonomi, sv = save(), kus = sv.dolap.kusan, KAT = EK.KATALOG;
    var ozel = KAT.filter(function (it) { return it.fiyat !== 0; });
    $('kolSay').textContent = ozel.filter(function (it) { return sahipMi(it.id); }).length + ' / ' + ozel.length;
    $('kolSekmeler').innerHTML = Object.keys(EK.TURLER).map(function (t) { return '<button type="button" role="tab" data-kol="' + t + '" aria-selected="' + (t === kolTur) + '">' + EK.TURLER[t] + '</button>'; }).join('');
    var liste = KAT.filter(function (it) { return it.tur === kolTur; }).sort(function (a, b) { return (NAD_SIRA[EK.nadirlik(a)] - NAD_SIRA[EK.nadirlik(b)]) || ((a.fiyat || 0) - (b.fiyat || 0)); });
    if (!kolSecili || !EK.item(kolSecili) || EK.item(kolSecili).tur !== kolTur) kolSecili = kus[kolTur];
    $('kolIzgara').innerHTML = liste.map(function (it) {
      var has = sahipMi(it.id), on = kus[it.tur] === it.id, nad = EK.nadirlik(it);
      return '<button type="button" class="kol-kart n-' + nad + (has ? '' : ' kilit') + (it.id === kolSecili ? ' secili' : '') + '" data-kol-id="' + it.id + '" aria-label="' + it.ad + ', ' + EK.NADIRLIK[nad] + (on ? ', kuşanıldı' : has ? ', sende' : ', kilitli') + '">' +
        '<img src="' + resim(it) + '" alt="">' + (on ? '<span class="tik" aria-hidden="true">' + IK.svg('tik') + '</span>' : '') + (has ? '' : '<span class="kilit-ik" aria-hidden="true">' + IK.svg('kilit') + '</span>') + (it.etkinlik ? '<span class="etk" aria-hidden="true">ETKİNLİK</span>' : '') + '<b>' + it.ad + '</b></button>';
    }).join('');
    kolBilgi();
  }
  function kolBilgi() {
    var EK = window.KuyuEkonomi, it = EK.item(kolSecili); if (!it) return;
    var has = sahipMi(it.id), on = save().dolap.kusan[it.tur] === it.id, nad = EK.nadirlik(it), b = $('kolGiy'), ac = '';
    $('kolAd').textContent = it.ad;
    $('kolNadir').textContent = EK.NADIRLIK[nad] + ' · ' + EK.TURLER[it.tur]; $('kolNadir').className = 'n-yazi n-' + nad;
    b.disabled = false;
    if (on) { b.textContent = 'KUŞANILDI'; b.disabled = true; }
    else if (has) b.textContent = 'GİY';
    else if (it.etkinlik) { b.textContent = 'ETKİNLİK'; b.disabled = true; ac = it.etkinlik + ' olarak açılır; Market\'te satılmaz.'; }
    else if (it.isik) { b.textContent = 'IŞIK ' + it.isik; b.disabled = true; ac = 'Kuyunun ışığı ' + it.isik + '. seviyeye gelince kendiliğinden açılır.'; }
    else if (it.lig != null) { b.textContent = EK.LIG[it.lig].ad.toLocaleUpperCase('tr-TR') + ' LİG'; b.disabled = true; ac = 'Haftalık Kuyu\'da ' + EK.LIG[it.lig].ad + ' ligine ulaşınca açılır.'; }
    else { b.innerHTML = 'MARKET · <i class="ikon-ates" aria-hidden="true"></i>' + it.fiyat; ac = 'Market\'te ' + it.fiyat + ' ateşböceği.'; }
    $('kolAcilis').textContent = ac;
  }
  $('kolSekmeler').addEventListener('click', function (e) { var b = e.target.closest('[data-kol]'); if (!b) return; kolTur = b.dataset.kol; kolSecili = null; renderKol(); });
  $('kolIzgara').addEventListener('click', function (e) { var b = e.target.closest('[data-kol-id]'); if (!b) return; kolSecili = b.dataset.kolId; renderKol(); salla($('kolIzgara').querySelector('.secili')); });
  $('kolGiy').addEventListener('click', function () {
    var EK = window.KuyuEkonomi, it = EK.item(kolSecili); if (!it) return;
    if (sahipMi(it.id)) { G.kusan(it.id); resimBellek = {}; if (G.sfx) G.sfx.won(); toast(it.ad + ' kuşanıldı', 1600); renderKol(); kutla($('kolIzgara').querySelector('.secili')); return; }
    if (!it.etkinlik && !it.isik && it.lig == null) { dolapTur = it.tur; openDolap(); urunAc(it.id); } // Market'te ürün kartıyla açılır
  });
  function kolBaslat() {
    var cv = $('kolOnizleme'), dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth || 320, h = window.innerHeight <= 700 ? 150 : 170; // v0.84: ad şeridi altta, pano biraz kısaldı
    cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
    var c = cv.getContext('2d');
    cancelAnimationFrame(kolRaf);
    (function tick(now) {
      var it = window.KuyuEkonomi.item(kolSecili), ek = {};
      if (it) ek[it.tur] = it.id;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      onizlemeCiz(c, w, h, now, G.gorunumIle(ek), kolTur === 'alev', '#1c1838', 1.35);
      kolRaf = requestAnimationFrame(tick);
    })(performance.now());
  }
  function kolDur() { cancelAnimationFrame(kolRaf); }

  // ---------- bölümler ----------
  // Gruplar: 1–6 Öğrenme (el yapımı), sonra 10'arlı. Sıradaki bölüm = geçilmemiş ilk bölüm.
  var listUpto = 0, filtre = 'tumu';
  // v0.92: Hikâye 83 kısa bölüm (dört bölge) + ikinci yolculuk (84–107, bölge başına 6); her bölge bir grup
  function groupOf(n) { var r = G.bolgeAraligi(n); return { a: r.a, b: r.b, ad: G.bolgeAdi(r.a) }; }
  function goalsOf(n) {
    var d = G.levelDef(n), ff = (d.rings || []).filter(function (r) { return r[2] === 'ff'; }).length;
    var b = (save().best || {})[n] || {};
    var got = Math.min(ff, b.ff || 0) + (b.perfect ? 1 : 0) + (b.flow ? 1 : 0);
    return { d: d, b: b, ff: ff, total: ff + 2, got: got, y: G.yildiz ? G.yildiz(b, ff) : 0 };
  }
  // v0.86 yıldızlar: geçilmiş kartın sağ üstünde 0–3★ (eskiden ✓ ya da ★); geçilmemişte yok.
  function kartIsaret(g, isNext) {
    if (isNext) return '<span class="etiket">Sıradaki</span>';
    if (!g.b.done) return '';
    return G.yildizHtml ? G.yildizHtml(g.y, 'bk-yildiz') : '<span class="tik" aria-hidden="true">' + IK.svg('tik') + '</span>';
  }
  function nextLevel() { var best = save().best || {}, n = 1; while (best[n] && best[n].done && n <= G.bolumSayi) n++; return n; }
  function openLevels() {
    var s = save(), nx = nextLevel();
    listUpto = G.bolumSayi;
    renderLevels();
    show('ekBolumler');
    // sıradaki bölüme kaydır
    var el = $('liste').querySelector('[data-siradaki]');
    var ek = $('ekBolumler');
    if (el) ek.scrollTop = Math.max(0, el.offsetTop - ek.clientHeight / 2 + el.offsetHeight / 2); else ek.scrollTop = 0;
  }
  function renderLevels() {
    var s = save(), best = s.best || {}, nx = nextLevel(), h = '', shown = 0;
    var doneAll = 0, gotAll = 0, totAll = 0, yAll = 0;
    Object.keys(best).forEach(function (k) {
      if (!best[k].done) return;
      var g = goalsOf(+k); doneAll++; gotAll += g.got; totAll += g.total; yAll += g.y;
    });
    $('ozetGecilen').textContent = doneAll;
    $('ozetHedef').textContent = gotAll + '/' + totAll;
    if ($('ozetYildiz')) $('ozetYildiz').textContent = yAll + '/' + G.bolumSayi * 3;
    $('ozetCubuk').style.width = (totAll ? Math.round(gotAll / totAll * 100) : 0) + '%';
    for (var ga = 1; ga <= listUpto;) {
      var gr = groupOf(ga), cards = '', gDone = 0, gGot = 0, gTot = 0, gY = 0;
      for (var n = gr.a; n <= gr.b; n++) {
        var g = goalsOf(n), b = g.b, done = !!b.done, full = done && g.got >= g.total, isNext = n === nx;
        gTot += g.total; gGot += g.got; gY += g.y; if (done) gDone++;
        if (filtre === 'eksik' && !(done && !full) && !isNext) continue;
        var dots = '';
        for (var k = 0; k < g.ff; k++) dots += '<i class="' + (k < (b.ff || 0) ? 'var' : '') + '"></i>';
        dots += '<i class="m' + (b.perfect ? ' var' : '') + '"></i><i class="m' + (b.flow ? ' var' : '') + '"></i>';
        cards += '<button type="button" class="bkart' + (done ? ' gecildi' : '') + (full ? ' tam' : '') + (isNext ? ' siradaki' : '') + '" data-n="' + n + '"' +
          (isNext ? ' data-siradaki aria-current="true"' : '') + ' aria-label="Bölüm ' + n + ', ' + g.d.name + (done ? ', geçildi, ' + g.y + ' yıldız' : '') + ', ' + g.got + '/' + g.total + ' hedef">' +
          '<span class="bk-ust"><span class="no">' + n + '</span>' + kartIsaret(g, isNext) + '</span>' +
          '<b>' + g.d.name + '</b><span class="rozet">' + dots + '</span></button>';
        shown++;
      }
      if (cards) {
        var pct = gTot ? Math.round(gGot / gTot * 100) : 0;
        h += '<div class="bgrup"><div class="bgrup-ust"><b>' + (gr.ad ? gr.ad + ' · ' : '') + gr.a + '–' + gr.b + '</b><span>' + gDone + '/' + (gr.b - gr.a + 1) + ' geçildi · ' + gY + '/' + (gr.b - gr.a + 1) * 3 + IK.svg('yildiz') + '</span></div>' +
          '<div class="cubuk ince" aria-hidden="true"><i style="width:' + pct + '%"></i></div><div class="liste">' + cards + '</div></div>';
      }
      ga = gr.b + 1;
    }
    if (!shown) h = '<p class="bos">Eksik hedefi olan geçilmiş bölüm yok. Tümü sekmesinden yeni bölümlere geçebilirsin.</p>';
    $('liste').innerHTML = h;
    $('dahaBtn').hidden = true; // v0.62: liste sınırlı, hepsi görünür (v0.92: 107 bölüm)
  }
  $('liste').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-n]'); if (!b) return;
    G.startLevel(+b.dataset.n);
  });

  // ---------- Hikâye haritası (v0.87, İstişare 6 A4; taslak docs/istisare-6/harita-taslak.html) ----------
  // Kuyu duvarı: 1. bölüm dipte, yukarı tırmanılır; bölgeler doku ve renkle ayrılır, her bölgenin dibinde kirişe asılı tabela.
  // Kilit yok (liste gibi her bölüme girilir). Bölüm geçildikten sonra harita açılınca Çıra ip atıp bir üst halkaya atlar
  // (save.haritaSon: haritada en son gösterilen halka; yalnız görünüş). Liste düğmesi bugünkü bölüm listesini açar.
  var HR = { ARALIK: 92, DIP: 190, UST: 240, XS: [0.30, 0.56, 0.74, 0.62, 0.34, 0.50], BOLGE: ['tas', 'maden', 'kristal', 'kule'] };
  // v0.90: tek duvar. Tuğlalar her yerde aynı (simetrik, yarı saydam); altındaki renk yukarı doğru bölgeden bölgeye yavaşça geçer.
  // İkinci yolculuk aynı sırayla, biraz daha gece. Sıradaki bölümün üstü giderek kararır: yukarıdaki bölümler zor seçilir.
  var HR_RENK = ['#222b2d', '#30241a', '#251f45', '#1b2a44'], HR_RENK2 = ['#1c2330', '#2a1f28', '#211b3d', '#17223a'];
  var hrKonum = {}, hrH = 0, hrCiraN = 1, hrRaf = 0, hrUcus = null, hrSavrulT = 0, hrSonW = 0, hrAcikN = 0;
  var HR_IK = {
    gunes: '<svg class="hr-isaret" viewBox="0 0 26 26" aria-hidden="true"><g stroke-linecap="round"><path d="M13 2v3M13 21v3M2 13h3M21 13h3M5.2 5.2l2.1 2.1M18.7 18.7l2.1 2.1M5.2 20.8l2.1-2.1M18.7 7.3l2.1-2.1" stroke="#15112a" stroke-width="5"/><path d="M13 2v3M13 21v3M2 13h3M21 13h3M5.2 5.2l2.1 2.1M18.7 18.7l2.1 2.1M5.2 20.8l2.1-2.1M18.7 7.3l2.1-2.1" stroke="#ffe066" stroke-width="2.2"/></g><circle cx="13" cy="13" r="5.6" fill="#ffe066" stroke="#15112a" stroke-width="2.4"/></svg>',
    kagit: '<svg class="hr-isaret" viewBox="0 0 26 26" aria-hidden="true"><path d="M5 4h12l4 4v14H5z" fill="#fff4dc" stroke="#15112a" stroke-width="2.4" stroke-linejoin="round"/><path d="M9 11h8M9 15h8M9 19h5" stroke="#15112a" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  function hrBuyuk(n) { return n === G.bolgeAraligi(n).b; } // bölge sonu: büyük halka (ilk yolculukta bölge finali)
  function hrYaricap(n) { return hrBuyuk(n) ? 34 : 28; }
  function hrUstten(y) { return hrH - y; }
  // aşağıdan yukarı yerleşim: her bölge bir bant (v0.92: kısa bölümlerde 18–24 halka); bandın dibinde kiriş ve tabela, ikinci yolculuk öncesi ek tabela
  function hrYerlesim(W) {
    var bantlar = [], y = HR.DIP, ARL = G.bolgeAraliklari;
    hrKonum = {};
    ARL.forEach(function (r, g) {
      var alt = y, ikinciBas = r.ikinci && (g === 0 || !ARL[g - 1].ikinci);
      if (ikinciBas) y += 130;
      var tabelaY = y + 64; y += 146;
      for (var n = r.a, k = 0; n <= r.b; n++, k++) { hrKonum[n] = { x: Math.round(HR.XS[k % 6] * W), y: y }; y += HR.ARALIK; }
      y += 10;
      bantlar.push({ g: g, r: r, alt: alt, ust: y, tabelaY: tabelaY, ikinciBas: ikinciBas });
    });
    hrH = y + HR.UST;
    bantlar[bantlar.length - 1].ust = hrH;
    return bantlar;
  }
  function hrCiz(ciraN) {
    var duvar = $('hrDuvar'), W = duvar.clientWidth || 360, bantlar = hrYerlesim(W), sira = nextLevel(), h = '', toplam = 0, gs = [];
    for (var n = 1; n <= G.bolumSayi; n++) { gs[n] = goalsOf(n); toplam += gs[n].y; }
    hrSonW = W;
    duvar.style.height = hrH + 'px';
    bantlar.forEach(function (b) {
      var ikinci = b.r.ikinci, a = b.r.a, son = b.r.b, top = 0;
      for (var m = a; m <= son; m++) top += gs[m].y;
      var ad = String(G.bolgeAdi(a)).replace(' · ikinci yolculuk', '') + (ikinci ? ' · II' : '');
      var ky = hrUstten(b.tabelaY + 30);
      h += '<div class="hr-bkiris" style="top:' + ky + 'px" aria-hidden="true"></div>';
      h += '<div class="hr-btabela" style="top:' + (ky + 32) + 'px;--egim:' + (b.g % 2 ? 2 : -2) + 'deg"><b>' + ad + '</b><small>' + a + '–' + son + ' · ' + top + '/' + (son - a + 1) * 3 + IK.svg('yildiz') + '</small></div>';
      if (b.ikinciBas) h += '<div class="hr-btabela buyuk" style="top:' + hrUstten(b.alt + 78) + 'px;--egim:-1.5deg"><b>İkinci yolculuk</b><small>Su baştan izler</small></div>';
    });
    var renk = bantlar.slice().reverse().map(function (b) { return (b.r.ikinci ? HR_RENK2 : HR_RENK)[b.r.bi] + ' ' + (hrUstten((b.alt + b.ust) / 2) / hrH * 100).toFixed(2) + '%'; });
    duvar.style.setProperty('--hr-renk', 'linear-gradient(180deg, ' + renk.join(', ') + ')');
    var ilkSon = hrKonum[G.kisaSayi]; // ilk yolculuğun sonu: gün ışığı
    if (ilkSon) h += '<div class="hr-gun" style="top:' + hrUstten(ilkSon.y + 190) + 'px;height:300px" aria-hidden="true"></div>';
    h += '<div class="hr-gun tepe" style="top:60px;height:' + (HR.UST + 80) + 'px" aria-hidden="true"></div>';
    // ip: geçilen kısım krem, sonrası noktalı; halkalar arasında hafif sarkar
    var yolG = '', yolS = '';
    for (var i = 1; i < G.bolumSayi; i++) {
      var p = hrKonum[i], q = hrKonum[i + 1];
      var d = 'M' + p.x + ' ' + hrUstten(p.y) + ' Q' + (p.x + q.x) / 2 + ' ' + (hrUstten((p.y + q.y) / 2) + 16) + ' ' + q.x + ' ' + hrUstten(q.y) + ' ';
      if (i < sira) yolG += d; else yolS += d;
    }
    h += '<svg class="hr-ipler" width="' + W + '" height="' + hrH + '" aria-hidden="true"><path class="golge" d="' + yolG + '"/><path class="gecti" d="' + yolG + '"/><path class="sonra" d="' + yolS + '"/></svg>';
    var T = window.KuyuBolumler;
    for (var r = 1; r <= G.bolumSayi; r++) {
      var g = gs[r], done = !!g.b.done, durum = done ? 'gecildi' : r === sira ? 'siradaki' : 'bekliyor', final = hrBuyuk(r), tf = T && r <= G.kisaSayi ? T.kisaBul(r) : null;
      h += '<button type="button" class="hr-halka ' + durum + (final ? ' final' : '') + (r > G.kisaSayi ? ' ikinci' : '') + '" data-n="' + r + '" style="left:' + hrKonum[r].x + 'px;top:' + hrUstten(hrKonum[r].y) + 'px"' +
        (durum === 'siradaki' ? ' aria-current="step"' : '') + ' aria-label="Bölüm ' + r + ', ' + g.d.name + (done ? ', ' + g.y + ' yıldız' : durum === 'siradaki' ? ', sıradaki' : '') + '">' +
        '<i class="h" aria-hidden="true"></i><span class="no" aria-hidden="true">' + r + '</span>' +
        (final ? HR_IK.gunes : tf && tf.not ? HR_IK.kagit : '') +
        (done ? G.yildizHtml(g.y, 'hr-yildiz') : '') +
        (durum === 'siradaki' ? '<span class="hr-sira" aria-hidden="true">Sıradaki</span>' : '') + '</button>';
    }
    h += '<div class="hr-dip" aria-hidden="true"></div>';
    // karanlık: sıradaki halkanın biraz üstünden tepeye doğru koyulaşır (halkalar dokunulabilir kalır)
    if (hrKonum[sira]) h += '<div class="hr-karanlik" style="height:' + Math.max(0, hrUstten(hrKonum[sira].y) - 54) + 'px" aria-hidden="true"></div>';
    h += '<svg class="hr-atis" width="' + W + '" height="' + hrH + '" aria-hidden="true"><line id="hrAtisIp" x1="0" y1="0" x2="0" y2="0"/></svg>';
    h += '<canvas class="hr-cira" id="hrCira" width="128" height="168" aria-hidden="true"></canvas>';
    duvar.innerHTML = h;
    $('hrToplamSayi').textContent = toplam + '/' + G.bolumSayi * 3;
    $('hrToplam').setAttribute('aria-label', 'toplam ' + toplam + ' yıldız');
    hrCiraKoy(ciraN || Math.min(sira, G.bolumSayi));
  }
  // Çıra halkanın altında iple asılı: tuval 64×84, ipin bağlandığı nokta tuvalin tepesi (32, 0)
  function hrAsili(n) { var k = hrKonum[n]; return { x: k.x - 32, y: hrUstten(k.y) + hrYaricap(n) - 6 }; }
  function hrCiraKoy(n) {
    hrCiraN = n; var c = $('hrCira'), p = hrAsili(n);
    if (!c) return;
    c.style.left = p.x + 'px'; c.style.top = p.y + 'px';
    // Çıra'nın asılı olduğu geçilmiş halkada (hikâye bitince son bölüm) yıldızlar yana kayar, Çıra'nın altında kalmasın
    $('hrDuvar').querySelectorAll('.hr-halka.cira-burada').forEach(function (b) { b.classList.remove('cira-burada'); });
    var hb = $('hrDuvar').querySelector('.hr-halka[data-n="' + n + '"]'); if (hb) hb.classList.add('cira-burada');
  }
  function hrKaydir(n, yumusak) {
    var k = $('hrKuyu'), t = hrUstten(hrKonum[n].y) - k.clientHeight * 0.55;
    k.scrollTo({ top: Math.max(0, t), behavior: yumusak && !reduceMotion ? 'smooth' : 'auto' });
  }
  function hrAtisIp(x1, y1, x2, y2) { var l = $('hrAtisIp'); if (!l) return; l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2); }
  // Çıra çizimi: seçili karakter ve takılar (G.kahramanCiz); ipinde yavaşça sallanır, atlayınca savrulur
  function hrDongu() {
    cancelAnimationFrame(hrRaf);
    var c = $('hrCira'); if (!c) return;
    var ctx = c.getContext('2d'), L = G.gorunum();
    (function kare(now) {
      if (current !== 'ekHarita' || !document.body.contains(c)) return;
      var t = now / 1000, a = reduceMotion ? 0 : Math.sin(t * 1.8) * 0.07, s = (now - hrSavrulT) / 1000;
      if (!reduceMotion && s >= 0 && s < 1.2) a += Math.sin(s * 9) * 0.45 * Math.exp(-s * 3.2); // ipinde savrulma, sönerek
      ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.clearRect(0, 0, 64, 84);
      ctx.save(); ctx.translate(32, 0); ctx.rotate(hrUcus ? 0 : a); ctx.translate(-32, 0);
      if (!hrUcus) { ctx.strokeStyle = '#efe2c4'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(32, 0); ctx.lineTo(32, 30); ctx.stroke(); }
      G.kahramanCiz(ctx, 32, 46, 14, t, L, { x: 0, y: -0.6 });
      ctx.restore();
      hrRaf = requestAnimationFrame(kare);
    })(performance.now());
  }
  function hrDur() { cancelAnimationFrame(hrRaf); hrRaf = 0; hrUcus = null; if (!$('hrKatman').hidden) hrKapat(true); }
  // atlama: ip hedef halkaya uzanır (0,26 sn) → Çıra kavisle atlar (0,52 sn) → ipinde savrulur
  function hrAtla(a, b) {
    if (reduceMotion) { hrCiraKoy(b); hrKaydir(b, false); return; }
    var bas = hrAsili(a), son = hrAsili(b), hx = hrKonum[b].x, hy = hrUstten(hrKonum[b].y) + 12, c = $('hrCira');
    var IP = 260, UC = 520, t0 = performance.now();
    hrUcus = { a: a, b: b };
    hrKaydir(b, true);
    (function kare(now) {
      if (!hrUcus || current !== 'ekHarita' || !document.body.contains(c)) { hrUcus = null; return; }
      var t = now - t0, el = { x: bas.x + 32, y: bas.y + 34 }; // Çıra'nın eli
      if (t < IP) {
        var e = 1 - Math.pow(1 - t / IP, 3);
        hrAtisIp(el.x, el.y, el.x + (hx - el.x) * e, el.y + (hy - el.y) * e);
      } else if (t < IP + UC) {
        var u = (t - IP) / UC, k = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        var cx = (bas.x + son.x) / 2, cy = Math.min(bas.y, son.y) - 46;
        var x = (1 - k) * (1 - k) * bas.x + 2 * (1 - k) * k * cx + k * k * son.x, y = (1 - k) * (1 - k) * bas.y + 2 * (1 - k) * k * cy + k * k * son.y;
        c.style.left = x + 'px'; c.style.top = y + 'px';
        hrAtisIp(hx, hy, x + 32, y + 34);
      } else {
        hrAtisIp(0, 0, 0, 0); hrUcus = null; hrCiraKoy(b); hrSavrulT = now;
        return;
      }
      requestAnimationFrame(kare);
    })(t0);
  }
  function openHarita() {
    var s = save(), sira = Math.min(nextLevel(), G.bolumSayi), son = s.haritaSon || 0;
    var bas = son && son < sira ? sira - 1 : sira; // birden çok bölüm geçildiyse yalnız son atlama gösterilir
    show('ekHarita');
    hrCiz(bas);
    hrKaydir(bas, false);
    hrDongu();
    if (bas !== sira) setTimeout(function () { if (current === 'ekHarita') hrAtla(bas, sira); }, 380);
    if (s.haritaSon !== sira) { s.haritaSon = sira; G.persist(); }
  }
  // bölüm sayfası
  function hrAc(n) {
    var g = goalsOf(n), b = g.b, d = g.d, ffT = g.ff, done = !!b.done, IK = G.madalyaIkon || {};
    var ffVar = done && ffT > 0 && (b.ff || 0) >= ffT, pVar = done && !!b.perfect, aVar = done && !!b.flow, ip = G.yildizIpucu ? G.yildizIpucu(b, ffT) : '';
    var bilgi = !done ? (n === nextLevel() ? 'Sıradaki bölüm' : 'Henüz geçilmedi') :
      (b.time ? 'En iyi ' + b.time.toFixed(1).replace('.', ',') + ' sn' : 'Geçildi') + (ip ? ' · ' + ip : g.y >= 3 ? ' · bütün madalyalar' : '');
    function md(ok, ik, ad, alt, e) { return '<div class="hr-madalya' + (ok ? ' var' : '') + '" style="--e:' + e + 'deg">' + (ik || '') + '<b>' + ad + '</b><span>' + alt + '</span></div>'; }
    $('hrSayfa').innerHTML =
      '<div class="hr-s-ust"><span class="hr-s-no ' + (done ? 'gecildi' : n === nextLevel() ? 'siradaki' : '') + '" aria-hidden="true">' + n + '</span>' +
      '<div class="hr-s-ad"><small>' + G.bolgeAdi(n) + '</small><h2 id="hrAd">' + d.name + '</h2></div>' + G.yildizHtml(g.y, 'hr-s-yildiz') + '</div>' +
      '<div class="hr-madalyalar">' +
      md(ffVar, IK.ff, 'Ateşböceği', Math.min(b.ff || 0, ffT) + '/' + ffT, -2) +
      md(pVar, IK.perfect, 'Kusursuz', pVar ? 'alındı' : 'en çok ' + d.par + ' atış', 1.5) +
      md(aVar, IK.flow, 'Akış', aVar ? 'alındı' : 'hedef x' + d.flow, -1) + '</div>' +
      '<p class="hr-s-bilgi">' + bilgi + '</p>' +
      '<button type="button" class="ana buyuk genis" id="hrOyna">' + (done ? 'Tekrar oyna' : 'OYNA') + '</button>' +
      '<button type="button" class="metin-btn" id="hrVazgec">Vazgeç</button>';
    hrAcikN = n;
    var k = $('hrKatman'); clearTimeout(hrKapT); k.classList.remove('kapaniyor');
    $('hrSayfa').style.transition = ''; $('hrSayfa').style.transform = '';
    k.hidden = false;
    $('hrOyna').onclick = function () { hrKapat(true); G.startLevel(n); };
    $('hrVazgec').onclick = function () { hrKapat(); };
    $('hrOyna').focus({ preventScroll: true });
  }
  var hrKapT = 0;
  function hrKapat(hemen) {
    var k = $('hrKatman'), n = hrAcikN; hrAcikN = 0; clearTimeout(hrKapT);
    if (k.hidden) return;
    var odak = function () { var b = n && $('hrDuvar').querySelector('.hr-halka[data-n="' + n + '"]'); if (b && current === 'ekHarita') b.focus({ preventScroll: true }); };
    if (hemen === true || reduceMotion) { k.hidden = true; k.classList.remove('kapaniyor'); odak(); return; }
    k.classList.add('kapaniyor');
    hrKapT = setTimeout(function () { k.hidden = true; k.classList.remove('kapaniyor'); $('hrSayfa').style.transform = ''; odak(); }, 220);
  }
  $('hrDuvar').addEventListener('click', function (e) { var b = e.target.closest('.hr-halka'); if (b && !hrUcus) hrAc(+b.dataset.n); });
  $('hrKatman').addEventListener('click', function (e) { if (e.target === this) hrKapat(); });
  $('hrListe').addEventListener('click', function () { openLevels(); });
  // aşağı çekerek kapatma (ürün sayfasıyla aynı: 90 px'ten fazla çekilirse kapanır)
  (function () {
    var sr = null, s = $('hrSayfa');
    s.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; sr = { y: e.clientY, dy: 0 }; s.setPointerCapture(e.pointerId); s.style.transition = 'none'; });
    s.addEventListener('pointermove', function (e) { if (!sr) return; sr.dy = Math.max(0, e.clientY - sr.y); s.style.transform = sr.dy ? 'translateY(' + sr.dy + 'px)' : ''; });
    function bitti() { if (!sr) return; var dy = sr.dy; sr = null; if (dy > 90) { hrKapat(); return; } s.style.transition = 'transform .2s cubic-bezier(.3, 1.3, .5, 1)'; s.style.transform = ''; }
    s.addEventListener('pointerup', bitti); s.addEventListener('pointercancel', bitti);
  })();
  window.addEventListener('resize', function () {
    if (current !== 'ekHarita' || hrUcus) return;
    var d = $('hrDuvar'); if (d.clientWidth === hrSonW) return;
    var k = $('hrKuyu'), oran = k.scrollTop / (hrH || 1);
    hrCiz(hrCiraN); k.scrollTop = oran * hrH; hrDongu();
  });
  document.querySelectorAll('[data-filtre]').forEach(function (b) {
    b.addEventListener('click', function () {
      filtre = b.dataset.filtre;
      document.querySelectorAll('[data-filtre]').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      renderLevels();
    });
  });
  $('dahaBtn').addEventListener('click', function () { listUpto = groupOf(listUpto + 1).b; renderLevels(); });
  $('gitForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = parseInt($('gitNo').value, 10);
    if (n > 0) G.startLevel(n); else toast('Bir bölüm numarası yaz (1 ya da daha büyük).');
  });

  // ---------- ayarlar ----------
  function openSettings() {
    var s = save();
    $('sesAnahtar').setAttribute('aria-checked', s.mute ? 'false' : 'true');
    $('titresimAnahtar').setAttribute('aria-checked', s.haptics === false ? 'false' : 'true');
    $('muzikAnahtar').setAttribute('aria-checked', G.muzikAcik() ? 'true' : 'false');
    $('yaziAnahtar').setAttribute('aria-checked', s.buyukYazi ? 'true' : 'false');
    $('hayaletAnahtar').setAttribute('aria-checked', G.hayaletAcik() ? 'true' : 'false');
    $('adDegis').value = (s.profile && s.profile.name) || '';
    show('ekAyarlar');
  }
  $('muzikAnahtar').addEventListener('click', function () {
    var on = G.toggleMuzik();
    $('muzikAnahtar').setAttribute('aria-checked', on ? 'true' : 'false');
  });
  $('sesAnahtar').addEventListener('click', function () {
    var muted = G.toggleMute();
    $('sesAnahtar').setAttribute('aria-checked', muted ? 'false' : 'true');
  });
  // Büyük yazı (erişilebilirlik): <html class="buyuk-yazi">; menülerdeki küçük yazılar büyür, oyun alanı değişmez.
  function yaziUygula() { document.documentElement.classList.toggle('buyuk-yazi', !!save().buyukYazi); }
  yaziUygula();
  $('yaziAnahtar').addEventListener('click', function () {
    var on = G.toggleBuyukYazi();
    $('yaziAnahtar').setAttribute('aria-checked', on ? 'true' : 'false');
    yaziUygula();
  });
  $('hayaletAnahtar').addEventListener('click', function () {
    var on = G.toggleHayalet();
    $('hayaletAnahtar').setAttribute('aria-checked', on ? 'true' : 'false');
  });
  $('titresimAnahtar').addEventListener('click', function () {
    var on = G.toggleHaptics();
    $('titresimAnahtar').setAttribute('aria-checked', on ? 'true' : 'false');
  });
  $('adForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var s = save(), name = cleanName($('adDegis').value);
    if (!name) { toast('Ad boş olamaz.'); return; }
    s.profile = Object.assign({}, s.profile || { method: 'misafir', createdAt: Date.now() }, { name: name });
    G.persist();
    toast('Adın kaydedildi: ' + name);
  });
  $('tanitimBtn').addEventListener('click', runIntro);

  // ---------- oyun istatistikleri (js/istatistik.js) ----------
  function kutu(etiket, deger) { return '<div><small>' + etiket + '</small><b>' + deger + '</b></div>'; }
  function openIstat() {
    var o = G.istatOzet(), b = o.bolumler, h = o.halka;
    $('istatBas').textContent = o.baslangic + ' tarihinden beri bu cihazda oynadıkların. Hiçbir yere gönderilmez.';
    $('istatGenel').innerHTML = kutu('Oynama süresi', String(o.toplamSureDk).replace('.', ',') + ' dk') + kutu('Bölüm denemesi', b.deneme) +
      kutu('Geçiş', b.gecis) + kutu('Ölüm', b.olum) + kutu('Atlanan', b.atla) + kutu('Yarıda bırakılan', b.terk);
    $('istatZor').innerHTML = o.zorlanilan.length ? o.zorlanilan.map(function (z) {
      var parca = [z.deneme + ' deneme', z.gecis + ' geçiş'];
      if (z.olum) parca.push(z.olum + ' ölüm (çoğu %' + z.olumYerOrtanca + ' yükseklikte)');
      if (z.atla) parca.push(z.atla + ' atlama');
      if (z.terk) parca.push(z.terk + ' yarıda');
      return '<div class="istat-satir"><b>' + z.n + '. bölüm</b><span>' + parca.join(' · ') + '</span></div>';
    }).join('') : '<p class="bos">Henüz zorlanılan bölüm yok.</p>';
    function kosuSatir(ad, k) {
      if (!k.kosu) return '<div class="istat-satir"><b>' + ad + '</b><span>Henüz koşu yok</span></div>';
      return '<div class="istat-satir"><b>' + ad + '</b><span>' + k.kosu + ' koşu · ortanca ' + k.ortancaMetre + ' m · en iyi ' + k.enIyiMetre + ' m · en uzun akış x' + k.enUzunAkis + '</span>' +
        '<small>Son koşular: ' + k.sonMetreler.join(', ') + ' m</small></div>';
    }
    $('istatKosu').innerHTML = kosuSatir('Sonsuz Kuyu', o.sonsuz) + kosuSatir('Günlük Kuyu', o.gunluk);
    $('istatHalka').innerHTML = kutu('Hız halkası', h.hiz) + kutu('Rüzgâr şeridi', h.serit) + kutu('Yay', h.yay) + kutu('Geçit', h.gecit) +
      kutu('Sarkaç', h.sarkac) + kutu('Boş atış', h.bos) + kutu('Kurtarma', h.kurtarma) + kutu('El kayması', h.kayma) + kutu('Atış', h.atis);
    $('istatSifirla').textContent = 'İstatistiği sıfırla'; sifirSor = false;
    var eskiMetin = document.querySelector('.istat-metin'); if (eskiMetin) eskiMetin.remove();
    show('ekIstat'); $('ekIstat').scrollTop = 0;
  }
  var sifirSor = false;
  $('istatBtn').addEventListener('click', openIstat);
  $('istatKopyala').addEventListener('click', function () {
    var metin = JSON.stringify({ oyun: 'Hoook', surum: (document.querySelector('.surum') || {}).textContent, istatistik: G.istatOzet() }, null, 1);
    function yedek() { // pano izni yoksa metni seçili bir kutuda göster
      var eski = document.querySelector('.istat-metin'); if (eski) eski.remove();
      var ta = document.createElement('textarea'); ta.value = metin; ta.className = 'istat-metin'; ta.readOnly = true;
      $('istatKopyala').after(ta); ta.focus(); ta.select(); toast('Metin seçildi; uzun basıp kopyala.');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(metin).then(function () { toast('İstatistik panoya kopyalandı'); }, yedek);
    else yedek();
  });
  $('istatSifirla').addEventListener('click', function () {
    if (!sifirSor) { sifirSor = true; $('istatSifirla').textContent = 'Emin misin? Silmek için tekrar dokun'; return; }
    G.istatSifirla(); toast('İstatistik sıfırlandı'); openIstat();
  });
  // Yedek: ilerleme kodu panoya kopyalanır; geri yükleme kodu yapıştırılarak yapılır (bu cihazdaki ilerlemenin yerine geçer)
  $('yedekAlBtn').addEventListener('click', function () {
    var kod = G.yedekAl();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(kod).then(function () { toast('Yedek kodu kopyalandı. Notlarına ya da kendine mesaj olarak sakla.', 3600); }, function () { window.prompt('Yedek kodun (kopyala ve sakla):', kod); });
    else window.prompt('Yedek kodun (kopyala ve sakla):', kod);
  });
  $('yedekYukleBtn').addEventListener('click', function () {
    var kod = window.prompt('Yedek kodunu yapıştır (KUYU1. ile başlar):');
    if (!kod) return;
    if (!window.confirm('Bu cihazdaki ilerlemenin yerine yedekteki ilerleme gelecek. Devam edilsin mi?')) return;
    if (G.yedekYukle(kod)) location.reload(); else toast('Kod geçersiz. KUYU1. ile başlayan kodun tamamını yapıştır.', 3600);
  });
  $('ipucuSifirBtn').addEventListener('click', function () { G.resetIntros(); toast('Tanıtım kartları yeni şeyleri ilk gördüğünde yeniden çıkacak.'); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && (current === 'ekBolumler' || current === 'ekAyarlar' || current === 'ekProfil' || current === 'ekYarisma')) home();
    if ((e.key === 'Enter' || e.key === ' ') && current === 'ekTanitim') $('ekTanitim').click();
  });

  // ---------- sahne: kuyunun içi (ana menü ve tanıtım) ----------
  // Tanıtımda kahraman dipten kanca atar, halkaya çekilir ve gün ışığına fırlar; sonra halkada sallanır.
  var sceneRaf = 0, sceneT0 = 0, sceneCanvas = null, brick = null, brickKey = '';
  var flies = [];
  for (var i = 0; i < 44; i++) flies.push({ x: 0.04 + Math.random() * 0.92, y: 0.2 + Math.random() * 0.7, p: Math.random() * 6.28, s: 0.4 + Math.random() * 0.6 });
  // Kuyunun ışığı (ana menü): seviye arttıkça daha çok ateşböceği, sıcak bir parıltı ve duvarda yanan fenerler.
  // Tanıtım sahnesi her zaman aynı kalır (önsöz).
  var isikSv = 0;
  function isikGuncelle() { isikSv = Math.min(10, G.isik ? G.isik().seviye : 0); } // sahne ilk 10 seviyeyle aydınlanır; 11–20 ışık yolu
  var DUVAR_FENER = [[0.07, 0.78], [0.93, 0.66], [0.07, 0.54], [0.93, 0.42], [0.07, 0.3], [0.93, 0.18], [0.07, 0.1], [0.93, 0.88]];

  function startScene() {
    sceneCanvas = current === 'ekAna' ? $('anaSahne') : $('tanitimSahne');
    if (!sceneRaf) sceneRaf = requestAnimationFrame(drawScene);
  }
  function stopScene() { if (sceneRaf) cancelAnimationFrame(sceneRaf); sceneRaf = 0; }

  function fitCanvas(c) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    var ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h, dpr: dpr };
  }

  function bricks(w, h, dpr) {
    var key = w + 'x' + h + 'x' + dpr;
    if (brick && brickKey === key) return brick;
    brickKey = key;
    brick = document.createElement('canvas'); brick.width = Math.round(w * dpr); brick.height = Math.round(h * dpr);
    var c = brick.getContext('2d'), seed = 11, rowH = 26;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    c.scale(dpr, dpr);
    c.fillStyle = '#101817'; c.fillRect(0, 0, w, h);
    for (var r = 0; r * rowH < h; r++) {
      var y = r * rowH, x = -(r % 2) * 24;
      while (x < w) {
        var bw = 40 + Math.floor(rnd() * 26), sh = 28 + Math.floor(rnd() * 14);
        c.fillStyle = 'rgb(' + (sh - 6) + ',' + (sh + 4) + ',' + (sh + 1) + ')';
        c.fillRect(x + 1.5, y + 1.5, bw - 3, rowH - 3);
        if (rnd() < 0.16) { c.fillStyle = 'rgba(79,107,68,.35)'; c.beginPath(); c.ellipse(x + bw * rnd(), y + rowH - 3, 7 + rnd() * 8, 3, 0, 0, 6.29); c.fill(); }
        x += bw;
      }
    }
    // kenarlar daha koyu: kuyunun yuvarlak hissi
    var g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(5,9,10,.75)'); g.addColorStop(0.22, 'rgba(5,9,10,0)'); g.addColorStop(0.78, 'rgba(5,9,10,0)'); g.addColorStop(1, 'rgba(5,9,10,.75)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    return brick;
  }

  // v0.76: kahraman seçili karakter ve takılarla (js/karakter.js); scarf: tanıtımdaki parlayan atkı rengi
  function hero(ctx, x, y, r, look, scarf, L) {
    var L0 = L || G.gorunum();
    if (scarf) L0 = Object.assign({}, L0, { atki: scarf });
    G.kahramanCiz(ctx, x, y, r, performance.now() / 1000, L0, look);
  }
  function ring(ctx, x, y, r) {
    ctx.fillStyle = '#1b1310'; ctx.fillRect(x - r * 0.4, y - r * 1.4, r * 0.8, r * 0.6);
    ctx.lineWidth = r * 0.42; ctx.strokeStyle = '#7a4b22'; ctx.beginPath(); ctx.arc(x, y + 1, r * 0.9, 0, 6.29); ctx.stroke();
    ctx.lineWidth = r * 0.28; ctx.strokeStyle = '#d08a45'; ctx.beginPath(); ctx.arc(x, y, r * 0.9, 0, 6.29); ctx.stroke();
  }
  function ease(t) { return t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3); }

  function drawScene(now) {
    sceneRaf = requestAnimationFrame(drawScene);
    if (!sceneCanvas || sceneCanvas.clientWidth === 0) return;
    var f = fitCanvas(sceneCanvas), ctx = f.ctx, w = f.w, h = f.h, t = now / 1000;
    var u = Math.min(w, 460) / 360; // dünya birimi
    var cx = w / 2;
    ctx.drawImage(bricks(w, h, f.dpr), 0, 0, w, h);
    // gün ışığı yukarıdan
    var lg = ctx.createRadialGradient(cx, -h * 0.15, 10, cx, -h * 0.15, h * 0.95);
    lg.addColorStop(0, 'rgba(227,244,242,.55)'); lg.addColorStop(0.35, 'rgba(191,230,238,.14)'); lg.addColorStop(1, 'rgba(191,230,238,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(227,244,242,.07)';
    ctx.beginPath(); ctx.moveTo(cx - w * 0.28, 0); ctx.lineTo(cx + w * 0.28, 0); ctx.lineTo(cx + w * 0.14, h * 0.75); ctx.lineTo(cx - w * 0.14, h * 0.75); ctx.closePath(); ctx.fill();

    // kuyunun ışığı: sıcak parıltı ve duvar fenerleri (yalnızca ana menüde)
    var ana = current === 'ekAna', sv = ana ? isikSv : 0;
    if (sv > 0) {
      var pg = ctx.createRadialGradient(cx, h * 0.62, 0, cx, h * 0.62, h * 0.7);
      pg.addColorStop(0, 'rgba(232,230,140,' + (0.025 * sv) + ')'); pg.addColorStop(1, 'rgba(232,230,140,0)');
      ctx.fillStyle = pg; ctx.fillRect(0, 0, w, h);
      for (var fi = 0; fi < Math.min(DUVAR_FENER.length, sv - 2); fi++) duvarFener(ctx, DUVAR_FENER[fi][0] * w, DUVAR_FENER[fi][1] * h, u, t + fi);
    }
    // ateşböcekleri: menüde ışık seviyesiyle çoğalır (8 + 3 × seviye), tanıtımda 14
    var flyN = ana ? 8 + 3 * sv : 14;
    flies.slice(0, flyN).forEach(function (fl) {
      var x = (fl.x + Math.sin(t * 0.3 * fl.s + fl.p) * 0.05) * w, y = (fl.y + Math.cos(t * 0.4 * fl.s + fl.p) * 0.03) * h;
      var a = 0.45 + 0.4 * Math.sin(t * 2 * fl.s + fl.p);
      var g = ctx.createRadialGradient(x, y, 0, x, y, 12 * u);
      g.addColorStop(0, 'rgba(232,242,124,' + (a * 0.9) + ')'); g.addColorStop(1, 'rgba(232,242,124,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 12 * u, y - 12 * u, 24 * u, 24 * u);
    });

    // halkalar
    var ringY = current === 'ekAna' ? h * 0.47 : h * 0.52;
    if (current === 'ekAna') {
      // v0.83: Çıra kirişin altında, yan etiketlerin arasında asılı; OYNA'nın duvar halkasına binmez (ip 60u, yarıçap 19u)
      var kb = document.querySelector('#ekAna .kiris').offsetHeight, ob = document.querySelector('#ekAna .oyna-blok').offsetTop;
      ringY = kb + Math.max(18 * u, Math.min((ob - kb - 79 * u) * 0.4, ob - kb - 79 * u - 14 * u));
      ring(ctx, cx - 118 * u, ob - 70 * u, 9 * u); ring(ctx, cx + 116 * u, ob - 150 * u, 9 * u); // duvarda boş halkalar
    }
    ring(ctx, cx, ringY, 11 * u);
    if (current !== 'ekAna') { ring(ctx, cx - 110 * u, ringY + 150 * u, 9 * u); ring(ctx, cx + 105 * u, ringY - 140 * u, 9 * u); }

    var r = (current === 'ekAna' ? 19 : 13) * u, rope = (current === 'ekAna' ? 60 : 46) * u; // ana ekranda Çıra büyük (v0.75)
    if (current === 'ekTanitim') {
      // Önsöz (docs/hikaye.md): kuyunun ağzında fener → bir kıvılcım kopup düşer → dipte Çıra gözünü açar.
      var k0 = reduceMotion ? 99 : (now - sceneT0) / 1000, k = k0 - ONSOZ;
      var startY = h * 0.9, ringX = cx, fx = cx, fyF = h * 0.07;
      fener(ctx, fx, fyF, u, t, k0 < ONSOZ ? 1 : 0.6);
      if (k0 < ONSOZ) {
        if (k0 > 0.35 && k0 < 1.15) { // kıvılcım düşüyor
          var dk = (k0 - 0.35) / 0.8, sy = fyF + 14 * u + (startY - fyF - 14 * u) * dk * dk;
          var sg = ctx.createRadialGradient(fx, sy, 0, fx, sy, 14 * u);
          sg.addColorStop(0, 'rgba(255,200,120,0.9)'); sg.addColorStop(1, 'rgba(255,160,80,0)');
          ctx.fillStyle = sg; ctx.fillRect(fx - 14 * u, sy - 14 * u, 28 * u, 28 * u);
          ctx.strokeStyle = 'rgba(255,170,90,0.5)'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(fx, sy - 30 * u * dk); ctx.lineTo(fx, sy); ctx.stroke();
          ctx.fillStyle = '#ffd08a'; ctx.beginPath(); ctx.arc(fx, sy, 3 * u, 0, 6.29); ctx.fill();
        } else if (k0 >= 1.15) { // iner, parlar, Çıra uyanır
          var wk = Math.min(1, (k0 - 1.15) / 0.4), gl = ctx.createRadialGradient(cx, startY, 0, cx, startY, 40 * u * (1.2 - wk * 0.4));
          gl.addColorStop(0, 'rgba(255,190,110,' + (0.5 * (1 - wk * 0.5)) + ')'); gl.addColorStop(1, 'rgba(255,190,110,0)');
          ctx.fillStyle = gl; ctx.fillRect(cx - 50 * u, startY - 50 * u, 100 * u, 100 * u);
          hero(ctx, cx, startY, r * (0.4 + 0.6 * wk), { x: 0, y: wk < 0.7 ? 1 : -1 });
        }
      } else if (k < 0.3) { hero(ctx, cx, startY, r, { x: 0, y: -1 }); }
      else if (k < 0.45) { // kanca uçuyor
        var hk = ease((k - 0.3) / 0.15);
        ctx.strokeStyle = '#eadfc4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, startY); ctx.lineTo(cx, startY + (ringY - startY) * hk); ctx.stroke();
        hero(ctx, cx, startY, r, { x: 0, y: -1 });
      } else if (k < 0.85) { // çekiliyor
        var pk = Math.pow((k - 0.45) / 0.4, 1.6), py = startY + (ringY + rope - startY) * pk;
        ctx.strokeStyle = '#eadfc4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(ringX, ringY); ctx.stroke();
        trailUp(ctx, cx, py, r, 0.6);
        hero(ctx, cx, py, r, { x: 0, y: -1 });
      } else if (k < 1.3) { // bırakıp gün ışığına fırlıyor
        var fk = (k - 0.85) / 0.45, fy = ringY + rope - (ringY + rope + r * 3) * ease(fk);
        trailUp(ctx, cx, fy, r, 1);
        hero(ctx, cx, fy, r, { x: 0, y: -1 }, '#e8f27c');
      } else { // geri gelip halkada sallanıyor
        swing(ctx, cx, ringY, rope, r, t, Math.min(1, (k - 1.3) / 0.5));
      }
      if (k > 1.05 && k < 1.6) { // ışık parlaması
        ctx.fillStyle = 'rgba(227,244,242,' + (0.35 * (1 - Math.abs(k - 1.25) / 0.35)) + ')';
        ctx.fillRect(0, 0, w, h);
      }
    } else {
      swing(ctx, cx, ringY, rope, r, t, 1);
    }

    // dipte su
    var wy = h - 34 * u;
    ctx.fillStyle = 'rgba(28,106,114,.85)';
    ctx.beginPath(); ctx.moveTo(0, h);
    for (var x = 0; x <= w + 12; x += 12) ctx.lineTo(x, wy + Math.sin(x / 30 + t * 2) * 3);
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(95,195,201,.8)'; ctx.lineWidth = 2; ctx.beginPath();
    for (var x2 = 0; x2 <= w + 12; x2 += 12) { var yy = wy + Math.sin(x2 / 30 + t * 2) * 3; if (x2 === 0) ctx.moveTo(x2, yy); else ctx.lineTo(x2, yy); }
    ctx.stroke();
    // ana menüde düğmeler okunur kalsın: alt kısım koyulaşır
    if (current === 'ekAna') {
      var bg = ctx.createLinearGradient(0, h * 0.55, 0, h);
      bg.addColorStop(0, 'rgba(13,20,22,0)'); bg.addColorStop(1, 'rgba(13,20,22,.75)');
      ctx.fillStyle = bg; ctx.fillRect(0, h * 0.55, w, h * 0.45);
    }
  }
  // Duvar feneri (kuyunun ışığı): duvara çakılı küçük fener
  function duvarFener(ctx, x, y, u, t) {
    var fl = 0.85 + 0.15 * Math.sin(t * 7);
    var g = ctx.createRadialGradient(x, y, 1, x, y, 34 * u);
    g.addColorStop(0, 'rgba(255,200,120,' + (0.38 * fl) + ')'); g.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 34 * u, y - 34 * u, 68 * u, 68 * u);
    ctx.fillStyle = '#2b2118'; ctx.fillRect(x - 5 * u, y - 7 * u, 10 * u, 13 * u); ctx.fillRect(x - 7 * u, y - 9 * u, 14 * u, 2.5 * u);
    ctx.fillStyle = 'rgba(255,214,150,' + (0.7 + 0.3 * fl) + ')'; ctx.fillRect(x - 3 * u, y - 4 * u, 6 * u, 8 * u);
  }
  // Kuyunun ağzındaki fener (önsöz)
  var ONSOZ = 1.7;
  function fener(ctx, x, y, u, t, parlak) {
    var fl = (0.85 + 0.15 * Math.sin(t * 9)) * parlak;
    var g = ctx.createRadialGradient(x, y, 2, x, y, 70 * u);
    g.addColorStop(0, 'rgba(255,200,120,' + (0.5 * fl) + ')'); g.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 70 * u, y - 70 * u, 140 * u, 140 * u);
    ctx.strokeStyle = 'rgba(160,140,120,0.8)'; ctx.lineWidth = 1.5 * u; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y - 10 * u); ctx.stroke();
    ctx.fillStyle = '#2b2118'; ctx.fillRect(x - 8 * u, y - 10 * u, 16 * u, 20 * u);
    ctx.fillStyle = 'rgba(255,214,150,' + Math.min(1, 0.6 + 0.4 * fl) + ')'; ctx.fillRect(x - 5 * u, y - 6 * u, 10 * u, 12 * u);
    ctx.fillStyle = '#2b2118'; ctx.fillRect(x - 10 * u, y - 12 * u, 20 * u, 3 * u); ctx.fillRect(x - 10 * u, y + 9 * u, 20 * u, 3 * u);
  }
  function trailUp(ctx, x, y, r, a) {
    ctx.strokeStyle = 'rgba(232,242,124,' + (0.55 * a) + ')'; ctx.lineCap = 'round';
    for (var i = 1; i < 6; i++) { ctx.lineWidth = r * (0.6 - i * 0.08); ctx.beginPath(); ctx.moveTo(x, y + r * 0.4 + (i - 1) * r * 0.55); ctx.lineTo(x, y + r * 0.4 + i * r * 0.55); ctx.stroke(); }
  }
  function swing(ctx, cx, ringY, rope, r, t, amp) {
    var ang = Math.sin(t * 1.7) * 0.42 * amp;
    var hx = cx + Math.sin(ang) * rope, hy = ringY + Math.cos(ang) * rope;
    ctx.strokeStyle = G.renk(G.gorunum().ip); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, ringY); ctx.lineTo(hx, hy - r * 0.2); ctx.stroke();
    hero(ctx, hx, hy, r, { x: Math.sin(t * 0.8) * 0.6, y: -0.5 });
  }

  window.addEventListener('resize', function () { brickKey = ''; });

  // ---------- tam ekran ve kurulum ----------
  var standalone = (window.matchMedia && (window.matchMedia('(display-mode: fullscreen)').matches || window.matchMedia('(display-mode: standalone)').matches)) || navigator.standalone;
  var canFull = !!(document.documentElement.requestFullscreen) && !standalone;
  if (!canFull) {
    $('tamEkranBtn').hidden = true;
    $('tamEkranYazi').textContent = standalone ? 'Oyun ana ekrandan açıldı, zaten tam ekran.' : 'Bu tarayıcıda tam ekran yok. Paylaş menüsünden "Ana Ekrana Ekle" ile kurarsan tam ekran açılır.';
  }
  $('tamEkranBtn').addEventListener('click', function () {
    if (document.fullscreenElement) { document.exitFullscreen().catch(function () {}); return; }
    document.documentElement.requestFullscreen({ navigationUI: 'hide' }).then(function () {
      try { screen.orientation && screen.orientation.lock && screen.orientation.lock('portrait').catch(function () {}); } catch (e) {}
    }).catch(function () { toast('Tam ekran açılamadı.'); });
  });
  document.addEventListener('fullscreenchange', function () { $('tamEkranBtn').textContent = document.fullscreenElement ? 'Kapat' : 'Aç'; });

  // Servis çalışanı: ana ekrana eklenebilir ve internetsiz açılır (https ya da localhost'ta)
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  // oyunun kullandığı arayüz
  window.KuyuScreens = {
    home: home,
    hak: openHak,
    tablo: openYarisma, // skor tablosu (v0.73); v0.89: Sıralama sekmesi
    // sonuç kartındaki kısa yol: Dolap o ürünün önizlemesiyle açılır
    koleksiyon: function (tur, id) { openKol(tur, id); },
    dolap: function (id) {
      var it = window.KuyuEkonomi.item(id);
      if (it) dolapTur = it.tur;
      openDolap();
      if (it) urunAc(id);
    },
    levels: function (liste) { if (liste) openLevels(); else openHarita(); },
    showGame: function () { show('oyun'); },
    toast: toast,
    hikaye: hikaye,
    video: video
  };

  // ---------- yerel uygulama hissi (v0.78) ----------
  // Tarayıcı izleri: iki parmakla yakınlaştırma ve uzun basma menüsü kapalı (yazı alanları hariç); çift dokunuş yakınlaştırmasını CSS touch-action kapatır
  ['gesturestart', 'gesturechange'].forEach(function (t) { document.addEventListener(t, function (e) { e.preventDefault(); }, { passive: false }); });
  document.addEventListener('touchmove', function (e) { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('contextmenu', function (e) { if (!e.target.closest('input, textarea')) e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { if (e.target.tagName === 'IMG') e.preventDefault(); });
  // ---------- Android geri tuşu ve geri hareketi (v0.80) ----------
  // Geçmişte görünmez bir koruma kaydı durur; geri gelince sırayla: açık pencere kapanır → oyunda duraklatılır
  // (duraklatmadaysa devam eder; sonuç kartında ana menüye dönülür) → OYNA dışındaki ekrandan OYNA'ya dönülür →
  // OYNA'da "Çıkmak için tekrar geri" uyarısı; 2 sn içinde ikinci geri uygulamadan çıkar.
  var GERI = { hoook: 'geri' }, cikisT = 0;
  function geriKur() { try { if (!(history.state && history.state.hoook === 'geri')) history.pushState(GERI, ''); } catch (e) {} }
  function geriIsle() {
    if (pencereAcik('videoKatman')) return true; // video sürerken geri bir şey yapmaz
    if (!$('urunKatman').hidden) { urunKapat(); return true; }
    if (!$('hrKatman').hidden) { hrKapat(); return true; }
    if (pencereAcik('hakKatman')) { $('hakKapat').click(); return true; }
    if (pencereAcik('girisKatman')) { $('girisKapat').click(); return true; }
    if (G.geri && G.geri()) return true;
    if (['ekAcilis', 'ekGiris', 'ekTanitim', 'ekAna', 'oyun'].indexOf(current) < 0) { home(); return true; }
    return false;
  }
  window.addEventListener('popstate', function () {
    if (geriIsle()) { geriKur(); return; }
    var t = Date.now();
    if (t - cikisT < 2000) { try { history.back(); } catch (e) {} return; } // ikinci geri: çık
    cikisT = t; toast('Çıkmak için tekrar geri', 2000); geriKur();
  });
  geriKur();

  // Her düğmeye basınca kısa ses ve hafif titreşim; ana düğmelerde (OYNA, Al, GİY, sekmeler) daha dolgun
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('button, [role="tab"]');
    if (!b || b.disabled || b.getAttribute('aria-disabled') === 'true') return;
    // v0.82: asılı etikete basınca ipinde savrulur (hareket azaltma açıksa yok)
    var as = !reduceMotion && b.parentNode && b.parentNode.classList && b.parentNode.classList.contains('aski') ? b.parentNode : null;
    if (as) { as.classList.remove('savrul'); void as.offsetWidth; as.classList.add('savrul'); }
    if (G.dokunus) G.dokunus(b.matches('.ana, .oyna-dugme, .oyna-sekme, .yan-kart, .m-haftalik'));
  }, { passive: true });

  // savrulma bitince etiket olağan salınımına döner (iç içe etiketlerde yalnız kendi animasyonu)
  document.addEventListener('animationend', function (e) { if (e.animationName === 'askiSavrul') e.target.classList.remove('savrul'); });

  boot();
})();
