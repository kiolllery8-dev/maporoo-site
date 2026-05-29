import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "MAPOROO｜肌膚的照顧，可以同時有效，且從容",
  description:
    "MAPOROO 以醫學實證的成分——PDRN、外泌體、胜肽與玻尿酸——配製美白、保濕與修復的日常保養。有效、溫和，適合各種膚況。",
  keywords: ["MAPOROO", "醫美保養", "PDRN", "外泌體", "胜肽", "玻尿酸", "保濕", "修復", "亮白"],
  metadataBase: new URL("https://maporoo.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "MAPOROO｜有效與舒適，可以並存",
    description: "以醫學實證的成分，配製有效而從容的日常保養。",
    type: "website",
    locale: "zh_TW",
    url: "https://maporoo.com",
    siteName: "MAPOROO"
  },
  twitter: {
    card: "summary_large_image",
    title: "MAPOROO｜有效與舒適，可以並存",
    description: "以醫學實證的成分，配製有效而從容的日常保養。"
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
  themeColor: "#F2EFE8"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <Nav />
        {/* Film hero bleeds under the fixed 64px header; sections flow below. */}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
