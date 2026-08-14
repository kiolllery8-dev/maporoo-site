import "server-only";

// 帳號與 session。會員（member）與管理者（admin）走同一套機制、分開的資料表，
// cookie 名稱也不同——會員 session 永遠打不開後台，反之亦然。
//
// 密碼用 Node 內建的 scrypt，不引入 bcrypt 之類的外部套件。
// 儲存格式：scrypt$N$r$p$<salt base64>$<hash base64>

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { all, get, run } from "./db";

// ── 密碼 ────────────────────────────────────────────────────

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(plain.normalize("NFKC"), salt, SCRYPT.keylen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
    // scrypt 預設的 maxmem 不夠 N=16384 用，要放寬。
    maxmem: 256 * 1024 * 1024,
  });
  return [
    "scrypt",
    SCRYPT.N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString("base64"),
    hash.toString("base64"),
  ].join("$");
}

export function verifyPassword(plain: string, stored: string): boolean {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, N, r, p, saltB64, hashB64] = parts;
  const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  let actual: Buffer;
  try {
    actual = crypto.scryptSync(plain.normalize("NFKC"), salt, expected.length, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
      maxmem: 256 * 1024 * 1024,
    });
  } catch {
    return false;
  }
  // 長度相同才比較——timingSafeEqual 對長度不同會直接丟例外。
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

// ── Session ─────────────────────────────────────────────────

export type Scope = "member" | "admin";

const COOKIE: Record<Scope, string> = {
  member: "maporoo_session",
  admin: "maporoo_admin",
};

// 會員 30 天、後台 12 小時。後台短一點是刻意的。
const TTL_MS: Record<Scope, number> = {
  member: 30 * 24 * 60 * 60 * 1000,
  admin: 12 * 60 * 60 * 1000,
};

function newToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export async function createSession(
  scope: Scope,
  subjectId: number,
  meta: { ip?: string; userAgent?: string } = {}
) {
  const token = newToken();
  const expiresAt = Date.now() + TTL_MS[scope];

  run(
    `INSERT INTO sessions (id, scope, subject_id, ip, user_agent, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    token,
    scope,
    subjectId,
    meta.ip ?? "",
    (meta.userAgent ?? "").slice(0, 300),
    expiresAt
  );

  const jar = await cookies();
  jar.set(COOKIE[scope], token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });

  // 順手清掉過期的 session，不需要另外排程。
  run(`DELETE FROM sessions WHERE expires_at < ?`, Date.now());

  return token;
}

export async function destroySession(scope: Scope) {
  const jar = await cookies();
  const token = jar.get(COOKIE[scope])?.value;
  if (token) run(`DELETE FROM sessions WHERE id = ? AND scope = ?`, token, scope);
  jar.delete(COOKIE[scope]);
}

/** 登出這個帳號的所有裝置（改密碼後應該呼叫）。 */
export function destroyAllSessions(scope: Scope, subjectId: number) {
  run(`DELETE FROM sessions WHERE scope = ? AND subject_id = ?`, scope, subjectId);
}

async function currentSubjectId(scope: Scope): Promise<number | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE[scope])?.value;
  if (!token) return null;
  const row = get<{ subject_id: number; expires_at: number }>(
    `SELECT subject_id, expires_at FROM sessions WHERE id = ? AND scope = ?`,
    token,
    scope
  );
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    run(`DELETE FROM sessions WHERE id = ?`, token);
    return null;
  }
  return row.subject_id;
}

// ── 目前登入者 ──────────────────────────────────────────────

export type Member = {
  id: number;
  email: string;
  name: string;
  phone: string;
  email_verified: number;
  points: number;
  disabled: number;
  created_at: string;
};

export type Admin = {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  disabled: number;
};

export async function currentMember(): Promise<Member | null> {
  const id = await currentSubjectId("member");
  if (!id) return null;
  const m = get<Member>(
    `SELECT id, email, name, phone, email_verified, points, disabled, created_at
       FROM members WHERE id = ?`,
    id
  );
  if (!m || m.disabled) return null;
  return m;
}

export async function currentAdmin(): Promise<Admin | null> {
  const id = await currentSubjectId("admin");
  if (!id) return null;
  const a = get<Admin>(
    `SELECT id, username, email, name, role, disabled FROM admins WHERE id = ?`,
    id
  );
  if (!a || a.disabled) return null;
  return a;
}

/** 列出這個帳號目前有效的登入裝置，給會員中心的「登入紀錄」用。 */
export function listSessions(scope: Scope, subjectId: number) {
  return all<{ id: string; ip: string; user_agent: string; created_at: string }>(
    `SELECT id, ip, user_agent, created_at
       FROM sessions
      WHERE scope = ? AND subject_id = ? AND expires_at > ?
      ORDER BY created_at DESC`,
    scope,
    subjectId,
    Date.now()
  );
}

// ── 輸入檢查 ────────────────────────────────────────────────

export function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  // 刻意寬鬆：真正的驗證靠寄信，不靠正規表達式。
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

// ── 後台帳號 ────────────────────────────────────────────────
// 管理者用帳號登入，不用 Email。帳號由負責人指派，例如 yankai-boss。

export function normalizeUsername(raw: string) {
  return raw.trim().toLowerCase();
}

/** 回傳 null 代表通過，否則回傳要顯示給使用者的中文訊息。 */
export function usernameProblem(u: string): string | null {
  if (u.length < 3) return "帳號至少 3 個字元。";
  if (u.length > 40) return "帳號請控制在 40 個字元以內。";
  // 只收小寫英數與 - _ .：中文或空白在網址、log 與匯出檔裡都會製造麻煩。
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(u)) {
    return "帳號只能用小寫英文、數字，以及 - _ . 三種符號，且開頭必須是英文或數字。";
  }
  return null;
}

/** 回傳 null 代表通過，否則回傳要顯示給使用者的中文訊息。 */
export function passwordProblem(pw: string): string | null {
  if (pw.length < 8) return "密碼至少 8 個字元。";
  if (pw.length > 200) return "密碼太長了，請控制在 200 字元以內。";
  if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return "密碼需要同時包含英文字母與數字。";
  return null;
}
