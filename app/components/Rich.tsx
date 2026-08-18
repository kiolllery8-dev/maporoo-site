// 後台多行欄位（Markdown）在前台的呈現。
//
// 內容經過 app/lib/markdown.ts 轉譯——那支先跳脫再解析，原始 HTML 進不來，
// 所以這裡用 dangerouslySetInnerHTML 是安全的：能出現的標籤只有轉譯器產生的那幾種。

export default function Rich({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={["cms", className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
