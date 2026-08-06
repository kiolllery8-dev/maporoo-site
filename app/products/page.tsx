import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import { BreadcrumbLd, ItemListLd } from "../components/JsonLd";
import { collections, concerns, ingredientPages, products, productsByCollection } from "../lib/catalog";

export const metadata: Metadata = {
  title: "全部商品｜MAPOROO",
  description:
    "MAPOROO 全系列 14 件商品——臉部保養、頭皮髮絲與沐浴香氛。以 PDRN、玻尿酸、胜肽與泛醇 B5 等成分於澳洲配製。",
  alternates: { canonical: "/products" },
};

export default function ProductsIndex() {
  return (
    <>
      <ItemListLd items={products} name="MAPOROO 全部商品" />
      <BreadcrumbLd
        trail={[
          { name: "首頁", url: "/" },
          { name: "全部商品", url: "/products" },
        ]}
      />

      <section className="pad" style={{ background: "var(--paper2)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <p className="eyebrow rv">ALL PRODUCTS</p>
          <h1 className="rv" style={{ marginTop: 16 }}>全部商品</h1>
          <p className="lead rv" style={{ marginTop: 22 }}>
            MAPOROO 全系列共 {products.length} 件，分為三個品類。你也可以從肌膚需求或成分出發，找到適合現在的自己那一支。
          </p>

          {/* taxonomy entry points */}
          <div className="rv" style={{ marginTop: 34 }}>
            <p className="en" style={{ marginBottom: 12 }}>依肌膚需求</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {concerns.map((c) => (
                <Link
                  key={c.slug}
                  href={`/concerns/${c.slug}`}
                  style={{ border: "1px solid var(--line)", padding: "9px 16px", fontSize: ".9rem", color: "var(--soft)", background: "var(--paper)" }}
                >
                  {c.zh}
                </Link>
              ))}
            </div>
            <p className="en" style={{ margin: "24px 0 12px" }}>依成分</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {ingredientPages.map((i) => (
                <Link
                  key={i.slug}
                  href={`/ingredients/${i.slug}`}
                  style={{ border: "1px solid var(--line)", padding: "9px 16px", fontSize: ".9rem", color: "var(--soft)", background: "var(--paper)" }}
                >
                  {i.zh}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="wrap" style={{ padding: "84px 30px 100px" }}>
        {collections.map((c, ci) => {
          const list = productsByCollection(c.slug);
          return (
            <section key={c.slug} id={c.slug} style={{ scrollMarginTop: 96, marginTop: ci === 0 ? 0 : 80 }}>
              <div
                className="rv"
                style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap", paddingBottom: 24, borderBottom: "1px solid var(--line)" }}
              >
                <h2 style={{ fontSize: "2rem", fontWeight: 900 }}>
                  <Link href={`/collections/${c.slug}`}>{c.zh}</Link>
                </h2>
                <span className="en">{c.en}</span>
                <p style={{ color: "var(--soft)", fontSize: ".98rem", flex: 1, minWidth: 240 }}>{c.d}</p>
                <Link href={`/collections/${c.slug}`} className="lnk-dark">看全部 {list.length} 件</Link>
              </div>
              <div className="grid g4" style={{ marginTop: 38 }}>
                {list.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <Reveal />
    </>
  );
}
