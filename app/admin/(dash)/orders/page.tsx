import { all, get } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { AdminLink, AdminNotice, Empty, Panel, Table, Td } from "../../ui";
import { METHOD, ORDER_STATUS, PAYMENT_STATUS } from "./labels";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  order_no: string;
  recipient: string;
  email: string;
  total_twd: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
};

const PAGE_SIZE = 50;

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; ok?: string }>;
}) {
  await requireAdmin("orders.view");
  const sp = await searchParams;
  const status = sp.status ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  const where = status && ORDER_STATUS[status] ? `WHERE order_status = ?` : "";
  const params = where ? [status] : [];

  const total = get<{ c: number }>(`SELECT COUNT(*) AS c FROM orders ${where}`, ...params)?.c ?? 0;

  const rows = all<Row>(
    `SELECT id, order_no, recipient, email, total_twd, payment_method,
            payment_status, order_status, created_at
       FROM orders ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
    ...params,
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE
  );

  const tabs = [{ key: "", label: "全部" }, ...Object.entries(ORDER_STATUS).map(([k, v]) => ({ key: k, label: v }))];

  return (
    <>
      <AdminNotice ok={sp.ok === "updated" ? "訂單已更新。" : undefined} />

      <Panel
        title={`訂單（${total}）`}
        action={
          <span style={{ display: "flex", gap: 16, fontSize: ".92rem", fontWeight: 700 }}>
            {tabs.map((t) => (
              <a
                key={t.key || "all"}
                href={t.key ? `/admin/orders?status=${t.key}` : "/admin/orders"}
                style={{ color: status === t.key ? "var(--ink)" : "var(--mute)" }}
              >
                {t.label}
              </a>
            ))}
          </span>
        }
      >
        {rows.length === 0 ? (
          <Empty>
            {status
              ? "這個狀態目前沒有訂單。"
              : "還沒有任何訂單。前台的結帳流程還沒接上——購物袋目前只存在瀏覽器的 localStorage 裡，按下結帳不會產生訂單。"}
          </Empty>
        ) : (
          <Table head={["訂單編號", "收件人", "金額", "付款方式", "付款", "訂單狀態", "成立時間"]}>
            {rows.map((o) => (
              <tr key={o.id}>
                <Td nowrap>
                  <AdminLink href={`/admin/orders/${o.order_no}`}>{o.order_no}</AdminLink>
                </Td>
                <Td>
                  {o.recipient || "—"}
                  <br />
                  <span style={{ fontSize: ".82rem", color: "var(--mute)" }}>{o.email}</span>
                </Td>
                <Td nowrap>NT$ {o.total_twd.toLocaleString()}</Td>
                <Td nowrap dim>{METHOD[o.payment_method] ?? o.payment_method}</Td>
                <Td nowrap>{PAYMENT_STATUS[o.payment_status] ?? o.payment_status}</Td>
                <Td nowrap>{ORDER_STATUS[o.order_status] ?? o.order_status}</Td>
                <Td nowrap dim>{o.created_at.slice(0, 16)}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </>
  );
}
