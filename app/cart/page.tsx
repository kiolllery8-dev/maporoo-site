import type { Metadata } from "next";
import CartView from "./CartView";

export const metadata: Metadata = {
  title: "購物袋｜MAPOROO",
  description: "查看購物袋內的商品。",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
