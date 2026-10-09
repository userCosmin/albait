-- Contact / offer requests submitted from albait.ro
CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  name        TEXT NOT NULL,
  company     TEXT,
  phone       TEXT,
  email       TEXT,
  interest    TEXT NOT NULL,
  message     TEXT,
  page        TEXT,
  consent_at  TEXT NOT NULL,
  ip_hash     TEXT,
  user_agent  TEXT,
  notified    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_ip_hash_created ON leads (ip_hash, created_at);
