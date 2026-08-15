"use client";

// 結帳表單。購物袋在 localStorage，所以品項必須由這裡送上去；
// 但送的只有 slug 與數量——金額一律由伺服器重算（見 actions.ts）。

import Link from "next/link";
import { useCart } from "../lib/cart";
import { getProduct } from "../lib/catalog";
import { shippingFor } from "../lib/shipping";
import { placeOrderAction } from "./actions";

type Props = {
  methods: Array<{ value: string; label: string }>;
  defaults: { email: string; name: string; phone: string };
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--line)",
  outline: "none",
  padding: "8px 0",
  fontSize: "1.05rem",
  color: "var(--ink)",
  fontWeight: 500,
  fontFamily: "inherit",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        fontSize: ".82rem",
        letterSpacing: ".14em",
        color: "var(--accent)",
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      {children}
    </span>
  );
}

export default function CheckoutForm({ methods, defaults }: Props) {
  const { lines, subtotal, count, ready } = useCart();

  if (!ready) return <p style={{ marginTop: 40, color: "var(--mute)" }}>載入中⋯</p>;

  if (lines.length === 0) {
    return (
      <div style={{ marginTop: 40 }}>
        <p style={{ color: "var(--soft)", fontSize: "1.05rem" }}>你的購物袋是空的。</p>
        <div style={{ marginTop: 24 }}>
          <Link href="/products" className="lnk-dark">
            瀏覽全部商品
          </Link>
        </div>
      </div>
    );
  }

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  return (
    <form action={placeOrderAction} className="grid g2" style={{ marginTop: 46, gap: 56, alignItems: "start" }}>
      {/* 品項：只送 slug 與數量 */}
      {lines.map((l) => (
        <span key={l.slug} style={{ display: "none" }}>
          <input type="hidden" name="slug" value={l.slug} />
          <input type="hidden" name="qty" value={l.qty} />
        </span>
      ))}

      <div>
        <p className="eyebrow" style={{ marginBottom: 22 }}>收件資訊</p>

        <label style={{ display: "block", marginBottom: 24 }}>
          <Label>收件人</Label>
          <input name="recipient" required defaultValue={defaults.name} autoComplete="name" style={inputStyle} />
        </label>

        <label style={{ display: "block", marginBottom: 24 }}>
          <Label>手機</Label>
          <input name="phone" type="tel" required defaultValue={defaults.phone} autoComplete="tel" style={inputStyle} />
        </label>

        <label style={{ display: "block", marginBottom: 24 }}>
          <Label>EMAIL</Label>
          <input name="email" type="email" required defaultValue={defaults.email} autoComplete="email" style={inputStyle} />
        </label>

        <div className="grid g2" style={{ gap: 20 }}>
          <label style={{ display: "block", marginBottom: 24 }}>
            <Label>郵遞區號</Label>
            <input name="zipcode" autoComplete="postal-code" style={inputStyle} />
          </label>
          <label style={{ display: "block", marginBottom: 24 }}>
            <Label>縣市</Label>
            <input name="city" autoComplete="address-level1" style={inputStyle} />
          </label>
        </div>

        <label style={{ display: "block", marginBottom: 24 }}>
          <Label>地址</Label>
          <input name="address" required autoComplete="street-address" style={inputStyle} />
        </label>

        <p className="eyebrow" style={{ margin: "34px 0 18px" }}>付款方式</p>
        {methods.map((m, i) => (
          <label
            key={m.value}
            style={{ display: "block", marginBottom: 12, fontSize: "1rem", color: "var(--soft)", fontWeight: 500 }}
          >
            <input type="radio" name="payment_method" value={m.value} defaultChecked={i === 0} style={{ marginRight: 10 }} />
            {m.label}
          </label>
        ))}

        <label style={{ display: "block", margin: "28px 0 24px" }}>
          <Label>備註（可留空）</Label>
          <textarea
            name="note"
            rows={3}
            maxLength={500}
            style={{ ...inputStyle, border: "1px solid var(--line)", padding: "10px 12px", lineHeight: 1.5 }}
          />
        </label>
      </div>

      <aside style={{ border: "1px solid var(--line)", padding: 30, background: "var(--paper2)", position: "sticky", top: 96 }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 900 }}>訂單摘要</h2>

        <div style={{ marginTop: 20 }}>
          {lines.map((l) => {
            const p = getProduct(l.slug);
            if (!p) return null;
            return (
              <p
                key={l.slug}
                style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "9px 0", fontSize: ".95rem", color: "var(--soft)" }}
              >
                <span>
                  {p.name}
                  <span style={{ color: "var(--mute)" }}> × {l.qty}</span>
                </span>
                <span style={{ whiteSpace: "nowrap" }}>NT$ {(p.price * l.qty).toLocaleString()}</span>
              </p>
            );
          })}
        </div>

        <div style={{ marginTop: 12, fontSize: "1rem", color: "var(--soft)" }}>
          <p style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
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

        <button
          type="submit"
          style={{
            marginTop: 20,
            width: "100%",
            background: "var(--ink)",
            color: "var(--paper)",
            border: "none",
            padding: "16px 20px",
            fontSize: ".95rem",
            fontWeight: 700,
            letterSpacing: ".12em",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          送出訂單
        </button>

        <p style={{ marginTop: 12, fontSize: ".85rem", color: "var(--mute)", lineHeight: 1.5 }}>
          線上刷卡尚未開通。送出後 MAPOROO 會以 Email 與你確認付款方式與出貨時間。
        </p>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
          <Link href="/cart" className="lnk-dark">
            回購物袋修改
          </Link>
        </div>
      </aside>
    </form>
  );
}
