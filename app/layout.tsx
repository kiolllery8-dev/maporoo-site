import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrezNu 碧森妮｜呼吸清新的空氣，是生命的泉源",
  description:
    "鴻元生技六十年——從一份對天然植物的偏執之愛開始。BrezNu 碧森妮，致力於芳香療法的推廣與應用，為人們嚴選頂級的天然植翠精華。",
  keywords: ["BrezNu", "碧森妮", "天然精油", "芳療", "芳香療法", "鴻元生技"],
  metadataBase: new URL("https://breznu.intelliverse.tw"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "BrezNu 碧森妮｜品牌故事",
    description: "六十年。一份對天然植物的偏執之愛。",
    type: "website",
    locale: "zh_TW",
    url: "https://breznu.intelliverse.tw",
    siteName: "BrezNu 碧森妮"
  },
  twitter: {
    card: "summary_large_image",
    title: "BrezNu 碧森妮｜品牌故事",
    description: "六十年。一份對天然植物的偏執之愛。"
  },
  icons: {
    icon: [
      { url: "/images/logo-breznu.png", type: "image/png" }
    ],
    apple: "/images/logo-breznu.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#DCE3D6"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="preload"
          as="image"
          href="/images/bg-spa-green.png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/bg-paper-waves.png"
        />
      </head>
      <body className="text-ink font-sans">{children}</body>
    </html>
  );
}
