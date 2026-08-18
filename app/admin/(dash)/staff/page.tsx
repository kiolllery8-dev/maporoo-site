import { all } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { ROLE_DESC, ROLE_LABEL, type Role } from "../../../lib/permissions";
import {
  AdminField,
  AdminNotice,
  AdminSelect,
  AdminSubmit,
  DangerButton,
  FieldRow,
  InlineSelect,
  InlineSubmit,
  Note,
  PageHeader,
  Panel,
  Pill,
  Table,
  Td,
  Tr,
} from "../../ui";
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

  const active = rows.filter((r) => r.disabled === 0).length;
  const pending = rows.filter((r) => r.must_change_password === 1).length;

  return (
    <>
      <PageHeader
        eyebrow="STAFF"
        title="管理者"
        crumbs={[{ label: "後台", href: "/admin" }, { label: "管理者" }]}
        stats={`共 ${rows.length} 位・啟用 ${active}${pending ? `・${pending} 位尚未更換初始密碼` : ""}`}
      />

      <AdminNotice
        ok={sp.ok ? OK[sp.ok] : undefined}
        e={sp.e && !ERR[sp.e] ? sp.e : undefined}
        m={sp.m ?? (sp.e && ERR[sp.e] ? ERR[sp.e] : undefined)}
      />

      {/* 手機：一列一張卡 */}
      <div className="md:hidden flex flex-col gap-3 mb-8">
        {rows.map((a) => (
          <div
            key={a.id}
            className={`bg-white border p-4 ${a.disabled ? "border-red-200 bg-red-50/30" : "border-brand-200"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-ink break-all">
                  {a.username}
                  {a.id === me.id && <span className="ml-2 text-xs text-ink/50">（你）</span>}
                </div>
                <div className="text-xs text-ink/50 mt-0.5">{a.name || "未設定顯示名稱"}</div>
              </div>
              <Pill tone={a.disabled ? "off" : "on"}>{a.disabled ? "已停用" : "正常"}</Pill>
            </div>
            {a.must_change_password === 1 && (
              <p className="mt-2 text-[11px] text-amber-700">尚未更換初始密碼</p>
            )}
            <div className="mt-3 pt-3 border-t border-brand-100 flex items-center justify-between gap-3">
              <form action={changeRoleAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={a.id} />
                <InlineSelect name="role" defaultValue={a.role} options={ROLE_OPTIONS} />
                <InlineSubmit>改</InlineSubmit>
              </form>
              {a.id !== me.id && (
                <form action={toggleAdminAction}>
                  <input type="hidden" name="id" value={a.id} />
                  {a.disabled ? <InlineSubmit>恢復</InlineSubmit> : <DangerButton>停用</DangerButton>}
                </form>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 桌機：資料表 */}
      <div className="hidden md:block mb-8">
        <Table head={["帳號", "顯示名稱", "角色", "最後登入", "建立", "狀態", "操作"]}>
          {rows.map((a) => (
            <Tr key={a.id} muted={a.disabled === 1}>
              <Td nowrap>
                <span className="font-medium text-ink">{a.username}</span>
                {a.id === me.id && <span className="ml-2 text-xs text-ink/50">（你）</span>}
                {a.must_change_password === 1 && (
                  <div className="text-[11px] text-amber-700 mt-0.5">尚未更換初始密碼</div>
                )}
              </Td>
              <Td>{a.name || "—"}</Td>
              <Td nowrap>
                <form action={changeRoleAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={a.id} />
                  <InlineSelect name="role" defaultValue={a.role} options={ROLE_OPTIONS} />
                  <InlineSubmit>改</InlineSubmit>
                </form>
              </Td>
              <Td nowrap dim>{a.last_login_at ? a.last_login_at.slice(0, 16) : "未登入過"}</Td>
              <Td nowrap dim>{a.created_at.slice(0, 10)}</Td>
              <Td nowrap>
                <Pill tone={a.disabled ? "off" : "on"}>{a.disabled ? "已停用" : "正常"}</Pill>
              </Td>
              <Td nowrap>
                {a.id === me.id ? (
                  <span className="text-ink/30 text-xs">—</span>
                ) : (
                  <form action={toggleAdminAction}>
                    <input type="hidden" name="id" value={a.id} />
                    {a.disabled ? <InlineSubmit>恢復</InlineSubmit> : <DangerButton>停用</DangerButton>}
                  </form>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </div>

      <Panel title="新增管理者">
        <Note>
          初始密碼由你設定，當面或用你們平常的方式交給對方。
          系統不會替你產生密碼，也不會寄信——密碼跑的路越少越安全。
          對方第一次登入會被要求立刻更換。
        </Note>
        <form action={createAdminAction} className="max-w-[460px]">
          <AdminField
            label="帳號"
            name="username"
            required
            autoComplete="off"
            hint="登入用。小寫英文、數字，以及 - _ . 三種符號，例如 yankaiboss。"
          />
          <AdminField label="顯示名稱" name="name" autoComplete="off" hint="後台顯示用，例如 晏愷老闆。" />
          <AdminField
            label="EMAIL（可留空）"
            name="email"
            type="email"
            autoComplete="off"
            hint="只是聯絡方式，不用來登入。"
          />
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
        <Note>
          改帳號不影響已登入的裝置，也不會動到密碼。顯示名稱是登入後右上角出現的那個名字。
        </Note>
        <div className="flex flex-col gap-4">
          {rows.map((a) => (
            <form
              key={a.id}
              action={editAdminAction}
              className="pb-4 border-b border-brand-100 last:border-0 last:pb-0"
            >
              <input type="hidden" name="id" value={a.id} />
              <FieldRow>
                <AdminField label="帳號" name="username" defaultValue={a.username} required />
                <AdminField label="顯示名稱" name="name" defaultValue={a.name} />
              </FieldRow>
              <FieldRow>
                <AdminField
                  label="EMAIL"
                  name="email"
                  defaultValue={a.email.endsWith("@no-email.local") ? "" : a.email}
                />
                <div className="flex items-end pb-4">
                  <AdminSubmit>儲存</AdminSubmit>
                </div>
              </FieldRow>
            </form>
          ))}
        </div>
      </Panel>

      <Panel title="重設某人的密碼">
        <form action={resetAdminPasswordAction} className="max-w-[460px]">
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
            <Tr key={r}>
              <Td nowrap>
                <strong className="text-ink">{ROLE_LABEL[r]}</strong>
                <div className="text-xs text-ink/50">{r}</div>
              </Td>
              <Td>{ROLE_DESC[r]}</Td>
            </Tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
