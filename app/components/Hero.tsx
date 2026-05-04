"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Layer 0: paper-waves bg — viewport-sized */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/images/bg-paper-waves.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Layer 1: hand image — absolute, centered, oversized (crops at edges) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <motion.img
          src="/images/hero-hand-mint.png"
          alt=""
          aria-hidden
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-[130vw] max-w-none h-auto select-none"
        />
      </div>

      {/* Layer 2: flow content. LOGO sits in NORMAL flow at the top of
          Hero (pt-[10vh]) — it scrolls 1:1 with the page just like
          regular content. Once the user has scrolled past it, the LOGO
          naturally exits the viewport from the top, so it cannot stay
          on screen. (No sticky / no fixed positioning.) */}
      <div className="relative z-20 min-h-screen flex flex-col items-center pt-[10vh]">
        <motion.img
          src="/images/bn-logo.png"
          alt="BrezNu 碧森妮"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-[50vw] max-w-[500px] h-auto select-none mx-auto"
        />

        {/* spacer pushes slogan + scroll hint to the bottom */}
        <div className="flex-1" />

        {/* slogan */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.6 }}
          className="text-center mb-12 font-serif text-ink text-base md:text-lg px-6 whitespace-nowrap"
        >
          呼吸清新的空氣，<span className="text-tea-deep">是生命的泉源</span>
        </motion.p>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1.2 }}
          className="flex flex-col items-center gap-2 text-ink-mute mb-4"
        >
          <span className="text-[10px] tracking-widest2 uppercase">Scroll</span>
          <span className="block w-px h-8 bg-ink-mute/40 animate-scroll-hint" />
        </motion.div>
      </div>
    </section>
  );
}
