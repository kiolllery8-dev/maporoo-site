import Link from "next/link";

// 會員區的分頁列。放在 Shell 底下，讓會員知道自己有哪些功能——
// 原本全部塞在 /account 一頁裡，訂單、地址、收藏都看不到入口。

// 只列已經蓋好的頁面。收藏功能的資料表已就緒，介面還沒做——
// 寧可少一個分頁，也不要點下去是 404。
const TABS = [
  { href: "/account", label: "總覽" },
  { href: "/account/orders", label: "訂單" },
  { href: "/account/addresses", label: "收件地址" },
  { href: "/account/password", label: "密碼" },
];

export default function AccountNav({ current }: { current: string }) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 26,
        flexWrap: "wrap",
        paddingBottom: 16,
        borderBottom: "1px solid var(--line)",
        marginBottom: 34,
        fontSize: ".95rem",
        fontWeight: 700,
      }}
    >
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          style={{ color: t.href === current ? "var(--ink)" : "var(--mute)" }}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
