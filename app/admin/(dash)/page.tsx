import { all } from "../../lib/db";
import { dashboardStats, requireAdmin } from "../../lib/admin";
import { AdminLink, AdminNotice, Empty, Panel, Stat, Table, Td } from "../ui";

export const dynamic = "force-dynamic";

type RecentOrder = {
  order_no: string;
  recipient: string;
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

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  await requireAdmin("reports.view");
  const sp = await searchParams;
  const s = dashboardStats();

  const recent = all<RecentOrder>(
    `SELECT order_no, recipient, total_twd, order_status, payment_status, created_at
       FROM orders ORDER BY created_at DESC LIMIT 8`
  );

  return (
    <>
      <AdminNotice ok={sp.password ? "密碼已更新。" : undefined} />

      <Panel title="總覽">
        <div className="grid g4" style={{ gap: 26 }}>
          <Stat label="訂單" value={s.orders} sub={`待處理 ${s.ordersNew}・待付款 ${s.unpaid}`} />
          <Stat label="已付款營收" value={`NT$ ${s.revenue.toLocaleString()}`} sub="累計" />
          <Stat label="會員" value={s.members} sub={`近 7 天新增 ${s.membersThisWeek}`} />
          <Stat label="商品" value={s.products} sub={`未上架 ${s.productsDraft}`} />
        </div>
      </Panel>

      <Panel title="最近的訂單" action={<AdminLink href="/admin/orders">全部訂單</AdminLink>}>
        {recent.length === 0 ? (
          <Empty>
            還沒有任何訂單。前台的結帳流程尚未接上——目前購物袋只存在瀏覽器裡，
            按下結帳不會產生訂單。這是下一個要做的部分。
          </Empty>
        ) : (
          <Table head={["訂單編號", "收件人", "金額", "訂單狀態", "付款", "成立時間"]}>
            {recent.map((o) => (
              <tr key={o.order_no}>
                <Td nowrap>
                  <AdminLink href={`/admin/orders/${o.order_no}`}>{o.order_no}</AdminLink>
                </Td>
                <Td>{o.recipient || "—"}</Td>
                <Td nowrap>NT$ {o.total_twd.toLocaleString()}</Td>
                <Td nowrap>{ORDER_STATUS[o.order_status] ?? o.order_status}</Td>
                <Td nowrap>{PAYMENT_STATUS[o.payment_status] ?? o.payment_status}</Td>
                <Td nowrap dim>{o.created_at.slice(0, 16)}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>

      <Panel title="還沒接上的部分">
        <Empty>
          資料表都建好了，這幾件事的介面還在做：前台結帳流程、文章管理（
          <code>/read</code> 路由）、文案區塊、報表。
          線上金流依老闆指示留給後續工程師，接口在
          <code style={{ margin: "0 4px" }}>app/lib/payment.ts</code>。
        </Empty>
      </Panel>
    </>
  );
}
