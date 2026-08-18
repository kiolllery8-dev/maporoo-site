import Link from "next/link";
import { all, get } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import {
  AdminLink,
  AdminNotice,
  Empty,
  FilterTabs,
  PageHeader,
  Pagination,
  Pill,
  SearchBox,
  Table,
  Td,
  Tr,
} from "../../ui";
import { METHOD, ORDER_STATUS, PAYMENT_STATUS } from "./labels";

// 版面照 auslife-www 的訂單列表：手機一列一張卡，桌機資料表。

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

/** 付款狀態的顏色：已付款綠、未付款黃、退款或失敗紅。 */
function payTone(s: string): "on" | "warn" | "off" {
  if (s === "paid") return "on";
  if (s === "refunded" || s === "failed") return "off";
  return "warn";
}

/** 訂單狀態的顏色：完成綠、取消紅、其餘中性偏黃。 */
function orderTone(s: string): "on" | "warn" | "off" {
  if (s === "done" || s === "shipped") return "on";
  if (s === "cancelled") return "off";
  return "warn";
}

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string; ok?: string }>;
}) {
  await requireAdmin("orders.view");
  const sp = await searchParams;
  const status = sp.status && ORDER_STATUS[sp.status] ? sp.status : "";
  const q = (sp.q ?? "").trim();

  const where: string[] = [];
  const params: (string | number)[] = [];
  if (status) {
    where.push(`order_status = ?`);
    params.push(status);
  }
  if (q) {
    where.push(`(order_no LIKE ? OR recipient LIKE ? OR email LIKE ? OR phone LIKE ?)`);
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const total = get<{ c: number }>(`SELECT COUNT(*) AS c FROM orders ${whereSql}`, ...params)?.c ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(sp.page) || 1), pages);

  const rows = all<Row>(
    `SELECT id, order_no, recipient, email, total_twd, payment_method,
            payment_status, order_status, created_at
       FROM orders ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
    ...params,
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE
  );

  // 頁籤上的數字看全部，不跟著搜尋條件跑。
  const n = (sql: string, ...p: (string | number)[]) => get<{ c: number }>(sql, ...p)?.c ?? 0;
  const allCount = n(`SELECT COUNT(*) AS c FROM orders`);
  const unpaid = n(`SELECT COUNT(*) AS c FROM orders WHERE payment_status = 'pending'`);
  const statusCount: Record<string, number> = {};
  for (const key of Object.keys(ORDER_STATUS)) {
    statusCount[key] = n(`SELECT COUNT(*) AS c FROM orders WHERE order_status = ?`, key);
  }

  const qs = (extra: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    for (const [k, v] of Object.entries(extra)) {
      if (v === undefined || v === "") p.delete(k);
      else p.set(k, String(v));
    }
    const s = p.toString();
    return s ? `/admin/orders?${s}` : "/admin/orders";
  };

  return (
    <>
      <PageHeader
        eyebrow="ORDERS"
        title="訂單管理"
        crumbs={[{ label: "後台", href: "/admin" }, { label: "訂單" }]}
        stats={
          allCount === 0
            ? "還沒有任何訂單"
            : `共 ${allCount} 筆${unpaid ? `・待付款 ${unpaid}` : ""}`
        }
      />

      <AdminNotice ok={sp.ok === "updated" ? "訂單已更新。" : undefined} />

      {allCount === 0 ? (
        <Empty>還沒有任何訂單。前台結帳成功之後，訂單會出現在這裡。</Empty>
      ) : (
        <>
          <SearchBox
            defaultValue={q}
            placeholder="搜尋訂單編號、收件人、Email、電話⋯"
            hidden={status ? { status } : undefined}
            clearHref="/admin/orders"
          />

          <FilterTabs
            current={status}
            tabs={[
              { key: "", label: "全部", count: allCount, href: qs({ status: undefined, page: undefined }) },
              ...Object.entries(ORDER_STATUS).map(([key, label]) => ({
                key,
                label,
                count: statusCount[key],
                tone: orderTone(key) === "off" ? ("off" as const) : undefined,
                href: qs({ status: key, page: undefined }),
              })),
            ]}
          />

          <p className="text-xs text-ink/50 mb-3">
            {q ? `搜尋「${q}」— ` : ""}
            顯示 {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + rows.length} / 共 {total} 筆
          </p>

          {rows.length === 0 ? (
            <Empty>{q ? `找不到符合「${q}」的訂單。` : "這個狀態目前沒有訂單。"}</Empty>
          ) : (
            <>
              {/* 手機：一列一張卡 */}
              <div className="md:hidden flex flex-col gap-3">
                {rows.map((o) => (
                  <Link
                    key={o.id}
                    href={`/admin/orders/${o.order_no}`}
                    className="block bg-white border border-brand-200 p-4 hover:border-ink transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-ink">{o.order_no}</div>
                        <div className="text-xs text-ink/50 mt-0.5">{o.created_at.slice(0, 16)}</div>
                      </div>
                      <div className="serif text-lg shrink-0">NT$ {o.total_twd.toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-ink/70 mt-2 truncate">
                      {o.recipient || "—"}
                      <span className="text-ink/40"> · {o.email}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-brand-100">
                      <Pill tone={orderTone(o.order_status)}>
                        {ORDER_STATUS[o.order_status] ?? o.order_status}
                      </Pill>
                      <Pill tone={payTone(o.payment_status)}>
                        {PAYMENT_STATUS[o.payment_status] ?? o.payment_status}
                      </Pill>
                      <span className="text-[11px] text-ink/50">
                        {METHOD[o.payment_method] ?? o.payment_method}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 桌機：資料表 */}
              <div className="hidden md:block">
                <Table head={["訂單編號", "收件人", "金額", "付款方式", "付款", "訂單狀態", "成立時間"]}>
                  {rows.map((o) => (
                    <Tr key={o.id}>
                      <Td nowrap>
                        <AdminLink href={`/admin/orders/${o.order_no}`}>{o.order_no}</AdminLink>
                      </Td>
                      <Td>
                        <div className="text-ink">{o.recipient || "—"}</div>
                        <div className="text-xs text-ink/50">{o.email}</div>
                      </Td>
                      <Td nowrap align="right">
                        <span className="font-medium text-ink">NT$ {o.total_twd.toLocaleString()}</span>
                      </Td>
                      <Td nowrap dim>{METHOD[o.payment_method] ?? o.payment_method}</Td>
                      <Td nowrap>
                        <Pill tone={payTone(o.payment_status)}>
                          {PAYMENT_STATUS[o.payment_status] ?? o.payment_status}
                        </Pill>
                      </Td>
                      <Td nowrap>
                        <Pill tone={orderTone(o.order_status)}>
                          {ORDER_STATUS[o.order_status] ?? o.order_status}
                        </Pill>
                      </Td>
                      <Td nowrap dim>{o.created_at.slice(0, 16)}</Td>
                    </Tr>
                  ))}
                </Table>
              </div>
            </>
          )}

          <Pagination page={page} pages={pages} href={(num) => qs({ page: num })} />
        </>
      )}
    </>
  );
}
