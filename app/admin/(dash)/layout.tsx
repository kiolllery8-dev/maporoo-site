import Link from "next/link";
import { requireAdmin } from "../../lib/admin";
import { can, ROLE_LABEL, type Capability, type Role } from "../../lib/permissions";
import { adminLogoutAction } from "../actions";

// 後台的權限守衛與外框。/admin/login 與 /admin/password 不在這個 group 裡，
// 所以不會被守衛擋住，也就不會導轉成迴圈。

export const dynamic = "force-dynamic";

// 只列已經蓋好的頁面。文章／文案／報表三個模組的資料表已就緒，介面還在做，
// 做好一個就把它加進來——寧可少一個連結，也不要點下去是 404。
//
// 每一項都綁一個 capability：角色沒有那個權限，連結就不顯示。
// （隱藏連結只是體貼，真正的把關在每個頁面與 action 自己的 requireAdmin。）
const NAV: Array<{ href: string; label: string; cap: Capability }> = [
  { href: "/admin", label: "總覽", cap: "reports.view" },
  { href: "/admin/orders", label: "訂單", cap: "orders.view" },
  { href: "/admin/members", label: "會員", cap: "members.view" },
  { href: "/admin/products", label: "商品", cap: "products.view" },
  { href: "/admin/articles", label: "文章", cap: "articles.manage" },
  { href: "/admin/staff", label: "管理者", cap: "staff.manage" },
];

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const nav = NAV.filter((n) => can(admin.role, n.cap));
  const roleLabel = ROLE_LABEL[admin.role as Role] ?? admin.role;

  return (
    <>
      <header
        style={{
          borderBottom: "1px solid var(--line)",
          background: "var(--paper2)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", padding: "14px 30px" }}>
          <Link href="/admin" style={{ fontWeight: 900, letterSpacing: ".24em", fontSize: "1rem" }}>
            MAPOROO
          </Link>
          <nav style={{ display: "flex", gap: 22, flexWrap: "wrap", flex: 1, fontSize: ".93rem", fontWeight: 700 }}>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} style={{ color: "var(--soft)" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <span style={{ fontSize: ".85rem", color: "var(--mute)", fontWeight: 500 }}>
            {admin.name || admin.username}
            <span
              style={{
                marginLeft: 8,
                padding: "2px 8px",
                background: "var(--ink)",
                color: "var(--paper)",
                fontSize: ".72rem",
                letterSpacing: ".1em",
                fontWeight: 700,
              }}
            >
              {roleLabel}
            </span>
          </span>
          <Link href="/" style={{ fontSize: ".85rem", color: "var(--mute)", fontWeight: 500 }}>
            看前台
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
                fontSize: ".85rem",
                color: "var(--soft)",
                fontWeight: 700,
              }}
            >
              登出
            </button>
          </form>
        </div>
      </header>

      <main className="wrap" style={{ padding: "44px 30px 90px" }}>
        {children}
      </main>
    </>
  );
}
