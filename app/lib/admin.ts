import "server-only";

// 後台的開站流程與權限守衛。
//
// 初始管理者的密碼**不寫在程式碼裡、也不寫在 .env 的預設值裡**。
// 資料庫還沒有任何管理者時，開站會自動產生一組隨機強密碼並印在伺服器 log，
// 只印這一次，而且該帳號第一次登入就必須改密碼。
//
// 想指定初始帳密的話，在 .env 設 ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD，
// 建立完成後請把那兩行刪掉。

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { get, run } from "./db";
import { currentAdmin, hashPassword, normalizeEmail, type Admin } from "./auth";
import { can, type Capability } from "./permissions";

const DEFAULT_ADMIN_EMAIL = "admin@maporoo.com";

/** 產生一組好唸、夠強的隨機密碼（約 103 bits 熵）。 */
function generatePassword() {
  // 去掉容易看錯的 0/O/1/l/I。
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(18);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out.replace(/(.{6})(?=.)/g, "$1-"); // 分段比較好抄
}

let bootstrapped = false;

/**
 * 確保系統至少有一個管理者。第一次呼叫時才會動作，之後直接跳過。
 * 由 /admin 的 layout 呼叫——沒進後台就不會觸發。
 */
export function ensureAdminExists() {
  if (bootstrapped) return;
  bootstrapped = true;

  const existing = get<{ c: number }>(`SELECT COUNT(*) AS c FROM admins`);
  if (existing && existing.c > 0) {
    // 舊資料庫的補救：角色分級是後來才加的，先前建立的帳號 role 是 'admin'，
    // 那個值在新的權限表裡不存在，等於什麼都不能做。把它們升成 owner，
    // 否則升級之後老闆會被自己的後台鎖在門外。
    run(`UPDATE admins SET role = 'owner' WHERE role NOT IN ('owner','manager','shipping','editor')`);

    // 至少要留一個 owner，不然沒有人能管理管理者帳號。
    const owners = get<{ c: number }>(`SELECT COUNT(*) AS c FROM admins WHERE role = 'owner'`);
    if (!owners?.c) {
      run(`UPDATE admins SET role = 'owner' WHERE id = (SELECT MIN(id) FROM admins)`);
    }
    return;
  }

  const email = normalizeEmail(process.env.ADMIN_BOOTSTRAP_EMAIL || DEFAULT_ADMIN_EMAIL);
  const fromEnv = process.env.ADMIN_BOOTSTRAP_PASSWORD || "";
  const password = fromEnv || generatePassword();

  run(
    `INSERT INTO admins (email, password_hash, name, role, must_change_password)
     VALUES (?, ?, ?, 'owner', 1)`,
    email,
    hashPassword(password),
    "負責人"
  );

  // 這是唯一一次密碼會出現的地方。用 console.warn 讓它不會被 log level 濾掉。
  const banner = "═".repeat(58);
  console.warn(
    [
      "",
      banner,
      "  MAPOROO 後台 — 已建立初始管理者帳號",
      "",
      `  帳號：${email}`,
      fromEnv
        ? "  密碼：（來自 .env 的 ADMIN_BOOTSTRAP_PASSWORD）"
        : `  密碼：${password}`,
      "",
      "  這組密碼只會出現這一次。第一次登入會強制要求你改掉。",
      fromEnv
        ? "  建立完成了，請把 .env 裡的 ADMIN_BOOTSTRAP_* 兩行刪除。"
        : "  請立刻抄下來，然後登入 /admin 更換。",
      banner,
      "",
    ].join("\n")
  );
}

/**
 * 後台頁面與 server action 的守衛。
 *
 * 未登入 → 登入頁；帶著必須改密碼的旗標 → 改密碼頁；
 * 有指定 capability 而角色不具備 → 拒絕頁。
 *
 * **每一個會改資料的 server action 都要自己呼叫一次並帶上 capability。**
 * 只靠畫面隱藏按鈕不算權限控管——表單可以被直接送出。
 */
export async function requireAdmin(cap?: Capability, pathname?: string): Promise<Admin> {
  const admin = await currentAdmin();
  if (!admin) {
    const next = pathname && pathname.startsWith("/") ? `?next=${encodeURIComponent(pathname)}` : "";
    redirect(`/admin/login${next}`);
  }

  const row = get<{ must_change_password: number }>(
    `SELECT must_change_password FROM admins WHERE id = ?`,
    admin.id
  );
  if (row?.must_change_password && pathname !== "/admin/password") {
    redirect("/admin/password?first=1");
  }

  if (cap && !can(admin.role, cap)) {
    redirect(`/admin/denied?need=${encodeURIComponent(cap)}`);
  }

  return admin;
}

/** 後台首頁的數字。全部是即時查詢，資料量到幾萬筆之前都不需要快取。 */
export function dashboardStats() {
  const one = (sql: string, ...p: (string | number)[]) =>
    get<{ v: number }>(sql, ...p)?.v ?? 0;

  return {
    members: one(`SELECT COUNT(*) AS v FROM members`),
    membersThisWeek: one(
      `SELECT COUNT(*) AS v FROM members WHERE created_at >= datetime('now','-7 days')`
    ),
    orders: one(`SELECT COUNT(*) AS v FROM orders`),
    ordersNew: one(`SELECT COUNT(*) AS v FROM orders WHERE order_status = 'new'`),
    unpaid: one(`SELECT COUNT(*) AS v FROM orders WHERE payment_status = 'pending'`),
    revenue: one(
      `SELECT COALESCE(SUM(total_twd),0) AS v FROM orders WHERE payment_status = 'paid'`
    ),
    products: one(`SELECT COUNT(*) AS v FROM products`),
    productsDraft: one(`SELECT COUNT(*) AS v FROM products WHERE status <> 'active'`),
    articles: one(`SELECT COUNT(*) AS v FROM articles`),
    articlesPublished: one(`SELECT COUNT(*) AS v FROM articles WHERE status = 'published'`),
  };
}
