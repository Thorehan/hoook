/* Kuyu — online: meydan okuma bağlantısı ve skor tablosu istemcisi. Tarayıcıda window.KuyuOnline, Node'da module.exports.

   1) Meydan okuma (arka uç gerekmez): koşunun tohumu, puanı ve oyuncu adı bağlantıya yazılır
      (?meydan=s-<tohum>-<puan>-<ad>). Bağlantıyı açan aynı kuyuyu oynar; sonuç kartı iki puanı karşılaştırır.
      Puan beyana dayanır (arkadaşlar arası).

   2) Skor tablosu (hazır ama KAPALI): AYAR boşken hiçbir istek atılmaz, arayüzde hiçbir şey görünmez.
      Kimlik Firebase'de anonim giriş (SDK yok, iki REST çağrısı), sunucu Cloudflare Worker + D1 (sunucu/src/index.js).
      Gönderilen: Firebase kimlik belgesi, oyuncu adı, puan, metre, tahta adı. Başka hiçbir şey gönderilmez.
      Oturum ayrı anahtarda ('kuyu.oturum') durur, kayda ve yedek koduna girmez.
      Kurulum: docs/online-kurulum.md. Yerelde: node tools/sahte-sunucu.js, sonra oyunu ?online=yerel ile aç (?online=kapat). */
