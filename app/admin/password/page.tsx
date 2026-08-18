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
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px]">
        <div className="bg-white border border-brand-200 shadow-soft p-8">
          <p className="text-[11px] tracking-[0.3em] text-brand-600">MAPOROO 後台</p>
          <h1 className="serif text-2xl mt-2 mb-3">
            {sp.first ? "先換一組你自己的密碼" : "修改密碼"}
          </h1>
          <p className="mb-6 text-sm text-ink/70 leading-relaxed">
            {sp.first
              ? "這個帳號目前用的是別人設定的初始密碼。換掉之後才能進入後台。"
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
      </div>
    </div>
  );
}
