"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collections } from "../lib/catalog";

type NavLink = { href: string; label: string; mega?: boolean };
const LEFT_LINKS: NavLink[] = [
  { href: "/collections", label: "系列", mega: true },
  { href: "/gift-finder", label: "找禮物" }
];
const RIGHT_LINKS: NavLink[] = [
  { href: "/journal", label: "MAPOROO 誌" },
  { href: "/about", label: "關於" },
  { href: "/stores", label: "門市" }
];
const PRIMARY: NavLink[] = [...LEFT_LINKS, ...RIGHT_LINKS];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMega, setOpenMega] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMega(false);
        setOpenMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled || openMega || openMobile
          ? "bg-champagne-100/90 backdrop-blur-md border-b border-gold/15"
          : "bg-transparent border-b border-transparent"
      }`}
      onMouseLeave={() => setOpenMega(false)}
    >
      <nav className="relative max-w-8xl mx-auto px-5 md:px-10 h-[76px] md:h-[92px] flex items-center">
        {/* Left links (desktop) */}
        <ul className="hidden md:flex items-center gap-8 flex-1 text-[0.8rem] tracking-widest2 uppercase text-ink-soft">
          {LEFT_LINKS.map((item) => (
            <li key={item.href} onMouseEnter={() => setOpenMega(Boolean(item.mega))}>
              <Link href={item.href} className="py-2 hover:text-gold-deep transition-colors link-underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Centre logo (gif, enlarged) */}
        <Link
          href="/"
          aria-label="MAPOROO"
          onClick={() => setOpenMobile(false)}
          onMouseEnter={() => setOpenMega(false)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <img
            src="/images/maporoo-logo.gif"
            alt="MAPOROO"
            className="h-14 md:h-[72px] w-auto select-none drop-shadow-[0_3px_12px_rgba(140,109,47,0.22)]"
            draggable={false}
          />
        </Link>

        {/* Right links (desktop) */}
        <ul className="hidden md:flex items-center gap-8 flex-1 justify-end text-[0.8rem] tracking-widest2 uppercase text-ink-soft">
          {RIGHT_LINKS.map((item) => (
            <li key={item.href} onMouseEnter={() => setOpenMega(Boolean(item.mega))}>
              <Link href={item.href} className="py-2 hover:text-gold-deep transition-colors link-underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger (logo stays centred) */}
        <button
          aria-label={openMobile ? "關閉選單" : "開啟選單"}
          aria-expanded={openMobile}
          onClick={() => setOpenMobile((v) => !v)}
          className="md:hidden ml-auto inline-flex items-center justify-center w-10 h-10 -mr-2 text-ink"
        >
          <span className="relative block w-5 h-3.5">
            <span className={`absolute inset-x-0 h-px bg-current transition-transform duration-300 ${openMobile ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute inset-x-0 top-1.5 h-px bg-current transition-opacity duration-300 ${openMobile ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute inset-x-0 h-px bg-current transition-transform duration-300 ${openMobile ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>

      {/* Mega-menu (desktop) */}
      <div
        className={`hidden md:block overflow-hidden transition-[max-height,opacity] duration-500 ease-soft ${
          openMega ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-8xl mx-auto px-10 pb-12 pt-4">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-2">
              <p className="eyebrow mb-5">全部系列</p>
              <Link href="/collections" className="font-serif-mix text-2xl text-ink hover:text-gold-deep transition-colors leading-snug">
                探索<br />MAPOROO
              </Link>
            </div>
            {collections.map((c) => (
              <div key={c.slug} className="col-span-2">
                <Link
                  href={`/collections/${c.slug}`}
                  className="block font-serif-mix text-xl text-ink hover:text-gold-deep transition-colors"
                  onClick={() => setOpenMega(false)}
                >
                  {c.name}
                </Link>
                <p className="mt-1 text-[0.7rem] uppercase tracking-widest2 text-gold-deep">{c.en}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                  {c.products.slice(0, 3).map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/collections/${c.slug}`}
                        className="hover:text-gold-deep transition-colors"
                        onClick={() => setOpenMega(false)}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-soft ${
          openMobile ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-8 pt-2 flex flex-col">
          {PRIMARY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpenMobile(false)}
              className="py-3.5 border-b border-gold/15 text-sm tracking-widest2 uppercase text-ink-soft hover:text-gold-deep transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-5">
            <p className="eyebrow mb-3">系列</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {collections.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  onClick={() => setOpenMobile(false)}
                  className="font-serif-mix text-lg text-ink hover:text-gold-deep transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
