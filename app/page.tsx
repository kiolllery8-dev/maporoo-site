import Link from "next/link";
import Hero from "./components/Hero";
import Newsletter from "./components/Newsletter";
import ProductCard from "./components/ProductCard";
import FadeIn from "./components/FadeIn";
import { collections, journal, getCollection } from "./lib/catalog";

export default function Home() {
  const plush = getCollection("plush")!;
  const featured = plush.products[0];
  const pairs = [
    collections[0].products[1],
    collections[2].products[1],
    collections[1].products[0],
    collections[3].products[1]
  ];

  return (
    <>
      <Hero />

      {/* ── Featured product spotlight ───────────────────────────── */}
      <section className="max-w-8xl mx-auto px-6 md:px-10 py-24 md:py-36">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeIn>
            <div className="relative aspect-[4/5] tile-gold ring-1 ring-gold/15">
              <img
                src="/images/maporoo-logo.webp"
                alt="經典袋鼠 ROO"
                className="absolute inset-0 m-auto h-28 w-auto opacity-30"
                draggable={false}
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="max-w-md">
              <p className="eyebrow">本月主打</p>
              <h2 className="mt-5 font-serif-mix text-3xl md:text-5xl text-ink leading-tight">{featured.name}</h2>
              <p className="mt-2 text-sm uppercase tracking-widest2 text-gold-deep">{featured.en}</p>
              <p className="mt-6 text-ink-soft leading-loose tracking-wider">{featured.blurb}</p>
              <p className="mt-6 text-ink-soft">NT$ {featured.price.toLocaleString()}</p>
              <div className="mt-8">
                <Link
                  href="/collections/plush"
                  className="inline-flex items-center px-7 py-3 bg-ink text-champagne-100 text-sm tracking-widest2 uppercase hover:bg-gold-deep transition-colors"
                >
                  查看系列
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Pairs well (cross-sell grid) ─────────────────────────── */}
      <section className="bg-champagne-300/70">
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="eyebrow">成對更暖</p>
                <h2 className="mt-4 font-serif-mix text-2xl md:text-4xl text-ink">相得益彰的搭配</h2>
              </div>
              <Link href="/collections" className="hidden md:inline text-sm tracking-widest2 uppercase text-ink-soft link-underline">
                查看全部
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pairs.map((p, i) => {
              const col = collections.find((c) => c.products.includes(p))!;
              return (
                <FadeIn key={p.slug} delay={i * 0.08}>
                  <ProductCard product={p} collectionSlug={col.slug} />
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Collection showcase ──────────────────────────────────── */}
      <section className="max-w-8xl mx-auto px-6 md:px-10 py-24 md:py-36">
        <FadeIn>
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="eyebrow">探索系列</p>
            <h2 className="mt-5 font-serif-mix text-3xl md:text-5xl text-ink leading-tight">五個關於溫柔的角落</h2>
            <p className="mt-5 text-ink-soft leading-loose tracking-wider">
              從可以抱著入睡的玩偶，到隨身帶著的童心。每一個系列，都是 MAPOROO 想替你接住的一種日常。
            </p>
          </div>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collections.map((c, i) => (
            <FadeIn key={c.slug} delay={i * 0.07}>
              <Link href={`/collections/${c.slug}`} className="group block">
                <div className={`relative aspect-[3/2] overflow-hidden ${i % 2 ? "tile-gold-deep" : "tile-gold"} ring-1 ring-gold/15`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h3 className="font-serif-mix text-2xl md:text-3xl text-ink group-hover:text-gold-deep transition-colors">{c.name}</h3>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-widest2 text-gold-deep">{c.en}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-ink-soft leading-relaxed tracking-wider">{c.tagline}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Gift finder CTA ──────────────────────────────────────── */}
      <section className="bg-ink text-champagne-100">
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="max-w-md">
              <p className="eyebrow !text-gold-light">禮物指南</p>
              <h2 className="mt-5 font-serif-mix text-3xl md:text-5xl leading-tight">不知道送什麼？<br />讓我們陪你想</h2>
              <p className="mt-6 text-champagne-200/80 leading-loose tracking-wider">
                告訴我們你想對誰、想說什麼樣的話，MAPOROO 會替你找出一份剛剛好的禮物。
              </p>
              <div className="mt-9">
                <Link
                  href="/gift-finder"
                  className="inline-flex items-center px-7 py-3 bg-champagne-100 text-ink text-sm tracking-widest2 uppercase hover:bg-gold-light transition-colors"
                >
                  開始找禮物
                </Link>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="flex justify-center">
              <img src="/images/maporoo-logo.gif" alt="" aria-hidden className="w-[55vw] max-w-[300px] h-auto opacity-95" draggable={false} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Journal (Read) 3-up ──────────────────────────────────── */}
      <section className="max-w-8xl mx-auto px-6 md:px-10 py-24 md:py-36">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow">MAPOROO 誌</p>
              <h2 className="mt-4 font-serif-mix text-2xl md:text-4xl text-ink">推薦閱讀</h2>
            </div>
            <Link href="/journal" className="hidden md:inline text-sm tracking-widest2 uppercase text-ink-soft link-underline">
              全部文章
            </Link>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {journal.map((j, i) => (
            <FadeIn key={j.slug} delay={i * 0.1}>
              <Link href="/journal" className="group block">
                <div className={`relative aspect-[3/2] ${i === 1 ? "tile-gold-deep" : "tile-gold"} ring-1 ring-gold/15`} />
                <p className="mt-5 eyebrow">{j.kicker}</p>
                <h3 className="mt-3 font-serif-mix text-2xl text-ink group-hover:text-gold-deep transition-colors leading-snug">{j.title}</h3>
                <p className="mt-3 text-sm text-ink-mute leading-relaxed line-clamp-2">{j.excerpt}</p>
                <p className="mt-3 text-xs uppercase tracking-widest2 text-gold-deep">閱讀 · {j.read}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Signature quote ──────────────────────────────────────── */}
      <section className="bg-champagne-400/50 paper-grain">
        <div className="max-w-4xl mx-auto px-6 py-28 md:py-40 text-center">
          <FadeIn>
            <p className="font-serif-mix italic text-2xl md:text-4xl text-ink leading-[1.7]">
              「一個被好好抱過的人，<br />最有力氣，再回頭抱抱別人。」
            </p>
            <div className="mt-10 flex justify-center">
              <span className="w-16 rule-h" />
            </div>
            <p className="mt-6 text-sm uppercase tracking-widest3 text-gold-deep">MAPOROO</p>
          </FadeIn>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
