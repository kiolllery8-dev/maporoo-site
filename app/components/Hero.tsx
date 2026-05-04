"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // LOGO follows the scroll across the full Hero range — starts overlaying
  // the hand image (top: 25vh), and lands at the very top of the viewport
  // (0vh) by the time the user has scrolled to the bottom of Hero.
  const logoTop = useTransform(scrollYProgress, [0, 1], ["25vh", "0vh"]);

  return (
    <>
      <section
        id="top"
        ref={ref}
        className="relative min-h-screen overflow-hidden"
      >
        {/* Layer 0: paper-waves bg — stays at viewport size, NOT scaled up */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/images/bg-paper-waves.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />

        {/* Layer 1: hand image — large, centered in viewport */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-2">
          <motion.img
            src="/images/hero-hand-mint.png"
            alt=""
            aria-hidden
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
            className="w-[min(100vw,1280px)] h-auto select-none"
          />
        </div>

        {/* slogan — moved further down toward viewport bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.6 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 font-serif text-ink text-base md:text-lg text-center px-6 whitespace-nowrap"
        >
          呼吸清新的空氣，<span className="text-tea-deep">是生命的泉源</span>
        </motion.p>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1.2 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-ink-mute"
        >
          <span className="text-[10px] tracking-widest2 uppercase">Scroll</span>
          <span className="block w-px h-8 bg-ink-mute/40 animate-scroll-hint" />
        </motion.div>
      </section>

      {/* === LOGO ===
          Fixed-positioned page-level overlay, horizontally centered via
          full-width flex container (reliable centering regardless of
          internal asymmetry of the LOGO PNG). Vertical position is
          scroll-driven via Hero's scrollYProgress. */}
      <motion.div
        style={{
          top: logoTop,
          left: 0,
          right: 0
        }}
        className="fixed z-[60] flex justify-center pointer-events-none"
      >
        <motion.img
          src="/images/bn-logo.png"
          alt="BrezNu 碧森妮"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-[70vw] max-w-[700px] h-auto select-none"
        />
      </motion.div>
    </>
  );
}
