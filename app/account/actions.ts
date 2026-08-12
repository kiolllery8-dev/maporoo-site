"use server";

// 會員的註冊、登入、登出、資料維護。
//
// 表單一律用原生 <form action={...}>，錯誤透過 redirect 的 query string 回傳。
// 這樣整套流程不需要任何 client-side JavaScript 就能運作。

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { get, run } from "../lib/db";
import {
  createSession,
  currentMember,
  destroyAllSessions,
  destroySession,
  hashPassword,
  isValidEmail,
  normalizeEmail,
  passwordProblem,
  verifyPassword,
} from "../lib/auth";

async function requestMeta() {
  const h = await headers();
  return {
    // 站台在 nginx 後面，真實來源看 x-forwarded-for 的第一段。
    ip: (h.get("x-forwarded-for") ?? "").split(",")[0].trim(),
    userAgent: h.get("user-agent") ?? "",
  };
}

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

// ── 註冊 ────────────────────────────────────────────────────

export async function registerAction(form: FormData) {
  const email = normalizeEmail(field(form, "email"));
  const password = String(form.get("password") ?? "");
  const name = field(form, "name");
  const phone = field(form, "phone");

  if (!email || !password) redirect("/account/register?e=missing");
  if (!isValidEmail(email)) redirect("/account/register?e=email");

  const pwProblem = passwordProblem(password);
  if (pwProblem) redirect(`/account/register?m=${encodeURIComponent(pwProblem)}`);

  const existing = get<{ id: number }>(`SELECT id FROM members WHERE email = ?`, email);
  if (existing) redirect("/account/register?e=taken");

  const { lastInsertRowid } = run(
    `INSERT INTO members (email, password_hash, name, phone, email_verified)
     VALUES (?, ?, ?, ?, 0)`,
    email,
    hashPassword(password),
    name,
    phone
  );

  // 尚未接寄信服務，所以註冊即開通。接上 Resend 之後，這裡改成寄驗證信。
  await createSession("member", lastInsertRowid, await requestMeta());
  run(`UPDATE members SET last_login_at = datetime('now') WHERE id = ?`, lastInsertRowid);

  redirect("/account?welcome=1");
}

// ── 登入 ────────────────────────────────────────────────────

export async function loginAction(form: FormData) {
  const email = normalizeEmail(field(form, "email"));
  const password = String(form.get("password") ?? "");
  const next = field(form, "next");

  if (!email || !password) redirect("/account/login?e=missing");

  const member = get<{ id: number; password_hash: string; disabled: number }>(
    `SELECT id, password_hash, disabled FROM members WHERE email = ?`,
    email
  );

  // 帳號不存在時也要跑一次雜湊比對，讓回應時間跟密碼錯誤的情況一致，
  // 避免有人靠回應快慢反推哪些 Email 註冊過。
  const ok = member
    ? verifyPassword(password, member.password_hash)
    : (verifyPassword(password, hashPassword("dummy")), false);

  if (!member || !ok) redirect("/account/login?e=credentials");
  if (member.disabled) redirect("/account/login?e=disabled");

  await createSession("member", member.id, await requestMeta());
  run(`UPDATE members SET last_login_at = datetime('now') WHERE id = ?`, member.id);

  redirect(next && next.startsWith("/") ? next : "/account");
}

// ── 登出 ────────────────────────────────────────────────────

export async function logoutAction() {
  await destroySession("member");
  redirect("/");
}

// ── 修改基本資料 ────────────────────────────────────────────

export async function updateProfileAction(form: FormData) {
  const member = await currentMember();
  if (!member) redirect("/account/login?e=session");

  run(
    `UPDATE members SET name = ?, phone = ? WHERE id = ?`,
    field(form, "name"),
    field(form, "phone"),
    member.id
  );

  redirect("/account?saved=1");
}

// ── 修改密碼 ────────────────────────────────────────────────

export async function changePasswordAction(form: FormData) {
  const member = await currentMember();
  if (!member) redirect("/account/login?e=session");

  const currentPw = String(form.get("current") ?? "");
  const nextPw = String(form.get("next") ?? "");

  const row = get<{ password_hash: string }>(
    `SELECT password_hash FROM members WHERE id = ?`,
    member.id
  );
  if (!row || !verifyPassword(currentPw, row.password_hash)) {
    redirect("/account/password?e=current");
  }

  const problem = passwordProblem(nextPw);
  if (problem) redirect(`/account/password?m=${encodeURIComponent(problem)}`);
  if (currentPw === nextPw) redirect("/account/password?e=same");

  run(`UPDATE members SET password_hash = ? WHERE id = ?`, hashPassword(nextPw), member.id);

  // 改密碼等於把其他裝置踢掉，然後重新登入目前這台。
  destroyAllSessions("member", member.id);
  await createSession("member", member.id, await requestMeta());

  redirect("/account?password=1");
}
