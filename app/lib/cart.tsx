"use client";

// Client-side shopping bag. State lives in localStorage so it survives reloads.
// NOTE: checkout is not wired to a payment gateway yet — see /cart for where
// the handoff needs to happen once a 金流 provider is chosen.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "./catalog";

const KEY = "maporoo.cart.v1";

export type CartLine = { slug: string; qty: number };

type CartApi = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartApi | null>(null);

function read(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop lines whose product no longer exists, so a renamed slug can't
    // wedge the bag into an unrenderable state.
    return parsed
      .filter((l) => l && typeof l.slug === "string" && getProduct(l.slug))
      .map((l) => ({ slug: l.slug, qty: Math.max(1, Math.min(99, Number(l.qty) || 1)) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate after mount — localStorage is not available during SSR, and
  // rendering the stored count on the server would cause a hydration mismatch.
  useEffect(() => {
    setLines(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage full or blocked — the bag just won't persist */
    }
  }, [lines, ready]);

  const api = useMemo<CartApi>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => {
      const p = getProduct(l.slug);
      return p ? s + p.price * l.qty : s;
    }, 0);
    return {
      lines,
      count,
      subtotal,
      ready,
      add: (slug, qty = 1) =>
        setLines((prev) => {
          const hit = prev.find((l) => l.slug === slug);
          if (hit) {
            return prev.map((l) =>
              l.slug === slug ? { ...l, qty: Math.min(99, l.qty + qty) } : l
            );
          }
          return [...prev, { slug, qty: Math.min(99, Math.max(1, qty)) }];
        }),
      setQty: (slug, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.slug !== slug)
            : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, qty) } : l))
        ),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      clear: () => setLines([]),
    };
  }, [lines, ready]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart(): CartApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
