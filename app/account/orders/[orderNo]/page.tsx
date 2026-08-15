import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { all, get } from "../../../lib/db";
import { currentMember } from "../../../lib/auth";
import { bankTransferInfo } from "../../../lib/payment";
import AccountNav from "../../AccountNav";
import { Shell } from "../../ui";
import { METHOD, ORDER_STATUS, PAYMENT_STATUS } from "../../labels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "訂單明細｜MAPOROO",
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
  discount_twd: number;
  total_twd: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_no: string;
  note: string;
  created_at: string;
};

type Item = { name: string; size: string; unit_price_twd: number; qty: number; total_twd: number };

export default async function MemberOrderDetail({
  params,
}: {
  params: Promise<{ orderNo: string }>;
}) {
  const { orderNo } = await params;
  const member = await currentMember();
  if (!member) redirect(`/account/login?next=/account/orders/${orderNo}`);

  const o = get<Order>(`SELECT * FROM orders WHERE order_no = ?`, orderNo);
  // 只能看自己的訂單。別人的訂單一律當作不存在，不回「你沒有權限」——
  // 那等於告訴對方這個訂單編號是真的。
  if (!o || o.member_id !== member.id) notFound();

  const items = all<Item>(`SELECT * FROM order_items WHERE order_id = ?`, o.id);
  const bank = bankTransferInfo();

  return (
    <Shell eyebrow="會員中心" title={`訂單 ${o.order_no}`} narrow={false}>
      <AccountNav current="/account/orders" />

      <div style={{ maxWidth: 720 }}>
        <p style={{ color: "var(--soft)", fontSize: "1rem", lineHeight: 1.6, marginBottom: 34 }}>
          成立時間 {o.created_at.slice(0, 16)}
          <br />
          訂單狀態 {ORDER_STATUS[o.order_status] ?? o.order_status}
          　·　付款 {PAYMENT_STATUS[o.payment_status] ?? o.payment_status}
          　·　{METHOD[o.payment_method] ?? o.payment_method}
          {o.shipping_no && (
            <>
              <br />
              物流單號 {o.shipping_no}
            </>
          )}
        </p>

        <p className="eyebrow" style={{ marginBottom: 14 }}>訂購內容</p>
        {items.map((i, n) => (
          <p
            key={n}
            style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderTop: "1px solid var(--line)", color: "var(--soft)", fontSize: "1rem" }}
          >
            <span>
              {i.name}
              {i.size && <span style={{ color: "var(--mute)" }}>・{i.size}</span>}
              <span style={{ color: "var(--mute)" }}> × {i.qty}</span>
            </span>
            <span style={{ whiteSpace: "nowrap" }}>NT$ {i.total_twd.toLocaleString()}</span>
          </p>
        ))}
        <p style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--line)", color: "var(--soft)" }}>
          <span>小計</span>
          <span>NT$ {o.subtotal_twd.toLocaleString()}</span>
        </p>
        <p style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--line)", color: "var(--soft)" }}>
          <span>運費</span>
          <span>{o.shipping_twd === 0 ? "免運" : `NT$ ${o.shipping_twd.toLocaleString()}`}</span>
        </p>
        <p
          style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", color: "var(--ink)", fontWeight: 900, fontSize: "1.15rem" }}
        >
          <span>合計</span>
          <span>NT$ {o.total_twd.toLocaleString()}</span>
        </p>

        {o.payment_method === "bank_transfer" && o.payment_status === "pending" && bank.configured && (
          <div style={{ marginTop: 30, padding: "18px 20px", background: "var(--paper2)", color: "var(--soft)", lineHeight: 1.6, fontSize: "1rem" }}>
            <strong style={{ color: "var(--ink)" }}>匯款資訊</strong>
            <br />
            {bank.bankName}　帳號 {bank.account}　戶名 {bank.holder}
            <br />
            <span style={{ color: "var(--mute)", fontSize: ".92rem" }}>
              匯款後請保留末五碼，MAPOROO 會與你核對。
            </span>
          </div>
        )}

        <p className="eyebrow" style={{ margin: "40px 0 14px" }}>收件資訊</p>
        <p style={{ color: "var(--soft)", fontSize: "1rem", lineHeight: 1.6 }}>
          {o.recipient}　{o.phone}
          <br />
          {o.zipcode} {o.city} {o.address}
          <br />
          {o.email}
          {o.note && (
            <>
              <br />
              備註：{o.note}
            </>
          )}
        </p>

        <p style={{ marginTop: 40 }}>
          <Link href="/account/orders" className="lnk-dark">回訂單列表</Link>
        </p>
      </div>
    </Shell>
  );
}
