import Link from "next/link";
import { all } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import {
  AdminField,
  AdminLink,
  AdminNotice,
  AdminSelect,
  AdminSubmit,
  Empty,
  FilterTabs,
  Note,
  PageHeader,
  Panel,
  Pill,
  Table,
  Tag,
  Td,
  Tr,
} from "../../ui";
import { createArticleAction } from "./actions";
import { CATEGORY_OPTIONS, KIND_LABEL, KIND_OPTIONS, STATUS_LABEL } from "./labels";

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
  created: "草稿已建立。點進去寫內容，寫完再發布。",
};
const ERR: Record<string, string> = {
  taken: "這個 slug 已經有文章在用了。",
  kind: "內容型態不正確。",
  notfound: "找不到這篇文章。",
};

function statusTone(s: string): "on" | "warn" | "off" {
  if (s === "published") return "on";
  if (s === "draft") return "off";
  return "warn";
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; e?: string; status?: string }>;
}) {
  await requireAdmin("articles.manage");
  const sp = await searchParams;
  const status = sp.status && STATUS_LABEL[sp.status] ? sp.status : "";

  const rows = all<Row>(
    `SELECT id, slug, kind, category, title, status, published_at, updated_at
       FROM articles ORDER BY updated_at DESC`
  );

  const counts: Record<string, number> = {};
  for (const key of Object.keys(STATUS_LABEL)) {
    counts[key] = rows.filter((r) => r.status === key).length;
  }
  const shown = status ? rows.filter((r) => r.status === status) : rows;

  return (
    <>
      <PageHeader
        eyebrow="ARTICLES"
        title="文章管理"
        crumbs={[{ label: "後台", href: "/admin" }, { label: "文章" }]}
        stats={
          rows.length === 0
            ? "還沒有文章"
            : `共 ${rows.length} 篇・已發布 ${counts.published}・草稿 ${counts.draft}`
        }
        actions={
          <Link href="#new" className="btn btn-primary">
            ＋ 開新文章
          </Link>
        }
      />

      <AdminNotice
        ok={sp.ok ? OK[sp.ok] : undefined}
        m={sp.e ? ERR[sp.e] ?? "操作沒有完成。" : undefined}
      />

      {rows.length === 0 ? (
        <Empty>
          還沒有文章。用下面的表單開第一篇。
          <br />
          <br />
          部落格是純知識世界，
          <strong className="text-ink">不提商品名、不放商品連結、不寫擦邊推薦</strong>。
          發布前系統會自動檢查，違反就擋下來。
        </Empty>
      ) : (
        <>
          <FilterTabs
            current={status}
            tabs={[
              { key: "", label: "全部", count: rows.length, href: "/admin/articles" },
              ...Object.entries(STATUS_LABEL).map(([key, label]) => ({
                key,
                label,
                count: counts[key],
                tone: key === "published" ? ("on" as const) : undefined,
                href: `/admin/articles?status=${key}`,
              })),
            ]}
          />

          {shown.length === 0 ? (
            <Empty>這個狀態目前沒有文章。</Empty>
          ) : (
            <>
              {/* 手機：一列一張卡 */}
              <div className="md:hidden flex flex-col gap-3">
                {shown.map((a) => (
                  <div key={a.id} className="bg-white border border-brand-200 p-4">
                    <Link href={`/admin/articles/${a.id}`} className="block">
                      <div className="font-medium text-ink leading-snug">{a.title}</div>
                      <div className="text-xs text-ink/50 mt-1 break-all">/read/{a.slug}</div>
                    </Link>
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <Tag>{KIND_LABEL[a.kind] ?? a.kind}</Tag>
                      <Tag>{a.category}</Tag>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-100">
                      <Pill tone={statusTone(a.status)}>{STATUS_LABEL[a.status] ?? a.status}</Pill>
                      <span className="text-[11px] text-ink/50">
                        編輯於 {a.updated_at.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 桌機：資料表 */}
              <div className="hidden md:block">
                <Table head={["標題", "型態", "分類", "狀態", "發布時間", "最後編輯", "操作"]}>
                  {shown.map((a) => (
                    <Tr key={a.id}>
                      <Td>
                        <AdminLink href={`/admin/articles/${a.id}`}>{a.title}</AdminLink>
                        <div className="text-xs text-ink/50 mt-0.5">/read/{a.slug}</div>
                      </Td>
                      <Td nowrap dim>{KIND_LABEL[a.kind] ?? a.kind}</Td>
                      <Td nowrap>
                        <Tag>{a.category}</Tag>
                      </Td>
                      <Td nowrap>
                        <Pill tone={statusTone(a.status)}>{STATUS_LABEL[a.status] ?? a.status}</Pill>
                      </Td>
                      <Td nowrap dim>{a.published_at ? a.published_at.slice(0, 10) : "—"}</Td>
                      <Td nowrap dim>{a.updated_at.slice(0, 16)}</Td>
                      <Td nowrap>
                        <div className="flex items-center gap-3 text-xs">
                          <AdminLink href={`/admin/articles/${a.id}`}>編輯</AdminLink>
                          {a.status === "published" && (
                            <Link href={`/read/${a.slug}`} className="text-ink/60 hover:text-ink">
                              看前台
                            </Link>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Table>
              </div>
            </>
          )}
        </>
      )}

      <div id="new" className="mt-8">
        <Panel title="開一篇新文章">
          <Note>
            建立之後是草稿，前台看不到。標題、分類、型態在編輯頁還能改，
            只有 slug（網址）建立後別再動——改了舊網址會失效。
          </Note>
          <form action={createArticleAction} className="max-w-[520px]">
            <AdminField label="標題" name="title" required />
            <AdminField
              label="SLUG（網址）"
              name="slug"
              required
              hint="只收小寫英數與連字號，例如 why-is-pdrn-trending。中文會被轉成連字號。"
            />
            <AdminSelect label="內容型態" name="kind" defaultValue="A" options={KIND_OPTIONS} />
            <AdminSelect
              label="分類"
              name="category"
              defaultValue={CATEGORY_OPTIONS[0]?.value}
              options={CATEGORY_OPTIONS}
            />
            <AdminSubmit>建立草稿</AdminSubmit>
          </form>
        </Panel>
      </div>
    </>
  );
}
