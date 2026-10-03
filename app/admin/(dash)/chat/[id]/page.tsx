import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/admin";
import { markReadByAdmin, messagesOf, threadById } from "../../../../lib/chat";
import {
  AdminNotice,
  AdminSubmit,
  BackLink,
  InlineSubmit,
  Note,
  PageHeader,
  Panel,
  Pill,
} from "../../../ui";
import { closeChatAction, reopenChatAction, replyChatAction } from "../actions";

export const dynamic = "force-dynamic";

const OK: Record<string, string> = {
  sent: "已回覆。客人下次打開聊天視窗就會看到。",
  closed: "已結案。客人再發訊息會自動回到進行中。",
  reopened: "已重新開啟。",
};

export default async function ChatThread({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; e?: string }>;
}) {
  await requireAdmin("members.view");
  const { id } = await params;
  const sp = await searchParams;

  const t = threadById(Number(id));
  if (!t) notFound();

  const msgs = messagesOf(t.id);
  // 打開就算看過。放在讀訊息之後，未讀數字才不會在這一頁自己歸零後還顯示。
  if (t.unread_admin > 0) markReadByAdmin(t.id);

  const who = t.name || (t.member_id ? `會員 #${t.member_id}` : `訪客 #${t.id}`);

  return (
    <>
      <BackLink href="/admin/chat">← 回客服列表</BackLink>

      <PageHeader
        eyebrow="CONVERSATION"
        title={who}
        crumbs={[
          { label: "後台", href: "/admin" },
          { label: "客服", href: "/admin/chat" },
          { label: who },
        ]}
        stats={`${msgs.length} 則・開始於 ${t.created_at.slice(0, 16)}${t.first_page ? `・從 ${t.first_page} 發問` : ""}`}
        actions={
          <>
            <Pill tone={t.status === "open" ? "on" : "off"}>
              {t.status === "open" ? "進行中" : "已結案"}
            </Pill>
            <form action={t.status === "open" ? closeChatAction : reopenChatAction}>
              <input type="hidden" name="id" value={t.id} />
              <InlineSubmit>{t.status === "open" ? "結案" : "重新開啟"}</InlineSubmit>
            </form>
          </>
        }
      />

      <AdminNotice
        ok={sp.ok ? OK[sp.ok] : undefined}
        m={sp.e === "empty" ? "訊息是空的，沒有送出。" : undefined}
      />

      {(t.email || t.member_id) && (
        <Note>
          {t.email && (
            <>
              他留的聯絡方式：<strong className="text-ink">{t.email}</strong>
              <br />
            </>
          )}
          {t.member_id && <>這是會員 #{t.member_id}，訂單與消費紀錄在會員頁查得到。</>}
        </Note>
      )}

      <Panel title="對話">
        {msgs.length === 0 ? (
          <p className="text-sm text-ink/50">還沒有訊息。</p>
        ) : (
          <div className="flex flex-col gap-3 max-w-[720px]">
            {msgs.map((m) => {
              const mine = m.sender === "admin";
              return (
                <div key={m.id} className={mine ? "self-end max-w-[85%]" : "self-start max-w-[85%]"}>
                  <div className="text-[11px] text-ink/50 mb-1">
                    {mine ? m.author || "客服" : who}・{m.created_at.slice(5, 16)}
                  </div>
                  <p
                    className={
                      "px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words " +
                      (mine
                        ? "bg-ink text-cream"
                        : "bg-brand-50 text-ink/80 border border-brand-200")
                    }
                  >
                    {m.body}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel title="回覆">
        <form action={replyChatAction} className="max-w-[720px]">
          <input type="hidden" name="id" value={t.id} />
          <label className="block mb-4">
            <span className="adm-label">訊息</span>
            <textarea
              name="body"
              rows={4}
              required
              maxLength={2000}
              className="adm-input"
              placeholder="直接回答他問的那件事。不確定的成分與功效不要猜，照法遵紅線寫。"
            />
          </label>
          <AdminSubmit>送出回覆</AdminSubmit>
        </form>
        <p className="mt-4 text-xs text-ink/50 leading-relaxed max-w-[560px]">
          回覆不會寄信。客人下次打開聊天視窗就看得到，視窗開著的話幾秒內出現。
          需要用 Email 回的話，用上面他留的信箱。
        </p>
      </Panel>
    </>
  );
}
