"use client";

import { useEffect, useState } from "react";

const LINKS_LEFT = [
  { href: "#origin", label: "Origin" },
  { href: "#brand", label: "Brand" }
];
const LINKS_RIGHT = [
  { href: "#belief", label: "Belief" },
  { href: "#contact", label: "Contact" }
];
const ALL_LINKS = [...LINKS_LEFT, ...LINKS_RIGHT];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled || open
          ? "bg-cream/40 backdrop-blur-md border-b border-tea/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-4 md:py-5 grid grid-cols-3 items-center">
        {/* Left links (desktop) */}
        <div className="hidden md:flex items-center gap-10 text-xs tracking-widest2 text-ink-soft uppercase justify-self-start">
          {LINKS_LEFT.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-tea-deep transition">
              {l.label}
            </a>
          ))}
        </div>

        {/* Center logo — leaf-shaped wordmark. The anchor cell has a fixed
            height matching the nav row, and the leaf image is absolutely
            positioned with top:0 + a taller height, so the leaf's bottom
            edge protrudes below the nav row. */}
        <a
          href="#top"
          onClick={() => setOpen(false)}
          aria-label="BrezNu 碧森妮"
          className="justify-self-center col-start-2 col-span-1 relative flex items-center justify-center h-9 md:h-11 w-[min(40vw,260px)]"
        >
          <img
            src="/images/bn-logo-leaf.png"
            alt="BrezNu 碧森妮"
            draggable={false}
            className="absolute left-1/2 top-0 -translate-x-1/2 h-[100px] md:h-[140px] w-auto select-none"
          />
        </a>

        {/* Right links (desktop) */}
        <div className="hidden md:flex items-center gap-10 text-xs tracking-widest2 text-ink-soft uppercase justify-self-end">
          {LINKS_RIGHT.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-tea-deep transition">
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden justify-self-end col-start-3 inline-flex items-center justify-center w-10 h-10 -mr-2 text-ink"
        >
          <span className="sr-only">menu</span>
          <span className="relative block w-5 h-3.5">
            <span
              className={`absolute inset-x-0 h-px bg-current transition-transform duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute inset-x-0 top-1.5 h-px bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute inset-x-0 h-px bg-current transition-transform duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 flex flex-col gap-1 text-sm tracking-widest2 uppercase text-ink-soft">
          {ALL_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 border-b border-tea/15 hover:text-tea-deep transition"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
