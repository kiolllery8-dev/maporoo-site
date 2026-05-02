"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-cream/30 backdrop-blur-sm border-b border-tea/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 grid grid-cols-3 items-center">
        <div className="hidden md:flex items-center gap-10 text-xs tracking-widest2 text-ink-soft uppercase justify-self-start">
          <a href="#origin" className="hover:text-tea-deep transition">
            Origin
          </a>
          <a href="#brand" className="hover:text-tea-deep transition">
            Brand
          </a>
        </div>
        <a
          href="#top"
          className="flex items-baseline gap-3 justify-self-center col-start-1 col-span-3 md:col-start-2 md:col-span-1"
        >
          <span className="font-serif-mix text-2xl tracking-wider2 text-ink">
            BrezNu
          </span>
          <span className="font-serif text-sm tracking-widest2 text-tea-deep">
            碧森妮
          </span>
        </a>
        <div className="hidden md:flex items-center gap-10 text-xs tracking-widest2 text-ink-soft uppercase justify-self-end">
          <a href="#belief" className="hover:text-tea-deep transition">
            Belief
          </a>
          <a href="#contact" className="hover:text-tea-deep transition">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
