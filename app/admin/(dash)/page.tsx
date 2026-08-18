import { all } from "../../lib/db";
import { dashboardStats, requireAdmin } from "../../lib/admin";
import { AdminLink, AdminNotice, Empty, PageHeader, Pill, StatCard, Table, Td, Tr } from "../ui";
import { METHOD, ORDER_STATUS, PAYMENT_STATUS } from "./orders/labels";

export const dynamic = "force-dynamic";

type RecentOrder = {
  order_no: string;
  recipient: string;
  total_twd: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
};

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  await requireAdmin("reports.view");
  const sp = await searchParams;
  const s = dashboardStats();

  const recent = all<RecentOrder>(
    `SELECT order_no, recipient, total_twd, order_status, payment_status, payment_method, created_at
       FROM orders ORDER BY created_at DESC LIMIT 8`
  );

  return (
    <>
      <PageHeader
        eyebrow="DASHBOARD"
        title="儀表板"
        stats="今天的營運狀況"
      />

      <AdminNotice ok={sp.password ? "密碼已更新。" : undefined} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="待處理訂單"
          value={s.ordersNew}
          hint={`累計 ${s.orders} 筆`}
          tone={s.ordersNew > 0 ? "warn" : "neutral"}
          href="/admin/orders?status=new"
        />
        <StatCard
          label="待付款"
          value={s.unpaid}
          hint="需要對帳"
          tone={s.unpaid > 0 ? "bad" : "neutral"}
          href="/admin/orders"
        />
        <StatCard
          label="已付款營收"
          value={`NT$ ${s.revenue.toLocaleString()}`}
          hint="累計"
          tone="accent"
        />
        <StatCard
          label="會員"
          value={s.members}
          hint={`近 7 天新增 ${s.membersThisWeek}`}
          href="/admin/members"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <StatCard label="商品" value={s.products} hint={`未上架 ${s.productsDraft}`} href="/admin/products" />
        <StatCard label="文章" value={s.articles} hint={`已發布 ${s.articlesPublished}`} href="/admin/articles" />
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="serif text-lg">最近的訂單</h3>
        <AdminLink href="/admin/orders">全部訂單</AdminLink>
      </div>

      {recent.length === 0 ? (
        <Empty>
          還沒有任何訂單。
          <br />
          客人在前台結帳之後，訂單會出現在這裡。
        </Empty>
      ) : (
        <Table head={["訂單編號", "收件人", "金額", "付款方式", "付款", "訂單狀態", "成立時間"]}>
          {recent.map((o) => (
            <Tr key={o.order_no} muted={o.order_status === "cancelled"}>
              <Td nowrap>
                <AdminLink href={`/admin/orders/${o.order_no}`}>{o.order_no}</AdminLink>
              </Td>
              <Td>{o.recipient || "—"}</Td>
              <Td nowrap align="right">NT$ {o.total_twd.toLocaleString()}</Td>
              <Td nowrap dim>{METHOD[o.payment_method] ?? o.payment_method}</Td>
              <Td nowrap>
                <Pill tone={o.payment_status === "paid" ? "on" : o.payment_status === "pending" ? "warn" : "off"}>
                  {PAYMENT_STATUS[o.payment_status] ?? o.payment_status}
                </Pill>
              </Td>
              <Td nowrap>{ORDER_STATUS[o.order_status] ?? o.order_status}</Td>
              <Td nowrap dim>{o.created_at.slice(0, 16)}</Td>
            </Tr>
          ))}
        </Table>
      )}
    </>
  );
}
