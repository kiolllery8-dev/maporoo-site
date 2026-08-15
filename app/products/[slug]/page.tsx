import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "../../components/Reveal";
import ProductCard from "../../components/ProductCard";
import Gallery from "../../components/Gallery";
import AddToCart from "../../components/AddToCart";
import { BreadcrumbLd, FaqLd, ProductLd } from "../../components/JsonLd";
import {
  products,
  getProduct,
  getCollection,
  getConcern,
  getIngredientPage,
  productsByCollection,
  imagesFor,
} from "../../lib/catalog";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "找不到商品｜MAPOROO" };

  const title = `${p.name}｜MAPOROO`;
  const description = `${p.tagline}${p.suits ? `適合：${p.suits}。` : ""}容量 ${p.size}，NT$${p.price.toLocaleString()}。`;
  const images = imagesFor(p);

  return {
    title,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/products/${p.slug}`,
      images: images.length ? [{ url: images[0], alt: p.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const col = getCollection(p.collection);
  const images = imagesFor(p);
  const related = productsByCollection(p.collection)
    .filter((x) => x.slug !== p.slug)
    .slice(0, 4);
  const off = p.listPrice && p.listPrice > p.price;

  return (
    <>
      <ProductLd product={p} />
      <FaqLd faq={p.faq} />
      <BreadcrumbLd
        trail={[
          { name: "首頁", url: "/" },
          { name: "全部商品", url: "/products" },
          { name: col?.zh ?? "商品", url: `/collections/${p.collection}` },
          { name: p.name, url: `/products/${p.slug}` },
        ]}
      />

      {/* breadcrumb */}
      <div className="wrap" style={{ paddingTop: 96, paddingBottom: 8 }}>
        <nav aria-label="麵包屑" className="en" style={{ color: "var(--mute)" }}>
          <Link href="/">首頁</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <Link href="/products">全部商品</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <Link href={`/collections/${p.collection}`}>{col?.zh}</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <span style={{ color: "var(--accent)" }}>{p.name}</span>
        </nav>
      </div>

      {/* head */}
      <section className="wrap" style={{ paddingTop: 24, paddingBottom: 84 }}>
        <div className="grid g2" style={{ gap: 56, alignItems: "start" }}>
          <Gallery images={images} alt={p.name} />

          <div>
            <p className="eyebrow">
              {col?.zh} ─ {col?.en}
            </p>
            <h1 style={{ marginTop: 16, fontSize: "clamp(28px,4vw,42px)" }}>{p.name}</h1>
            <p className="en" style={{ marginTop: 10 }}>
              {p.en} ─ {p.size} ─ {p.sku}
            </p>
            <p style={{ marginTop: 22, color: "var(--soft)", fontSize: "1.1rem", lineHeight: 1.6, maxWidth: 480 }}>
              {p.tagline}
            </p>

            <div style={{ marginTop: 26, display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 900 }}>NT$ {p.price.toLocaleString()}</span>
              {off && (
                <span style={{ color: "var(--mute)", textDecoration: "line-through", fontSize: "1rem" }}>
                  NT$ {p.listPrice!.toLocaleString()}
                </span>
              )}
            </div>

            <AddToCart slug={p.slug} />

            <p style={{ marginTop: 30, color: "var(--soft)", fontSize: "1.05rem", lineHeight: 1.6 }}>{p.about}</p>

            <div style={{ marginTop: 26, fontSize: "1rem", color: "var(--soft)", fontWeight: 500 }}>
              <p style={{ padding: "11px 0", borderTop: "1px solid var(--line)" }}>
                <span className="en" style={{ display: "inline-block", width: 92 }}>容量</span>
                {p.size}
              </p>
              <p style={{ padding: "11px 0", borderTop: "1px solid var(--line)" }}>
                <span className="en" style={{ display: "inline-block", width: 92 }}>適合</span>
                {p.suits}
              </p>
              {p.origin && (
                <p style={{ padding: "11px 0", borderTop: "1px solid var(--line)" }}>
                  <span className="en" style={{ display: "inline-block", width: 92 }}>產地</span>
                  {p.origin}
                </p>
              )}
              <p style={{ padding: "11px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
                <span className="en" style={{ display: "inline-block", width: 92 }}>商品編號</span>
                {p.sku}
              </p>
            </div>

            {/* concern / ingredient cross-links — the taxonomy that makes the
                catalogue crawlable in more than one direction */}
            {(p.concerns.length > 0 || p.ingredients.length > 0) && (
              <div style={{ marginTop: 26, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {p.concerns.map((c) => {
                  const x = getConcern(c);
                  return x ? (
                    <Link
                      key={c}
                      href={`/concerns/${c}`}
                      style={{ border: "1px solid var(--line)", padding: "7px 14px", fontSize: ".85rem", color: "var(--soft)" }}
                    >
                      {x.zh}
                    </Link>
                  ) : null;
                })}
                {p.ingredients.map((i) => {
                  const x = getIngredientPage(i);
                  return x ? (
                    <Link
                      key={i}
                      href={`/ingredients/${i}`}
                      style={{ border: "1px solid var(--line)", padding: "7px 14px", fontSize: ".85rem", color: "var(--soft)" }}
                    >
                      {x.zh}
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* highlights */}
      {p.highlights.length > 0 && (
        <section className="pad" style={{ background: "var(--paper2)" }}>
          <div className="wrap">
            <p className="eyebrow rv">產品特色 ─ HIGHLIGHTS</p>
            <h2 className="rv" style={{ marginTop: 16, marginBottom: 40 }}>配方裡的關鍵</h2>
            <div className="grid g3">
              {p.highlights.map((k) => (
                <div key={k.t} className="rv ing">
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 900, lineHeight: 1.5 }}>{k.t}</h3>
                  <p style={{ marginTop: 12, color: "var(--soft)", fontSize: ".98rem", lineHeight: 1.5 }}>{k.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* how to use */}
      <section className="pad-lg">
        <div className="wrap">
          <div className="grid g2" style={{ gap: 56, alignItems: "start" }}>
            <div className="rv">
              <p className="eyebrow">使用方式 ─ HOW TO USE</p>
              <ol className="steps" style={{ marginTop: 18 }}>
                {p.howToUse.map((s) => (
                  <li key={s.t}>
                    <strong style={{ color: "var(--ink)", fontWeight: 700 }}>{s.t}</strong>
                    <br />
                    {s.d}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rv">
              {p.note && (
                <>
                  <p className="eyebrow">小提醒 ─ NOTE</p>
                  <p style={{ marginTop: 18, color: "var(--soft)", fontSize: "1rem", lineHeight: 1.6, paddingTop: 15, borderTop: "1px solid var(--line)" }}>
                    {p.note}
                  </p>
                </>
              )}
              {p.caution && (
                <>
                  <p className="eyebrow" style={{ marginTop: p.note ? 34 : 0 }}>注意事項 ─ CAUTION</p>
                  <p style={{ marginTop: 18, color: "var(--soft)", fontSize: ".95rem", lineHeight: 1.6, paddingTop: 15, borderTop: "1px solid var(--line)" }}>
                    {p.caution}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — visible on the page, and mirrored into FAQPage structured data */}
      {p.faq.length > 0 && (
        <section className="pad" style={{ background: "var(--paper2)", borderTop: "1px solid var(--line)" }}>
          <div className="wrap-narrow" style={{ padding: 0 }}>
            <div className="wrap" style={{ padding: 0 }}>
              <p className="eyebrow rv">常見問題 ─ FAQ</p>
              <h2 className="rv" style={{ marginTop: 16, marginBottom: 34 }}>關於這支商品</h2>
              <div>
                {p.faq.map((f) => (
                  <div key={f.q} className="rv" style={{ padding: "22px 0", borderTop: "1px solid var(--line)" }}>
                    <h3 style={{ fontSize: "1.12rem", fontWeight: 700, lineHeight: 1.6 }}>{f.q}</h3>
                    <p style={{ marginTop: 10, color: "var(--soft)", fontSize: "1rem", lineHeight: 1.6 }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* related */}
      {related.length > 0 && (
        <section className="pad">
          <div className="wrap">
            <p className="eyebrow rv">搭配使用 ─ PAIRS WELL WITH</p>
            <h2 className="rv" style={{ marginTop: 16, marginBottom: 40 }}>相得益彰</h2>
            <div className="grid g4">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pad-lg" style={{ background: "var(--paper2)" }}>
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
