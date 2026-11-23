// Kor halka (v0.69) açıkken Sonsuz/Günlük/Haftalık testleri: üreticiyi kor açık kurar, sonra verilen aracı çalıştırır.
// Kullanım: node tools/korla.js hata.js 6   (ya da nisan.js, oyuncu.js, spam.js, ekonomi-olcum.js ...)
const path = require('path');
const G = require('../js/gen.js');
const eskiE = G.createEndless, eskiH = G.createHaftalik;
G.createEndless = (sd, k, a) => eskiE(sd, k, Object.assign({ kor: true }, a || {}));
G.createHaftalik = (sd, a) => eskiH(sd, Object.assign({ kor: true }, a || {}));
const arac = process.argv[2];
if (!arac) { console.log('Kullanım: node tools/korla.js <araç.js> [argümanlar]'); process.exit(1); }
process.argv.splice(2, 1);
console.log('(kor halka açık)');
require(path.join(__dirname, arac));
