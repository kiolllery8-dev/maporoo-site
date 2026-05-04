"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Layer 0: paper-waves bg (kept) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/images/bg-paper-waves.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Layer 1: LOGO above + hand image — both static, scroll naturally with the page */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-[14vh] pb-20 px-2 pointer-events-none">
        <motion.img
          src="/images/bn-logo.png"
          alt="BrezNu 碧森妮"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-[min(80vw,720px)] h-auto select-none -mb-2 md:-mb-4"
        />
        <motion.img
          src="/images/hero-hand-mint.png"
          alt=""
          aria-hidden
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-[min(96vw,1380px)] h-auto select-none"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.4 }}
          className="mt-6 font-serif text-ink text-base md:text-lg text-center"
        >
          呼吸清新的空氣，<span className="text-tea-deep">是生命的泉源</span>
        </motion.p>
      </div>

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
