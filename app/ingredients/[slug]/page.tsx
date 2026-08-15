import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "../../components/Reveal";
import ProductCard from "../../components/ProductCard";
import { BreadcrumbLd, FaqLd } from "../../components/JsonLd";
import { ingredientPages, getIngredientPage, productsByIngredient } from "../../lib/catalog";

export function generateStaticParams() {
  return ingredientPages.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = getIngredientPage(slug);
  if (!i) return { title: "找不到頁面｜MAPOROO" };
  const title = `${i.zh}是什麼？成分解析與保養用途｜MAPOROO`;
  const description = `${i.d}${i.what.slice(0, 80)}…`;
  return {
    title,
    description,
    alternates: { canonical: `/ingredients/${i.slug}` },
    openGraph: { title, description, type: "article", url: `/ingredients/${i.slug}` },
  };
}

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ing = getIngredientPage(slug);
  if (!ing) notFound();
  const list = productsByIngredient(slug);

  return (
    <>
      <FaqLd faq={ing.faq} />
      <BreadcrumbLd
        trail={[
          { name: "首頁", url: "/" },
          { name: "全部商品", url: "/products" },
          { name: ing.zh, url: `/ingredients/${ing.slug}` },
        ]}
      />

      <section className="pad" style={{ background: "var(--paper2)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <nav aria-label="麵包屑" className="en" style={{ color: "var(--mute)", marginBottom: 20 }}>
            <Link href="/">首頁</Link>
            <span style={{ margin: "0 10px" }}>/</span>
            <Link href="/products">全部商品</Link>
            <span style={{ margin: "0 10px" }}>/</span>
            <span style={{ color: "var(--accent)" }}>{ing.zh}</span>
          </nav>
          <p className="eyebrow rv">{ing.en}</p>
          <h1 className="rv" style={{ marginTop: 16 }}>{ing.zh}是什麼？</h1>
          <p className="lead rv" style={{ marginTop: 22 }}>{ing.d}</p>
        </div>
      </section>

      <article className="wrap-narrow" style={{ padding: "72px 30px 40px" }}>
        <section className="rv">
          <h2 style={{ fontSize: "1.7rem", fontWeight: 900 }}>它是什麼</h2>
          <p style={{ marginTop: 16, color: "var(--soft)", fontSize: "1.06rem", lineHeight: 1.6 }}>{ing.what}</p>
        </section>

        <section className="rv" style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: "1.7rem", fontWeight: 900 }}>在保養裡怎麼用</h2>
          <p style={{ marginTop: 16, color: "var(--soft)", fontSize: "1.06rem", lineHeight: 1.6 }}>{ing.how}</p>
        </section>

        <section className="rv" style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: "1.7rem", fontWeight: 900, marginBottom: 12 }}>常見問題</h2>
          {ing.faq.map((f) => (
            <div key={f.q} style={{ padding: "22px 0", borderTop: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.6 }}>{f.q}</h3>
              <p style={{ marginTop: 10, color: "var(--soft)", fontSize: "1rem", lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <p
          className="rv"
          style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--line)", color: "var(--mute)", fontSize: ".9rem", lineHeight: 1.5 }}
        >
          以上為成分知識整理，不是醫療建議。MAPOROO 商品為化粧品，作用於肌膚角質層。個別膚況問題請諮詢皮膚科醫師。
        </p>
      </article>

      {list.length > 0 && (
        <section className="pad" style={{ background: "var(--paper2)", borderTop: "1px solid var(--line)" }}>
          <div className="wrap">
            <p className="eyebrow rv">含有這個成分 ─ FORMULATED WITH</p>
            <h2 className="rv" style={{ marginTop: 16, marginBottom: 40 }}>
              MAPOROO 使用{ing.zh}的商品
            </h2>
            <div className="grid g4">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="wrap" style={{ padding: "60px 30px 90px" }}>
        <p className="en rv" style={{ marginBottom: 14 }}>其他成分</p>
        <div className="rv" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {ingredientPages
            .filter((x) => x.slug !== ing.slug)
            .map((x) => (
              <Link
                key={x.slug}
                href={`/ingredients/${x.slug}`}
                style={{ border: "1px solid var(--line)", padding: "9px 16px", fontSize: ".9rem", color: "var(--soft)" }}
              >
                {x.zh}
              </Link>
            ))}
        </div>
      </div>
      <Reveal />
    </>
  );
}
