-- Kuyu · skor tablosu (Cloudflare D1 / SQLite). Kurulum: docs/online-kurulum.md
--   npx wrangler@4 d1 execute kuyu-skor --remote --file=schema.sql
-- Oyuncu başına tahtada tek satır; uid Firebase kimliğidir (listede dönmez).
CREATE TABLE IF NOT EXISTS skorlar (
  tahta TEXT    NOT NULL,                -- h-2026-11-23 haftalık (pazartesi), g-2026-11-23 günlük
  uid   TEXT    NOT NULL,
  ad    TEXT    NOT NULL,
  puan  INTEGER NOT NULL,
  metre INTEGER NOT NULL DEFAULT 0,
  zaman INTEGER NOT NULL,                -- ms, en iyi puanın yazıldığı an (eşitlikte önce gelen üstte)
  PRIMARY KEY (tahta, uid)
);
CREATE INDEX IF NOT EXISTS skorlar_sira ON skorlar (tahta, puan DESC, zaman ASC);
-- Oyuncu başına son gönderim (hız sınırı)
CREATE TABLE IF NOT EXISTS gonderim (
  uid   TEXT    PRIMARY KEY,
  zaman INTEGER NOT NULL
);
