import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import { collections } from "../lib/catalog";

export const metadata: Metadata = {
  title: "全部系列｜MAPOROO",
  description: "玩偶、文具、居家、配件與禮盒——探索 MAPOROO 五個關於溫柔的系列。"
};

export default function CollectionsIndex() {
  return (
    <>
      {/* page header */}
      <section className="tile-gold paper-grain border-b border-gold/15">
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
          <FadeIn>
            <p className="eyebrow">全部系列</p>
            <h1 className="mt-5 font-serif-mix text-4xl md:text-6xl text-ink leading-tight">探索 MAPOROO</h1>
            <p className="mt-6 max-w-xl mx-auto text-ink-soft leading-loose tracking-wider">
              五個系列，五種把童心與溫柔留在身邊的方式。慢慢看，挑一個剛好接住此刻的你。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* collections list */}
      <div className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28 space-y-24 md:space-y-32">
        {collections.map((c, i) => (
          <section key={c.slug} id={c.slug} className="scroll-mt-28">
            <FadeIn>
              <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 ? "md:[direction:rtl]" : ""}`}>
                <Link href={`/collections/${c.slug}`} className="group block md:[direction:ltr]">
                  <div className={`relative aspect-[4/3] overflow-hidden ${i % 2 ? "tile-gold-deep" : "tile-gold"} ring-1 ring-gold/15`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h2 className="font-serif-mix text-4xl md:text-5xl text-ink group-hover:text-gold-deep transition-colors">{c.name}</h2>
                      <p className="mt-2 text-[0.7rem] uppercase tracking-widest2 text-gold-deep">{c.en}</p>
                    </div>
                  </div>
                </Link>
                <div className="md:[direction:ltr] max-w-md">
                  <p className="eyebrow">{c.en}</p>
                  <h2 className="mt-4 font-serif-mix text-3xl md:text-4xl text-ink">{c.tagline}</h2>
                  <p className="mt-5 text-ink-soft leading-loose tracking-wider">{c.description}</p>
                  <div className="mt-7">
                    <Link href={`/collections/${c.slug}`} className="text-sm tracking-widest2 uppercase text-ink-soft link-underline">
                      查看 {c.products.length} 件作品
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>
        ))}
      </div>
    </>
  );
}
