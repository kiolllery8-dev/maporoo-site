import Link from "next/link";
import { notFound } from "next/navigation";
import { get } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";
import { checkArticle, DISCLAIMER_TEXT } from "../../../../lib/article-guard";
import MarkdownEditor from "./MarkdownEditor";
import { ArticleImagesPanel } from "../../../ArticleImagesPanel";
import { listMedia } from "../../../../lib/media";
import { UPLOAD_ERRORS } from "../../../../lib/uploads";
import {
  AdminCheckbox,
  AdminField,
  AdminNotice,
  AdminSelect,
  AdminSubmit,
  BackLink,
  DangerButton,
  FieldRow,
  PageHeader,
  Panel,
  Pill,
} from "../../../ui";
import { CATEGORY_OPTIONS, KIND_OPTIONS, STATUS_LABEL } from "../labels";
import {
  deleteArticleAction,
  publishArticleAction,
  saveArticleAction,
  unpublishArticleAction,
} from "../actions";

export const dynamic = "force-dynamic";

type Article = {
  id: number;
  slug: string;
  kind: string;
  category: string;
  title: string;
  description: string;
  cover: string;
  reading_time: string;
  body_md: string;
  sources_json: string;
  disclaimer: number;
  status: string;
  published_at: string | null;
  updated_at: string;
};

const OK: Record<string, string> = {
  saved: "已儲存。",
  published: "已發布。文章現在出現在 /read 上。",
  unpublished: "已下架，狀態回到草稿。前台看不到了。",
  uploaded: "圖片已上傳，在下面的圖庫裡。",
  cover: "封面已更新。",
  coverclear: "封面已移除。",
  inserted: "圖片語法已接到內文最後面。把那一行剪到想要的位置，再按儲存。",
  alt: "替代文字已儲存。",
};

