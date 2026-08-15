import { all } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { ROLE_DESC, ROLE_LABEL, type Role } from "../../../lib/permissions";
import { AdminField, AdminNotice, AdminSelect, AdminSubmit, Panel, Table, Td } from "../../ui";
import {
  changeRoleAction,
  createAdminAction,
  editAdminAction,
  resetAdminPasswordAction,
  toggleAdminAction,
} from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  must_change_password: number;
  disabled: number;
  last_login_at: string | null;
  created_at: string;
};

const ROLE_OPTIONS = (Object.keys(ROLE_LABEL) as Role[]).map((r) => ({
  value: r,
  label: `${ROLE_LABEL[r]}（${r}）`,
}));

const OK: Record<string, string> = {
  created: "管理者已建立。請把帳號與初始密碼交給對方，他第一次登入會被要求改密碼。",
  role: "角色已更新。",
  toggled: "帳號狀態已更新。",
  reset: "密碼已重設。對方所有裝置都已登出，需要用新密碼重新登入並立刻更換。",
  edited: "帳號資料已更新。",
};

const ERR: Record<string, string> = {
  taken: "這個帳號（或 Email）已經有人用了。",
  email: "Email 格式不正確。留空也可以，那一格不是必填。",
  role: "角色不正確。",
  self: "不能停用自己的帳號。請由另一位負責人操作。",
  lastowner: "系統至少要保留一位能登入的負責人，這個動作會讓後台沒有人管得了帳號。",
};

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; e?: string; m?: string }>;
}) {
  const me = await requireAdmin("staff.manage");
  const sp = await searchParams;

  const rows = all<Row>(
    `SELECT id, username, email, name, role, must_change_password, disabled, last_login_at, created_at
       FROM admins ORDER BY id`
  );

  return (
    <>
      <AdminNotice
        ok={sp.ok ? OK[sp.ok] : undefined}
        e={sp.e && !ERR[sp.e] ? sp.e : undefined}
        m={sp.m ?? (sp.e && ERR[sp.e] ? ERR[sp.e] : undefined)}
      />

      <Panel title={`管理者（${rows.length}）`}>
        <Table head={["帳號", "顯示名稱", "角色", "最後登入", "建立", "狀態", "操作"]}>
          {rows.map((a) => (
            <tr key={a.id} style={a.disabled ? { opacity: 0.5 } : undefined}>
              <Td nowrap>
                <code style={{ color: "var(--ink)", fontWeight: 700 }}>{a.username}</code>
                {a.id === me.id && (
                  <span style={{ marginLeft: 8, fontSize: ".78rem", color: "var(--mute)" }}>（你）</span>
                )}
                {a.must_change_password === 1 && (
                  <>
                    <br />
                    <span style={{ fontSize: ".8rem", color: "#9B4A2F" }}>尚未更換初始密碼</span>
                  </>
                )}
              </Td>
              <Td>{a.name || "—"}</Td>
              <Td nowrap>
                <form action={changeRoleAction} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="hidden" name="id" value={a.id} />
                  <select
                    name="role"
                    defaultValue={a.role}
                    style={{
                      background: "var(--paper2)",
                      border: "1px solid var(--line)",
                      padding: "5px 8px",
                      fontSize: ".9rem",
                      fontFamily: "inherit",
                      color: "var(--ink)",
                    }}
                  >
                    {ROLE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: ".85rem", fontWeight: 700, color: "var(--ink)" }}
                  >
                    改
                  </button>
                </form>
              </Td>
              <Td nowrap dim>{a.last_login_at ? a.last_login_at.slice(0, 16) : "未登入過"}</Td>
              <Td nowrap dim>{a.created_at.slice(0, 10)}</Td>
              <Td nowrap>{a.disabled ? "已停用" : "正常"}</Td>
              <Td nowrap>
                {a.id === me.id ? (
                  <span style={{ color: "var(--mute)", fontSize: ".88rem" }}>—</span>
                ) : (
                  <form action={toggleAdminAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: ".88rem", fontWeight: 700, color: a.disabled ? "var(--ink)" : "#9B4A2F" }}
                    >
                      {a.disabled ? "恢復" : "停用"}
                    </button>
                  </form>
                )}
              </Td>
            </tr>
          ))}
        </Table>
      </Panel>

      <Panel title="新增管理者">
        <p style={{ marginBottom: 22, color: "var(--soft)", fontSize: ".95rem", lineHeight: 1.55, maxWidth: 620 }}>
          初始密碼由你設定，當面或用你們平常的方式交給對方。
          系統不會替你產生密碼，也不會寄信——密碼跑的路越少越安全。
          對方第一次登入會被要求立刻更換。
        </p>
        <form action={createAdminAction} style={{ maxWidth: 460 }}>
          <AdminField
            label="帳號"
            name="username"
            required
            autoComplete="off"
            hint="登入用。小寫英文、數字，以及 - _ . 三種符號，例如 yankaiboss。"
          />
          <AdminField label="顯示名稱" name="name" autoComplete="off" hint="後台顯示用，例如 晏愷老闆。" />
          <AdminField label="EMAIL（可留空）" name="email" type="email" autoComplete="off" hint="只是聯絡方式，不用來登入。" />
          <AdminSelect label="角色" name="role" options={ROLE_OPTIONS} defaultValue="shipping" />
          <AdminField
            label="初始密碼"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            hint="至少 8 個字元，需要同時包含英文字母與數字。"
          />
          <AdminSubmit>建立帳號</AdminSubmit>
        </form>
      </Panel>

      <Panel title="修改帳號與名稱">
        <p style={{ marginBottom: 22, color: "var(--soft)", fontSize: ".95rem", lineHeight: 1.55, maxWidth: 620 }}>
          開站時自動建立的帳號叫 <code>admin</code>，在這裡改成你自己的。
          改帳號不影響已登入的裝置，也不會動到密碼。
        </p>
        {rows.map((a) => (
          <form
            key={a.id}
            action={editAdminAction}
            style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--line)" }}
          >
            <input type="hidden" name="id" value={a.id} />
            <span style={{ width: 150 }}>
              <AdminField label="帳號" name="username" defaultValue={a.username} required />
            </span>
            <span style={{ width: 150 }}>
              <AdminField label="顯示名稱" name="name" defaultValue={a.name} />
            </span>
            <span style={{ width: 210 }}>
              <AdminField
                label="EMAIL"
                name="email"
                defaultValue={a.email.endsWith("@no-email.local") ? "" : a.email}
              />
            </span>
            <span style={{ paddingBottom: 20 }}>
              <AdminSubmit>儲存</AdminSubmit>
            </span>
          </form>
        ))}
      </Panel>

      <Panel title="重設某人的密碼">
        <form action={resetAdminPasswordAction} style={{ maxWidth: 460 }}>
          <AdminSelect
            label="對象"
            name="id"
            options={rows
              .filter((r) => r.id !== me.id)
              .map((r) => ({ value: String(r.id), label: r.name ? `${r.username}（${r.name}）` : r.username }))}
          />
          <AdminField
            label="新密碼"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            hint="至少 8 個字元，需要同時包含英文字母與數字。設定後對方所有裝置會登出。"
          />
          <AdminSubmit>重設密碼</AdminSubmit>
        </form>
      </Panel>

      <Panel title="四個角色能做什麼">
        <Table head={["角色", "權限範圍"]}>
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
            <tr key={r}>
              <Td nowrap>
                <strong style={{ color: "var(--ink)" }}>{ROLE_LABEL[r]}</strong>
                <br />
                <span style={{ fontSize: ".82rem", color: "var(--mute)" }}>{r}</span>
              </Td>
              <Td>{ROLE_DESC[r]}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
