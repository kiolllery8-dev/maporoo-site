"use server";

// 客服回覆與結案。權限用 members.view——看得到會員的人就看得到客人的提問，
// 出貨人員不該讀到客人的私訊。

import { redirect } from "next/navigation";
import { requireAdmin } from "../../../lib/admin";
import {
  addAdminMessage,
  cleanBody,
  setThreadStatus,
  threadById,
} from "../../../lib/chat";

function idOf(form: FormData): number {
  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/chat");
  if (!threadById(id)) redirect("/admin/chat");
  return id;
}

export async function replyChatAction(form: FormData) {
  const admin = await requireAdmin("members.view");
  const id = idOf(form);

  const body = cleanBody(form.get("body"));
  if (!body) redirect(`/admin/chat/${id}?e=empty`);

  addAdminMessage(id, admin.name || admin.username, body);
  redirect(`/admin/chat/${id}?ok=sent`);
}

export async function closeChatAction(form: FormData) {
  await requireAdmin("members.view");
  const id = idOf(form);
  setThreadStatus(id, "closed");
  redirect(`/admin/chat/${id}?ok=closed`);
}

export async function reopenChatAction(form: FormData) {
  await requireAdmin("members.view");
  const id = idOf(form);
  setThreadStatus(id, "open");
  redirect(`/admin/chat/${id}?ok=reopened`);
}
