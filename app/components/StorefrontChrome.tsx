"use client";

import { usePathname } from "next/navigation";

// 後台有自己的頁首與版面，前台的 Nav / Footer 不該出現在 /admin 底下。
// 用 client component 判斷路徑，讓前台頁面維持靜態產生。

export default function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
