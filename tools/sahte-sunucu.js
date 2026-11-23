// Yerel skor sunucusu: gerçek Worker kodunu (sunucu/src/index.js) Node'da, bellekteki bir SQLite (D1 yerine) ile çalıştırır.
// Firebase'in iki giriş çağrısını da taklit eder (anonim hesap, belge yenileme), böylece hesap açmadan uçtan uca denenir.
// Veriler bellekte durur, kapatınca silinir.
//   node tools/sahte-sunucu.js [port varsayılan 8767] [--dolu: tabloya örnek oyuncular ekler]
// Sonra oyunu http://localhost:8766/?online=yerel ile aç; Haftalık ya da Günlük Kuyu'yu oyna.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const W = require('../sunucu/src/index.js');

// D1'in kullanılan kısmı (prepare → bind → first/all/run) node:sqlite üstünde
function d1(db) {
  return {
    prepare(sql) {
      const st = db.prepare(sql); let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        async first() { const r = st.get(...args); return r ? Object.assign({}, r) : null; },
        async all() { return { results: st.all(...args).map(r => Object.assign({}, r)) }; },
        async run() { st.run(...args); return { success: true }; }
      };
      return o;
    }
  };
}

// saat: () => ms (testler için sahte saat); verilmezse gerçek saat
function kur(secenek) {
  secenek = secenek || {};
  const db = new DatabaseSync(':memory:');
  db.exec(fs.readFileSync(path.join(__dirname, '../sunucu/schema.sql'), 'utf8'));
  // --koken <adres>: başka bir yerel sayfaya da izin (ör. ayrı çalışma ağacı http://localhost:8768)
  const ek = process.argv.indexOf('--koken') > 0 ? ',' + process.argv[process.argv.indexOf('--koken') + 1] : '';
  const env = { DB: d1(db), FIREBASE_PROJE: 'yerel', KOKENLER: 'http://localhost:8766,http://127.0.0.1:8766' + ek };
  const saat = secenek.saat || Date.now;
  let sayac = 0;
  // Sahte Firebase: belge "sahte.<uid>", yenileme belgesi "yenile.<uid>"
  const dogrula = async b => (/^sahte\.[\w-]{1,64}$/.test(b) ? b.slice(6) : null);
  const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  const yanit = (res, kod, veri) => { res.writeHead(kod, Object.assign({ 'Content-Type': 'application/json' }, CORS)); res.end(JSON.stringify(veri)); };

  const sunucu = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://localhost');
    let govde = '';
    req.on('data', c => { govde += c; if (govde.length > 8192) req.destroy(); });
    req.on('end', async () => {
      if (u.pathname.startsWith('/v1/')) { // sahte Firebase
        if (req.method === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }
        if (u.pathname === '/v1/accounts:signUp') { const uid = 'yerel-' + (++sayac) + '-' + Math.random().toString(36).slice(2, 8); return yanit(res, 200, { idToken: 'sahte.' + uid, refreshToken: 'yenile.' + uid, expiresIn: '3600', localId: uid }); }
        if (u.pathname === '/v1/token') {
          const rt = new URLSearchParams(govde).get('refresh_token') || '';
          if (!rt.startsWith('yenile.')) return yanit(res, 400, { error: { message: 'INVALID_REFRESH_TOKEN' } });
          const uid = rt.slice(7); return yanit(res, 200, { id_token: 'sahte.' + uid, refresh_token: rt, expires_in: '3600', user_id: uid });
        }
        return yanit(res, 404, {});
      }
      const istek = new Request('http://localhost' + req.url, { method: req.method, headers: req.headers, body: req.method === 'POST' ? govde : undefined });
      const r = await W.isle(istek, env, { dogrula, simdi: saat() });
      const baslik = {}; r.headers.forEach((v, k) => { baslik[k] = v; });
      res.writeHead(r.status, baslik); res.end(await r.text());
    });
  });

  function ornekDoldur(tahta) {
    const adlar = ['Kıvılcım', 'Fitil', 'Bekçi', 'Yosun', 'Kova', 'Sarkaç', 'Halka', 'Rüzgâr'];
    const ekle = db.prepare('INSERT OR REPLACE INTO skorlar (tahta, uid, ad, puan, metre, zaman) VALUES (?, ?, ?, ?, ?, ?)');
    adlar.forEach((ad, i) => ekle.run(tahta, 'ornek-' + i, ad + ' (örnek)', 800 + i * i * 900, 400 + i * 350, saat() - 6e4));
  }
  return { sunucu, db, env, ornekDoldur };
}

if (require.main === module) {
  const PORT = +process.argv[2] || 8767;
  const k = kur();
  k.sunucu.listen(PORT, () => {
    console.log('Yerel skor sunucusu (Worker + SQLite + sahte Firebase): http://localhost:' + PORT + '  (oyunu ?online=yerel ile aç)');
    if (process.argv.includes('--dolu')) {
      for (const t of W.acikTahtalar(Date.now())) k.ornekDoldur(t);
      console.log('Örnek oyuncular eklendi (adlarında "örnek" yazar).');
    }
  });
}
module.exports = { kur };
