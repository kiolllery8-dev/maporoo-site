import "server-only";

// MAPOROO 資料層 — Node 內建的 node:sqlite，零原生相依。
// 做法對齊 auslife.tw：SQLite 單檔放 data/ 掛 volume，schema 全是
// CREATE ... IF NOT EXISTS，啟動時直接套用；欄位變更走 ensureColumn 輕量遷移。
//
// 連線是延遲建立的（第一次查詢才開檔），所以 next build 期間不會意外建出 DB。

import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

// node:sqlite 目前仍標記 experimental，啟動會噴一行警告。只靜音這一則，
// 其餘警告照常顯示。
const originalEmitWarning = process.emitWarning;
function silenceSqliteWarning() {
  process.emitWarning = ((warning: string | Error, ...rest: unknown[]) => {
    const message = typeof warning === "string" ? warning : warning?.message ?? "";
    if (/SQLite is an experimental feature/i.test(message)) return;
    return (originalEmitWarning as (...a: unknown[]) => void)(warning, ...rest);
  }) as typeof process.emitWarning;
}

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "maporoo.db");

// dev 的 HMR 會重複載入模組。把連線掛在 globalThis 上，避免每次熱更新都開一個
// 新的檔案 handle，最後把 WAL 撐爆。
const globalForDb = globalThis as unknown as { __maporooDb?: DatabaseSync };

function ensureColumn(db: DatabaseSync, table: string, column: string, ddl: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  }
}

function open(): DatabaseSync {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  silenceSqliteWarning();
  const db = new DatabaseSync(DB_PATH);
  process.emitWarning = originalEmitWarning;

  // WAL 讓讀寫不互相阻塞；foreign_keys 預設是關的，必須每次連線打開。
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  // 忙碌時等待而不是立刻丟 SQLITE_BUSY。
  db.exec("PRAGMA busy_timeout = 5000;");

  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  db.exec(fs.readFileSync(schemaPath, "utf8"));

  // 舊資料庫的補欄位放這裡。
  //
  // 為什麼需要這一段：schema.sql 用的是 CREATE TABLE IF NOT EXISTS，
  // 對「已經存在」的表完全不會動。所以每次在 schema.sql 幫既有的表加欄位，
  // 都必須在這裡補一行對應的 ALTER，否則已經跑起來的資料庫會少那一欄，
  // 而查詢會在執行期才爆炸。
  //
  // 新增欄位的規則：schema.sql 加一行，這裡也加一行，兩邊的 DDL 要一致。
  ensureColumn(
    db,
    "admins",
    "must_change_password",
    "must_change_password INTEGER NOT NULL DEFAULT 0"
  );

  // 後台從「用 Email 登入」改成「用帳號登入」。
  // 舊資料的帳號直接沿用原本的 email 字串，這樣既有管理者不會被鎖在門外。
  ensureColumn(db, "admins", "username", "username TEXT");
  db.exec(`UPDATE admins SET username = email WHERE username IS NULL OR username = ''`);
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_username ON admins(username)`);

  return db;
}

export function getDb(): DatabaseSync {
  if (!globalForDb.__maporooDb) globalForDb.__maporooDb = open();
  return globalForDb.__maporooDb;
}

// ── 查詢輔助 ────────────────────────────────────────────────
// 參數一律用 ? 佔位，不要用字串拼接組 SQL。

type Param = string | number | bigint | null | Uint8Array;

export function run(sql: string, ...params: Param[]) {
  const r = getDb().prepare(sql).run(...params);
  return { changes: Number(r.changes), lastInsertRowid: Number(r.lastInsertRowid) };
}

export function get<T = Record<string, unknown>>(sql: string, ...params: Param[]): T | undefined {
  return getDb().prepare(sql).get(...params) as T | undefined;
}

export function all<T = Record<string, unknown>>(sql: string, ...params: Param[]): T[] {
  return getDb().prepare(sql).all(...params) as T[];
}

export function exec(sql: string) {
  getDb().exec(sql);
}

/** 把 fn 包成一個交易：整段成功才 COMMIT，任何例外都 ROLLBACK。 */
export function transaction<A extends unknown[], R>(fn: (...args: A) => R) {
  return (...args: A): R => {
    const db = getDb();
    db.exec("BEGIN");
    try {
      const result = fn(...args);
      db.exec("COMMIT");
      return result;
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  };
}
