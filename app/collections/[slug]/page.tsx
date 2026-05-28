import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "../../components/FadeIn";
import ProductCard from "../../components/ProductCard";
import { collections, getCollection } from "../../lib/catalog";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return { title: "系列｜MAPOROO" };
  return {
    title: `${c.name} ${c.en}｜MAPOROO`,
    description: c.description
  };
}

export default async function CollectionPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const others = collections.filter((c) => c.slug !== slug);

  return (
    <>
      {/* breadcrumb + header */}
      <section className="tile-gold paper-grain border-b border-gold/15">
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <FadeIn>
            <nav className="text-xs uppercase tracking-widest2 text-ink-mute mb-8">
              <Link href="/" className="hover:text-gold-deep transition-colors">首頁</Link>
              <span className="mx-2">/</span>
              <Link href="/collections" className="hover:text-gold-deep transition-colors">系列</Link>
              <span className="mx-2">/</span>
              <span className="text-gold-deep">{collection.name}</span>
            </nav>
            <p className="eyebrow">{collection.en}</p>
            <h1 className="mt-4 font-serif-mix text-4xl md:text-6xl text-ink leading-tight">{collection.name}</h1>
            <p className="mt-6 max-w-2xl text-ink-soft leading-loose tracking-wider">{collection.description}</p>
          </FadeIn>
        </div>
      </section>

      {/* product grid */}
      <section className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {collection.products.map((p, i) => (
            <FadeIn key={p.slug} delay={i * 0.07}>
              <ProductCard product={p} collectionSlug={collection.slug} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* explore other collections */}
      <section className="bg-champagne-300/70 border-t border-gold/15">
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-20">
          <FadeIn>
            <p className="eyebrow mb-10">繼續逛逛</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {others.map((c, i) => (
              <FadeIn key={c.slug} delay={i * 0.06}>
                <Link href={`/collections/${c.slug}`} className="group block">
                  <div className={`relative aspect-square ${i % 2 ? "tile-gold-deep" : "tile-gold"} ring-1 ring-gold/15 flex items-center justify-center`}>
                    <h3 className="font-serif-mix text-2xl text-ink group-hover:text-gold-deep transition-colors">{c.name}</h3>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
