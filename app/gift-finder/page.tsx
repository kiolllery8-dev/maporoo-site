"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { giftMoods, allProducts } from "../lib/catalog";

const budgets = [
  { id: "under500", label: "NT$ 500 以下", test: (n: number) => n < 500 },
  { id: "500to1000", label: "NT$ 500 – 1,000", test: (n: number) => n >= 500 && n <= 1000 },
  { id: "1000to2000", label: "NT$ 1,000 – 2,000", test: (n: number) => n > 1000 && n <= 2000 },
  { id: "any", label: "都可以", test: (_: number) => true }
];

export default function GiftFinder() {
  const [mood, setMood] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!mood || !budget) return [];
    const b = budgets.find((x) => x.id === budget)!;
    return allProducts()
      .filter(({ product }) => product.tags.includes(mood) && b.test(product.price))
      .slice(0, 6);
  }, [mood, budget]);

  return (
    <>
      <section className="tile-gold-deep paper-grain border-b border-gold/15">
        <div className="max-w-8xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
          <p className="eyebrow">禮物指南</p>
          <h1 className="mt-5 font-serif-mix text-4xl md:text-6xl text-ink leading-tight">找一份剛好的禮物</h1>
          <p className="mt-6 max-w-xl mx-auto text-ink-soft leading-loose tracking-wider">
            告訴我們你想說什麼樣的話、預算大概多少，MAPOROO 替你挑出幾個剛剛好的選擇。
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        {/* step 1: mood */}
        <div className="mb-16">
          <p className="eyebrow mb-6">一、你想傳達的心意</p>
          <div className="flex flex-wrap gap-3">
            {giftMoods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`px-5 py-2.5 text-sm tracking-wider border transition-colors ${
                  mood === m.id
                    ? "bg-ink text-champagne-100 border-ink"
                    : "bg-transparent text-ink-soft border-gold/40 hover:border-gold-deep hover:text-gold-deep"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* step 2: budget */}
        <div className="mb-16">
          <p className="eyebrow mb-6">二、預算範圍</p>
          <div className="flex flex-wrap gap-3">
            {budgets.map((b) => (
              <button
                key={b.id}
                onClick={() => setBudget(b.id)}
                className={`px-5 py-2.5 text-sm tracking-wider border transition-colors ${
                  budget === b.id
                    ? "bg-ink text-champagne-100 border-ink"
                    : "bg-transparent text-ink-soft border-gold/40 hover:border-gold-deep hover:text-gold-deep"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rule-h mb-12" />

        {/* results */}
        {!mood || !budget ? (
          <p className="text-center text-ink-mute tracking-wider py-10">
            選好上面兩項，我們就開始替你挑禮物 ✦
          </p>
        ) : results.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-ink-soft tracking-wider">這個組合暫時沒有剛好的選擇，</p>
            <p className="text-ink-mute mt-2">試試把預算放寬一點，或換一種心意？</p>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-8 text-center">為你挑了這些</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {results.map(({ product, collection }) => (
                <Link key={product.slug} href={`/collections/${collection.slug}`} className="group block">
                  <div className={`relative aspect-[4/5] ${product.tone === "deep" ? "tile-gold-deep" : "tile-gold"} ring-1 ring-gold/15`}>
                    <img src="/images/maporoo-logo.webp" alt="" aria-hidden className="absolute inset-0 m-auto h-14 w-auto opacity-25" draggable={false} />
                  </div>
                  <h3 className="mt-4 font-serif-mix text-lg text-ink group-hover:text-gold-deep transition-colors">{product.name}</h3>
                  <p className="mt-1 text-sm text-ink-soft">NT$ {product.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
