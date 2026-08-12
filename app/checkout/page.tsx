import type { Metadata } from "next";
import Link from "next/link";
import { currentMember } from "../lib/auth";
import { availableMethods, METHOD_LABEL } from "../lib/payment";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "結帳｜MAPOROO",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  missing: "請把收件人、手機、Email 與地址填完整。",
  empty: "購物袋是空的，沒有東西可以結帳。",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const sp = await searchParams;
  const member = await currentMember();

  // 付款方式由伺服器決定（availableMethods 是 server-only），再交給表單顯示。
  const methods = availableMethods().map((m) => ({ value: m, label: METHOD_LABEL[m] }));

  const error = sp.e ? ERRORS[sp.e] ?? "訂單沒有送出，請再試一次。" : "";

  return (
    <div className="wrap" style={{ paddingTop: 120, paddingBottom: 110, minHeight: "70vh" }}>
      <p className="eyebrow">CHECKOUT</p>
      <h1 style={{ marginTop: 16, fontSize: "clamp(30px,4.6vw,48px)" }}>結帳</h1>

      {!member && (
        <p style={{ marginTop: 18, color: "var(--soft)", fontSize: ".98rem", lineHeight: 1.9 }}>
          目前以訪客身分結帳。
          <Link href="/account/login?next=/checkout" className="lnk-dark" style={{ marginLeft: 8 }}>
            登入會員
          </Link>
          之後可以在會員中心查到這筆訂單。
        </p>
      )}

      {error && (
        <p
          role="status"
          style={{
            margin: "26px 0 0",
            padding: "13px 16px",
            borderLeft: "2px solid #9B4A2F",
            background: "var(--paper2)",
            color: "#7A3722",
            fontSize: ".98rem",
            fontWeight: 500,
          }}
        >
          {error}
        </p>
      )}

      <CheckoutForm
        methods={methods}
        defaults={{
          email: member?.email ?? "",
          name: member?.name ?? "",
          phone: member?.phone ?? "",
        }}
      />
    </div>
  );
}
