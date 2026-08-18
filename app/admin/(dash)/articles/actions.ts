"use server";

// 文章管理。權限：articles.manage（負責人、營運人員、內容編輯）。
//
// 發布前一定會跑 checkArticle()。有 blocking 違規就擋下來，
// 不管操作的人是誰——包含負責人。零商品置入是老闆定的規則，
// 不是「建議」，所以這裡不留繞過的後門。

import { redirect } from "next/navigation";
import { get, run } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { checkArticle } from "../../../lib/article-guard";

const KINDS = ["A", "B", "C", "D"];
const CATEGORIES = ["日常保健", "趨勢觀察", "生活風格"];

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/** slug 只收小寫英數與連字號——中文 slug 在網址列會變成一長串編碼。 */
function normalizeSlug(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseSources(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export async function createArticleAction(form: FormData) {
  await requireAdmin("articles.manage");

  const slug = normalizeSlug(field(form, "slug"));
  const title = field(form, "title");
  const kind = field(form, "kind");
  const picked = field(form, "category");

  if (!slug || !title) redirect("/admin/articles?e=missing");
  if (!KINDS.includes(kind)) redirect("/admin/articles?e=kind");
  if (get<{ id: number }>(`SELECT id FROM articles WHERE slug = ?`, slug)) {
    redirect("/admin/articles?e=taken");
  }

  // 表單有選分類就用它；沒選（或送了清單外的值）才照型態推一個預設值。
  const category = CATEGORIES.includes(picked)
    ? picked
    : kind === "D"
      ? "生活風格"
      : kind === "C"
        ? "趨勢觀察"
        : "日常保健";

  const { lastInsertRowid } = run(
    `INSERT INTO articles (slug, kind, category, title, status)
     VALUES (?, ?, ?, ?, 'draft')`,
    slug,
    kind,
    category,
    title
  );

  redirect(`/admin/articles/${lastInsertRowid}`);
}

export async function saveArticleAction(form: FormData) {
  await requireAdmin("articles.manage");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/articles?e=notfound");
  if (!get<{ id: number }>(`SELECT id FROM articles WHERE id = ?`, id)) {
    redirect("/admin/articles?e=notfound");
  }

  const kind = field(form, "kind");
  const category = field(form, "category");

  run(
    `UPDATE articles SET
       title = ?, description = ?, kind = ?, category = ?,
       reading_time = ?, body_md = ?, sources_json = ?, disclaimer = ?,
       updated_at = datetime('now')
     WHERE id = ?`,
    field(form, "title"),
    field(form, "description"),
    KINDS.includes(kind) ? kind : "A",
    CATEGORIES.includes(category) ? category : "日常保健",
    field(form, "reading_time"),
    field(form, "body_md"),
    JSON.stringify(parseSources(field(form, "sources"))),
    form.get("disclaimer") ? 1 : 0,
    id
  );

  redirect(`/admin/articles/${id}?ok=saved`);
}

export async function publishArticleAction(form: FormData) {
  await requireAdmin("articles.manage");

  const id = Number(form.get("id"));
  const a = get<{
    id: number;
    title: string;
    description: string;
    body_md: string;
    kind: string;
    sources_json: string;
    disclaimer: number;
  }>(`SELECT id, title, description, body_md, kind, sources_json, disclaimer FROM articles WHERE id = ?`, id);
  if (!a) redirect("/admin/articles?e=notfound");

  let sources: unknown[] = [];
  try {
    const parsed = JSON.parse(a.sources_json || "[]");
    if (Array.isArray(parsed)) sources = parsed;
  } catch {
    sources = [];
  }

  const result = checkArticle({
    title: a.title,
    description: a.description,
    body: a.body_md,
    kind: a.kind,
    sources,
    disclaimer: a.disclaimer === 1,
  });

  if (result.blocking.length) {
    // 擋下來，把原因帶回編輯頁。不寫進資料庫，狀態維持原樣。
    redirect(`/admin/articles/${id}?blocked=1`);
  }

  run(
    `UPDATE articles SET status = 'published',
       published_at = COALESCE(published_at, datetime('now')),
       updated_at = datetime('now')
     WHERE id = ?`,
    id
  );

  redirect(`/admin/articles/${id}?ok=published`);
}

export async function unpublishArticleAction(form: FormData) {
  await requireAdmin("articles.manage");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/articles?e=notfound");

  run(`UPDATE articles SET status = 'draft', updated_at = datetime('now') WHERE id = ?`, id);
  redirect(`/admin/articles/${id}?ok=unpublished`);
}

export async function deleteArticleAction(form: FormData) {
  await requireAdmin("articles.manage");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/articles?e=notfound");

  // 已發布的文章不給直接刪——先下架，避免手滑弄掉一篇有排名的文章。
  const a = get<{ status: string }>(`SELECT status FROM articles WHERE id = ?`, id);
  if (!a) redirect("/admin/articles?e=notfound");
  if (a.status === "published") redirect(`/admin/articles/${id}?e=publisheddelete`);

  run(`DELETE FROM articles WHERE id = ?`, id);
  redirect("/admin/articles?ok=deleted");
}
