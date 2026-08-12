"use server";

// 管理者帳號的管理。只有 owner（負責人）能進到這裡的任何一個動作。
//
// 初始密碼由負責人自己輸入，系統不產生也不傳送——
// 產生一組隨機密碼的話，就得想辦法把它交到對方手上（塞進網址、寄信、存進資料庫），
// 每一種都會讓明文密碼多跑一段路。讓負責人當面或用既有的通訊方式給，最短也最安全。
// 新帳號一律帶著「第一次登入必須改密碼」的旗標。

import { redirect } from "next/navigation";
import { get, run } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import {
  destroyAllSessions,
  hashPassword,
  isValidEmail,
  normalizeEmail,
  passwordProblem,
} from "../../../lib/auth";
import { isRole } from "../../../lib/permissions";

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/** 系統至少要留一個能動的 owner，否則沒有人管得了管理者帳號。 */
function otherActiveOwners(excludeId: number): number {
  return (
    get<{ c: number }>(
      `SELECT COUNT(*) AS c FROM admins WHERE role = 'owner' AND disabled = 0 AND id <> ?`,
      excludeId
    )?.c ?? 0
  );
}

export async function createAdminAction(form: FormData) {
  await requireAdmin("staff.manage");

  const email = normalizeEmail(field(form, "email"));
  const name = field(form, "name");
  const role = field(form, "role");
  const password = String(form.get("password") ?? "");

  if (!email || !password) redirect("/admin/staff?e=missing");
  if (!isValidEmail(email)) redirect("/admin/staff?e=email");
  if (!isRole(role)) redirect("/admin/staff?e=role");

  const problem = passwordProblem(password);
  if (problem) redirect(`/admin/staff?m=${encodeURIComponent(problem)}`);

  if (get<{ id: number }>(`SELECT id FROM admins WHERE email = ?`, email)) {
    redirect("/admin/staff?e=taken");
  }

  run(
    `INSERT INTO admins (email, password_hash, name, role, must_change_password)
     VALUES (?, ?, ?, ?, 1)`,
    email,
    hashPassword(password),
    name,
    role
  );

  redirect("/admin/staff?ok=created");
}

export async function changeRoleAction(form: FormData) {
  const me = await requireAdmin("staff.manage");

  const id = Number(form.get("id"));
  const role = field(form, "role");
  if (!Number.isInteger(id) || id <= 0 || !isRole(role)) redirect("/admin/staff?e=notfound");

  const target = get<{ id: number; role: string }>(`SELECT id, role FROM admins WHERE id = ?`, id);
  if (!target) redirect("/admin/staff?e=notfound");

  // 把自己從 owner 降級，而且沒有別的 owner 在＝把自己鎖在門外。
  if (id === me.id && target.role === "owner" && role !== "owner" && otherActiveOwners(id) === 0) {
    redirect("/admin/staff?e=lastowner");
  }

  run(`UPDATE admins SET role = ? WHERE id = ?`, role, id);
  redirect("/admin/staff?ok=role");
}

export async function toggleAdminAction(form: FormData) {
  const me = await requireAdmin("staff.manage");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/staff?e=notfound");
  if (id === me.id) redirect("/admin/staff?e=self");

  const target = get<{ disabled: number; role: string }>(
    `SELECT disabled, role FROM admins WHERE id = ?`,
    id
  );
  if (!target) redirect("/admin/staff?e=notfound");

  const next = target.disabled ? 0 : 1;

  // 停用最後一個 owner 等於整個後台沒有人能管帳號了。
  if (next === 1 && target.role === "owner" && otherActiveOwners(id) === 0) {
    redirect("/admin/staff?e=lastowner");
  }

  run(`UPDATE admins SET disabled = ? WHERE id = ?`, next, id);
  // 停用要同時把對方的登入清掉，否則他手上還握著有效的 session。
  if (next === 1) destroyAllSessions("admin", id);

  redirect("/admin/staff?ok=toggled");
}

export async function resetAdminPasswordAction(form: FormData) {
  await requireAdmin("staff.manage");

  const id = Number(form.get("id"));
  const password = String(form.get("password") ?? "");
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/staff?e=notfound");

  const problem = passwordProblem(password);
  if (problem) redirect(`/admin/staff?m=${encodeURIComponent(problem)}`);

  if (!get<{ id: number }>(`SELECT id FROM admins WHERE id = ?`, id)) {
    redirect("/admin/staff?e=notfound");
  }

  run(
    `UPDATE admins SET password_hash = ?, must_change_password = 1 WHERE id = ?`,
    hashPassword(password),
    id
  );
  // 重設密碼把對方所有裝置踢掉，他必須用新密碼重新登入並立刻改掉。
  destroyAllSessions("admin", id);

  redirect("/admin/staff?ok=reset");
}
