import { notFound } from "next/navigation";
import { get } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";
import { checkArticle, DISCLAIMER_TEXT } from "../../../../lib/article-guard";
import { renderMarkdown } from "../../../../lib/markdown";
import { AdminField, AdminLink, AdminNotice, AdminSelect, AdminSubmit, Panel } from "../../../ui";
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
};

export default async function EditArticle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; e?: string; blocked?: string }>;
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
  });

  const published = a.status === "published";

  return (
    <>
      <p style={{ marginBottom: 20, fontSize: ".9rem" }}>
        <AdminLink href="/admin/articles">← 回文章列表</AdminLink>
      </p>

      <AdminNotice
        ok={sp.ok ? OK[sp.ok] : undefined}
        m={
          sp.blocked
            ? "這篇還不能發布——下面「上架檢查」列出的問題要先處理完。"
            : sp.e === "publisheddelete"
              ? "已發布的文章不能直接刪除。請先下架，再刪。"
              : undefined
        }
      />

      {/* ── 上架檢查 ─────────────────────────────────────── */}
      <Panel title="上架檢查">
        {check.blocking.length === 0 && check.warnings.length === 0 ? (
          <p style={{ color: "var(--soft)", fontSize: ".97rem", lineHeight: 1.5 }}>
            沒有發現問題。可以發布。
          </p>
        ) : (
          <>
            {check.blocking.map((v, i) => (
              <p
                key={`b${i}`}
                style={{ margin: "0 0 10px", padding: "11px 14px", borderLeft: "3px solid #9B4A2F", background: "var(--paper2)", color: "#7A3722", fontSize: ".94rem", lineHeight: 1.5 }}
              >
                <strong>擋下發布 · {v.rule}</strong>
                <br />
                {v.detail}
              </p>
            ))}
            {check.warnings.map((v, i) => (
              <p
                key={`w${i}`}
                style={{ margin: "0 0 10px", padding: "11px 14px", borderLeft: "3px solid var(--mute)", background: "var(--paper2)", color: "var(--soft)", fontSize: ".94rem", lineHeight: 1.5 }}
              >
                <strong>提醒 · {v.rule}</strong>
                <br />
                {v.detail}
              </p>
            ))}
          </>
        )}

        <p style={{ marginTop: 16, fontSize: ".86rem", color: "var(--mute)", lineHeight: 1.5 }}>
          規則來源：<code>000_Agent/knowledge/maporoo-brand-dna.md</code> 第三節（零商品置入）、
          2.7（禁詞）、2.8（AI 腔），以及 <code>compliance-redlines.md</code>。
        </p>
      </Panel>

      {/* ── 狀態與動作 ───────────────────────────────────── */}
      <Panel title={`狀態：${STATUS_LABEL[a.status] ?? a.status}`}>
        <p style={{ marginBottom: 18, color: "var(--soft)", fontSize: ".95rem", lineHeight: 1.5 }}>
          網址 <code>/read/{a.slug}</code>
          {a.published_at && `　·　發布於 ${a.published_at.slice(0, 16)}`}
          　·　最後編輯 {a.updated_at.slice(0, 16)}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
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
          {published && <AdminLink href={`/read/${a.slug}`}>看前台</AdminLink>}
          {!published && (
            <form action={deleteArticleAction}>
              <input type="hidden" name="id" value={a.id} />
              <button
                type="submit"
                style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: ".92rem", fontWeight: 700, color: "#9B4A2F" }}
              >
                刪除草稿
              </button>
            </form>
          )}
        </div>
      </Panel>

      {/* ── 內容 ─────────────────────────────────────────── */}
      <Panel title="內容">
        <form action={saveArticleAction} style={{ maxWidth: 760 }}>
          <input type="hidden" name="id" value={a.id} />

          <AdminField label="標題" name="title" required defaultValue={a.title} />
          <AdminField
            label="META DESCRIPTION"
            name="description"
            defaultValue={a.description}
            hint="搜尋結果顯示的摘要，150 字內。"
          />

          <div className="grid g2" style={{ gap: 20 }}>
            <AdminSelect label="內容型態" name="kind" defaultValue={a.kind} options={KIND_OPTIONS} />
            <AdminSelect label="分類" name="category" defaultValue={a.category} options={CATEGORY_OPTIONS} />
          </div>

          <AdminField
            label="閱讀時間"
            name="reading_time"
            defaultValue={a.reading_time}
            hint="例如「3 分鐘」。"
          />

          <AdminField
            label="內文（MARKDOWN）"
            name="body_md"
            textarea
            rows={22}
            defaultValue={a.body_md}
            hint="支援 ## 標題、### 小標、- 清單、1. 清單、> 引言、**粗體**、[文字](網址)。不支援原始 HTML。"
          />

          <AdminField
            label="出處（一行一筆）"
            name="sources"
            textarea
            rows={4}
            defaultValue={sources.join("\n")}
            hint="型態 B／C 必填。格式建議：媒體或節目名稱 / 日期 / 連結。查不到來源的說法不要寫進文章。"
          />

          <label style={{ display: "block", marginBottom: 24, fontSize: ".95rem", fontWeight: 500, color: "var(--soft)", lineHeight: 1.5 }}>
            <input type="checkbox" name="disclaimer" defaultChecked={a.disclaimer === 1} style={{ marginRight: 8 }} />
            文末附非醫療建議聲明（型態 B／C 必勾）
            <br />
            <span style={{ marginLeft: 26, color: "var(--mute)", fontSize: ".88rem" }}>
              會自動加上：「{DISCLAIMER_TEXT}」
            </span>
          </label>

          <AdminSubmit>儲存</AdminSubmit>
        </form>
      </Panel>

      {/* ── 預覽 ─────────────────────────────────────────── */}
      <Panel title="預覽">
        {a.body_md.trim() ? (
          <div
            className="article-body"
            style={{ maxWidth: 700, color: "var(--soft)", lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(a.body_md) }}
          />
        ) : (
          <p style={{ color: "var(--mute)" }}>還沒有內文。</p>
        )}
      </Panel>
    </>
  );
}
