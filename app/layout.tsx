import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { CartProvider } from "./lib/cart";
import { OrganizationLd, WebSiteLd } from "./components/JsonLd";
import { SITE } from "./lib/site";

// "醫學實證"／"醫美" removed 2026-08-05: 身分誤導用語, see
// 000_Agent/knowledge/compliance-redlines.md §2.
export const metadata: Metadata = {
  title: {
    default: "MAPOROO｜肌膚的照顧，可以同時有效，且從容",
    template: "%s"
  },
  description:
    "MAPOROO 是澳洲配製的保養品牌，商品涵蓋臉部保養、頭皮髮絲與沐浴香氛。以 PDRN、玻尿酸、胜肽與泛醇 B5 等成分配製——有效的成分，值得溫和的對待。",
  keywords: ["MAPOROO", "PDRN", "玻尿酸", "胜肽", "泛醇 B5", "保濕", "頭皮護理", "精油香水", "澳洲保養品"],
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  openGraph: {
    title: "MAPOROO｜有效與舒適，可以並存",
    description: "以實證成分配製，有效而從容的日常保養。臉部保養、頭皮髮絲與沐浴香氛。",
    type: "website",
    locale: "zh_TW",
    url: SITE.url,
    siteName: "MAPOROO"
  },
  twitter: {
    card: "summary_large_image",
    title: "MAPOROO｜有效與舒適，可以並存",
    description: "以實證成分配製，有效而從容的日常保養。"
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
        <OrganizationLd />
        <WebSiteLd />
        <CartProvider>
          <Nav />
          {/* Film hero bleeds under the fixed 64px header; sections flow below. */}
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
