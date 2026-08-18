import "server-only";

// 前台的商品資料來源。
//
// 讀資料庫；資料庫還沒有商品時，退回 app/lib/catalog.ts 的內容。
//
// 為什麼要有 fallback：全新環境（剛部署、還沒按過匯入）的資料庫是空的。
// 沒有 fallback 的話，整個商店會是一片空白——寧可顯示程式碼裡那份，
// 也不要讓客人看到沒有商品的店。
//
// 匯入之後資料庫就是唯一真相，後台改什麼前台就顯示什麼。

import {
  products as seedProducts,
  collections,
  concerns,
  ingredientPages,
  type Product,
} from "./catalog";
import { all, get } from "./db";
import { imagesByProductId, productImageRows } from "./media";

type Row = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  en: string;
  size: string;
  price: number;
  list_price: number | null;
  collection: string;
  origin: string;
  tagline: string;
  about: string;
  suits: string;
  note: string;
  caution: string;
  status: string;
  sort: number;
  highlights_json: string;
  how_to_use_json: string;
  faq_json: string;
  concerns_json: string;
  ingredients_json: string;
};

function json<T>(raw: string, fallback: T): T {
  try {
    const v = JSON.parse(raw || "");
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

/** 資料庫的一列轉成前台在用的 Product 形狀，讓所有頁面不用改寫。 */
function toProduct(r: Row, images?: string[]): Product {
  return {
    slug: r.slug,
    sku: r.sku,
    name: r.name,
    en: r.en,
    size: r.size,
    price: r.price,
    listPrice: r.list_price,
    collection: r.collection,
    concerns: json(r.concerns_json, [] as string[]),
    ingredients: json(r.ingredients_json, [] as string[]),
    tagline: r.tagline,
    about: r.about,
    highlights: json(r.highlights_json, [] as Product["highlights"]),
    howToUse: json(r.how_to_use_json, [] as Product["howToUse"]),
    note: r.note || undefined,
    caution: r.caution || undefined,
    suits: r.suits,
    origin: r.origin || undefined,
    faq: json(r.faq_json, [] as Product["faq"]),
    images,
  };
}

const COLUMNS = `id, slug, sku, name, en, size, price, list_price, collection, origin,
  tagline, about, suits, note, caution, status, sort,
  highlights_json, how_to_use_json, faq_json, concerns_json, ingredients_json`;

/** 前台看得到的商品：只有上架中的，依 sort 排序。 */
export function shopProducts(): Product[] {
  try {
    const rows = all<Row>(
      `SELECT ${COLUMNS} FROM products WHERE status = 'active' ORDER BY sort, id`
    );
    if (rows.length > 0) {
      // 相簿一次撈完再對回去，避免每個商品各查一次資料庫。
      const gallery = imagesByProductId();
      return rows.map((r) => toProduct(r, gallery.get(r.id)));
    }
  } catch {
    // 資料庫不可用（例如 build 階段還沒有檔案）就走 fallback。
  }
  return seedProducts;
}

export function shopProduct(slug: string): Product | undefined {
  try {
    const r = get<Row>(`SELECT ${COLUMNS} FROM products WHERE slug = ? AND status = 'active'`, slug);
    if (r) return toProduct(r, productImageRows(r.id).map((i) => i.url));
    // 資料庫有商品但沒有這一支，代表它被下架或刪掉了——
    // 這時不要退回 catalog.ts，否則下架的商品會繼續出現在前台。
    const any = get<{ c: number }>(`SELECT COUNT(*) AS c FROM products`);
    if (any && any.c > 0) return undefined;
  } catch {
    /* 走 fallback */
  }
  return seedProducts.find((p) => p.slug === slug);
}

export function shopByCollection(slug: string): Product[] {
  return shopProducts().filter((p) => p.collection === slug);
}

export function shopByConcern(slug: string): Product[] {
  return shopProducts().filter((p) => p.concerns.includes(slug));
}

export function shopByIngredient(slug: string): Product[] {
  return shopProducts().filter((p) => p.ingredients.includes(slug));
}

/** 分類三組目前仍寫在 catalog.ts。要讓後台能新增分類，得先把它們也搬進資料庫。 */
export { collections, concerns, ingredientPages };
