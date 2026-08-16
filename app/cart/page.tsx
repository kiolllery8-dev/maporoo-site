import type { Metadata } from "next";
import CartView from "./CartView";
import { cartCatalog } from "../lib/cart-catalog";

// 商品資料由伺服器讀資料庫後傳進畫面，畫面顯示的價格才會跟結帳收的一致。
export const revalidate = 300;

export const metadata: Metadata = {
  title: "購物袋｜MAPOROO",
  description: "查看購物袋內的商品。",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView catalog={cartCatalog()} />;
}
