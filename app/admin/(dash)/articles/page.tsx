import { all } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { AdminField, AdminLink, AdminNotice, AdminSelect, AdminSubmit, Empty, Panel, Table, Td } from "../../ui";
import { createArticleAction } from "./actions";
import { KIND_LABEL, KIND_OPTIONS, STATUS_LABEL } from "./labels";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  kind: string;
  category: string;
  title: string;
  status: string;
  published_at: string | null;
  updated_at: string;
};

const OK: Record<string, string> = {
  deleted: "文章已刪除。",
};
const ERR: Record<string, string> = {
  taken: "這個 slug 已經有文章在用了。",
  kind: "內容型態不正確。",
  notfound: "找不到這篇文章。",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; e?: string }>;
}) {
  await requireAdmin("articles.manage");
  const sp = await searchParams;

  const rows = all<Row>(
    `SELECT id, slug, kind, category, title, status, published_at, updated_at
       FROM articles ORDER BY updated_at DESC`
  );

  const published = rows.filter((r) => r.status === "published").length;

  return (
    <>
      <AdminNotice
        ok={sp.ok ? OK[sp.ok] : undefined}
        m={sp.e ? ERR[sp.e] ?? "操作沒有完成。" : undefined}
      />

      <Panel title={`文章（${rows.length}　已發布 ${published}）`}>
        {rows.length === 0 ? (
          <Empty>
            還沒有文章。用下面的表單開第一篇。
            <br />
            <br />
            提醒：部落格是純知識世界，<strong style={{ color: "var(--ink)" }}>
              不提商品名、不放商品連結、不寫擦邊推薦
            </strong>
            。發布前系統會自動檢查，違反就擋下來。
          </Empty>
        ) : (
          <Table head={["標題", "型態", "分類", "狀態", "發布時間", "最後編輯", ""]}>
            {rows.map((a) => (
              <tr key={a.id}>
                <Td>
                  <AdminLink href={`/admin/articles/${a.id}`}>{a.title}</AdminLink>
                  <br />
                  <span style={{ fontSize: ".82rem", color: "var(--mute)" }}>/read/{a.slug}</span>
                </Td>
                <Td nowrap dim>{KIND_LABEL[a.kind] ?? a.kind}</Td>
                <Td nowrap dim>{a.category}</Td>
                <Td nowrap>{STATUS_LABEL[a.status] ?? a.status}</Td>
                <Td nowrap dim>{a.published_at ? a.published_at.slice(0, 10) : "—"}</Td>
                <Td nowrap dim>{a.updated_at.slice(0, 16)}</Td>
                <Td nowrap>
                  {a.status === "published" && <AdminLink href={`/read/${a.slug}`}>看前台</AdminLink>}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>

      <Panel title="開一篇新文章">
        <form action={createArticleAction} style={{ maxWidth: 520 }}>
          <AdminField label="標題" name="title" required />
          <AdminField
            label="SLUG（網址）"
            name="slug"
            required
            hint="只收小寫英數與連字號，例如 why-is-pdrn-trending。中文會被轉成連字號。"
          />
          <AdminSelect label="內容型態" name="kind" defaultValue="A" options={KIND_OPTIONS} />
          <AdminSubmit>建立草稿</AdminSubmit>
        </form>
      </Panel>
    </>
  );
}
