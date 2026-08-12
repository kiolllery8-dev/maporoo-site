import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { all, get } from "../../../lib/db";
import { currentMember } from "../../../lib/auth";
import { bankTransferInfo, METHOD_LABEL, type PaymentMethod } from "../../../lib/payment";
import ClearCart from "../ClearCart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "訂單已成立｜MAPOROO",
  robots: { index: false, follow: false },
};

type Order = {
  id: number;
  order_no: string;
  member_id: number | null;
  email: string;
  recipient: string;
  phone: string;
  zipcode: string;
  city: string;
  address: string;
  subtotal_twd: number;
  shipping_twd: number;
  total_twd: number;
  payment_method: string;
  note: string;
  created_at: string;
};

type Item = { name: string; size: string; unit_price_twd: number; qty: number; total_twd: number };

export default async function OrderDone({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;

  const order = get<Order>(`SELECT * FROM orders WHERE order_no = ?`, orderNo);
  if (!order) notFound();

  // 訂單編號帶了 4 碼亂數，猜不到；會員的訂單另外再擋一層，
  // 避免登入者拿到別人的訂單網址就能看內容。
  const member = await currentMember();
  if (order.member_id && (!member || member.id !== order.member_id)) notFound();

  const items = all<Item>(`SELECT * FROM order_items WHERE order_id = ?`, order.id);
  const bank = bankTransferInfo();

  return (
    <div className="wrap-narrow" style={{ paddingTop: 120, paddingBottom: 110, minHeight: "70vh" }}>
      <ClearCart />

      <p className="eyebrow">訂單已成立</p>
      <h1 style={{ marginTop: 16, fontSize: "clamp(28px,4.4vw,44px)" }}>謝謝你的訂購</h1>
      <p style={{ marginTop: 20, color: "var(--soft)", fontSize: "1.05rem", lineHeight: 2 }}>
        訂單編號 <strong style={{ color: "var(--ink)" }}>{order.order_no}</strong>
        <br />
        MAPOROO 會以 Email（{order.email}）與你確認付款與出貨時間。
      </p>

      <section style={{ marginTop: 44 }}>
        <p className="eyebrow" style={{ marginBottom: 16 }}>訂購內容</p>
        {items.map((i, n) => (
          <p
            key={n}
            style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderTop: "1px solid var(--line)", color: "var(--soft)", fontSize: "1rem" }}
          >
            <span>
              {i.name}
              {i.size && <span style={{ color: "var(--mute)" }}> ・{i.size}</span>}
              <span style={{ color: "var(--mute)" }}> × {i.qty}</span>
            </span>
            <span style={{ whiteSpace: "nowrap" }}>NT$ {i.total_twd.toLocaleString()}</span>
          </p>
        ))}
        <p style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--line)", color: "var(--soft)" }}>
          <span>運費</span>
          <span>{order.shipping_twd === 0 ? "免運" : `NT$ ${order.shipping_twd.toLocaleString()}`}</span>
        </p>
        <p
          style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", color: "var(--ink)", fontWeight: 900, fontSize: "1.15rem" }}
        >
          <span>合計</span>
          <span>NT$ {order.total_twd.toLocaleString()}</span>
        </p>
      </section>

      <section style={{ marginTop: 44 }}>
        <p className="eyebrow" style={{ marginBottom: 16 }}>付款方式</p>
        <p style={{ color: "var(--soft)", fontSize: "1rem", lineHeight: 2 }}>
          {METHOD_LABEL[order.payment_method as PaymentMethod] ?? order.payment_method}
        </p>

        {order.payment_method === "bank_transfer" &&
          (bank.configured ? (
            <div style={{ marginTop: 14, padding: "18px 20px", background: "var(--paper2)", color: "var(--soft)", lineHeight: 2, fontSize: "1rem" }}>
              {bank.bankName}
              <br />
              帳號 {bank.account}
              <br />
              戶名 {bank.holder}
              <br />
              <span style={{ color: "var(--mute)", fontSize: ".92rem" }}>
                匯款後請保留末五碼，MAPOROO 會與你核對。
              </span>
            </div>
          ) : (
            <p style={{ marginTop: 14, color: "var(--mute)", fontSize: ".95rem", lineHeight: 1.9 }}>
              匯款帳戶尚未設定，MAPOROO 會直接以 Email 提供付款資訊。
            </p>
          ))}
      </section>

      <section style={{ marginTop: 44 }}>
        <p className="eyebrow" style={{ marginBottom: 16 }}>收件資訊</p>
        <p style={{ color: "var(--soft)", fontSize: "1rem", lineHeight: 2 }}>
          {order.recipient}　{order.phone}
          <br />
          {order.zipcode} {order.city} {order.address}
          {order.note && (
            <>
              <br />
              備註：{order.note}
            </>
          )}
        </p>
      </section>

      <p style={{ marginTop: 46, display: "flex", gap: 26, flexWrap: "wrap" }}>
        <Link href="/products" className="lnk-dark">繼續選購</Link>
        {order.member_id && <Link href="/account" className="lnk-dark">到會員中心查看訂單</Link>}
      </p>
    </div>
  );
}
