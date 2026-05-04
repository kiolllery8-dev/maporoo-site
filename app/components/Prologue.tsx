"use client";

import FadeIn from "./FadeIn";

export default function Prologue() {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-2xl mx-auto text-center space-y-10">
        <FadeIn>
          <p className="text-xs tracking-widest2 uppercase text-tea-deep">
            Prologue · 序
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="font-serif font-medium text-2xl md:text-3xl leading-[2] text-ink">
            一個品牌的誕生&ensp;絕非偶然<br />
            一項產品的開發&ensp;也非一時半刻<br />
            一門事業的經營&ensp;更要兢兢業業
          </h2>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex justify-center pt-6">
            <span className="divider-line" />
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <p className="font-serif text-ink-soft leading-loose tracking-wider">
            這是&nbsp;BrezNu&nbsp;碧森妮&nbsp;走過的六十年。
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
