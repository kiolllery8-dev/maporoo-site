import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "../../components/Reveal";
import ProductCard from "../../components/ProductCard";
import { products, getProduct, getCollection, productsByCollection } from "../../lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "商品｜MAPOROO" };
  return {
    title: `${p.name} ${p.en}｜MAPOROO`,
    description: p.tagline
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const col = getCollection(p.collection);
  const related = [
    ...productsByCollection(p.collection).filter((x) => x.slug !== p.slug),
    ...products.filter((x) => x.collection !== p.collection)
  ].slice(0, 4);

  return (
    <>
      {/* breadcrumb */}
      <div className="wrap" style={{ paddingTop: 96, paddingBottom: 8 }}>
        <nav className="en" style={{ color: "var(--mute)" }}>
          <Link href="/" className="hover:text-[var(--ink)]">首頁</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <Link href="/products" className="hover:text-[var(--ink)]">商品</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <Link href={`/products#${p.collection}`} className="hover:text-[var(--ink)]">{col?.zh}</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <span style={{ color: "var(--accent)" }}>{p.name}</span>
        </nav>
      </div>

      {/* product head — image + info */}
      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 84 }}>
        <div className="grid g2" style={{ gap: 56, alignItems: "start" }}>
          <div className="ph" style={{ aspectRatio: "1/1", position: "sticky", top: 96 }}>
            <span>{p.en.toUpperCase()}</span>
          </div>
          <div>
            <p className="eyebrow">{col?.zh} ─ {col?.en}</p>
            <h1 style={{ marginTop: 16, fontSize: "clamp(30px,4.4vw,46px)" }}>{p.name}</h1>
            <p className="en" style={{ marginTop: 10 }}>{p.en} ─ {p.size}</p>
            <p style={{ marginTop: 22, color: "var(--soft)", fontSize: "1.1rem", lineHeight: 2, maxWidth: 460 }}>{p.tagline}</p>

            <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>NT$ {p.price.toLocaleString()}</span>
              <span className="en" style={{ border: "1px solid var(--line)", padding: "8px 16px", color: "var(--soft)" }}>{p.size}</span>
            </div>
            <button
              type="button"
              style={{ marginTop: 22, background: "var(--ink)", color: "#fff", border: "none", padding: "15px 34px", fontSize: ".95rem", fontWeight: 700, letterSpacing: ".12em", cursor: "pointer", fontFamily: "inherit" }}
            >
              加入購物車
            </button>

            <p style={{ marginTop: 32, color: "var(--soft)", fontSize: "1.05rem", lineHeight: 2 }}>{p.about}</p>

            <div style={{ marginTop: 26, fontSize: "1rem", color: "var(--soft)", fontWeight: 500 }}>
              <p style={{ padding: "11px 0", borderTop: "1px solid var(--line)" }}><span className="en" style={{ display: "inline-block", width: 92 }}>容量</span>{p.size}</p>
              <p style={{ padding: "11px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}><span className="en" style={{ display: "inline-block", width: 92 }}>適合</span>{p.suits}</p>
            </div>
          </div>
        </div>
      </section>

      {/* key ingredients */}
      <section className="pad" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <p className="eyebrow rv">關鍵成分 ─ KEY INGREDIENTS</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 40 }}>配方裡的關鍵</h2>
          <div className="grid g3">
            {p.keyIngredients.map((k) => (
              <div key={k.name} className="rv ing">
                <h3 style={{ fontSize: "1.6rem", fontWeight: 900 }}>{k.name}</h3>
                <p style={{ marginTop: 12, color: "var(--soft)", fontSize: ".98rem", lineHeight: 1.9 }}>{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how to use + suits/ingredients */}
      <section className="pad-lg">
        <div className="wrap">
          <div className="grid g2" style={{ gap: 56, alignItems: "start" }}>
            <div className="rv">
              <p className="eyebrow">使用方式 ─ HOW TO USE</p>
              <ol className="steps" style={{ marginTop: 18 }}>
                {p.howToUse.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
            <div className="rv">
              <p className="eyebrow">全成分 ─ INGREDIENTS</p>
              <p style={{ marginTop: 18, color: "var(--soft)", fontSize: ".95rem", lineHeight: 2, paddingTop: 15, borderTop: "1px solid var(--line)" }}>
                {p.fullIngredients}
              </p>
              <p className="en" style={{ marginTop: 22 }}>適合</p>
              <p style={{ marginTop: 8, color: "var(--soft)", fontSize: "1rem" }}>{p.suits}</p>
            </div>
          </div>
        </div>
      </section>

      {/* pairs well with */}
      <section className="pad" style={{ background: "var(--paper2)", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <p className="eyebrow rv">搭配使用 ─ PAIRS WELL WITH</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 40 }}>相得益彰</h2>
          <div className="grid g4">
            {related.map((r) => <ProductCard key={r.slug} product={r} />)}
          </div>
        </div>
      </section>

      {/* quote */}
      <section className="pad-lg">
        <div className="wrap-narrow">
          <p className="rv" style={{ fontSize: "clamp(22px,3.4vw,34px)", fontWeight: 900, lineHeight: 1.55 }}>
            有效的成分，<br />值得溫和的對待。
          </p>
          <div className="rv" style={{ marginTop: 26 }}>
            <Link href="/products" className="lnk-dark">瀏覽全部商品</Link>
          </div>
        </div>
      </section>
      <Reveal />
    </>
  );
}
