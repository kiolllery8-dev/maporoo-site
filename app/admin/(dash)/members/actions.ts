"use server";

import { redirect } from "next/navigation";
import { get, run } from "../../../lib/db";
import { destroyAllSessions } from "../../../lib/auth";
import { requireAdmin } from "../../../lib/admin";

/**
 * 停用／恢復會員。
 * 停用時順手把該會員所有裝置的登入清掉——否則他手上還握著有效的 session，
 * 停用等於沒停。
 */
export async function toggleMemberAction(form: FormData) {
  await requireAdmin("members.manage");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/members");

  const row = get<{ disabled: number }>(`SELECT disabled FROM members WHERE id = ?`, id);
  if (!row) redirect("/admin/members");

  const next = row.disabled ? 0 : 1;
  run(`UPDATE members SET disabled = ? WHERE id = ?`, next, id);
  if (next === 1) destroyAllSessions("member", id);

  redirect("/admin/members?ok=toggled");
}
