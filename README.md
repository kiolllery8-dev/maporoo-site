# MAPOROO 官網

Next.js 15 品牌官網 ＋ 商品目錄，部署於家用 server，網域 [maporoo.com](https://maporoo.com)。

---

## 技術棧

| 項目 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.0.3 | App Router、`output: standalone` |
| React | 18.3.1 | UI |
| TypeScript | 5.6.3 | 型別 |
| Tailwind CSS | 3.4.14 | 樣式（搭配 `globals.css` 的 CSS 變數）|
| Framer Motion | 11.11.17 | 滾輪動效 |

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start
```

---

## 網站結構

| 路由 | 內容 | 數量 |
|------|------|-----:|
| `/` | 品牌首頁（影片 hero、品類、精選商品、成分、故事）| 1 |
| `/products` | 全部商品，依品類分組 | 1 |
| `/products/[slug]` | 商品頁（相簿、特色、使用方式、FAQ、加入購物袋）| 14 |
| `/collections/[slug]` | 品類頁：`facial-care`／`hair-scalp`／`bath-fragrance` | 3 |
| `/concerns/[slug]` | 肌膚需求頁：保濕補水、提亮勻淨、緊緻彈潤、清潔卸妝、溫和敏弱、頭皮養護、毛躁修護 | 7 |
| `/ingredients/[slug]` | 成分知識頁：PDRN、玻尿酸、胜肽、泛醇 B5、咖啡因 | 5 |
| `/cart` | 購物袋（`noindex`）| 1 |

共 **32 個可索引頁面**。品類／需求／成分三軸交叉，同一件商品可從三個方向被找到。

---

## 資料層

商品資料集中在 `app/lib/catalog.ts`，是**唯一的真實來源**——
商品頁、分類頁、sitemap、JSON-LD、`llms.txt` 全部由它產生。新增一件商品只要改這個檔案，
所有頁面、結構化資料與 sitemap 都會自動跟上。

| 檔案 | 內容 |
|------|------|
| `app/lib/catalog.ts` | 14 件商品 ＋ 品類／需求／成分三組分類定義 |
| `app/lib/product-images.ts` | 商品圖路徑（依 SKU 索引，112 張，機器產生勿手改）|
| `app/lib/site.ts` | 站台識別字串，供 metadata／JSON-LD／sitemap 共用 |
| `app/lib/cart.tsx` | 購物袋狀態（React context ＋ localStorage）|

商品圖由本站自行託管於 `public/images/products/`（112 張，約 17MB），
檔名採商品 slug（例 `glow-cream-50ml-1.jpg`），讓路徑本身帶關鍵字權重。
`next.config.mjs` 的 `remotePatterns` 刻意留空——沒有任何外部圖片來源，
誤加外站 `<Image src>` 會直接讓 build 失敗，而不是悄悄新增第三方依賴。

---

## SEO / AEO / GEO

| 項目 | 位置 |
|------|------|
| `sitemap.xml` | `app/sitemap.ts`（由 catalog 產生）|
| `robots.txt` | `app/robots.ts`（允許 AI 爬蟲，排除 `/cart`）|
| `llms.txt` | `app/llms.txt/route.ts`（給語言模型讀的純文字站台索引）|
| JSON-LD | `app/components/JsonLd.tsx` — Organization／WebSite／Product＋Offer／BreadcrumbList／FAQPage／ItemList |
| canonical | 每個頁面的 `generateMetadata` 各自輸出 |
| FAQ | 每個商品頁與成分頁的問答同時是畫面內容與 `FAQPage` 結構化資料 |

FAQ 之所以同時出現在畫面與結構化資料，是因為 Google 要求兩者一致；也讓答案引擎能直接引用。

---

## 法遵

商品文案依 `000_Agent/knowledge/compliance-redlines.md` 改寫，
逐詞對照與未解決事項記錄於 **[`PRODUCT-COPY-COMPLIANCE.md`](PRODUCT-COPY-COMPLIANCE.md)**。

> [!IMPORTANT]
> 品名保留原文（含「凍齡」「美白」「逆齡」）是老闆 2026-08-05 的決定，
> 為的是與其他通路一致。這是已知的殘留風險，細節見上述文件。
> 新增或修改任何對外文案前，請先讀該文件。

---

## 部署

推上 `main` 由 GitHub Actions 自架 runner 自動部署（`.github/workflows/deploy.yml`）：
`docker compose up -d --build` → 容器健康檢查 → 外部 `https://maporoo.com` 檢查。

DNS 在 Cloudflare（zone `maporoo.com`），A record 指向家用 server 固定 IP，橘雲 ON、SSL 模式 `full`，
origin 共用 `auslife.tw` 的 Let's Encrypt 憑證。

---

## 尚未完成

- [ ] **線上結帳**——購物袋（加入、改數量、移除、小計、運費）已可用，但「前往結帳」是停用狀態。
      需要先決定金流商（綠界／藍新）並取得商店代號與金鑰，再接訂單、物流與發票。
- [ ] 首頁 LIBRARY 六篇文章目前有標題無內容，點不進去
