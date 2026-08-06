"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../lib/cart";
import { getProduct, heroImage } from "../lib/catalog";

const FREE_SHIPPING_OVER = 1500;
const SHIPPING_FEE = 80;

export default function CartView() {
  const { lines, subtotal, count, ready, setQty, remove } = useCart();

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const qtyBtn: React.CSSProperties = {
    width: 34,
    height: 34,
    border: "1px solid var(--line)",
    background: "transparent",
    color: "var(--ink)",
    cursor: "pointer",
    fontFamily: "inherit",
    lineHeight: 1,
  };

  return (
    <div className="wrap" style={{ paddingTop: 120, paddingBottom: 110, minHeight: "70vh" }}>
      <p className="eyebrow">SHOPPING BAG</p>
      <h1 style={{ marginTop: 16, fontSize: "clamp(30px,4.6vw,48px)" }}>購物袋</h1>

      {!ready ? (
        <p style={{ marginTop: 40, color: "var(--mute)" }}>載入中⋯</p>
      ) : lines.length === 0 ? (
        <div style={{ marginTop: 40 }}>
          <p style={{ color: "var(--soft)", fontSize: "1.05rem" }}>你的購物袋是空的。</p>
          <div style={{ marginTop: 24 }}>
            <Link href="/products" className="lnk-dark">瀏覽全部商品</Link>
          </div>
        </div>
      ) : (
        <div className="grid g2" style={{ marginTop: 46, gap: 56, alignItems: "start" }}>
          {/* lines */}
          <div>
            {lines.map((l) => {
              const p = getProduct(l.slug);
              if (!p) return null;
              const img = heroImage(p);
              return (
                <div
                  key={l.slug}
                  style={{ display: "flex", gap: 18, padding: "22px 0", borderTop: "1px solid var(--line)" }}
                >
                  <Link
                    href={`/products/${p.slug}`}
                    style={{ position: "relative", width: 88, height: 110, flexShrink: 0, background: "var(--paper2)", border: "1px solid var(--line)", overflow: "hidden" }}
                  >
                    {img && <Image src={img} alt={p.name} fill sizes="88px" style={{ objectFit: "cover" }} />}
                  </Link>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/products/${p.slug}`}>
                      <h2 style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.55 }}>{p.name}</h2>
                    </Link>
                    <p className="en" style={{ marginTop: 5 }}>{p.size} ─ {p.sku}</p>

                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)" }}>
                        <button type="button" style={qtyBtn} onClick={() => setQty(l.slug, l.qty - 1)} aria-label={`減少 ${p.name} 的數量`}>
                          −
                        </button>
                        <span style={{ width: 40, textAlign: "center", fontWeight: 700, fontSize: ".95rem" }}>{l.qty}</span>
                        <button type="button" style={qtyBtn} onClick={() => setQty(l.slug, l.qty + 1)} aria-label={`增加 ${p.name} 的數量`}>
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.slug)}
                        style={{ border: "none", background: "none", color: "var(--mute)", fontSize: ".88rem", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
                      >
                        移除
                      </button>
                    </div>
                  </div>

                  <p style={{ fontWeight: 700, fontSize: "1rem", whiteSpace: "nowrap" }}>
                    NT$ {(p.price * l.qty).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* summary */}
          <aside style={{ border: "1px solid var(--line)", padding: 30, background: "var(--paper2)", position: "sticky", top: 96 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 900 }}>訂單摘要</h2>

            <div style={{ marginTop: 22, fontSize: "1rem", color: "var(--soft)" }}>
              <p style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span>小計（{count} 件）</span>
                <span>NT$ {subtotal.toLocaleString()}</span>
              </p>
              <p style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
                <span>運費</span>
                <span>{shipping === 0 ? "免運" : `NT$ ${shipping}`}</span>
              </p>
              <p
                style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)", color: "var(--ink)", fontWeight: 900, fontSize: "1.15rem" }}
              >
                <span>合計</span>
                <span>NT$ {total.toLocaleString()}</span>
              </p>
            </div>

            {shipping > 0 && (
              <p style={{ marginTop: 4, fontSize: ".86rem", color: "var(--mute)" }}>
                再加購 NT$ {(FREE_SHIPPING_OVER - subtotal).toLocaleString()} 即可免運。
              </p>
            )}

            {/* Checkout is intentionally disabled: no payment gateway is
                connected yet. Wiring 綠界／藍新 here needs merchant credentials
                and an order backend — see README. */}
            <button
              type="button"
              disabled
              title="結帳功能尚未開通"
              style={{
                marginTop: 24,
                width: "100%",
                background: "var(--mute)",
                color: "#fff",
                border: "none",
                padding: "16px 20px",
                fontSize: ".95rem",
                fontWeight: 700,
                letterSpacing: ".12em",
                cursor: "not-allowed",
                fontFamily: "inherit",
              }}
            >
              前往結帳
            </button>
            <p style={{ marginTop: 12, fontSize: ".85rem", color: "var(--mute)", lineHeight: 1.85 }}>
              線上結帳尚未開通。目前可先將商品加入購物袋確認品項與金額，我們正在串接金流。
            </p>

            <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
              <Link href="/products" className="lnk-dark">繼續選購</Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
