"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FadeIn from "./FadeIn";

export default function ChapterEra80() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <div className="space-y-8">
          <FadeIn>
            <p className="font-en text-tea-deep text-5xl md:text-6xl tracking-wider leading-none">
              1980<span className="text-tea">s</span>
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-xs tracking-widest2 uppercase text-ink-mute">
              Chapter Two · 走向世界
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 className="font-serif font-light text-3xl md:text-4xl leading-[1.6] text-ink">
              為顧客<span className="text-tea-deep">&nbsp;品質把關</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.35}>
            <span className="block w-12 h-px bg-tea/60" />
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="space-y-6 text-ink-soft leading-loose tracking-wider">
              <p>
                80&nbsp;年代，我們引進國外其他天然植物精油為原料，將天然精油的品項再擴增，以滿足海內外客戶的需求——成為當時國內屈指可數的精油出口商。
              </p>
              <p>
                也是少數有能力&nbsp;<span className="text-ink">調配複方精油</span>&nbsp;的廠商。當時芳療教育尚未成形、芳療師行業才剛起步，我們已經具備精油品質鑑別能力，採購專業&nbsp;
                <span className="font-en text-ink tracking-wider">GC-MS</span>&nbsp;儀器做成份分析檢驗。
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.55}>
            <blockquote className="border-l-2 border-tea pl-6 py-2 font-serif text-xl md:text-2xl text-ink leading-loose">
              真正做到——<br />「為顧客品質把關」。
            </blockquote>
          </FadeIn>
        </div>

        <motion.div style={{ y }} className="relative aspect-[4/5]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/images/hero-02.jpg)",
              filter: "sepia(0.1) saturate(0.9)"
            }}
          />
          <div className="absolute inset-0 ring-1 ring-tea/20" />
        </motion.div>
      </div>
    </section>
  );
}
