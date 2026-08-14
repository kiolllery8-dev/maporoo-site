import { requireAdmin } from "../../lib/admin";
import Sidebar from "./Sidebar";

// 後台的權限守衛與版面。
// /admin/login 與 /admin/password 不在這個 route group 裡，
// 所以不會被守衛擋住，也就不會導轉成迴圈。

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div style={{ display: "flex", alignItems: "flex-start", minHeight: "100vh" }}>
      <Sidebar role={admin.role} name={admin.name || admin.username} />
      <main style={{ flex: 1, minWidth: 0, padding: "34px 40px 90px" }}>{children}</main>
    </div>
  );
}