(function (root) {
  'use strict';
  // Hesaplar açılınca doldurulur. url: Worker adresi; firebase: Firebase web apiKey (herkese açık olacak şekilde
  // tasarlanmıştır, gizli anahtar değildir). Boşken online kapalıdır.
  var AYAR = { url: 'https://hoook-skor.torehan-anbarli.workers.dev', firebase: 'AIzaSyB4PlqU2y8fzorDA8cDaGJt0_C0MboReJM' };
  var YEREL = { url: 'http://localhost:8767', firebase: 'yerel-deneme', kimlikUrl: 'http://localhost:8767', yenileUrl: 'http://localhost:8767' };
  var KIMLIK_URL = 'https://identitytoolkit.googleapis.com', YENILE_URL = 'https://securetoken.googleapis.com';
  var DEPO = 'kuyu.online', OTURUM = 'kuyu.oturum', SEN_DEPO = 'kuyu.online.sen'; // SEN_DEPO: tahta başına son gönderimin sırası ve puanı (v0.73)

  function depo() { try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch (e) { return null; } }
  function oku(k) { var d = depo(); try { return d && JSON.parse(d.getItem(k) || 'null'); } catch (e) { return null; } }
  function yaz(k, v) { var d = depo(); try { if (d) { if (v == null) d.removeItem(k); else d.setItem(k, JSON.stringify(v)); } } catch (e) {} }
  function ayar() { var o = oku(DEPO); return o && o.url && o.firebase ? o : AYAR; }
  // ?online=yerel → yerel sahte sunucu; ?online=kapat → varsayılana dön. Ayar değişince oturum da sıfırlanır.
  function ayarBaglanti(deger) {
    if (deger === 'yerel') { yaz(DEPO, YEREL); yaz(OTURUM, null); yaz(SEN_DEPO, null); }
    else if (deger === 'kapat') { yaz(DEPO, null); yaz(OTURUM, null); yaz(SEN_DEPO, null); }
  }
  function acik() { var a = ayar(); return !!(a.url && a.firebase); }

  function uuid() {
    var c = typeof crypto !== 'undefined' ? crypto : null;
    if (c && c.randomUUID) return c.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) { var r = Math.random() * 16 | 0; return (ch === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  // Oyuncu kimliği: Firebase oturumu varsa onun kimliği; yoksa (online kapalı) cihazda üretilen eski rastgele kimlik.
  function kimlik(save) {
    var o = oku(OTURUM); if (o && o.uid) return o.uid;
    if (!save.online) save.online = {}; if (!save.online.kimlik) save.online.kimlik = uuid(); return save.online.kimlik;
  }
  function temizAd(s) { return String(s || '').replace(/[<>&"]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || 'Tırmanıcı'; }

  function getir(url, secenek) {
    if (typeof fetch !== 'function') return Promise.reject(new Error('fetch yok'));
    var kes = typeof AbortController === 'function' ? new AbortController() : null;
    var zaman = kes ? setTimeout(function () { kes.abort(); }, 6000) : null;
    if (kes) secenek.signal = kes.signal;
    return fetch(url, secenek).then(function (r) {
      if (zaman) clearTimeout(zaman);
      return r.json().catch(function () { return {}; }).then(function (veri) { return { kod: r.status, veri: veri || {} }; });
    }, function (e) { if (zaman) clearTimeout(zaman); throw e; });
  }

  // ---------- Firebase anonim oturum (REST) ----------
  var bekleyen = null;
  function kaydet(uid, belge, yenileBelge, sn) { var o = { uid: uid, belge: belge, yenile: yenileBelge, bitis: Date.now() + (+sn || 3600) * 1000 }; yaz(OTURUM, o); return o; }
  function yeniHesap(a) {
    return getir((a.kimlikUrl || KIMLIK_URL) + '/v1/accounts:signUp?key=' + encodeURIComponent(a.firebase), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true })
    }).then(function (y) {
      if (y.kod !== 200 || !y.veri.idToken) throw new Error('giriş ' + y.kod);
      return kaydet(y.veri.localId, y.veri.idToken, y.veri.refreshToken, y.veri.expiresIn);
    });
  }
  function yenile(a, o) {
    return getir((a.yenileUrl || YENILE_URL) + '/v1/token?key=' + encodeURIComponent(a.firebase), {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(o.yenile)
    }).then(function (y) {
      if (y.kod === 200 && y.veri.id_token) return kaydet(y.veri.user_id, y.veri.id_token, y.veri.refresh_token, y.veri.expires_in);
      if (y.kod >= 400 && y.kod < 500) { yaz(OTURUM, null); return yeniHesap(a); } // oturum geçersiz: yeni anonim hesap
      throw new Error('yenileme ' + y.kod);
    });
  }
  // Geçerli kimlik belgesi; gerekirse yeniler ya da ilk kez anonim hesap açar. Aynı anda tek istek.
  function oturum() {
    if (!acik()) return Promise.reject(new Error('online kapalı'));
    var a = ayar(), o = oku(OTURUM);
    if (o && o.belge && o.bitis - 60000 > Date.now()) return Promise.resolve(o);
    if (!bekleyen) bekleyen = (o && o.yenile ? yenile(a, o) : yeniHesap(a)).then(function (x) { bekleyen = null; return x; }, function (e) { bekleyen = null; throw e; });
    return bekleyen;
  }

  // ---------- skor tablosu ----------
  var sonSen = {}; // tahta → sunucunun son gönderimde verdiği { sira, toplam, puan, ad }
  function adres(yol) { return ayar().url.replace(/\/$/, '') + yol; }
  // tahta: 'h-2026-11-09' (Haftalık Kuyu, pazartesi tarihi) ya da 'g-2026-11-11' (Günlük Kuyu).
  // Sunucu kabul ederse true (puan eskisinden kötüyse yazılmaz ama yine true), reddederse false; ağ hatasında reddedilir.
  function gonder(save, tahta, ad, puan, metre) {
    return oturum().then(function (o) {
      return getir(adres('/skor'), {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + o.belge },
        body: JSON.stringify({ tahta: tahta, ad: temizAd(ad), puan: Math.max(0, Math.floor(puan)), metre: Math.max(0, Math.floor(metre || 0)) })
      });
    }).then(function (y) {
      if (y.kod === 200) { sonSen[tahta] = { sira: y.veri.sira, toplam: y.veri.toplam, puan: y.veri.puan, ad: y.veri.ad }; senSakla(tahta, sonSen[tahta]); return true; }
      if (y.kod === 401) { var o = oku(OTURUM); if (o) { o.bitis = 0; yaz(OTURUM, o); } } // belge reddedildi: sonra yenilenir
      if (y.kod >= 500) throw new Error('sunucu ' + y.kod);
      return false;
    });
  }
  // İlk n satır (en yüksek puan önce). Dizi; ayrıca .toplam (tahtadaki oyuncu sayısı) ve .sen (son gönderimin sırası).
  function tablo(tahta, n) {
    if (!acik()) return Promise.reject(new Error('online kapalı'));
    return getir(adres('/tablo?tahta=' + encodeURIComponent(tahta) + '&n=' + (n || 100)), { method: 'GET' }).then(function (y) {
      if (y.kod !== 200) throw new Error('sunucu ' + y.kod);
      var rows = Array.isArray(y.veri.satirlar) ? y.veri.satirlar : [];
      rows.toplam = +y.veri.toplam || rows.length; rows.sen = sonSen[tahta] || null;
      return rows;
    });
  }
  // Son gönderim cihazda saklanır (v0.73): tam tablo sayfa yenilense de senin satırını bulur. En son 6 tahta tutulur.
  function senSakla(tahta, sen) {
    var d = oku(SEN_DEPO) || {}; d[tahta] = sen;
    var k = Object.keys(d).sort(); while (k.length > 6) delete d[k.shift()];
    yaz(SEN_DEPO, d);
  }
  function benim(tahta) { return sonSen[tahta] || (oku(SEN_DEPO) || {})[tahta] || null; }
  // Tam tablo (v0.73): ilk n satır (en çok 200) ve senin yerin. Sunucu listede kimlik döndürmez; senin satırın, son
  // gönderimindeki ad ve puanla eşleşen ilk satırdır (güncel sıra). Listede yoksa son gönderimdeki sıra (eski: true).
  function tamTablo(tahta, n) {
    return tablo(tahta, Math.min(200, n || 200)).then(function (rows) {
      var b = benim(tahta), ben = null;
      if (b) {
        for (var i = 0; i < rows.length; i++) if (temizAd(rows[i].ad) === temizAd(b.ad) && +rows[i].puan === +b.puan) { ben = { sira: i + 1, ad: b.ad, puan: b.puan, eski: false }; break; }
        if (!ben) ben = { sira: b.sira, ad: b.ad, puan: b.puan, eski: true };
      }
      return { satirlar: rows.map(function (r) { return { ad: temizAd(r.ad), puan: +r.puan || 0, metre: +r.metre || 0 }; }), toplam: Math.max(rows.toplam || 0, ben ? ben.sira : 0), ben: ben };
    });
  }
  // Listedeki yerin: { sira (1'den), toplam, liste: ilk 'ust' satır + sen }. Sıra sunucunun son gönderimde verdiğidir
  // (rows.sen); yoksa satırdaki oyuncu kimliğiyle aranır. Bilinmiyorsa sira null.
  function ozet(rows, benim, ust) {
    ust = ust || 5;
    var sen = rows.sen, sira = sen ? sen.sira : null;
    if (!sen) for (var i = 0; i < rows.length; i++) if (rows[i].oyuncu && rows[i].oyuncu === benim) { sira = i + 1; break; }
    var liste = rows.slice(0, ust).map(function (r, k) { return { sira: k + 1, ad: temizAd(r.ad), puan: r.puan, ben: sira === k + 1 }; });
    if (sira && sira > liste.length) {
      var r = sen ? { ad: sen.ad, puan: sen.puan } : rows[sira - 1];
      liste.push({ sira: sira, ad: temizAd(r.ad), puan: r.puan, ben: true }); // ilk 'ust' dışındaysan kendi satırın da eklenir
    }
    return { sira: sira, toplam: Math.max(rows.toplam || rows.length, sira || 0), liste: liste };
  }

  // ---------- meydan okuma ----------
  // tur: 's' Sonsuz Kuyu kuralları, 'h' Haftalık Kuyu kuralları. Tohum 32 bit, 36'lık yazılır.
  function meydanKodla(m) { return (m.tur === 'h' ? 'h' : 's') + '-' + (m.seed >>> 0).toString(36) + '-' + Math.max(0, Math.floor(m.puan)) + '-' + encodeURIComponent(temizAd(m.ad)); }
  function meydanCoz(str) {
    var p = /^([sh])-([0-9a-z]{1,7})-(\d{1,9})-(.{1,96})$/.exec(String(str || ''));
    if (!p) return null;
    var seed = parseInt(p[2], 36), ad;
    try { ad = decodeURIComponent(p[4]); } catch (e) { return null; }
    if (!(seed >= 0 && seed <= 0xFFFFFFFF)) return null;
    return { tur: p[1], seed: seed >>> 0, puan: parseInt(p[3], 10), ad: temizAd(ad) };
  }
  function meydanBaglanti(taban, m) { return taban + '?meydan=' + meydanKodla(m); }

  var api = { AYAR: AYAR, YEREL: YEREL, ayar: ayar, ayarBaglanti: ayarBaglanti, acik: acik, kimlik: kimlik, temizAd: temizAd, oturum: oturum,
    gonder: gonder, tablo: tablo, ozet: ozet, tamTablo: tamTablo, benim: benim, meydanKodla: meydanKodla, meydanCoz: meydanCoz, meydanBaglanti: meydanBaglanti };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KuyuOnline = api;
})(typeof window !== 'undefined' ? window : this);
