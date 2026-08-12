import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentMember } from "../../lib/auth";
import { loginAction } from "../actions";
import { Aside, Field, Notice, Shell, Submit, TextLink } from "../ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "會員登入｜MAPOROO",
  description: "登入 MAPOROO 會員帳號，查看訂單、收藏與會員禮遇。",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; m?: string; next?: string }>;
}) {
  if (await currentMember()) redirect("/account");
  const sp = await searchParams;

  return (
    <Shell eyebrow="會員登入" title="歡迎回來" lead="登入之後可以查看訂單、管理收藏與收件資訊。">
      <Notice e={sp.e} m={sp.m} />
      <form action={loginAction}>
        <input type="hidden" name="next" value={sp.next ?? ""} />
        <Field label="EMAIL" name="email" type="email" required autoComplete="email" />
        <Field label="密碼" name="password" type="password" required autoComplete="current-password" />
        <Submit>登入</Submit>
      </form>
      <Aside>
        還沒有帳號？<TextLink href="/account/register">註冊一個</TextLink>
      </Aside>
    </Shell>
  );
}
