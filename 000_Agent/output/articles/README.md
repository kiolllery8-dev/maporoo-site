# articles — 教育文章暫存區

`/read` 與 `/read/[slug]` 路由上線前，02 內容編輯部產出的文章先以 Markdown 存放在這裡。

檔名 ＝ 未來的 slug（例：`what-is-pdrn.md`）。

每篇檔頭請帶上：

```yaml
---
slug: why-is-pdrn-trending
type: C                   # A 日常保健 / B 名人醫師經驗 / C 醫美趨勢科普 / D 生活推薦
category: 趨勢觀察        # 日常保健 / 趨勢觀察 / 生活風格
title: PDRN 最近為什麼這麼夯？不是新成分、3 件你該先知道的事
description:              # meta description，150 字內
targetKeyword: PDRN
readingTime: 3 分鐘
sources:                  # 型態 B/C 必填：可查證的出處
  - 出處名稱 / 日期 / 連結
disclaimer: true          # 型態 B/C 必須為 true（非醫療建議聲明）
status: draft             # draft / 待04法遵 / 待08語調 / 可發布
reviewId:                 # 04 法遵通過後填入審查編號
---
```

> [!CAUTION]
> **沒有 `relatedProducts` 欄位，這是刻意的。**
> 部落格零商品置入（老闆 2026-08-05 拍板）——不提商品名、不放商品連結、不寫擦邊推薦。
> 誰都不准把這個欄位加回來。規則見 `000_Agent/knowledge/maporoo-brand-dna.md` 第三節。

路由上線後，這裡的檔案搬進正式內容來源，本資料夾保留為草稿區。
