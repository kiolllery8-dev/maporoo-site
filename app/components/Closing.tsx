"use client";

import FadeIn from "./FadeIn";

export default function Closing() {
  return (
    <section className="relative py-32 md:py-48 px-6">
      <div className="max-w-2xl ml-auto mr-[6%] md:mr-[12%] text-center space-y-10">
        <FadeIn>
          <p className="text-xs tracking-widest2 uppercase text-tea-deep">
            Epilogue · 結語
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="font-serif font-medium text-2xl md:text-3xl leading-[2] text-ink">
            願你深深&nbsp;吸一口氣<br />
            從每一滴植翠精華裡，<br />
            <span className="text-tea-deep">感受大自然的&nbsp;能量</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex justify-center pt-4">
            <span className="divider-line-h" />
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <p className="font-serif-mix italic text-ink-soft text-lg tracking-wider">
            BrezNu&nbsp;&nbsp;碧森妮
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
