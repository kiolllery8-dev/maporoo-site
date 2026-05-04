"use client";

import FadeIn from "./FadeIn";

export default function ChapterName() {
  return (
    <section className="relative py-24 md:py-56 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-8 md:space-y-12">
        <FadeIn>
          <p className="text-xs tracking-widest2 uppercase text-tea-deep">
            The Name · 品牌名
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="font-en italic text-tea-deep text-5xl md:text-8xl tracking-wider">
            BrezNu
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="flex justify-center">
            <span className="divider-line-h" />
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <h2 className="font-serif font-medium text-xl md:text-3xl leading-[2] text-ink">
            取意為——<br />
            <span className="text-tea-deep">「呼吸清新的空氣，是生命的泉源」</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.65}>
          <p className="font-serif text-ink-soft leading-loose tracking-wider max-w-xl mx-auto">
            我們的經營理念為&nbsp;重視產品品質，<br />
            以&nbsp;誠信至高&nbsp;為第一原則，<br />
            提供專業諮詢服務，推出專業課程，致力推廣芳香療法。
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
