"use client";

import Link from "next/link";
import { useCart } from "../lib/cart";

export default function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      購物袋
      {/* Rendered only after hydration so SSR and client markup agree. */}
      {ready && count > 0 && (
        <span
          aria-label={`購物袋內有 ${count} 件商品`}
          style={{
            marginLeft: 7,
            minWidth: 20,
            height: 20,
            padding: "0 6px",
            borderRadius: 10,
            background: "var(--ink)",
            color: "#fff",
            fontSize: ".68rem",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
