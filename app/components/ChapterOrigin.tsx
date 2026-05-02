"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FadeIn from "./FadeIn";

export default function ChapterOrigin() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="origin"
      ref={ref}
      className="relative py-32 md:py-48 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div style={{ y }} className="relative aspect-[4/5] order-2 md:order-1">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/images/hero-01.jpg)",
              filter: "sepia(0.15) saturate(0.85)"
            }}
          />
          <div className="absolute inset-0 ring-1 ring-tea/20" />
        </motion.div>

        <div className="order-1 md:order-2 space-y-8">
          <FadeIn>
            <p className="font-en text-tea-deep text-5xl md:text-6xl tracking-wider leading-none">
              1960<span className="text-tea">s</span>
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-xs tracking-widest2 uppercase text-ink-mute">
              Chapter One · 起源
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h2 className="font-serif font-light text-3xl md:text-4xl leading-[1.6] text-ink">
              從一份對天然的<br />
              <span className="text-tea-deep">偏執之愛</span>&nbsp;開始
            </h2>
          </FadeIn>

          <FadeIn delay={0.35}>
            <span className="block w-12 h-px bg-tea/60" />
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="space-y-6 text-ink-soft leading-loose tracking-wider">
              <p>
                鴻元生技&nbsp;60&nbsp;年代成立初期，創辦人
                <span className="text-ink">&nbsp;謝炳欽&nbsp;先生</span>
                ，一生熱愛對天然植物的研究。由天然植物萃取、精煉到分餾，投入專業設備，培育專業人員，一步一腳印鑽研天然精油。
              </p>
              <p>
                追求天然的原料，甚至遠赴海外國家研究相關天然植物，並與當地農民契種配合。從國內種植的&nbsp;薄荷、香茅、樟樹、牛樟、檜木&nbsp;⋯⋯ 經過蒸餾萃取程序自行萃取精油。
              </p>
              <p className="font-serif text-ink">
                當時，是國內少數具有蒸餾設備與分餾技術的工廠，<br />
                也是少數將國內精油出口至日本、歐美的廠商。
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
