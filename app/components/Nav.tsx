"use client";

import { useEffect, useState } from "react";
import CartLink from "./CartLink";

const LEFT = [
  { href: "/products", label: "商品" },
  { href: "/collections/facial-care", label: "臉部保養" },
  { href: "/collections/hair-scalp", label: "頭皮髮絲" }
];
const RIGHT = [
  { href: "/collections/bath-fragrance", label: "沐浴香氛" },
  { href: "/ingredients/pdrn", label: "成分" },
  { href: "/#story", label: "關於" }
];
const ALL = [...LEFT, ...RIGHT];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-[55] h-16 flex items-center border-b border-[var(--line)]"
      style={{ background: "rgba(242,239,232,.93)", backdropFilter: "blur(8px)" }}
    >
      <div className="relative w-full max-w-[1120px] mx-auto px-[30px] flex items-center justify-between">
        {/* Left nav (desktop) */}
        <nav className="hidden min-[980px]:flex gap-[30px] text-[.95rem] font-bold tracking-[.08em] text-[var(--soft)] flex-1">
          {LEFT.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[var(--ink)] transition-colors">{l.label}</a>
          ))}
        </nav>

        {/* Brand — logo gif + wordmark, centred on desktop */}
        {/* Home, not "#top" — the site has 30+ subpages now, and an anchor
            would leave the visitor stranded on whatever page they're on. */}
        <a
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 min-[980px]:absolute min-[980px]:left-1/2 min-[980px]:-translate-x-1/2"
        >
          <img
            src="/images/maporoo-logo.gif"
            alt=""
            aria-hidden
            draggable={false}
            className="h-11 w-auto select-none"
          />
          <span className="font-black text-[1.5rem] tracking-[.3em] leading-none">MAPOROO</span>
        </a>

        {/* Right nav (desktop) */}
        <nav className="hidden min-[980px]:flex gap-[30px] text-[.95rem] font-bold tracking-[.08em] text-[var(--soft)] flex-1 justify-end items-center">
          {RIGHT.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[var(--ink)] transition-colors">{l.label}</a>
          ))}
          <span className="text-[var(--ink)]"><CartLink /></span>
        </nav>

        {/* Mobile: bag stays reachable without opening the drawer */}
        <span className="min-[980px]:hidden ml-auto mr-3 text-[.9rem] font-bold text-[var(--soft)]">
          <CartLink />
        </span>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="min-[980px]:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-[var(--ink)]"
        >
          <span className="relative block w-5 h-3.5">
            <span className={`absolute inset-x-0 h-px bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute inset-x-0 top-1.5 h-px bg-current transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute inset-x-0 h-px bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`min-[980px]:hidden absolute top-16 inset-x-0 overflow-hidden transition-[max-height,opacity] duration-500 border-b border-[var(--line)] ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        style={{ background: "rgba(242,239,232,.97)", backdropFilter: "blur(8px)" }}
      >
        <div className="px-[30px] py-2 flex flex-col">
          {ALL.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3.5 border-b border-[var(--line)] text-[.95rem] font-bold tracking-[.08em] text-[var(--soft)] hover:text-[var(--ink)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
