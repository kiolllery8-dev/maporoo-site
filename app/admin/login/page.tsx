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
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "120px 30px" }}>
      <p style={{ fontSize: ".78rem", letterSpacing: ".26em", color: "var(--accent)", fontWeight: 700 }}>
        MAPOROO 後台
      </p>
      <h1 style={{ margin: "16px 0 34px", fontSize: "1.9rem", fontWeight: 900 }}>管理者登入</h1>

      <AdminNotice e={sp.e} m={sp.m} />

      <form action={adminLoginAction}>
        <input type="hidden" name="next" value={sp.next ?? ""} />
        <AdminField label="帳號" name="username" required autoComplete="username" />
        <AdminField label="密碼" name="password" type="password" required autoComplete="current-password" />
        <AdminSubmit>登入</AdminSubmit>
      </form>

      <p style={{ marginTop: 34, fontSize: ".85rem", color: "var(--mute)", lineHeight: 1.9 }}>
        第一次使用？系統會在資料庫還沒有管理者時自動建立帳號，
        密碼印在伺服器 log（<code>docker logs maporoo</code>），只印一次。
      </p>
    </div>
  );
}
