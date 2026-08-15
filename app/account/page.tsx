import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { all } from "../lib/db";
import { currentMember } from "../lib/auth";
import { logoutAction, updateProfileAction } from "./actions";
import AccountNav from "./AccountNav";
import { Field, Notice, Row, Shell, Submit, TextLink } from "./ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "會員中心｜MAPOROO",
  robots: { index: false, follow: false },
};

type OrderRow = {
  order_no: string;
  total_twd: number;
  order_status: string;
  payment_status: string;
  created_at: string;
};

const ORDER_STATUS: Record<string, string> = {
  new: "已成立",
  processing: "處理中",
  shipped: "已出貨",
  done: "已完成",
  cancelled: "已取消",
};

const PAYMENT_STATUS: Record<string, string> = {
  pending: "待付款",
  paid: "已付款",
  refunded: "已退款",
  failed: "付款失敗",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string; saved?: string; password?: string }>;
}) {
  const member = await currentMember();
  if (!member) redirect("/account/login?next=/account");

  const sp = await searchParams;
  const ok = sp.welcome
    ? "帳號建立完成，歡迎加入 MAPOROO。"
    : sp.saved
      ? "資料已更新。"
      : sp.password
        ? "密碼已更新，其他裝置上的登入都已登出。"
        : undefined;

  const orders = all<OrderRow>(
    `SELECT order_no, total_twd, order_status, payment_status, created_at
       FROM orders WHERE member_id = ? ORDER BY created_at DESC LIMIT 20`,
    member.id
  );

  return (
    <Shell eyebrow="會員中心" title={member.name ? `${member.name}，你好` : "會員中心"} narrow={false}>
      <AccountNav current="/account" />
      <Notice ok={ok} />

      <div style={{ marginBottom: 54 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>帳號</p>
        <Row label="EMAIL" value={member.email} />
        <Row label="姓名" value={member.name || "尚未填寫"} />
        <Row label="手機" value={member.phone || "尚未填寫"} />
        <Row label="回購點數" value={`${member.points} 點`} />
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, display: "flex", gap: 24, flexWrap: "wrap" }}>
          <TextLink href="/account/password">修改密碼</TextLink>
          <form action={logoutAction}>
            <Submit>登出</Submit>
          </form>
        </div>
      </div>

      <div style={{ marginBottom: 54 }}>
        <p className="eyebrow" style={{ marginBottom: 20 }}>訂單紀錄</p>
        {orders.length === 0 ? (
          <p style={{ color: "var(--soft)", lineHeight: 1.55 }}>
            目前沒有訂單。
            <br />
            <TextLink href="/products">看看全部商品</TextLink>
          </p>
        ) : (
          orders.map((o) => (
            <p
              key={o.order_no}
              style={{ padding: "15px 0", borderTop: "1px solid var(--line)", display: "flex", gap: 20, flexWrap: "wrap", alignItems: "baseline", fontSize: "1rem", color: "var(--soft)", fontWeight: 500 }}
            >
              <span className="en" style={{ width: 140, flexShrink: 0, color: "var(--ink)" }}>{o.order_no}</span>
              <span style={{ width: 110 }}>{o.created_at.slice(0, 10)}</span>
              <span style={{ width: 100, color: "var(--ink)" }}>NT$ {o.total_twd.toLocaleString()}</span>
              <span style={{ width: 90 }}>{ORDER_STATUS[o.order_status] ?? o.order_status}</span>
              <span>{PAYMENT_STATUS[o.payment_status] ?? o.payment_status}</span>
            </p>
          ))
        )}
      </div>

      <div>
        <p className="eyebrow" style={{ marginBottom: 20 }}>修改基本資料</p>
        <form action={updateProfileAction}>
          <Field label="姓名" name="name" defaultValue={member.name} autoComplete="name" />
          <Field label="手機" name="phone" type="tel" defaultValue={member.phone} autoComplete="tel" />
          <Submit>儲存</Submit>
        </form>
      </div>
    </Shell>
  );
}
