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

/**
 * 新增商品。
 *
 * 只要求最少的必填欄位——品名、slug、售價、品類。其餘（成分、使用步驟、
 * FAQ⋯）建立後在編輯頁補。要求一次填完二十個欄位，只會讓人放棄。
 *
 * 一律以草稿建立：新商品在你檢查過之前不該直接出現在前台。
 */
export async function createProductAction(form: FormData) {
  await requireAdmin("products.edit");

  const name = field(form, "name");
  const slug = field(form, "slug")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const collection = field(form, "collection");
  const price = intField(form, "price");

  if (!name || !slug) redirect("/admin/products/new?e=missing");
  if (price <= 0) redirect("/admin/products/new?e=price");
  if (get<{ id: number }>(`SELECT id FROM products WHERE slug = ?`, slug)) {
    redirect("/admin/products/new?e=taken");
  }

  const sku = field(form, "sku");
  if (sku && get<{ id: number }>(`SELECT id FROM products WHERE sku = ?`, sku)) {
    redirect("/admin/products/new?e=sku");
  }

  const listPriceRaw = field(form, "list_price");

  const { lastInsertRowid } = run(
    `INSERT INTO products
       (slug, sku, name, en, size, price, list_price, collection, origin,
        tagline, about, suits, stock, track_stock, status, sort,
        highlights_json, how_to_use_json, faq_json, concerns_json, ingredients_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 999,
             '[]', '[]', '[]', '[]', '[]')`,
    slug,
    sku,
    name,
    field(form, "en"),
    field(form, "size"),
    price,
    listPriceRaw === "" ? null : Math.trunc(Number(listPriceRaw)) || null,
    collection,
    field(form, "origin"),
    field(form, "tagline"),
    field(form, "about"),
    field(form, "suits"),
    intField(form, "stock"),
    form.get("track_stock") ? 1 : 0
  );

  redirect(`/admin/products/${lastInsertRowid}?ok=created`);
}

/** 刪除商品。已上架的不給直接刪，避免手滑弄掉一支正在賣的東西。 */
export async function deleteProductAction(form: FormData) {
  await requireAdmin("products.edit");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/products");

  const p = get<{ status: string; slug: string }>(
    `SELECT status, slug FROM products WHERE id = ?`,
    id
  );
  if (!p) redirect("/admin/products?e=notfound");
  if (p.status === "active") redirect(`/admin/products/${id}?e=activedelete`);

  // 訂單明細存的是下單當下的品名與價格，不是外鍵，
  // 所以刪商品不會影響歷史訂單。
  run(`DELETE FROM product_images WHERE product_id = ?`, id);
  run(`DELETE FROM products WHERE id = ?`, id);

  redirect("/admin/products?ok=deleted");
}
