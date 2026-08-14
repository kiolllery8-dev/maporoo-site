"use server";

// 後台的登入、登出、改密碼。與前台會員完全分離：不同資料表、不同 cookie。

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { get, run } from "../lib/db";
import {
  createSession,
  currentAdmin,
  destroyAllSessions,
  destroySession,
  hashPassword,
  normalizeUsername,
  passwordProblem,
  verifyPassword,
} from "../lib/auth";
import { landingFor } from "../lib/permissions";

async function requestMeta() {
  const h = await headers();
  return {
    ip: (h.get("x-forwarded-for") ?? "").split(",")[0].trim(),
    userAgent: h.get("user-agent") ?? "",
  };
}

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

export async function adminLoginAction(form: FormData) {
  const username = normalizeUsername(field(form, "username"));
  const password = String(form.get("password") ?? "");
  const next = field(form, "next");

  if (!username || !password) redirect("/admin/login?e=missing");

  const admin = get<{ id: number; password_hash: string; disabled: number }>(
    `SELECT id, password_hash, disabled FROM admins WHERE username = ?`,
    username
  );

  // 帳號不存在時同樣跑一次雜湊，避免用回應時間反推帳號是否存在。
  const ok = admin
    ? verifyPassword(password, admin.password_hash)
    : (verifyPassword(password, hashPassword("dummy")), false);

  if (!admin || !ok) redirect("/admin/login?e=credentials");
  if (admin.disabled) redirect("/admin/login?e=disabled");

  await createSession("admin", admin.id, await requestMeta());
  run(`UPDATE admins SET last_login_at = datetime('now') WHERE id = ?`, admin.id);

  redirect(next && next.startsWith("/admin") ? next : "/admin");
}

export async function adminLogoutAction() {
  await destroySession("admin");
  redirect("/admin/login");
}

export async function adminChangePasswordAction(form: FormData) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login?e=session");

  const currentPw = String(form.get("current") ?? "");
  const nextPw = String(form.get("next") ?? "");

  const row = get<{ password_hash: string }>(
    `SELECT password_hash FROM admins WHERE id = ?`,
    admin.id
  );
  if (!row || !verifyPassword(currentPw, row.password_hash)) {
    redirect("/admin/password?e=current");
  }

  const problem = passwordProblem(nextPw);
  if (problem) redirect(`/admin/password?m=${encodeURIComponent(problem)}`);
  if (currentPw === nextPw) redirect("/admin/password?e=same");

  run(
    `UPDATE admins SET password_hash = ?, must_change_password = 0 WHERE id = ?`,
    hashPassword(nextPw),
    admin.id
  );

  // 改完密碼把其他裝置踢掉，再幫目前這台重新登入。
  destroyAllSessions("admin", admin.id);
  await createSession("admin", admin.id, await requestMeta());

  // 導到這個角色實際看得到的第一個頁面。
  // 寫死 /admin 的話，出貨人員一改完密碼就會被自己的權限擋在「沒有權限」頁，
  // 看起來像剛改完密碼就出錯。
  redirect(`${landingFor(admin.role)}?password=1`);
}
