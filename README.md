# MAPOROO｜品牌故事官網

仿 [diaominasia.com](https://www.diaominasia.com/) 的滾輪敘事架構，重新打造的 MAPOROO 純品牌故事頁。

---

## 設計定調

- **不賣商品**——首頁是品牌故事頁，未來再加 CTA 連結到購買頁
- **滾輪敘事**——一頁一頁帶出「童心、陪伴、溫柔」的品牌靈魂
- **奶油白＋金茶褐**——以米奶白為主，茶褐為點綴，明朝體 + 黑體混排

## 故事章節順序

1. **Hero** — 「願你永遠記得，最初擁抱的溫度」
2. **Prologue 序** — 一個品牌的誕生絕非偶然
3. **Ch.01 起源** — 從一份對童心的固執守候開始
4. **Ch.02 走出小屋** — 為每一份心意精緻把關
5. **Ch.03 品牌誕生** — MAPOROO 於是誕生
6. **The Name 品牌名** — Ma · Po · Roo 三個音節
7. **時代的回應** — 先伸手抱抱別人
8. **Belief 信念** — 「只想做最有溫度的小事」
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
| `ink` | #1F1A14 | 主要文字（暖深棕）|
| `ink-soft` | #4A4337 | 次要文字 |
| `tea-deep` | #5C3F22 | 重點文字 / 標題強調 |
| `tea` | #8A6840 | 線條 / 副標 |
| `tea-light` | #B88751 | 反白章節點綴 |

## 圖片

- `public/images/maporoo-logo.webp`：MAPOROO 品牌 LOGO（金底＋黑色小兔子）
- `public/images/hero-01.jpg` ~ `hero-03.jpg`：章節 banner（暫用原架構素材，未來可替換為品牌主視覺）
- `public/images/bg-spa-green.png` / `bg-paper-waves.png` / `hero-hand-mint.png`：站底背景與 hero 圖（之後可換成 MAPOROO 風格素材）

## 後續可加的功能

- [ ] 「商品系列」連結頁
- [ ] 「合作詢問」表單
- [ ] 替換 hero / chapter 內頁圖為 MAPOROO 原創插畫
- [ ] 配色細調至 LOGO 金色（#D9A933 系）
