import type { Metadata } from "next";
import { ensureAdminExists } from "../lib/admin";

// 這一層刻意不做權限檢查——/admin/login 也在底下，擋在這裡會造成無限導轉。
// 守衛在 (dash) 這個 route group 的 layout 裡。

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MAPOROO 後台",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // 資料庫還沒有管理者的話，在這裡建立初始帳號並把密碼印進伺服器 log。
  ensureAdminExists();

  return <div className="min-h-screen bg-cream">{children}</div>;
}
