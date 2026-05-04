"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // === LOGO morph: huge in Hero center → small at nav center ===
  // top: viewport-50% → 22px (just below nav top edge)
  const logoTop = useTransform(scrollYProgress, [0, 1], ["50%", "22px"]);
  // y-translate: -50% (centers vertically) → 0 (top-aligned at nav)
  const logoY = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);
  // scale: 1 → 0.18 (BN-LOGO ~400px wide → ~72px wide at nav)
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.18]);

  // === Hand image: scrolls with Hero, drifts up + fades as Hero exits ===
  const handY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const handOpacity = useTransform(scrollYProgress, [0.4, 0.95], [1, 0]);

  return (
    <>
      <section
        id="top"
        ref={ref}
        className="relative min-h-screen overflow-hidden"
      >
        {/* paper-waves bg (kept) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/images/bg-paper-waves.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />

        {/* hand image — sits behind LOGO in Hero center */}
        <motion.div
          style={{ y: handY, opacity: handOpacity }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <img
            src="/images/hero-hand-mint.png"
            alt=""
            aria-hidden
            draggable={false}
            className="w-[min(80vw,520px)] h-auto select-none"
          />
        </motion.div>

        {/* slogan + scroll hint, anchored to bottom of Hero */}
        <div className="relative z-20 min-h-screen flex flex-col items-center justify-end px-6 pb-24 text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 max-w-md"
          >
            <p className="text-xs tracking-widest2 uppercase text-tea-deep">
              since 1960s · A Sixty-Year Pursuit of Nature
            </p>
            <p className="font-serif font-medium text-ink leading-[1.6] text-base md:text-lg">
              呼吸清新的空氣，<span className="text-tea-deep">是生命的泉源</span>
            </p>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-ink-mute"
        >
          <span className="text-[10px] tracking-widest2 uppercase">Scroll</span>
          <span className="block w-px h-8 bg-ink-mute/40 animate-scroll-hint" />
        </motion.div>
      </section>

      {/* === Morphing BN-LOGO: fixed-positioned at page level so it can
            seamlessly land in the nav center as the user scrolls Hero === */}
      <motion.div
        style={{
          top: logoTop,
          left: "50%",
          x: "-50%",
          y: logoY,
          scale: logoScale
        }}
        className="fixed z-[60] pointer-events-none origin-center"
      >
        <img
          src="/images/bn-logo.png"
          alt="BrezNu 碧森妮"
          draggable={false}
          className="w-[min(72vw,400px)] h-auto select-none"
        />
      </motion.div>
    </>
  );
}
