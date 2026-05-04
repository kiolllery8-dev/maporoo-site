# BrezNu 碧森妮｜品牌故事官網

仿 [diaominasia.com](https://www.diaominasia.com/) 的滾輪敘事架構，套用 [breznu.com](https://breznu.com/) 的品牌故事內容，重新打造的純品牌故事頁。

---

## 設計定調

- **不賣商品**——首頁是品牌故事頁，未來再加 CTA 連結到購買頁
- **滾輪敘事**——一頁一頁帶出 60 年的品牌故事
- **日系極簡 + 奶油色**——以米奶白為主，茶褐為點綴，明朝體 + 黑體混排

## 故事章節順序

1. **Hero** — 「呼吸清新的空氣，是生命的泉源」
2. **Prologue 序** — 一個品牌的誕生絕非偶然
3. **1960s 起源** — 創辦人謝炳欽，對天然植物的偏執之愛
4. **1980s 走向世界** — GC-MS 為品質把關
5. **1990s 品牌誕生** — 從工業轉型品牌
6. **品牌名意義** — BrezNu 的字義
7. **時代的回應** — 紛擾世代的精油使命（深色反白章節）
8. **信念** — 「只想發展天然品」
9. **Epilogue 結語**
10. **Footer**

## 技術棧

| 項目 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.0.3 | App Router |
| React | 18.3.1 | UI |
| TypeScript | 5.6.3 | 型別 |
| Tailwind CSS | 3.4.14 | 樣式 |
| Framer Motion | 11.11.17 | 滾輪 fade-in / parallax |

## 啟動方式

```bash
npm install
npm run dev
```

開啟 http://localhost:3000

正式部署：

```bash
npm run build
npm run start
```

## 配色（在 `tailwind.config.ts` 調整）

| Token | Hex | 用途 |
|-------|-----|------|
| `cream` | #FAF5EA | 主背景（奶油白）|
| `cream-200` | #F2EBDA | 次背景（深一階奶油）|
| `ink` | #2A241D | 主要文字（暖深棕）|
| `ink-soft` | #645C50 | 次要文字 |
| `tea-deep` | #76583B | 重點文字 / 標題強調 |
| `tea` | #A4845A | 線條 / 副標 |
| `tea-light` | #D4A574 | 反白章節點綴 |

## 圖片

舊站圖片已下載到 `public/images/`：

- `hero-01.jpg` ~ `hero-03.jpg`：舊站 banner（用於 1960s / 1980s / 1990s 章節）
- `logo-breznu.png`：碧森妮 logo
- `logo-hongyuan.png`：鴻元生技 logo

## 後續可加的功能

- [ ] 加入「商品系列」連結頁，但首頁仍維持品牌故事不變
- [ ] 加入「芳療 Blog」入口
- [ ] 加入聯名品牌專區（白沙屯、米飛兔）
- [ ] 加入「諮詢服務 / 課程」CTA
