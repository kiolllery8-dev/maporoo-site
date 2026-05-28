import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "MAPOROO｜願你永遠記得，最初擁抱的溫度",
  description:
    "MAPOROO 是一個關於擁抱、童心、與溫柔陪伴的生活風格品牌。玩偶、文具、居家、配件與禮盒——把擁抱的溫度，包成一份禮物。",
  keywords: ["MAPOROO", "童心", "陪伴", "禮物", "玩偶", "文具", "生活風格"],
  metadataBase: new URL("https://maporoo.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "MAPOROO｜把擁抱的溫度，包成一份禮物",
    description: "玩偶・文具・居家・配件・禮盒。願你永遠記得，最初擁抱的溫度。",
    type: "website",
    locale: "zh_TW",
    url: "https://maporoo.com",
    siteName: "MAPOROO"
  },
  twitter: {
    card: "summary_large_image",
    title: "MAPOROO｜把擁抱的溫度，包成一份禮物",
    description: "願你永遠記得，最初擁抱的溫度。"
  },
  icons: {
    icon: [{ url: "/images/maporoo-logo.webp", type: "image/webp" }],
    apple: "/images/maporoo-logo.webp"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F5EEDC"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="font-sans text-ink bg-champagne-200">
        <Nav />
        <main className="min-h-screen pt-[76px] md:pt-[92px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