export default async function EditArticle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; e?: string; blocked?: string; n?: string }>;
}) {
  await requireAdmin("articles.manage");
  const { id } = await params;
  const sp = await searchParams;

  const a = get<Article>(`SELECT * FROM articles WHERE id = ?`, Number(id));
  if (!a) notFound();

  let sources: string[] = [];
  try {
    const parsed = JSON.parse(a.sources_json || "[]");
    if (Array.isArray(parsed)) sources = parsed.map(String);
  } catch {
    sources = [];
  }

  // 每次進頁面都跑一次檢查，讓寫手邊寫邊看得到哪裡卡住，
  // 不用等按了發布才知道。
  const check = checkArticle({
    title: a.title,
    description: a.description,
    body: a.body_md,
    kind: a.kind,
    sources,
    disclaimer: a.disclaimer === 1,
    cover: a.cover,
  });

  const library = listMedia();

  const published = a.status === "published";
  const clean = check.blocking.length === 0 && check.warnings.length === 0;

  return (
    <>
      <BackLink href="/admin/articles">← 回文章列表</BackLink>

      <PageHeader
        eyebrow="ARTICLE"
        title={a.title}
        crumbs={[
          { label: "後台", href: "/admin" },
          { label: "文章", href: "/admin/articles" },
          { label: a.title.length > 14 ? a.title.slice(0, 14) + "…" : a.title },
        ]}
        stats={`/read/${a.slug}${a.published_at ? `・發布於 ${a.published_at.slice(0, 16)}` : ""}・最後編輯 ${a.updated_at.slice(0, 16)}`}
        actions={
          <>
            <Pill tone={published ? "on" : "warn"}>{STATUS_LABEL[a.status] ?? a.status}</Pill>
            {published && (
              <Link href={`/read/${a.slug}`} className="btn btn-outline">
                看前台
              </Link>
            )}
          </>
        }
      />

      <AdminNotice
        ok={sp.ok ? OK[sp.ok] : undefined}
        m={
          sp.blocked
            ? "這篇還不能發布——下面「上架檢查」列出的問題要先處理完。"
            : sp.e === "publisheddelete"
              ? "已發布的文章不能直接刪除。請先下架，再刪。"
              : sp.e
                ? UPLOAD_ERRORS[sp.e] ?? undefined
                : undefined
        }
      />

      {/* ── 上架檢查 ─────────────────────────────────────── */}
      <Panel
        title="上架檢查"
        action={
          clean ? (
            <Pill tone="on">通過</Pill>
          ) : check.blocking.length ? (
            <Pill tone="off">擋下 {check.blocking.length} 項</Pill>
          ) : (
            <Pill tone="warn">提醒 {check.warnings.length} 項</Pill>
          )
        }
      >
        {clean ? (
          <p className="text-sm text-ink/70 leading-relaxed">沒有發現問題。可以發布。</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {check.blocking.map((v, i) => (
              <div key={`b${i}`} className="px-4 py-3 bg-red-50 border-l-[3px] border-red-700">
                <p className="text-sm font-medium text-red-800">擋下發布 · {v.rule}</p>
                <p className="text-sm text-red-700/90 mt-0.5 leading-relaxed">{v.detail}</p>
              </div>
            ))}
            {check.warnings.map((v, i) => (
              <div key={`w${i}`} className="px-4 py-3 bg-amber-50 border-l-[3px] border-amber-500">
                <p className="text-sm font-medium text-amber-800">提醒 · {v.rule}</p>
                <p className="text-sm text-amber-800/80 mt-0.5 leading-relaxed">{v.detail}</p>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-ink/50 leading-relaxed">
          規則來源：<code>000_Agent/knowledge/maporoo-brand-dna.md</code> 第三節（零商品置入）、
          2.7（禁詞）、2.8（AI 腔），以及 <code>compliance-redlines.md</code>。
        </p>
      </Panel>

      {/* ── 狀態與動作 ───────────────────────────────────── */}
      <Panel title={`狀態：${STATUS_LABEL[a.status] ?? a.status}`}>
        <div className="flex gap-4 flex-wrap items-center">
          {published ? (
            <form action={unpublishArticleAction}>
              <input type="hidden" name="id" value={a.id} />
              <AdminSubmit>下架</AdminSubmit>
            </form>
          ) : (
            <form action={publishArticleAction}>
              <input type="hidden" name="id" value={a.id} />
              <AdminSubmit>
                {check.blocking.length ? `發布（目前有 ${check.blocking.length} 項會被擋下）` : "發布"}
              </AdminSubmit>
            </form>
          )}
          {!published && (
            <form action={deleteArticleAction}>
              <input type="hidden" name="id" value={a.id} />
              <DangerButton>刪除草稿</DangerButton>
            </form>
          )}
        </div>
      </Panel>

      {/* ── 內容 ─────────────────────────────────────────── */}
      <Panel title="內容">
        <form action={saveArticleAction}>
          <input type="hidden" name="id" value={a.id} />

          {/* 短欄位維持窄版好讀；編輯器要左右對照，讓它吃滿整個面板。 */}
          <div className="max-w-[620px]">
            <AdminField label="標題" name="title" required defaultValue={a.title} />
            <AdminField
              label="META DESCRIPTION"
              name="description"
              defaultValue={a.description}
              hint="搜尋結果顯示的摘要，150 字內。"
            />

            <FieldRow>
              <AdminSelect label="內容型態" name="kind" defaultValue={a.kind} options={KIND_OPTIONS} />
              <AdminSelect label="分類" name="category" defaultValue={a.category} options={CATEGORY_OPTIONS} />
            </FieldRow>

            <AdminField
              label="閱讀時間"
              name="reading_time"
              defaultValue={a.reading_time}
              hint="例如「3 分鐘」。"
            />
          </div>

          <MarkdownEditor name="body_md" defaultValue={a.body_md} rows={24} />

          <div className="max-w-[620px]">
            <AdminField
              label="出處（一行一筆）"
              name="sources"
              textarea
              rows={4}
              defaultValue={sources.join("\n")}
              hint="型態 B／C 必填。格式建議：媒體或節目名稱 / 日期 / 連結。查不到來源的說法不要寫進文章。"
            />

            <AdminCheckbox
              name="disclaimer"
              defaultChecked={a.disclaimer === 1}
              label="文末附非醫療建議聲明（型態 B／C 必勾）"
              hint={`會自動加上：「${DISCLAIMER_TEXT}」`}
            />

            <AdminSubmit>儲存</AdminSubmit>
          </div>
        </form>
      </Panel>

      <ArticleImagesPanel articleId={a.id} cover={a.cover} library={library} />
    </>
  );
}
