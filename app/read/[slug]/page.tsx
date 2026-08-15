import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { all, get } from "../../lib/db";
import { DISCLAIMER_TEXT } from "../../lib/article-guard";
import { renderMarkdown } from "../../lib/markdown";
import { SITE } from "../../lib/site";

export const revalidate = 300;

type Article = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  reading_time: string;
  body_md: string;
  sources_json: string;
  disclaimer: number;
  published_at: string | null;
};

function load(slug: string) {
  return get<Article>(
    `SELECT id, slug, title, description, category, reading_time, body_md,
            sources_json, disclaimer, published_at
       FROM articles WHERE slug = ? AND status = 'published'`,
    slug
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = load(slug);
  if (!a) return { title: "找不到這篇文章｜MAPOROO" };

  return {
    title: `${a.title}｜MAPOROO`,
    description: a.description,
    alternates: { canonical: `/read/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.description,
      type: "article",
      url: `/read/${a.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = load(slug);
  if (!a) notFound();

  let sources: string[] = [];
  try {
    const parsed = JSON.parse(a.sources_json || "[]");
    if (Array.isArray(parsed)) sources = parsed.map(String);
  } catch {
    sources = [];
  }

  const more = all<{ slug: string; title: string; category: string }>(
    `SELECT slug, title, category FROM articles
      WHERE status = 'published' AND id <> ?
      ORDER BY published_at DESC LIMIT 3`,
    a.id
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.published_at ?? undefined,
    articleSection: a.category,
    author: { "@type": "Organization", name: "MAPOROO" },
    publisher: { "@type": "Organization", name: "MAPOROO" },
    mainEntityOfPage: `${SITE.url}/read/${a.slug}`,
  };

  return (
    <article className="wrap-narrow" style={{ paddingTop: 120, paddingBottom: 110 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="eyebrow">{a.category}</p>
      <h1 style={{ marginTop: 16, fontSize: "clamp(28px,4.2vw,44px)", lineHeight: 1.35 }}>{a.title}</h1>
      <p style={{ marginTop: 16, fontSize: ".82rem", letterSpacing: ".12em", color: "var(--mute)", fontWeight: 700 }}>
        {a.published_at ? a.published_at.slice(0, 10) : ""}
        {a.reading_time ? `　·　閱讀 ${a.reading_time}` : ""}
      </p>

      <div
        className="article-body"
        style={{ marginTop: 44 }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(a.body_md) }}
      />

      {a.disclaimer === 1 && (
        <p
          style={{ marginTop: 44, padding: "16px 18px", background: "var(--paper2)", color: "var(--soft)", fontSize: ".93rem", lineHeight: 1.5 }}
        >
          {DISCLAIMER_TEXT}
        </p>
      )}

      {sources.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>出處</p>
          <ul className="clean">
            {sources.map((s, i) => (
              <li key={i} style={{ color: "var(--soft)", fontSize: ".93rem", lineHeight: 1.5 }}>
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 文末只有延伸閱讀。不放商品、不放訂閱表單——
          零商品置入是老闆 2026-08-05 拍板的規則。 */}
      {more.length > 0 && (
        <section style={{ marginTop: 54, paddingTop: 30, borderTop: "1px solid var(--line)" }}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>延伸閱讀</p>
          {more.map((m) => (
            <p key={m.slug} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
              <Link href={`/read/${m.slug}`} style={{ fontWeight: 700, fontSize: "1.02rem" }}>
                {m.title}
              </Link>
              <br />
              <span style={{ fontSize: ".84rem", color: "var(--mute)" }}>{m.category}</span>
            </p>
          ))}
        </section>
      )}

      <p style={{ marginTop: 44 }}>
        <Link href="/read" className="lnk-dark">回到全部文章</Link>
      </p>
    </article>
  );
}
