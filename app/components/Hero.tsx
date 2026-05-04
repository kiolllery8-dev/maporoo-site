"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero uses the original paper-waves image as a top banner */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          backgroundImage: "url(/images/bg-paper-waves.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat"
        }}
      />

      <div className="relative text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10"
        >
          <p className="text-xs tracking-widest2 uppercase text-tea-deep">
            since 1960s · A Sixty-Year Pursuit of Nature
          </p>

          <h1 className="font-serif font-medium text-ink leading-[1.5] text-3xl md:text-5xl">
            呼吸清新的空氣
            <br />
            <span className="text-tea-deep">是生命的泉源</span>
          </h1>

          <div className="flex justify-center pt-4">
            <span className="divider-line-h" />
          </div>

          <p className="font-serif-mix italic text-ink-soft text-lg md:text-xl tracking-wider">
            BrezNu&nbsp;&nbsp;碧森妮
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-ink-mute"
      >
        <span className="text-[10px] tracking-widest2 uppercase">Scroll</span>
        <span className="block w-px h-10 bg-ink-mute/40 animate-scroll-hint" />
      </motion.div>
    </section>
  );
}
