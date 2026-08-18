import "server-only";

// 分類（品類／肌膚需求／成分）的資料來源。
//
// 跟商品同一套策略：讀資料庫，資料庫是空的就退回 app/lib/catalog.ts。
// 全新環境或還沒按過匯入時，前台顯示的仍然是完整的分類，不會變成空選單。
//
// 匯入之後資料庫就是唯一真相，後台改什麼前台就顯示什麼。

import {
  collections as seedCollections,
  concerns as seedConcerns,
  ingredientPages as seedIngredients,
  type Collection,
  type Concern,
  type Faq,
  type IngredientPage,
} from "./catalog";
import { all } from "./db";

export type Kind = "collection" | "concern" | "ingredient";

export const KIND_LABEL: Record<Kind, string> = {
  collection: "品類",
  concern: "肌膚需求",
  ingredient: "成分",
};

export type TaxonomyRow = {
  id: number;
  kind: string;
  slug: string;
  zh: string;
  en: string;
  d: string;
  intro: string;
  what: string;
  how: string;
  faq_json: string;
  sort: number;
  disabled: number;
};

function json<T>(raw: string, fallback: T): T {
  try {
    const v = JSON.parse(raw || "");
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

/** 前台看得到的那一種分類。資料庫沒有資料就回 null，交給呼叫端走 fallback。 */
function rowsOf(kind: Kind): TaxonomyRow[] | null {
  try {
    const rows = all<TaxonomyRow>(
      `SELECT * FROM taxonomies WHERE kind = ? AND disabled = 0 ORDER BY sort, id`,
      kind
    );
    return rows.length ? rows : null;
  } catch {
    // 資料庫還沒建好（例如 build 階段）就走 fallback。
    return null;
  }
}

export function shopCollections(): Collection[] {
  const rows = rowsOf("collection");
  if (!rows) return seedCollections;
  return rows.map((r) => ({ slug: r.slug, zh: r.zh, en: r.en, d: r.d, intro: r.intro }));
}

export function shopConcerns(): Concern[] {
  const rows = rowsOf("concern");
  if (!rows) return seedConcerns;
  return rows.map((r) => ({ slug: r.slug, zh: r.zh, en: r.en, d: r.d, intro: r.intro }));
}

export function shopIngredientPages(): IngredientPage[] {
  const rows = rowsOf("ingredient");
  if (!rows) return seedIngredients;
  return rows.map((r) => ({
    slug: r.slug,
    zh: r.zh,
    en: r.en,
    d: r.d,
    what: r.what,
    how: r.how,
    faq: json(r.faq_json, [] as Faq[]),
  }));
}

export function getShopCollection(slug: string) {
  return shopCollections().find((c) => c.slug === slug);
}
export function getShopConcern(slug: string) {
  return shopConcerns().find((c) => c.slug === slug);
}
export function getShopIngredientPage(slug: string) {
  return shopIngredientPages().find((i) => i.slug === slug);
}

/** 後台用：連停用的也要看得到。 */
export function adminTaxonomies(kind: Kind): TaxonomyRow[] {
  return all<TaxonomyRow>(`SELECT * FROM taxonomies WHERE kind = ? ORDER BY sort, id`, kind);
}

export function taxonomyCounts(): Record<Kind, { total: number; live: number }> {
  const out = {} as Record<Kind, { total: number; live: number }>;
  for (const k of ["collection", "concern", "ingredient"] as Kind[]) {
    const rows = adminTaxonomies(k);
    out[k] = { total: rows.length, live: rows.filter((r) => r.disabled === 0).length };
  }
  return out;
}

/** 程式碼裡那三組的筆數，後台匯入按鈕要顯示。 */
export const SEED_COUNTS: Record<Kind, number> = {
  collection: seedCollections.length,
  concern: seedConcerns.length,
  ingredient: seedIngredients.length,
};

export { seedCollections, seedConcerns, seedIngredients };
