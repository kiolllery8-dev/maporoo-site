"use client";

import Link from "next/link";
import { useCart } from "../lib/cart";

/**
 * 購物袋連結。
 *
 * compact 模式給手機用：只有袋子圖示與數字，不顯示「購物袋」三個字。
 * 手機的頁首要塞下 logo、字標、購物袋、漢堡四樣東西，320px 的螢幕上
 * 光是那三個字就會把漢堡擠出畫面（實測超出 28px）。
 */
export default function CartLink({ compact = false }: { compact?: boolean }) {
  const { count, ready } = useCart();
  const showCount = ready && count > 0;

  if (compact) {
    return (
      <Link
        href="/cart"
        aria-label={showCount ? `購物袋，${count} 件商品` : "購物袋"}
        style={{ position: "relative", display: "inline-flex", alignItems: "center", padding: "2px" }}
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <path d="M6 7h12l-1 13H7L6 7Z" />
          <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
        </svg>
        {showCount && (
          <span
            style={{
              position: "absolute",
              top: -3,
              right: -6,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 8,
              background: "var(--ink)",
              color: "#fff",
              fontSize: ".62rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link href="/cart" style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      購物袋
      {/* Rendered only after hydration so SSR and client markup agree. */}
      {showCount && (
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
