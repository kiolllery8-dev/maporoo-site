"use server";

// 文章的圖片動作：封面與內文插圖。
//
// 商品是「相簿」（有順序、第一張是封面），文章是「一張封面 ＋ 想插哪就插哪」，
// 所以這裡不做排序，只做上傳、設封面、插進內文、從媒體庫移除。

import { redirect } from "next/navigation";
import { requireAdmin } from "../../../lib/admin";
import { get, run } from "../../../lib/db";
import { addMedia, mediaByUrl, setMediaAlt } from "../../../lib/media";
import { saveUpload } from "../../../lib/uploads";

function articleId(form: FormData): number {
  const id = Number(form.get("article_id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/articles");
  if (!get<{ id: number }>(`SELECT id FROM articles WHERE id = ?`, id)) {
    redirect("/admin/articles");
  }
  return id;
}

function back(id: number, q: string) {
  redirect(`/admin/articles/${id}?${q}#images`);
}

/** 上傳圖片。可以直接指定它同時成為封面。 */
export async function uploadArticleImageAction(form: FormData) {
  const admin = await requireAdmin("articles.manage");
  const id = articleId(form);
  const asCover = form.get("as_cover") === "1";

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) back(id, "e=empty");

  let first = "";
  let added = 0;
  let failed = "";

  for (const file of files) {
    const r = await saveUpload(file);
    if (!r.ok) {
      failed = r.reason;
      continue;
    }
    if (!mediaByUrl(r.url)) {
      addMedia({
        url: r.url,
        filename: r.filename,
        mime: r.mime,
        bytes: r.bytes,
        uploadedBy: admin.username,
      });
    }
    if (!first) first = r.url;
    added++;
  }

  if (added === 0) back(id, `e=${failed || "empty"}`);

  if (asCover && first) {
    run(`UPDATE articles SET cover = ?, updated_at = datetime('now') WHERE id = ?`, first, id);
    back(id, `ok=cover&n=${added}`);
  }
  back(id, `ok=uploaded&n=${added}${failed ? `&e=${failed}` : ""}`);
}

export async function setArticleCoverAction(form: FormData) {
  await requireAdmin("articles.manage");
  const id = articleId(form);
  const url = String(form.get("url") ?? "");
  if (url && !mediaByUrl(url)) back(id, "e=notfound");
  run(`UPDATE articles SET cover = ?, updated_at = datetime('now') WHERE id = ?`, url, id);
  back(id, url ? "ok=cover" : "ok=coverclear");
}

/** 把圖片語法接到內文最後面。寫手再把它剪到想要的位置。 */
export async function insertArticleImageAction(form: FormData) {
  await requireAdmin("articles.manage");
  const id = articleId(form);
  const url = String(form.get("url") ?? "");
  const m = mediaByUrl(url);
  if (!m) back(id, "e=notfound");

  const row = get<{ body_md: string }>(`SELECT body_md FROM articles WHERE id = ?`, id);
  const body = row?.body_md ?? "";
  const snippet = `![${m!.alt}](${m!.url})`;
  const next = body.trimEnd() ? `${body.trimEnd()}\n\n${snippet}\n` : `${snippet}\n`;

  run(`UPDATE articles SET body_md = ?, updated_at = datetime('now') WHERE id = ?`, next, id);
  back(id, "ok=inserted");
}

export async function setMediaAltAction(form: FormData) {
  await requireAdmin("articles.manage");
  const id = articleId(form);
  setMediaAlt(String(form.get("url") ?? ""), String(form.get("alt") ?? ""));
  back(id, "ok=alt");
}
