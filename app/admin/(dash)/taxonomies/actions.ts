"use server";

// 分類管理。品類、肌膚需求、成分三組共用同一組動作，以 kind 區分。

import { redirect } from "next/navigation";
import { get, run, transaction } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { seedCollections, seedConcerns, seedIngredients, type Kind } from "../../../lib/taxonomy";

const KINDS: Kind[] = ["collection", "concern", "ingredient"];

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

function kindOf(form: FormData): Kind {
  const k = field(form, "kind") as Kind;
  if (!KINDS.includes(k)) redirect("/admin/taxonomies");
  return k;
}

/** slug 進網址，只收小寫英數與連字號。 */
function normalizeSlug(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function back(kind: Kind, q: string) {
  redirect(`/admin/taxonomies?kind=${kind}&${q}`);
}

/**
 * 把 catalog.ts 的三組分類匯入資料庫。
 * 以 (kind, slug) 比對，已存在的略過不覆蓋，所以重複按是安全的。
 */
export async function importTaxonomiesAction(form: FormData) {
  await requireAdmin("products.edit");
  const kind = kindOf(form);

  const seed =
    kind === "collection"
      ? seedCollections.map((c, i) => ({ ...c, what: "", how: "", faq: [], sort: i }))
      : kind === "concern"
        ? seedConcerns.map((c, i) => ({ ...c, what: "", how: "", faq: [], sort: i }))
        : seedIngredients.map((i2, i) => ({ ...i2, intro: "", sort: i }));

  const doImport = transaction(() => {
    let created = 0;
    let skipped = 0;
    for (const s of seed) {
      const exists = get<{ id: number }>(
        `SELECT id FROM taxonomies WHERE kind = ? AND slug = ?`,
        kind,
        s.slug
      );
      if (exists) {
        skipped++;
        continue;
      }
      run(
        `INSERT INTO taxonomies (kind, slug, zh, en, d, intro, what, how, faq_json, sort)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        kind,
        s.slug,
        s.zh,
        s.en,
        s.d,
        ("intro" in s ? s.intro : "") ?? "",
        s.what ?? "",
        s.how ?? "",
        JSON.stringify(s.faq ?? []),
        s.sort
      );
      created++;
    }
    return { created, skipped };
  });

  const { created, skipped } = doImport();
  back(kind, `ok=import&created=${created}&skipped=${skipped}`);
}

export async function createTaxonomyAction(form: FormData) {
  await requireAdmin("products.edit");
  const kind = kindOf(form);

  const slug = normalizeSlug(field(form, "slug"));
  const zh = field(form, "zh");
  if (!slug || !zh) back(kind, "e=missing");
  if (get<{ id: number }>(`SELECT id FROM taxonomies WHERE kind = ? AND slug = ?`, kind, slug)) {
    back(kind, "e=taken");
  }

  const max = get<{ m: number | null }>(
    `SELECT MAX(sort) AS m FROM taxonomies WHERE kind = ?`,
    kind
  )?.m;

  run(
    `INSERT INTO taxonomies (kind, slug, zh, en, d, sort) VALUES (?, ?, ?, ?, ?, ?)`,
    kind,
    slug,
    zh,
    field(form, "en"),
    field(form, "d"),
    (max ?? -1) + 1
  );
  back(kind, "ok=created");
}

export async function saveTaxonomyAction(form: FormData) {
  await requireAdmin("products.edit");
  const kind = kindOf(form);
  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) back(kind, "e=notfound");

  const row = get<{ id: number }>(`SELECT id FROM taxonomies WHERE id = ? AND kind = ?`, id, kind);
  if (!row) back(kind, "e=notfound");

  run(
    `UPDATE taxonomies SET zh = ?, en = ?, d = ?, intro = ?, what = ?, how = ?,
            sort = ?, disabled = ?, updated_at = datetime('now')
      WHERE id = ?`,
    field(form, "zh"),
    field(form, "en"),
    field(form, "d"),
    field(form, "intro"),
    field(form, "what"),
    field(form, "how"),
    Number(form.get("sort")) || 0,
    form.get("disabled") ? 1 : 0,
    id
  );
  back(kind, "ok=saved");
}

export async function deleteTaxonomyAction(form: FormData) {
  await requireAdmin("products.edit");
  const kind = kindOf(form);
  const id = Number(form.get("id"));

  const row = get<{ slug: string; disabled: number }>(
    `SELECT slug, disabled FROM taxonomies WHERE id = ? AND kind = ?`,
    id,
    kind
  );
  if (!row) back(kind, "e=notfound");

  // 還在前台顯示的分類不給直接刪——商品可能正指向它，刪掉會出現壞掉的連結。
  if (row!.disabled === 0) back(kind, "e=livedelete");

  run(`DELETE FROM taxonomies WHERE id = ?`, id);
  back(kind, "ok=deleted");
}
