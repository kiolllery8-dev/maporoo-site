import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentMember } from "../../lib/auth";
import { changePasswordAction } from "../actions";
import AccountNav from "../AccountNav";
import { Aside, Field, Notice, Shell, Submit, TextLink } from "../ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "修改密碼｜MAPOROO",
  robots: { index: false, follow: false },
};

export default async function PasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; m?: string }>;
}) {
  const member = await currentMember();
  if (!member) redirect("/account/login?next=/account/password");
  const sp = await searchParams;

  return (
    <Shell
      eyebrow="會員中心"
      title="換一組新的密碼"
      lead="密碼更新後，其他裝置上的登入會全部登出，只保留你目前這一台。"
      narrow={false}
    >
      <AccountNav current="/account/password" />
      <Notice e={sp.e} m={sp.m} />
      <form action={changePasswordAction}>
        <Field label="目前的密碼" name="current" type="password" required autoComplete="current-password" />
        <Field
          label="新密碼"
          name="next"
          type="password"
          required
          autoComplete="new-password"
          hint="至少 8 個字元，需要同時包含英文字母與數字。"
        />
        <Submit>更新密碼</Submit>
      </form>
      <Aside>
        <TextLink href="/account">回會員中心</TextLink>
      </Aside>
    </Shell>
  );
}
