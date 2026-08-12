import { all, get } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { can } from "../../../lib/permissions";
import { AdminNotice, Empty, Panel, Table, Td } from "../../ui";
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
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  // LIKE 的萬用字元要跟著參數走，不要拼進 SQL 字串。
  const like = `%${q}%`;
  const where = q ? `WHERE m.email LIKE ? OR m.name LIKE ? OR m.phone LIKE ?` : "";
  const params = q ? [like, like, like] : [];

  const total =
    get<{ c: number }>(`SELECT COUNT(*) AS c FROM members m ${where}`, ...params)?.c ?? 0;

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
    offset
  );

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <AdminNotice ok={sp.ok === "toggled" ? "會員狀態已更新。" : undefined} />

      <Panel
        title={`會員（${total}）`}
        action={
          <form style={{ display: "flex", gap: 10 }}>
            <input
              name="q"
              defaultValue={q}
              placeholder="搜尋 Email／姓名／電話"
              style={{
                background: "var(--paper2)",
                border: "1px solid var(--line)",
                padding: "8px 11px",
                fontSize: ".93rem",
                fontFamily: "inherit",
                color: "var(--ink)",
                width: 220,
              }}
            />
            <button
              type="submit"
              style={{
                cursor: "pointer",
                background: "none",
                border: "1px solid var(--line)",
                padding: "8px 16px",
                fontFamily: "inherit",
                fontSize: ".93rem",
                fontWeight: 700,
                color: "var(--ink)",
              }}
            >
              搜尋
            </button>
          </form>
        }
      >
        {rows.length === 0 ? (
          <Empty>{q ? `找不到符合「${q}」的會員。` : "還沒有任何會員。"}</Empty>
        ) : (
          <Table head={["EMAIL", "姓名", "電話", "訂單", "累計消費", "點數", "最後登入", "註冊", "狀態"]}>
            {rows.map((m) => (
              <tr key={m.id} style={m.disabled ? { opacity: 0.5 } : undefined}>
                <Td nowrap>{m.email}</Td>
                <Td>{m.name || "—"}</Td>
                <Td nowrap>{m.phone || "—"}</Td>
                <Td nowrap>{m.orders}</Td>
                <Td nowrap>NT$ {m.spent.toLocaleString()}</Td>
                <Td nowrap>{m.points}</Td>
                <Td nowrap dim>{m.last_login_at ? m.last_login_at.slice(0, 10) : "未登入過"}</Td>
                <Td nowrap dim>{m.created_at.slice(0, 10)}</Td>
                <Td nowrap>
                  {mayManage ? (
                    <form action={toggleMemberAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        style={{
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          padding: 0,
                          fontFamily: "inherit",
                          fontSize: ".9rem",
                          fontWeight: 700,
                          color: m.disabled ? "var(--ink)" : "#9B4A2F",
                        }}
                      >
                        {m.disabled ? "恢復" : "停用"}
                      </button>
                    </form>
                  ) : (
                    <span style={{ color: "var(--mute)", fontSize: ".9rem" }}>
                      {m.disabled ? "已停用" : "正常"}
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        )}

        {pages > 1 && (
          <p style={{ marginTop: 22, display: "flex", gap: 14, fontSize: ".92rem", fontWeight: 700 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`/admin/members?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                style={{ color: p === page ? "var(--ink)" : "var(--mute)" }}
              >
                {p}
              </a>
            ))}
          </p>
        )}
      </Panel>
    </>
  );
}
