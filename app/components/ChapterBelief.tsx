"use client";

import FadeIn from "./FadeIn";

export default function ChapterBelief() {
  return (
    <section id="belief" className="relative py-40 md:py-56 px-6 paper-grain">
      <div className="max-w-3xl mx-auto space-y-14">
        <FadeIn>
          <p className="text-xs tracking-widest2 uppercase text-tea-deep text-center">
            Our Belief · 信念
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="font-serif font-light text-3xl md:text-5xl leading-[1.5] text-ink text-center">
            我們的信念&nbsp;<span className="text-tea-deep">很簡單</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="flex justify-center">
            <span className="divider-line" />
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <blockquote className="font-serif text-2xl md:text-3xl text-ink leading-[2] text-center tracking-wider">
            「&nbsp;只想發展&nbsp;<span className="text-tea-deep">天然品</span>&nbsp;」
          </blockquote>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="space-y-6 text-ink-soft leading-loose tracking-wider max-w-2xl mx-auto pt-6">
            <p>
              一路走來，堅持研發無毒、無害的天然產品，想為社會做出一點貢獻，想替地球盡一份心力。
            </p>
            <p>
              雖然這條路走來艱辛，但鴻元生技的創辦人及現任總經理，仍堅持這個理念直到如今——
            </p>
            <p className="font-serif text-ink">
              這是&nbsp;對天然植物偏執的熱愛，<br />
              是&nbsp;對農林業者由衷的尊重。
            </p>
            <p>
              希望消費者能感受到天然產品業者的用心，讓天然植物的資源能有效被利用，進而達到人體及環境整體的幫助——
            </p>
            <p className="text-ink italic font-serif">
              這些理念堅持，就是發展事業的&nbsp;初衷。
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
