"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  // Bind to global scrollY so the LOGO moves 1:1 with the page —
  // it appears to scroll with the content until the resting point.
  const { scrollY } = useScroll();

  // LOGO start: 190px from viewport top (just above the hand image).
  // LOGO rest: 0px (snapped to the very top once user scrolls 190px down).
  // Scrolling up reverses the mapping automatically.
  const logoTop = useTransform(scrollY, [0, 190], [190, 0]);

  return (
    <>
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

        {/* Layer 1: hand image — sits in the lower-middle area; scrolls naturally with Hero */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-[24vh] pb-24 px-6 pointer-events-none">
          <motion.img
            src="/images/hero-hand-mint.png"
            alt=""
            aria-hidden
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
            className="w-[min(72vw,460px)] h-auto select-none"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.4 }}
            className="mt-10 font-serif text-ink text-base md:text-lg text-center"
          >
            呼吸清新的空氣，<span className="text-tea-deep">是生命的泉源</span>
          </motion.p>
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

      {/* === Fixed BN-LOGO ===
          Sits directly above the hand image at scroll-start (top: 28vh).
          As the user scrolls Hero, LOGO migrates linearly toward the nav
          center (top: 14px). After Hero is past, top is clamped at 14px so
          LOGO stays locked at the nav. NO scaling — size is constant. */}
      <motion.div
        style={{
          top: logoTop,
          left: "50%",
          x: "-50%"
        }}
        className="fixed z-[60] pointer-events-none"
      >
        <img
          src="/images/bn-logo.png"
          alt="BrezNu 碧森妮"
          draggable={false}
          className="w-[min(38vw,240px)] h-auto select-none"
        />
      </motion.div>
    </>
  );
}
