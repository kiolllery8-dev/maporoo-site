"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FadeIn from "./FadeIn";

export default function ChapterBrand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="brand"
      ref={ref}
      className="relative py-32 md:py-48 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div style={{ y }} className="relative aspect-[4/5] order-2 md:order-1">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/images/hero-03.jpg)",
              filter: "sepia(0.12) saturate(0.85)"
            }}
          />
          <div className="absolute inset-0 ring-1 ring-tea/20" />
        </motion.div>

        <div className="order-1 md:order-2 space-y-8">
          <FadeIn>
            <p className="font-en text-tea-deep text-5xl md:text-6xl tracking-wider leading-none">
              1990<span className="text-tea">s</span>
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-xs tracking-widest2 uppercase text-ink-mute">
              Chapter Three · 品牌誕生
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 className="font-serif font-medium text-3xl md:text-4xl leading-[1.6] text-ink">
              <span className="font-en italic">BrezNu</span>&nbsp;碧森妮
              <br />
              於是<span className="text-tea-deep">&nbsp;誕生</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.35}>
            <span className="block w-12 h-px bg-tea/60" />
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="space-y-6 text-ink-soft leading-loose tracking-wider">
              <p>
                90&nbsp;年代，公司由製造工業&nbsp;轉型品牌行銷；從工廠級的服務轉向消費者服務。
              </p>
              <p>
                我們嚴選頂級的天然植翠精華，培養內部芳療師，為每一位走進&nbsp;BrezNu&nbsp;的人提供諮詢服務——
              </p>
              <p className="font-serif text-ink">
                致力於芳香療法的推廣與應用，<br />
                提升人們的生活環境品質，<br />
                幫助身心靈健康，傳遞大自然的能量。
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
