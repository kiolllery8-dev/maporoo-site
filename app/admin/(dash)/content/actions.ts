"use server";

// 前台文案的儲存。
//
// 一次存一個群組（例如「首頁 · 品牌主張」），而不是整頁一起送——
// 整頁一起送的話，兩個人同時在改就會互相蓋掉，而且錯一個欄位要重填全部。

import { redirect } from "next/navigation";
import { run } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { BLOCKS } from "../../../lib/content";

export async function saveContentAction(form: FormData) {
  await requireAdmin("content.manage");

  const group = String(form.get("__group") ?? "");
  const keys = BLOCKS.filter((b) => b.group === group).map((b) => b.key);
  if (keys.length === 0) redirect("/admin/content");

  for (const key of keys) {
    const raw = form.get(key);
    const value = typeof raw === "string" ? raw.trim() : "";
    run(
      `INSERT INTO content_blocks (key, label, value, updated_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
      key,
      BLOCKS.find((b) => b.key === key)?.label ?? "",
      value
    );
  }

  redirect(`/admin/content?ok=saved&g=${encodeURIComponent(group)}`);
}

/** 把一個群組回復成程式碼裡的預設文案。 */
export async function resetContentAction(form: FormData) {
  await requireAdmin("content.manage");

  const group = String(form.get("__group") ?? "");
  const keys = BLOCKS.filter((b) => b.group === group).map((b) => b.key);
  for (const key of keys) run(`DELETE FROM content_blocks WHERE key = ?`, key);

  redirect(`/admin/content?ok=reset&g=${encodeURIComponent(group)}`);
}
