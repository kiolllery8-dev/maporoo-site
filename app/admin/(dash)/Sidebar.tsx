"use client";

// 移植自 auslife-www 的 components/AdminSidebar：
// 手機是抽屜、桌機常駐 256px，分組導覽、目前頁面高亮、待辦數字徽章。
//
// 與 auslife 的差別有兩處：
//  1. 顏色換成 MAPOROO 的（見 tailwind.config.ts 的說明）
//  2. 每一項綁 capability——角色沒有那個權限，連結就不出現。
//     權限的真正把關在伺服器端，這裡只是不顯示用不到的東西。

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { can, ROLE_LABEL, type Capability, type Role } from "../../lib/permissions";
import { adminLogoutAction } from "../actions";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  cap: Capability;
  /** 有值的話會去 /api/admin/badges 撈即時數字 */
  badge?: "newOrders" | "unpaid" | "draftArticles";
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "今日營運",
    items: [
      { href: "/admin", label: "儀表板", icon: "📊", cap: "reports.view" },
      { href: "/admin/orders", label: "訂單", icon: "🧾", cap: "orders.view", badge: "newOrders" },
    ],
  },
  {
    label: "商品與內容",
    items: [
      { href: "/admin/products", label: "商品", icon: "📦", cap: "products.view" },
      { href: "/admin/taxonomies", label: "分類", icon: "🗂", cap: "products.edit" },
      { href: "/admin/articles", label: "文章", icon: "📝", cap: "articles.manage", badge: "draftArticles" },
      { href: "/admin/content", label: "前台文案", icon: "🎨", cap: "content.manage" },
    ],
  },
  {
    label: "顧客",
    items: [{ href: "/admin/members", label: "會員", icon: "👥", cap: "members.view" }],
  },
  {
    label: "設定",
    items: [{ href: "/admin/staff", label: "管理者", icon: "🔑", cap: "staff.manage" }],
  },
];

export default function Sidebar({ role, name }: { role: string; name: string }) {
  const pathname = usePathname() || "/admin";
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const [badges, setBadges] = useState<{ newOrders: number; unpaid: number; draftArticles: number }>({
    newOrders: 0, unpaid: 0, draftArticles: 0,
  });
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch("/api/admin/badges", { credentials: "include", cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => { if (!cancelled && j) setBadges(j); })
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(t); };
  }, [pathname]);

  const badgeValue = (k?: NavItem["badge"]) => (k ? badges[k] ?? 0 : 0);

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

  const groups = NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => can(role, i.cap)) }))
    .filter((g) => g.items.length > 0);

  const totalBadges = groups.flatMap((g) => g.items).reduce((s, i) => s + badgeValue(i.badge), 0);

  return (
    <>
      {/* 漢堡：只在手機出現。桌機側欄常駐，按鈕會蓋在導覽上。 */}
      <div className="fixed top-4 right-4 z-[70] md:hidden">
        <button
          aria-label="後台選單"
          onClick={() => setOpen((v) => !v)}
          className="relative w-11 h-11 bg-ink text-cream rounded-full flex items-center justify-center shadow-lg hover:bg-brand-700 transition"
        >
          {totalBadges > 0 && !open && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] bg-red-600 text-white rounded-full flex items-center justify-center font-medium ring-2 ring-cream">
              {totalBadges > 99 ? "99+" : totalBadges}
            </span>
          )}
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          )}
        </button>
      </div>

      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      <aside
        className={`fixed top-0 left-0 h-screen w-[85%] max-w-[320px] bg-white shadow-[6px_0_24px_-8px_rgba(0,0,0,0.35)] z-[65] overflow-y-auto flex flex-col transform transition-transform duration-300 ease-out md:w-64 md:max-w-none md:translate-x-0 md:shadow-none md:border-r md:border-brand-200 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-6 py-6 border-b border-brand-200">
          <p className="text-[10px] tracking-[0.4em] text-brand-500">ADMIN</p>
          <p className="serif text-2xl mt-1">MAPOROO 後台</p>
        </div>

        <nav className="py-2 flex-1">
          {groups.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? "mt-2 pt-2 border-t border-brand-100" : ""}>
              <p className="px-6 pt-2 pb-1 text-[10px] tracking-[0.3em] text-brand-500 uppercase">
                {group.label}
              </p>
              {group.items.map((it) => {
                const active = isActive(it.href);
                const count = badgeValue(it.badge);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-3 px-6 py-2.5 text-sm transition ${
                      active
                        ? "bg-brand-50 text-ink font-medium border-l-2 border-ink"
                        : "text-ink/70 hover:bg-brand-50 border-l-2 border-transparent"
                    }`}
                  >
                    <span className="w-5 text-center">{it.icon}</span>
                    <span className="flex-1">{it.label}</span>
                    {count > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 text-[10px] bg-red-600 text-white rounded-full flex items-center justify-center font-medium">
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-brand-200">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[11px] text-brand-500 mt-0.5">{ROLE_LABEL[role as Role] ?? role}</p>
          <div className="mt-3 flex items-center gap-4">
            <Link href="/" className="text-[12px] text-ink/60 hover:text-ink">在新分頁看前台 ↗</Link>
            <form action={adminLogoutAction}>
              <button type="submit" className="text-[12px] text-red-700 hover:text-red-900 bg-transparent border-none p-0 cursor-pointer font-medium">
                登出
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
