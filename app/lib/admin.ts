import "server-only";

// 後台的開站流程與權限守衛。
//
// 初始管理者的密碼**不寫在程式碼裡、也不寫在 .env 的預設值裡**。
// 資料庫還沒有任何管理者時，開站會自動產生一組隨機強密碼並印在伺服器 log，
// 只印這一次，而且該帳號第一次登入就必須改密碼。
//
// 想指定初始帳密的話，在 .env 設 ADMIN_BOOTSTRAP_EMAIL / ADMIN_BOOTSTRAP_PASSWORD，
// 建立完成後請把那兩行刪掉。

import { redirect } from "next/navigation";
import { get, run } from "./db";
import {
  currentAdmin,
  hashPassword,
  normalizeEmail,
  normalizeUsername,
  type Admin,
} from "./auth";
import { can, type Capability } from "./permissions";

const DEFAULT_ADMIN_EMAIL = "admin@maporoo.com";

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

  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || "";
  const banner = "═".repeat(58);

  // 沒有指定密碼就**不建立任何帳號**。
  //
  // 舊版會在這裡隨機產生一組密碼、印進容器 log。那個設計害人：
  // 密碼由系統決定、只出現一次、而且每次重新部署容器一換就消失，
  // 負責人因此被鎖在門外，唯一的出路是 SSH 進伺服器改資料庫。
  //
  // 現在改成：密碼一律由人指定。沒指定就沒有帳號，也就沒有預設密碼
  // 可以被猜到或外流。要開通請跑 GitHub Actions 的
  // 「Reset admin password」流程，在那裡輸入自己要的帳號密碼。
  if (!password) {
    console.warn(
      [
        "",
        banner,
        "  MAPOROO 後台 — 尚未有任何管理者帳號",
        "",
        "  系統不會自動產生密碼。要開通後台，請到 GitHub 的 Actions 頁面",
        "  執行「Reset admin password」，在表單裡填入你要的帳號與密碼。",
        banner,
        "",
      ].join("\n")
    );
    return;
  }

  const email = normalizeEmail(process.env.ADMIN_BOOTSTRAP_EMAIL || DEFAULT_ADMIN_EMAIL);
  const username = normalizeUsername(process.env.ADMIN_BOOTSTRAP_USERNAME || "admin");

  run(
    `INSERT INTO admins (username, email, password_hash, name, role, must_change_password)
     VALUES (?, ?, ?, ?, 'owner', 0)`,
    username,
    email,
    hashPassword(password),
    "負責人"
  );

  console.warn(
    [
      "",
      banner,
      "  MAPOROO 後台 — 已依 .env 的設定建立管理者帳號",
      "",
      `  帳號：${username}`,
      "  密碼：你在 ADMIN_BOOTSTRAP_PASSWORD 設定的那一組",
      "",
      "  帳號建好了，請把 .env 裡的 ADMIN_BOOTSTRAP_* 三行刪除。",
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
