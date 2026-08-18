import { requireAdmin } from "../../lib/admin";
import Sidebar from "./Sidebar";

// 版面移植自 auslife-www 的 app/admin/layout.tsx：
// 桌機用 md:pl-64 把內容推到常駐側欄右邊；
// 手機保留 pr-16，讓標題與按鈕不會躲在右上角那顆漢堡底下。
//
// /admin/login 與 /admin/password 不在這個 route group 裡，
// 所以不會被權限守衛擋住，也就不會導轉成迴圈。

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream md:pl-64">
      <Sidebar role={admin.role} name={admin.name || admin.username} />
      <div className="container-x py-6 md:py-10 pr-16 md:pr-0">{children}</div>
    </div>
  );
}
