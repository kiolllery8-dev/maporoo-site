import { notFound } from "next/navigation";
import { all, get } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";
import { can } from "../../../../lib/permissions";
import {
  AdminField,
  AdminNotice,
  AdminSelect,
  AdminSubmit,
  BackLink,
  PageHeader,
  Panel,
  Pill,
  Table,
  Td,
  Tr,
} from "../../../ui";
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

function payTone(s: string): "on" | "warn" | "off" {
  if (s === "paid") return "on";
  if (s === "refunded" || s === "failed") return "off";
  return "warn";
}

function orderTone(s: string): "on" | "warn" | "off" {
  if (s === "done" || s === "shipped") return "on";
  if (s === "cancelled") return "off";
  return "warn";
}

/** 一行「標籤 ＋ 值」，收件與金額兩塊共用。 */
function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-1.5 border-b border-brand-100 last:border-0">
      <span className="w-20 shrink-0 text-xs text-ink/50 pt-0.5">{label}</span>
      <span className="text-sm text-ink/80 leading-relaxed min-w-0 break-words">{children}</span>
    </div>
  );
}

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
      <BackLink href="/admin/orders">← 回訂單列表</BackLink>

      <PageHeader
        eyebrow="ORDER"
        title={o.order_no}
        crumbs={[
          { label: "後台", href: "/admin" },
          { label: "訂單", href: "/admin/orders" },
          { label: o.order_no },
        ]}
        stats={`成立於 ${o.created_at.slice(0, 16)}・${items.length} 項商品・NT$ ${o.total_twd.toLocaleString()}`}
        actions={
          <>
            <Pill tone={orderTone(o.order_status)}>
              {ORDER_STATUS[o.order_status] ?? o.order_status}
            </Pill>
            <Pill tone={payTone(o.payment_status)}>
              {PAYMENT_STATUS[o.payment_status] ?? o.payment_status}
            </Pill>
          </>
        }
      />

      <AdminNotice ok={sp.ok === "saved" ? "訂單已更新。" : undefined} />

      <div className="grid lg:grid-cols-2 gap-5">
        <Panel title="收件資訊">
          <Line label="收件人">{o.recipient || "—"}</Line>
          <Line label="電話">{o.phone || "—"}</Line>
          <Line label="地址">
            {o.zipcode} {o.city} {o.address || "—"}
          </Line>
          <Line label="EMAIL">{o.email}</Line>
          <Line label="身分">{o.member_id ? `會員 #${o.member_id}` : "訪客下單"}</Line>
          {o.note && (
            <p className="mt-4 px-4 py-3 bg-brand-50 text-sm text-ink/70 leading-relaxed border-l-[3px] border-brand-300">
              客人備註：{o.note}
            </p>
          )}
        </Panel>

        <Panel title="金額">
          <Line label="小計">NT$ {o.subtotal_twd.toLocaleString()}</Line>
          <Line label="運費">NT$ {o.shipping_twd.toLocaleString()}</Line>
          <Line label="折扣">－NT$ {o.discount_twd.toLocaleString()}</Line>
          <Line label="合計">
            <strong className="serif text-xl text-ink">NT$ {o.total_twd.toLocaleString()}</strong>
          </Line>
          <Line label="付款方式">{METHOD[o.payment_method] ?? o.payment_method}</Line>
          <Line label="付款備查">{o.payment_ref || "—"}</Line>
          <Line label="物流單號">{o.shipping_no || "—"}</Line>
        </Panel>
      </div>

      <Panel title={`商品明細（${items.length}）`}>
        {items.length === 0 ? (
          <p className="text-sm text-ink/50">沒有明細。</p>
        ) : (
          <Table head={["商品", "容量", "單價", "數量", "小計"]}>
            {items.map((i, n) => (
              <Tr key={n}>
                <Td>
                  <div className="text-ink">{i.name}</div>
                  <div className="text-xs text-ink/50">{i.product_slug}</div>
                </Td>
                <Td nowrap dim>{i.size || "—"}</Td>
                <Td nowrap align="right">NT$ {i.unit_price_twd.toLocaleString()}</Td>
                <Td nowrap align="right">{i.qty}</Td>
                <Td nowrap align="right">
                  <span className="font-medium text-ink">NT$ {i.total_twd.toLocaleString()}</span>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Panel>

      <Panel title="更新訂單">
        <form action={updateOrderAction} className="max-w-[560px]">
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
            <p className="mb-5 px-4 py-3 bg-brand-50 text-sm text-ink/60 leading-relaxed border-l-[3px] border-brand-300">
              付款狀態目前是「{PAYMENT_STATUS[o.payment_status] ?? o.payment_status}」。
              你的角色改不了付款相關欄位，需要調整請找負責人或營運人員。
            </p>
          )}
          <AdminField label="物流單號" name="shipping_no" defaultValue={o.shipping_no} />
          <AdminField label="內部備註" name="admin_note" textarea rows={3} defaultValue={o.admin_note} />

          <AdminSubmit>更新</AdminSubmit>
        </form>
      </Panel>

      <Panel title={`異動紀錄（${events.length}）`}>
        {events.length === 0 ? (
          <p className="text-sm text-ink/50">還沒有異動。</p>
        ) : (
          <Table head={["時間", "操作者", "欄位", "從", "改成"]}>
            {events.map((e, n) => (
              <Tr key={n}>
                <Td nowrap dim>{e.created_at.slice(0, 16)}</Td>
                <Td nowrap dim>{e.actor}</Td>
                <Td nowrap>{e.field}</Td>
                <Td nowrap dim>{e.from_value || "—"}</Td>
                <Td nowrap>{e.to_value || "—"}</Td>
              </Tr>
            ))}
          </Table>
        )}
      </Panel>
    </>
  );
}
