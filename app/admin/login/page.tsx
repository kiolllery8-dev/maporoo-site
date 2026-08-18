import { redirect } from "next/navigation";
import { currentAdmin } from "../../lib/auth";
import { adminLoginAction } from "../actions";
import { AdminField, AdminNotice, AdminSubmit } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; m?: string; next?: string }>;
}) {
  if (await currentAdmin()) redirect("/admin");
  const sp = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px]">
        <div className="bg-white border border-brand-200 shadow-soft p-8">
          <p className="text-[11px] tracking-[0.3em] text-brand-600">MAPOROO 後台</p>
          <h1 className="serif text-2xl mt-2 mb-7">管理者登入</h1>

          <AdminNotice e={sp.e} m={sp.m} />

          <form action={adminLoginAction}>
            <input type="hidden" name="next" value={sp.next ?? ""} />
            <AdminField label="帳號" name="username" required autoComplete="username" />
            <AdminField label="密碼" name="password" type="password" required autoComplete="current-password" />
            <AdminSubmit>登入</AdminSubmit>
          </form>
        </div>

        <p className="mt-5 text-xs text-ink/50 leading-relaxed">
          忘記密碼請找負責人到「管理者」頁面替你重設，重設後第一次登入會要求你立刻換一組自己的。
        </p>
      </div>
    </div>
  );
}
