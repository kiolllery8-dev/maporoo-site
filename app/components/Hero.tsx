"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen">
      {/* Layer 0: paper-waves bg */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/images/bg-paper-waves.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Layer 1: hand image — own overflow-hidden wrapper */}
      <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center pointer-events-none">
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

      {/* Layer 2: flow content — sticky LOGO (greenvines pattern).
          - LOGO sticks at top: 80px while Hero is in view (the "top" position).
          - When the parent's bottom approaches the LOGO's bottom (i.e. the
            user has scrolled near the end of Hero), sticky RELEASES and the
            LOGO bottom anchors to the parent's bottom — which IS the line
            between #top and the next chapter.
          - From that moment, LOGO bottom stays glued to that line and
            scrolls out together with Hero. Once Hero leaves the viewport,
            the LOGO is gone with it (no fade, no lingering).
          - Browser handles all the math — no need to hard-code LOGO height. */}
      <div className="relative z-20 min-h-screen">
        <div className="sticky top-[80px] z-[60] flex justify-center w-full pointer-events-none">
          <motion.img
            src="/images/bn-logo.png"
            alt="BrezNu 碧森妮"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
            className="w-[50vw] max-w-[500px] h-auto select-none"
          />
        </div>
      </div>

      {/* slogan — enlarged 2.5x with drop+glow shadow for depth */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.6 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 font-serif text-ink text-3xl md:text-4xl lg:text-5xl text-center px-6 whitespace-nowrap font-medium tracking-wide"
        style={{
          textShadow:
            "0 2px 8px rgba(31, 26, 20, 0.45), 0 0 24px rgba(250, 245, 234, 0.85), 0 1px 0 rgba(250, 245, 234, 0.95)"
        }}
      >
        呼吸清新的空氣，<span className="text-white">是生命的泉源</span>
      </motion.p>
    </section>
  );
}
