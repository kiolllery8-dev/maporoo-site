import { notFound } from "next/navigation";
import { all, get } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";
import { can } from "../../../../lib/permissions";
import { AdminField, AdminLink, AdminNotice, AdminSelect, AdminSubmit, Panel, Table, Td } from "../../../ui";
import { updateOrderAction } from "./actions";
import { METHOD, ORDER_STATUS, PAYMENT_STATUS } from "../labels";

export const dynamic = "force-dynamic";

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
  payment_ref: string;
  order_status: string;
  shipping_no: string;
  note: string;
  admin_note: string;
  created_at: string;
};

type Item = {
  product_slug: string;
  name: string;
  size: string;
  unit_price_twd: number;
  qty: number;
  total_twd: number;
};

type Event = {
  actor: string;
  field: string;
  from_value: string;
  to_value: string;
  created_at: string;
};

export default async function OrderDetail({
  params,
  searchParams,
}: {
  params: Promise<{ orderNo: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const admin = await requireAdmin("orders.view");
  // 出貨人員看得到訂單、能出貨，但付款欄位不該出現在他的畫面上。
  // （伺服器端另有把關，見 actions.ts——畫面隱藏只是體貼，不是防線。）
  const mayTouchPayment = can(admin.role, "orders.payment");

  const { orderNo } = await params;
  const sp = await searchParams;

  const o = get<Order>(`SELECT * FROM orders WHERE order_no = ?`, orderNo);
  if (!o) notFound();

  const items = all<Item>(`SELECT * FROM order_items WHERE order_id = ?`, o.id);
  const events = all<Event>(
    `SELECT actor, field, from_value, to_value, created_at
       FROM order_events WHERE order_id = ? ORDER BY created_at DESC`,
    o.id
  );

  return (
    <>
      <p style={{ marginBottom: 20, fontSize: ".9rem" }}>
        <AdminLink href="/admin/orders">← 回訂單列表</AdminLink>
      </p>

      <AdminNotice ok={sp.ok === "saved" ? "訂單已更新。" : undefined} />

      <Panel title={`訂單 ${o.order_no}`}>
        <div className="grid g2" style={{ gap: 40, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: ".78rem", letterSpacing: ".16em", color: "var(--accent)", fontWeight: 700, marginBottom: 12 }}>
              收件資訊
            </p>
            <p style={{ color: "var(--soft)", lineHeight: 1.6, fontSize: ".97rem", fontWeight: 500 }}>
              {o.recipient || "—"}　{o.phone}
              <br />
              {o.zipcode} {o.city} {o.address || "—"}
              <br />
              {o.email}
              <br />
              {o.member_id ? `會員 #${o.member_id}` : "訪客下單"}
              <br />
              成立時間 {o.created_at}
            </p>
            {o.note && (
              <p style={{ marginTop: 16, padding: "11px 14px", background: "var(--paper2)", fontSize: ".93rem", color: "var(--soft)", lineHeight: 1.5 }}>
                客人備註：{o.note}
              </p>
            )}
          </div>

          <div>
            <p style={{ fontSize: ".78rem", letterSpacing: ".16em", color: "var(--accent)", fontWeight: 700, marginBottom: 12 }}>
              金額
            </p>
            <p style={{ color: "var(--soft)", lineHeight: 1.6, fontSize: ".97rem", fontWeight: 500 }}>
              小計　NT$ {o.subtotal_twd.toLocaleString()}
              <br />
              運費　NT$ {o.shipping_twd.toLocaleString()}
              <br />
              折扣　－NT$ {o.discount_twd.toLocaleString()}
              <br />
              <strong style={{ color: "var(--ink)" }}>合計　NT$ {o.total_twd.toLocaleString()}</strong>
              <br />
              付款方式　{METHOD[o.payment_method] ?? o.payment_method}
              <br />
              目前狀態　{ORDER_STATUS[o.order_status] ?? o.order_status}・{PAYMENT_STATUS[o.payment_status] ?? o.payment_status}
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="商品明細">
        {items.length === 0 ? (
          <p style={{ color: "var(--mute)" }}>沒有明細。</p>
        ) : (
          <Table head={["商品", "容量", "單價", "數量", "小計"]}>
            {items.map((i, n) => (
              <tr key={n}>
                <Td>
                  {i.name}
                  <br />
                  <span style={{ fontSize: ".82rem", color: "var(--mute)" }}>{i.product_slug}</span>
                </Td>
                <Td nowrap>{i.size || "—"}</Td>
                <Td nowrap>NT$ {i.unit_price_twd.toLocaleString()}</Td>
                <Td nowrap>{i.qty}</Td>
                <Td nowrap>NT$ {i.total_twd.toLocaleString()}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>

      <Panel title="更新訂單">
        <form action={updateOrderAction} style={{ maxWidth: 560 }}>
          <input type="hidden" name="order_no" value={o.order_no} />

          <AdminSelect
            label="訂單狀態"
            name="order_status"
            defaultValue={o.order_status}
            options={Object.entries(ORDER_STATUS).map(([value, label]) => ({ value, label }))}
          />
          {mayTouchPayment ? (
            <>
              <AdminSelect
                label="付款狀態"
                name="payment_status"
                defaultValue={o.payment_status}
                options={Object.entries(PAYMENT_STATUS).map(([value, label]) => ({ value, label }))}
              />
              <AdminField
                label="付款備查"
                name="payment_ref"
                defaultValue={o.payment_ref}
                hint="匯款末五碼，或日後金流商回傳的交易序號。"
              />
            </>
          ) : (
            <p style={{ marginBottom: 20, padding: "11px 14px", background: "var(--paper2)", color: "var(--mute)", fontSize: ".92rem", lineHeight: 1.5 }}>
              付款狀態目前是「{PAYMENT_STATUS[o.payment_status] ?? o.payment_status}」。
              你的角色改不了付款相關欄位，需要調整請找負責人或營運人員。
            </p>
          )}
          <AdminField label="物流單號" name="shipping_no" defaultValue={o.shipping_no} />
          <AdminField label="內部備註" name="admin_note" textarea rows={3} defaultValue={o.admin_note} />

          <AdminSubmit>更新</AdminSubmit>
        </form>
      </Panel>

      <Panel title="異動紀錄">
        {events.length === 0 ? (
          <p style={{ color: "var(--mute)" }}>還沒有異動。</p>
        ) : (
          <Table head={["時間", "操作者", "欄位", "從", "改成"]}>
            {events.map((e, n) => (
              <tr key={n}>
                <Td nowrap dim>{e.created_at}</Td>
                <Td nowrap dim>{e.actor}</Td>
                <Td nowrap>{e.field}</Td>
                <Td nowrap dim>{e.from_value || "—"}</Td>
                <Td nowrap>{e.to_value || "—"}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </>
  );
}
