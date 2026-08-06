import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "../../components/Reveal";
import ProductCard from "../../components/ProductCard";
import { BreadcrumbLd, ItemListLd } from "../../components/JsonLd";
import { collections, getCollection, productsByCollection } from "../../lib/catalog";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return { title: "找不到分類｜MAPOROO" };
  const n = productsByCollection(slug).length;
  const title = `${c.zh} ${c.en}｜MAPOROO`;
  const description = `${c.d}MAPOROO ${c.zh}系列共 ${n} 件商品。`;
  return {
    title,
    description,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title, description, type: "website", url: `/collections/${c.slug}` },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const list = productsByCollection(slug);

  return (
    <>
      <ItemListLd items={list} name={`MAPOROO ${c.zh}`} />
      <BreadcrumbLd
        trail={[
          { name: "首頁", url: "/" },
          { name: "全部商品", url: "/products" },
          { name: c.zh, url: `/collections/${c.slug}` },
        ]}
      />

      <section className="pad" style={{ background: "var(--paper2)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <nav aria-label="麵包屑" className="en" style={{ color: "var(--mute)", marginBottom: 20 }}>
            <Link href="/">首頁</Link>
            <span style={{ margin: "0 10px" }}>/</span>
            <Link href="/products">全部商品</Link>
            <span style={{ margin: "0 10px" }}>/</span>
            <span style={{ color: "var(--accent)" }}>{c.zh}</span>
          </nav>
          <p className="eyebrow rv">{c.en}</p>
          <h1 className="rv" style={{ marginTop: 16 }}>{c.zh}</h1>
          <p className="lead rv" style={{ marginTop: 22 }}>{c.intro}</p>
        </div>
      </section>

      <div className="wrap" style={{ padding: "72px 30px 100px" }}>
        <p className="en rv" style={{ marginBottom: 30 }}>共 {list.length} 件商品</p>
        <div className="grid g4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <div className="rv" style={{ marginTop: 72, paddingTop: 34, borderTop: "1px solid var(--line)" }}>
          <p className="en" style={{ marginBottom: 14 }}>其他品類</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {collections
              .filter((x) => x.slug !== c.slug)
              .map((x) => (
                <Link
                  key={x.slug}
                  href={`/collections/${x.slug}`}
                  style={{ border: "1px solid var(--line)", padding: "9px 16px", fontSize: ".9rem", color: "var(--soft)" }}
                >
                  {x.zh}
                </Link>
              ))}
          </div>
        </div>
      </div>
      <Reveal />
    </>
  );
}
