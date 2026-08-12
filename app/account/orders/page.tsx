import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { all } from "../../lib/db";
import { currentMember } from "../../lib/auth";
import AccountNav from "../AccountNav";
import { Shell, TextLink } from "../ui";
import { ORDER_STATUS, PAYMENT_STATUS } from "../labels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "我的訂單｜MAPOROO",
  robots: { index: false, follow: false },
};

type Row = {
  order_no: string;
  total_twd: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  items: number;
};

export default async function OrdersPage() {
  const member = await currentMember();
  if (!member) redirect("/account/login?next=/account/orders");

  const orders = all<Row>(
    `SELECT o.order_no, o.total_twd, o.order_status, o.payment_status, o.created_at,
            COUNT(i.id) AS items
       FROM orders o
       LEFT JOIN order_items i ON i.order_id = o.id
      WHERE o.member_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
    member.id
  );

  return (
    <Shell eyebrow="會員中心" title="我的訂單" narrow={false}>
      <AccountNav current="/account/orders" />

      {orders.length === 0 ? (
        <p style={{ color: "var(--soft)", lineHeight: 1.95 }}>
          還沒有訂單。
          <br />
          <TextLink href="/products">看看全部商品</TextLink>
        </p>
      ) : (
        <div>
          {orders.map((o) => (
            <div
              key={o.order_no}
              style={{ padding: "20px 0", borderTop: "1px solid var(--line)", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "baseline" }}
            >
              <span className="en" style={{ width: 150, color: "var(--ink)", fontWeight: 700 }}>
                <Link href={`/account/orders/${o.order_no}`}>{o.order_no}</Link>
              </span>
              <span style={{ width: 110, color: "var(--mute)", fontSize: ".92rem" }}>
                {o.created_at.slice(0, 10)}
              </span>
              <span style={{ width: 90, color: "var(--soft)", fontSize: ".95rem" }}>{o.items} 件</span>
              <span style={{ width: 110, color: "var(--ink)", fontWeight: 700 }}>
                NT$ {o.total_twd.toLocaleString()}
              </span>
              <span style={{ width: 90, color: "var(--soft)", fontSize: ".95rem" }}>
                {ORDER_STATUS[o.order_status] ?? o.order_status}
              </span>
              <span style={{ color: "var(--soft)", fontSize: ".95rem" }}>
                {PAYMENT_STATUS[o.payment_status] ?? o.payment_status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}
