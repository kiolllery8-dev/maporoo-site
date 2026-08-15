import type { Metadata } from "next";
import Link from "next/link";
import { all } from "../lib/db";
import { excerpt } from "../lib/markdown";

// 每 5 分鐘重新產生一次。文章不是即時性內容，不需要每次請求都查資料庫。
export const revalidate = 300;

export const metadata: Metadata = {
  title: "閱讀｜MAPOROO",
  description:
    "MAPOROO 的知識分享——日常保健、趨勢觀察與生活風格。理解，是保養的開始。",
  alternates: { canonical: "/read" },
};

type Row = {
  slug: string;
  title: string;
  description: string;
  category: string;
  reading_time: string;
  body_md: string;
  published_at: string | null;
};

export default function ReadIndex() {
  const rows = all<Row>(
    `SELECT slug, title, description, category, reading_time, body_md, published_at
       FROM articles
      WHERE status = 'published'
      ORDER BY published_at DESC, id DESC`
  );

  const categories = Array.from(new Set(rows.map((r) => r.category).filter(Boolean)));

  return (
    <div className="wrap" style={{ paddingTop: 120, paddingBottom: 110, minHeight: "70vh" }}>
      <p className="eyebrow">閱讀 ─ LIBRARY</p>
      <h1 style={{ marginTop: 16, fontSize: "clamp(30px,4.6vw,48px)" }}>理解，是保養的開始</h1>
      <p className="lead" style={{ marginTop: 22 }}>
        這裡是純粹的知識分享——日常保健、趨勢觀察與生活風格。不推銷任何商品。
      </p>

      {rows.length === 0 ? (
        <p style={{ marginTop: 50, color: "var(--mute)", fontSize: "1.02rem", lineHeight: 1.55 }}>
          文章正在準備中。
          <br />
          <Link href="/products" className="lnk-dark" style={{ marginTop: 18, display: "inline-block" }}>
            先看看全部商品
          </Link>
        </p>
      ) : (
        <>
          {categories.length > 1 && (
            <p style={{ marginTop: 34, display: "flex", gap: 20, flexWrap: "wrap", fontSize: ".92rem", color: "var(--mute)", fontWeight: 700 }}>
              {categories.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          )}

          <div style={{ marginTop: 42 }}>
            {rows.map((r) => (
              <article key={r.slug} style={{ padding: "30px 0", borderTop: "1px solid var(--line)" }}>
                <p className="en" style={{ marginBottom: 10 }}>{r.category}</p>
                <h2 style={{ fontSize: "clamp(20px,2.6vw,28px)", fontWeight: 700, lineHeight: 1.5 }}>
                  <Link href={`/read/${r.slug}`}>{r.title}</Link>
                </h2>
                <p style={{ marginTop: 12, color: "var(--soft)", fontSize: "1.02rem", lineHeight: 1.55, maxWidth: 700 }}>
                  {r.description || excerpt(r.body_md)}
                </p>
                <p style={{ marginTop: 12, fontSize: ".82rem", letterSpacing: ".12em", color: "var(--mute)", fontWeight: 700 }}>
                  {r.published_at ? r.published_at.slice(0, 10) : ""}
                  {r.reading_time ? `　·　閱讀 ${r.reading_time}` : ""}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
