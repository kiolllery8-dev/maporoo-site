"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Measure actual Hero height so the LOGO timing self-adjusts to viewport size.
  const [heroH, setHeroH] = useState(800);
  useEffect(() => {
    const update = () => {
      if (ref.current) setHeroH(ref.current.offsetHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // LOGO behaviour (continuous motion driven by scrollY):
  // - scrollY 0           → top: 60   (high near the top)
  // - scrollY heroH       → top: 0    (locked at the top of viewport = the
  //                                    bottom-line of the top section)
  // - scrollY heroH + 200 → top: -120 (LOGO has exited above the viewport)
  // - scrollY > heroH+200 → clamped at -120 (gone, doesn't reappear)
  // Net effect: while scrolling Hero, LOGO visibly moves with the page;
  // when Hero is gone, LOGO leaves with it, never lingers in chapter 1.
  const logoTop = useTransform(
    scrollY,
    [0, heroH, heroH + 200],
    [60, 0, -120]
  );

  return (
    <section id="top" ref={ref} className="relative min-h-screen">
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

      {/* Layer 1: hand image — wrapped in its own overflow:hidden so the
          oversized image crops cleanly without forcing the whole section
          to be overflow-hidden (which would break sticky/fixed children). */}
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

      {/* === LOGO ===
          Lives inside <section id="top"> in DOM, but uses position:fixed
          so it can be anchored to the viewport while its `top` is
          scroll-driven. Centered horizontally via full-width flex. */}
      <motion.div
        style={{ top: logoTop, left: 0, right: 0 }}
        className="fixed z-[60] flex justify-center pointer-events-none"
      >
        <motion.img
          src="/images/bn-logo.png"
          alt="BrezNu 碧森妮"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-[50vw] max-w-[500px] h-auto select-none"
        />
      </motion.div>

      {/* slogan — anchored near viewport bottom while Hero is in view */}
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
  );
}
