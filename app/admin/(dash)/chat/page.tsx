import Link from "next/link";
import { requireAdmin } from "../../../lib/admin";
import { chatCounts, inboxThreads } from "../../../lib/chat";
import { AdminNotice, Empty, FilterTabs, Note, PageHeader, Pill, Table, Td, Tr } from "../../ui";

export const dynamic = "force-dynamic";

export default async function ChatInbox({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin("members.view");
  const sp = await searchParams;
  const status = sp.status === "closed" || sp.status === "all" ? sp.status : "open";

  const rows = inboxThreads(status === "all" ? "" : status);
  const counts = chatCounts();

  return (
    <>
      <PageHeader
        eyebrow="CHAT"
        title="線上客服"
        crumbs={[{ label: "後台", href: "/admin" }, { label: "客服" }]}
        stats={
          counts.all === 0
            ? "還沒有人發問"
            : `進行中 ${counts.open}・已結案 ${counts.closed}${counts.unread ? `・${counts.unread} 條未讀` : ""}`
        }
      />

      <AdminNotice />

      <FilterTabs
        current={status}
        tabs={[
          { key: "open", label: "進行中", count: counts.open, href: "/admin/chat", tone: "on" },
          { key: "closed", label: "已結案", count: counts.closed, href: "/admin/chat?status=closed" },
          { key: "all", label: "全部", count: counts.all, href: "/admin/chat?status=all" },
        ]}
      />

      {rows.length === 0 ? (
        <Empty>
          {status === "open"
            ? "沒有進行中的對話。前台右下角的聊天泡泡有人發問時，會出現在這裡。"
            : "這個狀態目前沒有對話。"}
        </Empty>
      ) : (
        <>
          {/* 手機：一列一張卡 */}
          <div className="md:hidden flex flex-col gap-3">
            {rows.map((t) => (
              <Link
                key={t.id}
                href={`/admin/chat/${t.id}`}
                className={`block bg-white border p-4 hover:border-ink transition ${t.unread_admin ? "border-ink" : "border-brand-200"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-ink">
                      {t.name || (t.member_id ? `會員 #${t.member_id}` : `訪客 #${t.id}`)}
                      {t.unread_admin > 0 && (
                        <span className="ml-2 inline-block min-w-[18px] px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-700 text-center">
                          {t.unread_admin}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-ink/50 mt-0.5">
                      {t.last_message_at ? t.last_message_at.slice(5, 16) : "—"}・{t.messages} 則
                    </div>
                  </div>
                  <Pill tone={t.status === "open" ? "on" : "off"}>
                    {t.status === "open" ? "進行中" : "已結案"}
                  </Pill>
                </div>
                <p className="mt-2 text-sm text-ink/70 line-clamp-2 break-words">{t.preview || "（沒有內容）"}</p>
              </Link>
            ))}
          </div>

          {/* 桌機：資料表 */}
          <div className="hidden md:block">
            <Table head={["客人", "最後一句", "則數", "從哪一頁", "最後時間", "狀態"]}>
              {rows.map((t) => (
                <Tr key={t.id}>
                  <Td nowrap>
                    <Link
                      href={`/admin/chat/${t.id}`}
                      className="text-ink font-medium hover:text-brand-700 underline underline-offset-4 decoration-brand-300"
                    >
                      {t.name || (t.member_id ? `會員 #${t.member_id}` : `訪客 #${t.id}`)}
                    </Link>
                    {t.unread_admin > 0 && (
                      <span className="ml-2 inline-block min-w-[18px] px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-700 text-center">
                        {t.unread_admin}
                      </span>
                    )}
                    {t.email && <div className="text-[11px] text-ink/50 mt-0.5">{t.email}</div>}
                  </Td>
                  <Td>
                    <span className="block max-w-[420px] truncate text-ink/70">{t.preview || "—"}</span>
                  </Td>
                  <Td nowrap align="right">{t.messages}</Td>
                  <Td nowrap dim>{t.first_page || "—"}</Td>
                  <Td nowrap dim>{t.last_message_at ? t.last_message_at.slice(5, 16) : "—"}</Td>
                  <Td nowrap>
                    <Pill tone={t.status === "open" ? "on" : "off"}>
                      {t.status === "open" ? "進行中" : "已結案"}
                    </Pill>
                  </Td>
                </Tr>
              ))}
            </Table>
          </div>
        </>
      )}

      <div className="mt-6">
        <Note>
          客人不需要註冊就能發問，身分靠瀏覽器裡的一個識別碼記住，所以同一個人換裝置會變成新的一條對話。
          已登入的會員發言時會自動帶出會員編號。
          <br />
          你回的訊息不會寄信，客人下次打開聊天視窗就看得到；想用 Email 回覆的話，看對話裡他留的信箱。
        </Note>
      </div>
    </>
  );
}
