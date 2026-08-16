import "server-only";

// 購物袋與結帳畫面要顯示的商品資料。
//
// 那兩個畫面是 client component（購物袋活在 localStorage，只有瀏覽器知道內容），
// 所以它們讀不到資料庫。以前它們直接 import catalog.ts，結果是：
// 後台改了價格，畫面顯示舊價、結帳卻按新價收錢。
//
// 改成由伺服器把商品資料算好傳進去，畫面與收費就一定用同一份數字。

import { shopProducts } from "./shop";
import { heroImage } from "./catalog";

export type CartProduct = {
  slug: string;
  name: string;
  size: string;
  sku: string;
  price: number;
  image?: string;
};

/** 傳給 client component 的精簡商品表，只帶畫面用得到的欄位。 */
export function cartCatalog(): Record<string, CartProduct> {
  const map: Record<string, CartProduct> = {};
  for (const p of shopProducts()) {
    map[p.slug] = {
      slug: p.slug,
      name: p.name,
      size: p.size ?? "",
      sku: p.sku ?? "",
      price: p.price,
      image: heroImage(p),
    };
  }
  return map;
}
