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

      {/* Layer 1: hand image — own overflow-hidden wrapper so the oversized
          image clips cleanly without affecting the section's own overflow */}
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
          Anchored absolutely with bottom:0 → its bottom edge sits exactly on
          the line between #top and the next chapter. Scrolls naturally with
          Hero (because it's a normal absolute child of the section in flow
          with the page). When Hero scrolls out of the viewport, the LOGO
          goes with it — no fade, no lingering. */}
      <div className="absolute left-0 right-0 bottom-0 z-[60] flex justify-center pointer-events-none">
        <motion.img
          src="/images/bn-logo.png"
          alt="BrezNu 碧森妮"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-[50vw] max-w-[500px] h-auto select-none"
        />
      </div>

      {/* slogan — repositioned above the LOGO so they don't collide */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.6 }}
        className="absolute bottom-[170px] left-1/2 -translate-x-1/2 z-20 font-serif text-ink text-base md:text-lg text-center px-6 whitespace-nowrap"
      >
        呼吸清新的空氣，<span className="text-tea-deep">是生命的泉源</span>
      </motion.p>

      {/* scroll hint — keep above the LOGO too */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
        className="absolute bottom-[130px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-ink-mute"
      >
        <span className="text-[10px] tracking-widest2 uppercase">Scroll</span>
        <span className="block w-px h-6 bg-ink-mute/40 animate-scroll-hint" />
      </motion.div>
    </section>
  );
}
