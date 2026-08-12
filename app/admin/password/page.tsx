import { redirect } from "next/navigation";
import { currentAdmin } from "../../lib/auth";
import { adminChangePasswordAction } from "../actions";
import { AdminField, AdminNotice, AdminSubmit } from "../ui";

// 刻意放在 (dash) group 外面：帶著 must_change_password 旗標的管理者會被
// 守衛導來這裡，如果這頁也在 group 裡就會無限導轉。

export const dynamic = "force-dynamic";

export default async function AdminPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; m?: string; first?: string }>;
}) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login?next=/admin/password");
  const sp = await searchParams;

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "110px 30px" }}>
      <p style={{ fontSize: ".78rem", letterSpacing: ".26em", color: "var(--accent)", fontWeight: 700 }}>
        MAPOROO 後台
      </p>
      <h1 style={{ margin: "16px 0 18px", fontSize: "1.8rem", fontWeight: 900 }}>
        {sp.first ? "先換一組你自己的密碼" : "修改密碼"}
      </h1>
      <p style={{ marginBottom: 32, color: "var(--soft)", fontSize: ".97rem", lineHeight: 1.9 }}>
        {sp.first
          ? "這個帳號目前用的是系統產生的初始密碼。換掉之後才能進入後台。"
          : "密碼更新後，其他裝置上的登入會全部登出，只保留你目前這一台。"}
      </p>

      <AdminNotice e={sp.e} m={sp.m} />

      <form action={adminChangePasswordAction}>
        <AdminField label="目前的密碼" name="current" type="password" required autoComplete="current-password" />
        <AdminField
          label="新密碼"
          name="next"
          type="password"
          required
          autoComplete="new-password"
          hint="至少 8 個字元，需要同時包含英文字母與數字。"
        />
        <AdminSubmit>更新密碼</AdminSubmit>
      </form>
    </div>
  );
}
