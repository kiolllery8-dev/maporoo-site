import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrezNu 碧森妮｜呼吸清新的空氣，是生命的泉源",
  description:
    "鴻元生技六十年——從一份對天然植物的偏執之愛開始。BrezNu 碧森妮，致力於芳香療法的推廣與應用，為人們嚴選頂級的天然植翠精華。",
  keywords: ["BrezNu", "碧森妮", "天然精油", "芳療", "芳香療法", "鴻元生技"],
  metadataBase: new URL("https://breznu.intelliverse.tw"),
  openGraph: {
    title: "BrezNu 碧森妮｜品牌故事",
    description: "六十年。一份對天然植物的偏執之愛。",
    type: "website",
    locale: "zh_TW",
    url: "https://breznu.intelliverse.tw"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <body className="bg-cream text-ink font-sans">{children}</body>
    </html>
  );
}
