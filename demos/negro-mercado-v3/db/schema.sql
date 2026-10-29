CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  variants TEXT NOT NULL,            -- JSON: [{"label":"S","price":4200}]
  available INTEGER NOT NULL DEFAULT 1, -- 0 = agotado hoy
  published INTEGER NOT NULL DEFAULT 1, -- 0 = oculto en la carta
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,               -- identificador no adivinable (lo conoce quien pidió)
  number INTEGER NOT NULL,           -- número corto para el salón
  "table" INTEGER NOT NULL,
  customer TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  items TEXT NOT NULL,               -- JSON con nombre, opción, cantidad y precio al momento
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- new | preparing | ready | delivered | cancelled
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS orders_status ON orders(status, created_at);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT OR IGNORE INTO settings (key, value) VALUES ('tables', '12');
INSERT OR IGNORE INTO settings (key, value) VALUES ('accepting', '1');
