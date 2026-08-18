import "server-only";

// 媒體庫與商品相簿的資料存取。
//
// 一張圖只在 media 留一筆，用途（商品相簿、文章封面、內文插圖）另外記。
// 這樣同一張圖可以重複使用，也不會因為某篇文章刪了就把圖砍掉。

import { all, get, run } from "./db";

export type Media = {
  id: number;
  url: string;
  filename: string;
  mime: string;
  bytes: number;
  alt: string;
  uploaded_by: string;
  created_at: string;
};

export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
  alt: string;
  sort: number;
};

// ── 媒體庫 ──────────────────────────────────────────────────

export function addMedia(m: {
  url: string;
  filename: string;
  mime: string;
  bytes: number;
  alt?: string;
  uploadedBy?: string;
}) {
  run(
    `INSERT INTO media (url, filename, mime, bytes, alt, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    m.url,
    m.filename,
    m.mime,
    m.bytes,
    m.alt ?? "",
    m.uploadedBy ?? ""
  );
}

export function listMedia(limit = 200): Media[] {
  return all<Media>(`SELECT * FROM media ORDER BY created_at DESC, id DESC LIMIT ?`, limit);
}

export function mediaByUrl(url: string): Media | undefined {
  return get<Media>(`SELECT * FROM media WHERE url = ?`, url);
}

export function setMediaAlt(url: string, alt: string) {
  run(`UPDATE media SET alt = ? WHERE url = ?`, alt.slice(0, 200), url);
}

/** 這張圖還有沒有人在用——刪檔案前一定要問。 */
export function mediaInUse(url: string): { products: number; articleCovers: number; bodies: number } {
  const n = (sql: string, ...p: (string | number)[]) => get<{ c: number }>(sql, ...p)?.c ?? 0;
  return {
    products: n(`SELECT COUNT(*) AS c FROM product_images WHERE url = ?`, url),
    articleCovers: n(`SELECT COUNT(*) AS c FROM articles WHERE cover = ?`, url),
    bodies: n(`SELECT COUNT(*) AS c FROM articles WHERE body_md LIKE ?`, `%${url}%`),
  };
}

export function deleteMediaRow(url: string) {
  run(`DELETE FROM media WHERE url = ?`, url);
}

// ── 商品相簿 ────────────────────────────────────────────────

export function productImageRows(productId: number): ProductImage[] {
  return all<ProductImage>(
    `SELECT * FROM product_images WHERE product_id = ? ORDER BY sort, id`,
    productId
  );
}

/** 接在最後面。sort 用「目前最大 + 1」，不重排既有的。 */
export function appendProductImage(productId: number, url: string, alt = "") {
  const max = get<{ m: number | null }>(
    `SELECT MAX(sort) AS m FROM product_images WHERE product_id = ?`,
    productId
  )?.m;
  run(
    `INSERT INTO product_images (product_id, url, alt, sort) VALUES (?, ?, ?, ?)`,
    productId,
    url,
    alt,
    (max ?? -1) + 1
  );
}

export function removeProductImage(id: number, productId: number) {
  run(`DELETE FROM product_images WHERE id = ? AND product_id = ?`, id, productId);
  resequence(productId);
}

export function setProductImageAlt(id: number, productId: number, alt: string) {
  run(
    `UPDATE product_images SET alt = ? WHERE id = ? AND product_id = ?`,
    alt.slice(0, 200),
    id,
    productId
  );
}

/** 跟前一張（或後一張）交換位置。第一張就是封面。 */
export function moveProductImage(id: number, productId: number, dir: "up" | "down") {
  const rows = productImageRows(productId);
  const i = rows.findIndex((r) => r.id === id);
  if (i < 0) return;
  const j = dir === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= rows.length) return;

  run(`UPDATE product_images SET sort = ? WHERE id = ?`, j, rows[i].id);
  run(`UPDATE product_images SET sort = ? WHERE id = ?`, i, rows[j].id);
}

/** 直接送到第一張——「設為封面」按一下就好，不用按半天上移。 */
export function makeProductCover(id: number, productId: number) {
  const rows = productImageRows(productId);
  const picked = rows.find((r) => r.id === id);
  if (!picked) return;
  const rest = rows.filter((r) => r.id !== id);
  run(`UPDATE product_images SET sort = 0 WHERE id = ?`, picked.id);
  rest.forEach((r, n) => run(`UPDATE product_images SET sort = ? WHERE id = ?`, n + 1, r.id));
}

/** 刪掉一張之後把 sort 收攏成 0,1,2…，避免久了變成 0,3,7。 */
function resequence(productId: number) {
  productImageRows(productId).forEach((r, n) => {
    if (r.sort !== n) run(`UPDATE product_images SET sort = ? WHERE id = ?`, n, r.id);
  });
}

/** 前台用：一次撈多個商品的圖，避免每個商品各查一次。 */
export function imagesByProductId(): Map<number, string[]> {
  const rows = all<{ product_id: number; url: string }>(
    `SELECT product_id, url FROM product_images ORDER BY product_id, sort, id`
  );
  const map = new Map<number, string[]>();
  for (const r of rows) {
    const list = map.get(r.product_id);
    if (list) list.push(r.url);
    else map.set(r.product_id, [r.url]);
  }
  return map;
}
