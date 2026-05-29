import type { Metadata } from "next";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import { collections, productsByCollection } from "../lib/catalog";

export const metadata: Metadata = {
  title: "全部商品｜MAPOROO",
  description: "MAPOROO 全系列保養品——修復、亮白、保濕、香氛與頭皮。以醫學實證的成分配製，適合各種膚況。"
};

export default function ProductsIndex() {
  return (
    <>
      {/* header */}
      <section className="pad" style={{ background: "var(--paper2)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <p className="eyebrow rv">ALL PRODUCTS</p>
          <h1 className="rv" style={{ marginTop: 16 }}>全部商品</h1>
          <p className="lead rv" style={{ marginTop: 22 }}>
            以醫學實證的成分配製的日常保養。依系列瀏覽，或從你的肌膚需求出發。
          </p>
        </div>
      </section>

      {/* products grouped by collection */}
      <div className="wrap" style={{ padding: "84px 30px 100px" }}>
        {collections.map((c, ci) => (
          <section key={c.slug} id={c.slug} style={{ scrollMarginTop: 96, marginTop: ci === 0 ? 0 : 80 }}>
            <div className="rv" style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap", paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 900 }}>{c.zh}</h2>
              <span className="en">{c.en}</span>
              <p style={{ color: "var(--soft)", fontSize: ".98rem", flex: 1, minWidth: 240 }}>{c.d}</p>
            </div>
            <div className="grid g4" style={{ marginTop: 38 }}>
              {productsByCollection(c.slug).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <Reveal />
    </>
  );
}
