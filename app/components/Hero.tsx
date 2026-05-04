"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Layer 0: paper-waves bg — kept at viewport size, NOT scaled up
          to match the hand image. */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/images/bg-paper-waves.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Layer 1: hand image (large, centered) with LOGO overlaid on top */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-2">
        <div className="relative w-[min(96vw,1100px)]">
          <motion.img
            src="/images/hero-hand-mint.png"
            alt=""
            aria-hidden
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
            className="w-full h-auto select-none"
          />

          {/* LOGO overlaid on top of the hand image (upper-center area) */}
          <motion.img
            src="/images/bn-logo.png"
            alt="BrezNu 碧森妮"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
            className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[64%] max-w-[520px] h-auto select-none pointer-events-none"
          />
        </div>
      </div>

      {/* slogan — bottom of Hero */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.6 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 font-serif text-ink text-base md:text-lg text-center px-6 whitespace-nowrap"
      >
        呼吸清新的空氣，<span className="text-tea-deep">是生命的泉源</span>
      </motion.p>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-ink-mute"
      >
        <span className="text-[10px] tracking-widest2 uppercase">Scroll</span>
        <span className="block w-px h-8 bg-ink-mute/40 animate-scroll-hint" />
      </motion.div>
    </section>
  );
}
