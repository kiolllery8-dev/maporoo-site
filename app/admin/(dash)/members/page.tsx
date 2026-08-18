import { all, get } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { can } from "../../../lib/permissions";
import {
  AdminNotice,
  DangerButton,
  Empty,
  InlineSubmit,
  PageHeader,
  Pagination,
  Pill,
  SearchBox,
  StatCard,
  Table,
  Td,
  Tr,
} from "../../ui";
import { toggleMemberAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  email: string;
  name: string;
  phone: string;
  points: number;
  disabled: number;
  last_login_at: string | null;
  created_at: string;
  orders: number;
  spent: number;
};

const PAGE_SIZE = 50;

export default async function AdminMembers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; ok?: string }>;
}) {
  const admin = await requireAdmin("members.view");
  const mayManage = can(admin.role, "members.manage");
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  // LIKE 的萬用字元要跟著參數走，不要拼進 SQL 字串。
  const like = `%${q}%`;
  const where = q ? `WHERE m.email LIKE ? OR m.name LIKE ? OR m.phone LIKE ?` : "";
  const params = q ? [like, like, like] : [];

  const total = get<{ c: number }>(`SELECT COUNT(*) AS c FROM members m ${where}`, ...params)?.c ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(sp.page) || 1), pages);

  const rows = all<Row>(
    `SELECT m.id, m.email, m.name, m.phone, m.points, m.disabled,
            m.last_login_at, m.created_at,
            COUNT(o.id) AS orders,
            COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total_twd ELSE 0 END), 0) AS spent
       FROM members m
       LEFT JOIN orders o ON o.member_id = m.id
       ${where}
       GROUP BY m.id
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
    ...params,
    PAGE_SIZE,
    offsetOf(page)
  );

  // 概況數字看全部會員，不受搜尋影響。
  const n = (sql: string) => get<{ c: number }>(sql)?.c ?? 0;
  const allCount = n(`SELECT COUNT(*) AS c FROM members`);
  const active = n(`SELECT COUNT(*) AS c FROM members WHERE disabled = 0`);
  const buyers = n(
    `SELECT COUNT(DISTINCT member_id) AS c FROM orders WHERE member_id IS NOT NULL AND payment_status = 'paid'`
  );
  const revenue =
    get<{ c: number }>(
      `SELECT COALESCE(SUM(total_twd), 0) AS c FROM orders WHERE member_id IS NOT NULL AND payment_status = 'paid'`
    )?.c ?? 0;

  const href = (num: number) =>
    `/admin/members?page=${num}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <>
      <PageHeader
        eyebrow="MEMBERS"
        title="會員管理"
        crumbs={[{ label: "後台", href: "/admin" }, { label: "會員" }]}
        stats={allCount === 0 ? "還沒有任何會員" : `共 ${allCount} 位・啟用 ${active}`}
      />

      <AdminNotice ok={sp.ok === "toggled" ? "會員狀態已更新。" : undefined} />

      {allCount === 0 ? (
        <Empty>
          還沒有任何會員。前台的<strong className="text-ink">註冊</strong>頁開通後，
          註冊的人會出現在這裡。
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard label="會員總數" value={allCount} />
            <StatCard label="啟用中" value={active} tone="good" />
            <StatCard label="有付款訂單" value={buyers} tone="accent" hint="至少完成一次付款" />
            <StatCard label="會員貢獻營收" value={`NT$ ${revenue.toLocaleString()}`} />
          </div>

          <SearchBox
            defaultValue={q}
            placeholder="搜尋 Email、姓名、電話⋯"
            clearHref="/admin/members"
          />

          <p className="text-xs text-ink/50 mb-3">
            {q ? `搜尋「${q}」— ` : ""}
            顯示 {total === 0 ? 0 : offsetOf(page) + 1}–{offsetOf(page) + rows.length} / 共 {total} 位
          </p>

          {rows.length === 0 ? (
            <Empty>找不到符合「{q}」的會員。</Empty>
          ) : (
            <>
              {/* 手機：一列一張卡 */}
              <div className="md:hidden flex flex-col gap-3">
                {rows.map((m) => (
                  <div
                    key={m.id}
                    className={`bg-white border p-4 ${m.disabled ? "border-red-200 bg-red-50/30" : "border-brand-200"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-ink truncate">{m.name || "未填姓名"}</div>
                        <div className="text-xs text-ink/50 truncate">{m.email}</div>
                      </div>
                      <Pill tone={m.disabled ? "off" : "on"}>{m.disabled ? "已停用" : "正常"}</Pill>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-brand-100 text-center">
                      <div>
                        <div className="serif text-lg">{m.orders}</div>
                        <div className="text-[10px] text-ink/50">訂單</div>
                      </div>
                      <div>
                        <div className="serif text-lg">{m.spent.toLocaleString()}</div>
                        <div className="text-[10px] text-ink/50">累計消費</div>
                      </div>
                      <div>
                        <div className="serif text-lg">{m.points}</div>
                        <div className="text-[10px] text-ink/50">點數</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-100 text-[11px] text-ink/50">
                      <span>註冊 {m.created_at.slice(0, 10)}</span>
                      {mayManage && (
                        <form action={toggleMemberAction}>
                          <input type="hidden" name="id" value={m.id} />
                          {m.disabled ? <InlineSubmit>恢復</InlineSubmit> : <DangerButton>停用</DangerButton>}
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 桌機：資料表 */}
              <div className="hidden md:block">
                <Table
                  head={["EMAIL", "姓名", "電話", "訂單", "累計消費", "點數", "最後登入", "註冊", "狀態"]}
                >
                  {rows.map((m) => (
                    <Tr key={m.id} muted={m.disabled === 1}>
                      <Td nowrap>
                        <span className="text-ink">{m.email}</span>
                      </Td>
                      <Td>{m.name || "—"}</Td>
                      <Td nowrap dim>{m.phone || "—"}</Td>
                      <Td nowrap align="right">{m.orders}</Td>
                      <Td nowrap align="right">
                        <span className="font-medium text-ink">NT$ {m.spent.toLocaleString()}</span>
                      </Td>
                      <Td nowrap align="right">{m.points}</Td>
                      <Td nowrap dim>{m.last_login_at ? m.last_login_at.slice(0, 10) : "未登入過"}</Td>
                      <Td nowrap dim>{m.created_at.slice(0, 10)}</Td>
                      <Td nowrap>
                        {mayManage ? (
                          <form action={toggleMemberAction} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={m.id} />
                            <Pill tone={m.disabled ? "off" : "on"}>{m.disabled ? "已停用" : "正常"}</Pill>
                            {m.disabled ? <InlineSubmit>恢復</InlineSubmit> : <DangerButton>停用</DangerButton>}
                          </form>
                        ) : (
                          <Pill tone={m.disabled ? "off" : "on"}>{m.disabled ? "已停用" : "正常"}</Pill>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Table>
              </div>
            </>
          )}

          <Pagination page={page} pages={pages} href={href} />
        </>
      )}
    </>
  );
}

function offsetOf(page: number) {
  return (page - 1) * PAGE_SIZE;
}
