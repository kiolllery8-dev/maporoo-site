"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../lib/cart";

export default function AddToCart({ slug }: { slug: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function onAdd() {
    add(slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2600);
  }

  const btn: React.CSSProperties = {
    width: 42,
    height: 42,
    border: "1px solid var(--line)",
    background: "transparent",
    color: "var(--ink)",
    fontSize: "1.1rem",
    cursor: "pointer",
    fontFamily: "inherit",
    lineHeight: 1,
  };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)" }}>
          <button type="button" style={btn} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="減少數量">
            −
          </button>
          <span
            aria-live="polite"
            style={{ width: 48, textAlign: "center", fontWeight: 700, fontSize: "1rem" }}
          >
            {qty}
          </span>
          <button type="button" style={btn} onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="增加數量">
            +
          </button>
        </div>

        <button
          type="button"
          onClick={onAdd}
          style={{
            background: "var(--ink)",
            color: "#fff",
            border: "none",
            padding: "15px 38px",
            fontSize: ".95rem",
            fontWeight: 700,
            letterSpacing: ".12em",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          加入購物袋
        </button>
      </div>

      <p
        role="status"
        style={{
          marginTop: 12,
          minHeight: 26,
          fontSize: ".92rem",
          color: "var(--accent)",
          fontWeight: 700,
          opacity: added ? 1 : 0,
          transition: "opacity .3s",
        }}
      >
        {added ? (
          <>
            已加入購物袋 ·{" "}
            <Link href="/cart" style={{ borderBottom: "1px solid var(--accent)" }}>
              查看購物袋
            </Link>
          </>
        ) : (
          " "
        )}
      </p>
    </div>
  );
}
