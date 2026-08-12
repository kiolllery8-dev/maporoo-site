"use server";

import { redirect } from "next/navigation";
import { get, run, transaction } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { products as catalogProducts } from "../../../lib/catalog";

/**
 * 把 app/lib/catalog.ts 的商品匯入資料庫。
 *
 * 以 slug 比對：已存在的只補齊空白欄位不覆蓋（後台改過的內容不會被蓋掉），
 * 不存在的才新增。所以這顆按鈕重複按是安全的。
 */
export async function importCatalogAction() {
  await requireAdmin("products.edit");

  const importAll = transaction(() => {
    let created = 0;
    let skipped = 0;

    for (const p of catalogProducts) {
      const exists = get<{ id: number }>(`SELECT id FROM products WHERE slug = ?`, p.slug);
      if (exists) {
        skipped++;
        continue;
      }

      run(
        `INSERT INTO products
           (slug, sku, name, en, size, price, list_price, collection, origin,
            tagline, about, suits, note, caution,
            stock, track_stock, status, sort,
            highlights_json, how_to_use_json, faq_json, concerns_json, ingredients_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 'active', ?, ?, ?, ?, ?, ?)`,
        p.slug,
        p.sku ?? "",
        p.name,
        p.en ?? "",
        p.size ?? "",
        p.price ?? 0,
        p.listPrice ?? null,
        p.collection ?? "",
        p.origin ?? "",
        p.tagline ?? "",
        p.about ?? "",
        p.suits ?? "",
        p.note ?? "",
        p.caution ?? "",
        created,
        JSON.stringify(p.highlights ?? []),
        JSON.stringify(p.howToUse ?? []),
        JSON.stringify(p.faq ?? []),
        JSON.stringify(p.concerns ?? []),
        JSON.stringify(p.ingredients ?? [])
      );
      created++;
    }

    return { created, skipped };
  });

  const { created, skipped } = importAll();
  redirect(`/admin/products?ok=import&created=${created}&skipped=${skipped}`);
}

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

function intField(form: FormData, name: string) {
  const n = Number(form.get(name));
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

export async function saveProductAction(form: FormData) {
  await requireAdmin("products.edit");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/products");

  const exists = get<{ id: number }>(`SELECT id FROM products WHERE id = ?`, id);
  if (!exists) redirect("/admin/products?e=notfound");

  const listPriceRaw = field(form, "list_price");

  run(
    `UPDATE products SET
       name = ?, en = ?, size = ?, price = ?, list_price = ?,
       tagline = ?, about = ?, suits = ?, note = ?, caution = ?,
       stock = ?, track_stock = ?, status = ?, featured = ?, sort = ?,
       updated_at = datetime('now')
     WHERE id = ?`,
    field(form, "name"),
    field(form, "en"),
    field(form, "size"),
    intField(form, "price"),
    listPriceRaw === "" ? null : Math.trunc(Number(listPriceRaw)) || null,
    field(form, "tagline"),
    field(form, "about"),
    field(form, "suits"),
    field(form, "note"),
    field(form, "caution"),
    intField(form, "stock"),
    form.get("track_stock") ? 1 : 0,
    field(form, "status") || "active",
    form.get("featured") ? 1 : 0,
    intField(form, "sort"),
    id
  );

  redirect(`/admin/products/${id}?ok=saved`);
}
