import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentMember } from "../../lib/auth";
import { registerAction } from "../actions";
import { Aside, Field, Notice, Shell, Submit, TextLink } from "../ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "加入會員｜MAPOROO",
  description: "加入 MAPOROO 會員，享有首購禮、回購點數與會員專屬活動。",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; m?: string }>;
}) {
  if (await currentMember()) redirect("/account");
  const sp = await searchParams;

  return (
    <Shell
      eyebrow="加入會員"
      title="建立你的 MAPOROO 帳號"
      lead="留下 Email 與密碼就可以開始。姓名與電話之後在會員中心補填也行。"
    >
      <Notice e={sp.e} m={sp.m} />
      <form action={registerAction}>
        <Field label="EMAIL" name="email" type="email" required autoComplete="email" />
        <Field
          label="密碼"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          hint="至少 8 個字元，需要同時包含英文字母與數字。"
        />
        <Field label="姓名" name="name" autoComplete="name" />
        <Field label="手機" name="phone" type="tel" autoComplete="tel" />
        <Submit>建立帳號</Submit>
      </form>
      <Aside>
        已經有帳號了？<TextLink href="/account/login">直接登入</TextLink>
        <br />
        建立帳號代表你同意 MAPOROO 蒐集並使用上述資料以提供會員服務。
        隱私權政策與會員條款正在準備中，上線後會在這裡附上連結。
      </Aside>
    </Shell>
  );
}
