"use client";

import { useEffect, useState } from "react";
import CartLink from "./CartLink";

// 左右兩側的「寬度」要接近，品牌才會落在視覺正中間。
// 之前左邊 3 項、右邊 6 項，右側把品牌往左推，左邊就空出一大塊。
// 現在左邊放四個逛商品的入口，右邊放知識與帳戶，兩側寬度差不多。
const LEFT = [
  { href: "/products", label: "商品" },
  { href: "/collections/facial-care", label: "臉部保養" },
  { href: "/collections/hair-scalp", label: "頭皮髮絲" },
  { href: "/collections/bath-fragrance", label: "沐浴香氛" }
];
const RIGHT = [
  { href: "/ingredients/pdrn", label: "成分" },
  { href: "/read", label: "閱讀" },
  { href: "/#story", label: "關於" }
];
// 會員入口。登入與否的判斷在 /account 裡做（未登入會導去登入頁），
// 所以 Nav 不需要知道登入狀態，也就不必為了這顆連結變成動態渲染。
const ACCOUNT = { href: "/account", label: "會員" };
const ALL = [...LEFT, ...RIGHT, ACCOUNT];

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
        <nav className="hidden min-[1080px]:flex gap-[24px] text-[.95rem] font-bold tracking-[.08em] text-[var(--soft)] flex-1">
          {LEFT.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[var(--ink)] transition-colors">{l.label}</a>
          ))}
        </nav>

        {/* Brand — logo gif + wordmark.
            在文件流裡，不是絕對置中。
            舊版用 absolute left-1/2 -translate-x-1/2，那會讓品牌脫離文件流，
            左右兩個 nav 因為 flex-1 直接長進中央，蓋在品牌上面。
            實測 1280px：右側導覽被壓住 32px，左側卻空了 151px——
            因為右邊的連結是左邊的兩倍。
            放回文件流之後，兩個 nav 各 flex-1、品牌 shrink-0，
            品牌自然落在中間，而且不可能再重疊。 */}
        {/* Home, not "#top" — the site has 30+ subpages now, and an anchor
            would leave the visitor stranded on whatever page they're on. */}
        <a
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 shrink-0"
        >
          <img
            src="/images/maporoo-logo.gif"
            alt=""
            aria-hidden
            draggable={false}
            className="h-11 w-auto select-none"
          />
          {/* 字距 0.5em 是老闆定的，桌機手機都維持這個比例。
              但 0.5em 是相對字級的，字級不縮的話手機上字標會寬到 237px，
              把購物袋連結擠成寬度 0（實測過）。所以縮字級、不動字距。

              另外字距也會加在最後一個 O 後面，讓字看起來偏左、右邊像多一塊留白，
              負的 margin 剛好抵銷那一格，不影響字與字之間。 */}
          <span
            className="font-black text-[.85rem] min-[420px]:text-[1.05rem] min-[1080px]:text-[1.5rem] leading-none"
            style={{ letterSpacing: "0.5em", marginRight: "-0.5em" }}
          >
            MAPOROO
          </span>
        </a>

        {/* Right nav (desktop) */}
        <nav className="hidden min-[1080px]:flex gap-[24px] text-[.95rem] font-bold tracking-[.08em] text-[var(--soft)] flex-1 justify-end items-center">
          {RIGHT.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[var(--ink)] transition-colors">{l.label}</a>
          ))}
          <a href={ACCOUNT.href} className="hover:text-[var(--ink)] transition-colors">{ACCOUNT.label}</a>
          <span className="text-[var(--ink)]"><CartLink /></span>
        </nav>

        {/* Mobile: bag stays reachable without opening the drawer.
            用 compact 模式（圖示＋數字，不顯示「購物袋」三個字）：
            320px 的螢幕上，那三個字會把漢堡擠出畫面 28px。實測過。
            pl-3 也是必要的——字標尾端用負 margin 抵銷字距，
            墨水會超出排版框約 0.5em，不留這段內距就會壓到購物袋。 */}
        <span className="min-[1080px]:hidden ml-auto mr-4 pl-3 text-[var(--ink)]">
          <CartLink compact />
        </span>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="min-[1080px]:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-[var(--ink)]"
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
        className={`min-[1080px]:hidden absolute top-16 inset-x-0 overflow-hidden transition-[max-height,opacity] duration-500 border-b border-[var(--line)] ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
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
