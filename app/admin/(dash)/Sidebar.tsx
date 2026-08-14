"use client";

// 用 client component 只為了 usePathname——layout 拿不到目前路徑，
// 選單就無法標出你正在哪一頁。權限判斷仍以伺服器端為準：
// 這裡的 role 是 layout 從 requireAdmin 拿到後傳進來的，
// 而每一頁與每一個 action 都會自己再檢查一次。
import Link from "next/link";
import { usePathname } from "next/navigation";
import { can, ROLE_LABEL, type Capability, type Role } from "../../lib/permissions";
import { adminLogoutAction } from "../actions";

// 左側分組選單。
//
// 每一項都綁一個 capability：角色沒有那個權限，連結就不出現。
// 也只列**已經蓋好而且點進去有東西可以改**的頁面——寧可少一個連結，
// 也不要點下去是 404 或一片空白。

type Item = { href: string; label: string; cap: Capability; icon: string };
type Group = { title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "今日營運",
    items: [
      { href: "/admin", label: "儀表板", cap: "reports.view", icon: "▦" },
      { href: "/admin/orders", label: "訂單", cap: "orders.view", icon: "▤" },
    ],
  },
  {
    title: "商品與內容",
    items: [
      { href: "/admin/products", label: "商品", cap: "products.view", icon: "◈" },
      { href: "/admin/articles", label: "文章", cap: "articles.manage", icon: "✎" },
      { href: "/admin/content", label: "前台文案", cap: "content.manage", icon: "❝" },
    ],
  },
  {
    title: "顧客",
    items: [{ href: "/admin/members", label: "會員", cap: "members.view", icon: "◍" }],
  },
  {
    title: "設定",
    items: [{ href: "/admin/staff", label: "管理者", cap: "staff.manage", icon: "⚿" }],
  },
];

export default function Sidebar({ role, name }: { role: string; name: string }) {
  const current = usePathname() ?? "/admin";

  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => can(role, i.cap)),
  })).filter((g) => g.items.length > 0);

  return (
    <aside
      style={{
        width: 210,
        flexShrink: 0,
        borderRight: "1px solid var(--line)",
        background: "var(--paper2)",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "24px 22px 20px", borderBottom: "1px solid var(--line)" }}>
        <p style={{ fontSize: ".68rem", letterSpacing: ".26em", color: "var(--accent)", fontWeight: 700 }}>
          ADMIN
        </p>
        <p style={{ marginTop: 8, fontSize: "1.2rem", fontWeight: 900, letterSpacing: ".04em" }}>
          MAPOROO 後台
        </p>
      </div>

      <nav style={{ flex: 1, padding: "18px 0" }}>
        {groups.map((g) => (
          <div key={g.title} style={{ marginBottom: 22 }}>
            <p
              style={{
                padding: "0 22px 8px",
                fontSize: ".7rem",
                letterSpacing: ".2em",
                color: "var(--mute)",
                fontWeight: 700,
              }}
            >
              {g.title}
            </p>
            {g.items.map((i) => {
              // /admin 是所有路徑的前綴，只有完全相等時才算選中，
              // 否則進任何子頁都會看到「儀表板」被點亮。
              const active = i.href === "/admin" ? current === "/admin" : current.startsWith(i.href);
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "9px 22px",
                    fontSize: ".95rem",
                    fontWeight: 700,
                    color: active ? "var(--ink)" : "var(--soft)",
                    background: active ? "var(--paper)" : "transparent",
                    borderLeft: active ? "2px solid var(--ink)" : "2px solid transparent",
                  }}
                >
                  <span style={{ color: active ? "var(--ink)" : "var(--mute)", width: 14 }}>{i.icon}</span>
                  {i.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: "16px 22px 22px", borderTop: "1px solid var(--line)" }}>
        <p style={{ fontSize: ".85rem", color: "var(--ink)", fontWeight: 700 }}>{name}</p>
        <p style={{ fontSize: ".75rem", color: "var(--mute)", marginTop: 2 }}>
          {ROLE_LABEL[role as Role] ?? role}
        </p>
        <p style={{ marginTop: 14, display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/" style={{ fontSize: ".82rem", color: "var(--soft)", fontWeight: 700 }}>
            看前台 ↗
          </Link>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
                fontFamily: "inherit",
                fontSize: ".82rem",
                color: "#9B4A2F",
                fontWeight: 700,
              }}
            >
              登出
            </button>
          </form>
        </p>
      </div>
    </aside>
  );
}
