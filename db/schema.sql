-- MAPOROO — 後台與會員系統資料庫（SQLite / node:sqlite）
--
-- 做法對齊 auslife.tw（澳喀萊買）：SQLite 單檔放 data/ 掛 volume、
-- 所有語句 CREATE ... IF NOT EXISTS，啟動時直接套用，欄位變更走 db/index 的
-- ensureColumn 輕量遷移。
--
-- 金額一律以「新台幣整數元」儲存，避免浮點誤差。
-- 時間一律 UTC 字串（datetime('now')）或 epoch ms（INTEGER），不混用。

-- ── 站台設定（key-value）───────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- ── 管理者 ─────────────────────────────────────────────────
-- 後台帳號與前台會員完全分離：admins 進不了會員區，members 也進不了後台。
CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'admin',   -- admin | editor
  -- 1 = 下次登入強制改密碼。開站自動產生的初始帳號一定是 1。
  must_change_password INTEGER NOT NULL DEFAULT 0,
  disabled      INTEGER NOT NULL DEFAULT 0,
  last_login_at TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── 會員 ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL DEFAULT '',        -- '' = 僅第三方登入
  name           TEXT DEFAULT '',
  phone          TEXT DEFAULT '',
  email_verified INTEGER NOT NULL DEFAULT 0,
  google_id      TEXT DEFAULT '',
  points         INTEGER NOT NULL DEFAULT 0,      -- 回購點數
  note           TEXT DEFAULT '',                 -- 後台備註，會員看不到
  disabled       INTEGER NOT NULL DEFAULT 0,
  last_login_at  TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS member_addresses (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id  INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  recipient  TEXT NOT NULL,
  phone      TEXT DEFAULT '',
  zipcode    TEXT DEFAULT '',
  city       TEXT DEFAULT '',
  address    TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_member_addresses_member ON member_addresses(member_id);

-- 一次性 token：email 驗證、忘記密碼
CREATE TABLE IF NOT EXISTS member_tokens (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id  INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL,                       -- verify_email | reset_password
  token      TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,                    -- epoch ms
  used_at    TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_member_tokens_member ON member_tokens(member_id);

-- 會員收藏
CREATE TABLE IF NOT EXISTS member_favorites (
  member_id    INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (member_id, product_slug)
);

-- ── Session（會員與管理者共用一張表，用 scope 區分）────────
CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,                    -- 隨機 token（存 cookie 的值）
  scope      TEXT NOT NULL,                       -- member | admin
  subject_id INTEGER NOT NULL,                    -- members.id 或 admins.id
  ip         TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  expires_at INTEGER NOT NULL,                    -- epoch ms
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_subject ON sessions(scope, subject_id);

-- ── 商品 ───────────────────────────────────────────────────
-- 目前商品仍以 app/lib/catalog.ts 為準（14 支）。這張表是後台上線後的接手處：
-- 後台寫入這裡，前台改讀這裡，catalog.ts 退為初始匯入來源（db/seed）。
CREATE TABLE IF NOT EXISTS products (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  slug             TEXT NOT NULL UNIQUE,
  sku              TEXT DEFAULT '',
  name             TEXT NOT NULL,
  en               TEXT DEFAULT '',
  size             TEXT DEFAULT '',
  price            INTEGER NOT NULL DEFAULT 0,    -- TWD
  list_price       INTEGER,                       -- NULL = 無原價
  collection       TEXT DEFAULT '',               -- catalog.ts 的 collection slug
  origin           TEXT DEFAULT '',
  tagline          TEXT DEFAULT '',
  about            TEXT DEFAULT '',
  suits            TEXT DEFAULT '',
  note             TEXT DEFAULT '',
  caution          TEXT DEFAULT '',
  stock            INTEGER NOT NULL DEFAULT 0,
  track_stock      INTEGER NOT NULL DEFAULT 0,    -- 0 = 不控庫存（永遠可買）
  status           TEXT NOT NULL DEFAULT 'active',-- active | draft | sold_out
  featured         INTEGER NOT NULL DEFAULT 0,
  sort             INTEGER NOT NULL DEFAULT 0,
  -- 結構化欄位以 JSON 存：highlights / howToUse / faq / concerns / ingredients
  highlights_json  TEXT DEFAULT '[]',
  how_to_use_json  TEXT DEFAULT '[]',
  faq_json         TEXT DEFAULT '[]',
  concerns_json    TEXT DEFAULT '[]',
  ingredients_json TEXT DEFAULT '[]',
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status, sort);

CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        TEXT DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id, sort);

-- ── 訂單 ───────────────────────────────────────────────────
-- payment_method 目前只開 bank_transfer / cod。
-- 線上金流（藍新 NewebPay / 綠界）由後續工程師接手，接口見 app/lib/payment.ts。
CREATE TABLE IF NOT EXISTS orders (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no       TEXT NOT NULL UNIQUE,
  member_id      INTEGER REFERENCES members(id) ON DELETE SET NULL,
  email          TEXT DEFAULT '',
  recipient      TEXT DEFAULT '',
  phone          TEXT DEFAULT '',
  zipcode        TEXT DEFAULT '',
  city           TEXT DEFAULT '',
  address        TEXT DEFAULT '',
  subtotal_twd   INTEGER NOT NULL DEFAULT 0,
  shipping_twd   INTEGER NOT NULL DEFAULT 0,
  discount_twd   INTEGER NOT NULL DEFAULT 0,
  total_twd      INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer', -- bank_transfer | cod
  payment_status TEXT NOT NULL DEFAULT 'pending',       -- pending | paid | refunded | failed
  payment_ref    TEXT DEFAULT '',                       -- 匯款末五碼／金流交易序號
  payment_info   TEXT DEFAULT '',                       -- JSON，留給金流接手
  order_status   TEXT NOT NULL DEFAULT 'new',           -- new | processing | shipped | done | cancelled
  shipping_no    TEXT DEFAULT '',
  note           TEXT DEFAULT '',                       -- 客人備註
  admin_note     TEXT DEFAULT '',                       -- 內部備註
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_member ON orders(member_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status, created_at);

CREATE TABLE IF NOT EXISTS order_items (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id       INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug   TEXT NOT NULL,
  name           TEXT NOT NULL,                   -- 下單當下的品名，商品改名不影響歷史訂單
  size           TEXT DEFAULT '',
  unit_price_twd INTEGER NOT NULL DEFAULT 0,      -- 下單當下的單價
  qty            INTEGER NOT NULL DEFAULT 1,
  total_twd      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 訂單狀態異動紀錄（誰在什麼時候改了什麼）
CREATE TABLE IF NOT EXISTS order_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  actor      TEXT DEFAULT '',                     -- admin:1 / member:5 / system
  field      TEXT DEFAULT '',
  from_value TEXT DEFAULT '',
  to_value   TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_events(order_id, created_at);

-- ── 部落格文章（02 內容編輯部的 /read 路由）────────────────
-- 刻意沒有 related_products 欄位：部落格零商品置入是老闆 2026-08-05 拍板的規則，
-- 沒有欄位就沒人塞得進去。見 000_Agent/knowledge/maporoo-brand-dna.md 第三節。
CREATE TABLE IF NOT EXISTS articles (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT NOT NULL UNIQUE,
  kind          TEXT NOT NULL DEFAULT 'A',        -- A 日常保健 | B 名人醫師經驗 | C 醫美趨勢 | D 生活推薦
  category      TEXT DEFAULT '',                  -- 日常保健 | 趨勢觀察 | 生活風格
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',                  -- meta description
  cover         TEXT DEFAULT '',
  reading_time  TEXT DEFAULT '',
  body_md       TEXT DEFAULT '',
  sources_json  TEXT DEFAULT '[]',                -- 型態 B/C 必填：可查證出處
  disclaimer    INTEGER NOT NULL DEFAULT 0,       -- 非醫療建議聲明
  status        TEXT NOT NULL DEFAULT 'draft',    -- draft | pending_compliance | pending_voice | published
  review_id     TEXT DEFAULT '',                  -- 04 法遵通過後的審查編號
  published_at  TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status, published_at);

-- ── 首頁與各區塊文案 ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_blocks (
  key        TEXT PRIMARY KEY,                    -- 例：home.brand_statement / home.slogan
  label      TEXT DEFAULT '',                     -- 後台顯示用的中文名稱
  value      TEXT DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── 報表用的每日彙總（由排程或後台觸發寫入）─────────────────
CREATE TABLE IF NOT EXISTS daily_stats (
  day          TEXT PRIMARY KEY,                  -- YYYY-MM-DD
  orders_count INTEGER NOT NULL DEFAULT 0,
  revenue_twd  INTEGER NOT NULL DEFAULT 0,
  new_members  INTEGER NOT NULL DEFAULT 0,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
