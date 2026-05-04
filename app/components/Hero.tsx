"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // LOGO behaviour:
  // 1. Initial: at top: 60px (high near the top, just below where the nav
  //    would visually sit — but the nav text logo is removed).
  // 2. Scrolling phase: top decreases 1:1 with scrollY for the first 60px
  //    of scroll → LOGO appears to follow the page exactly.
  // 3. Sticky phase: once at top: 0, the value clamps and LOGO stays
  //    pinned at the top of the viewport — i.e. fixed at the "top of top
  //    section" line.
  const logoTop = useTransform(scrollY, [0, 60], [60, 0]);

  // 4. Hero-past phase: when the user has scrolled past Hero entirely,
  //    fade the LOGO out so it doesn't linger on top of chapter 1.
  const [heroPast, setHeroPast] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      setHeroPast(r.bottom <= 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      ref={ref}
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

      {/* Layer 1: hand image — absolute, oversized, can be cropped */}
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

      {/* === LOGO ===
          Lives inside <section id="top">. Position: fixed so it's
          centered horizontally on the viewport (asymmetric LOGO content
          can't drift off-center). The vertical position is scroll-driven:
          - scrollY 0 → top: 60px  (high, just under where the nav sits)
          - scrollY 60 → top: 0    (locked at the very top)
          - scrollY > 60 → top: 0  (clamped, "fixed at top of top section")
          - heroPast → opacity: 0  (fades out so it can't linger on screen) */}
      <motion.div
        style={{ top: logoTop, left: 0, right: 0 }}
        className={`fixed z-[60] flex justify-center pointer-events-none transition-opacity duration-500 ${
          heroPast ? "opacity-0" : "opacity-100"
        }`}
      >
        <motion.img
          src="/images/bn-logo.png"
          alt="BrezNu 碧森妮"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-[50vw] max-w-[500px] h-auto select-none mx-auto"
        />
      </motion.div>

      {/* slogan */}
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
