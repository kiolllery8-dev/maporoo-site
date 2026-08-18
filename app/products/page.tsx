import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import { BreadcrumbLd, ItemListLd } from "../components/JsonLd";
import { shopCollections, shopConcerns, shopIngredientPages } from "../lib/taxonomy";
import { shopProducts, shopByCollection } from "../lib/shop";
import { loadContent, richText, text } from "../lib/content";
import Rich from "../components/Rich";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "全部商品｜MAPOROO",
  description:
    "MAPOROO 全系列 14 件商品——臉部保養、頭皮髮絲與沐浴香氛。以 PDRN、玻尿酸、胜肽與泛醇 B5 等成分於澳洲配製。",
  alternates: { canonical: "/products" },
};

export default function ProductsIndex() {
  const c = loadContent();
  const t = (k: string) => text(c, k);
  const total = shopProducts().length;

  return (
    <>
      <ItemListLd items={shopProducts()} name="MAPOROO 全部商品" />
      <BreadcrumbLd
        trail={[
          { name: "首頁", url: "/" },
          { name: "全部商品", url: "/products" },
        ]}
      />

      <section className="pad" style={{ background: "var(--paper2)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <p className="eyebrow rv">{t("products.eyebrow")}</p>
          <h1 className="rv" style={{ marginTop: 16 }}>{t("products.heading")}</h1>
          <Rich
            className="lead rv"
            html={richText(c, "products.lead").replace(/\{n\}/g, String(total))}
          />

          {/* taxonomy entry points */}
          <div className="rv" style={{ marginTop: 34 }}>
            <p className="en" style={{ marginBottom: 12 }}>{t("products.by_concern")}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {shopConcerns().map((c) => (
                <Link
                  key={c.slug}
                  href={`/concerns/${c.slug}`}
                  style={{ border: "1px solid var(--line)", padding: "9px 16px", fontSize: ".9rem", color: "var(--soft)", background: "var(--paper)" }}
                >
                  {c.zh}
                </Link>
              ))}
            </div>
            <p className="en" style={{ margin: "24px 0 12px" }}>{t("products.by_ingredient")}</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {shopIngredientPages().map((i) => (
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
        {shopCollections().map((c, ci) => {
          const list = shopByCollection(c.slug);
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
