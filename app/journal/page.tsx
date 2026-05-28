import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "../components/FadeIn";
import { journal } from "../lib/catalog";

export const metadata: Metadata = {
  title: "MAPOROO 誌｜品牌、設計與生活的事",
  description: "關於童心、陪伴與溫柔設計的短篇閱讀。"
};

export default function JournalIndex() {
  const [lead, ...rest] = journal;
  return (
    <>
      <section className="tile-gold paper-grain border-b border-gold/15">
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <FadeIn>
            <p className="eyebrow">MAPOROO 誌</p>
            <h1 className="mt-5 font-serif-mix text-4xl md:text-6xl text-ink leading-tight">慢慢讀，慢慢暖</h1>
            <p className="mt-6 max-w-xl text-ink-soft leading-loose tracking-wider">
              關於品牌、設計與生活的短篇——那些我們在做每一件小東西時，心裡想的事。
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28">
        {/* lead article */}
        <FadeIn>
          <Link href="/journal" className="group grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-20 md:mb-28">
            <div className="relative aspect-[4/3] tile-gold-deep ring-1 ring-gold/15" />
            <div>
              <p className="eyebrow">{lead.kicker}</p>
              <h2 className="mt-4 font-serif-mix text-3xl md:text-5xl text-ink group-hover:text-gold-deep transition-colors leading-tight">{lead.title}</h2>
              <p className="mt-5 text-ink-soft leading-loose tracking-wider">{lead.excerpt}</p>
              <p className="mt-5 text-xs uppercase tracking-widest2 text-gold-deep">閱讀 · {lead.read}</p>
            </div>
          </Link>
        </FadeIn>

        <div className="rule-h mb-20 md:mb-24" />

        {/* rest */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {rest.map((j, i) => (
            <FadeIn key={j.slug} delay={i * 0.1}>
              <Link href="/journal" className="group block">
                <div className={`relative aspect-[3/2] ${i % 2 ? "tile-gold" : "tile-gold-deep"} ring-1 ring-gold/15`} />
                <p className="mt-5 eyebrow">{j.kicker}</p>
                <h3 className="mt-3 font-serif-mix text-2xl md:text-3xl text-ink group-hover:text-gold-deep transition-colors leading-snug">{j.title}</h3>
                <p className="mt-3 text-ink-mute leading-relaxed">{j.excerpt}</p>
                <p className="mt-3 text-xs uppercase tracking-widest2 text-gold-deep">閱讀 · {j.read}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
