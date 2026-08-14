import { requireAdmin } from "../../../lib/admin";
import { BLOCKS, loadContent } from "../../../lib/content";
import { AdminField, AdminNotice, AdminSubmit, PageHeader, Panel } from "../../ui";
import { resetContentAction, saveContentAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; g?: string }>;
}) {
  await requireAdmin("content.manage");
  const sp = await searchParams;
  const content = loadContent();

  const groups: string[] = [];
  for (const b of BLOCKS) if (!groups.includes(b.group)) groups.push(b.group);

  const edited = BLOCKS.filter((b) => content.has(b.key)).length;

  const ok =
    sp.ok === "saved"
      ? `已儲存${sp.g ? `「${sp.g}」` : ""}。前台最多 5 分鐘內更新。`
      : sp.ok === "reset"
        ? `已回復${sp.g ? `「${sp.g}」` : ""}的預設文案。`
        : undefined;

  return (
    <>
      <PageHeader
        eyebrow="CONTENT"
        title="前台文案"
        stats={`共 ${BLOCKS.length} 段可編輯文字・已自訂 ${edited} 段`}
      />

      <AdminNotice ok={ok} />

      <p style={{ marginBottom: 30, color: "var(--soft)", fontSize: ".97rem", lineHeight: 1.95, maxWidth: 680 }}>
        這裡改的字會直接顯示在前台，不需要重新部署。
        欄位留空就會回到程式碼裡的預設文案，所以前台不會出現空白區塊。
        <br />
        改完之後前台<strong style={{ color: "var(--ink)" }}>最多 5 分鐘</strong>更新一次（頁面有快取）。
        想立刻看到，重新整理兩次即可。
      </p>

      {groups.map((g) => {
        const blocks = BLOCKS.filter((b) => b.group === g);
        const customised = blocks.some((b) => content.has(b.key));
        return (
          <Panel
            key={g}
            title={g}
            action={
              customised ? (
                <form action={resetContentAction}>
                  <input type="hidden" name="__group" value={g} />
                  <button
                    type="submit"
                    style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: ".88rem", fontWeight: 700, color: "var(--mute)" }}
                  >
                    回復預設
                  </button>
                </form>
              ) : (
                <span style={{ fontSize: ".85rem", color: "var(--mute)" }}>使用預設文案</span>
              )
            }
          >
            <form action={saveContentAction} style={{ maxWidth: 720 }}>
              <input type="hidden" name="__group" value={g} />
              {blocks.map((b) => (
                <AdminField
                  key={b.key}
                  label={b.label}
                  name={b.key}
                  defaultValue={content.get(b.key) ?? b.fallback}
                  textarea={b.multiline}
                  rows={b.multiline ? 3 : undefined}
                  hint={b.hint}
                />
              ))}
              <AdminSubmit>儲存這一區</AdminSubmit>
            </form>
          </Panel>
        );
      })}
    </>
  );
}
