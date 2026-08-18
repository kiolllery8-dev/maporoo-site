import "server-only";

// 前台文案。
//
// 首頁的每一段文字都在這裡登記一個 key。後台可以改，前台讀資料庫；
// 資料庫沒有值就用 fallback，也就是目前寫在程式碼裡的那句話。
//
// 這樣設計的好處：文案改動不需要重新部署，而且就算資料庫是空的
// （例如全新環境、或還沒進後台改過），前台顯示的仍然是完整的內容，
// 不會出現空白區塊。
//
// 新增一段可編輯文案的方式：在 BLOCKS 加一筆，然後在頁面上用 text(key) 取值。

import { all } from "./db";
import { renderMarkdown } from "./markdown";

export type Block = {
  key: string;
  group: string;
  label: string;
  fallback: string;
  multiline?: boolean;
  hint?: string;
};

export const BLOCKS: Block[] = [
  // ── 首頁影片區 ────────────────────────────────────────
  { key: "home.hero.eyebrow", group: "首頁 · 影片區", label: "上方小標", fallback: "MAPOROO ─ Skin Care" },
  {
    key: "home.hero.heading",
    group: "首頁 · 影片區",
    label: "主標題",
    fallback: "肌膚的照顧，\n可以同時有效，且從容。",
    multiline: true,
    hint: "換行會照著顯示。",
  },
  {
    key: "home.hero.lead",
    group: "首頁 · 影片區",
    label: "副標",
    fallback: "以實證成分，配製保濕、提亮與修護的日常保養。",
  },
  { key: "home.hero.cta", group: "首頁 · 影片區", label: "按鈕文字", fallback: "探索全部商品" },

  // ── 品牌主張 ──────────────────────────────────────────
  { key: "home.brand.eyebrow", group: "首頁 · 品牌主張", label: "上方小標", fallback: "MAPOROO 相信" },
  { key: "home.brand.heading", group: "首頁 · 品牌主張", label: "標題", fallback: "有效與舒適，可以並存。" },
  {
    key: "home.brand.body",
    group: "首頁 · 品牌主張",
    label: "內文",
    multiline: true,
    fallback:
      "MAPOROO 在實證的基礎上，選擇可信的成分——PDRN、玻尿酸、胜肽與泛醇 B5——於澳洲配製兼具功效與感官的保養。有效的成分，值得溫和的對待。",
  },

  // ── 品類 ──────────────────────────────────────────────
  { key: "home.collections.heading", group: "首頁 · 品類", label: "標題", fallback: "三個品類" },
  {
    key: "home.collections.lead",
    group: "首頁 · 品類",
    label: "說明",
    multiline: true,
    fallback:
      "從臉、到頭皮、到身體與香氣——MAPOROO 以 PDRN、玻尿酸、胜肽與泛醇 B5 等成分於澳洲配製，適合各種膚況的日常使用。",
  },

  // ── 依需求選擇 ────────────────────────────────────────
  { key: "home.needs.eyebrow", group: "首頁 · 依需求", label: "上方小標", fallback: "依需求選擇" },
  { key: "home.needs.heading", group: "首頁 · 依需求", label: "標題", fallback: "從你的肌膚出發" },

  // ── 成分 ──────────────────────────────────────────────
  { key: "home.ingredients.eyebrow", group: "首頁 · 成分", label: "上方小標", fallback: "配方哲學" },
  { key: "home.ingredients.heading", group: "首頁 · 成分", label: "標題", fallback: "MAPOROO 選擇的成分" },
  {
    key: "home.ingredients.lead",
    group: "首頁 · 成分",
    label: "說明",
    multiline: true,
    fallback: "每一支配方，都建立在科學實證之上。成分的可信，是照顧的前提。",
  },

  // ── 品牌故事 ──────────────────────────────────────────
  { key: "home.story.eyebrow", group: "首頁 · 品牌故事", label: "上方小標", fallback: "MAPOROO 的故事" },
  { key: "home.story.heading", group: "首頁 · 品牌故事", label: "標題", fallback: "關於 MAPOROO" },
  {
    key: "home.story.body",
    group: "首頁 · 品牌故事",
    label: "內文",
    multiline: true,
    fallback:
      "MAPOROO 相信，有效與舒適可以並存。在科學實證的基礎上選擇可信的成分，配製出有效、溫和、令人安心的日常保養。適合每一種膚況，陪你每一次想照顧自己的時刻。",
  },

  // ── 合作聯盟 ──────────────────────────────────────────
  { key: "home.alliance.eyebrow", group: "首頁 · 合作聯盟", label: "上方小標", fallback: "合作聯盟 ─ PARTNERSHIP" },
  { key: "home.alliance.heading", group: "首頁 · 合作聯盟", label: "標題", fallback: "一起把好的配方，分享出去" },
  {
    key: "home.alliance.lead",
    group: "首頁 · 合作聯盟",
    label: "說明",
    multiline: true,
    fallback:
      "MAPOROO 歡迎直播主、團購主與通路夥伴加入。分潤機制清楚、品牌素材完整，合作簡單透明。",
  },

  // ── 服務 ──────────────────────────────────────────────
  { key: "home.service.eyebrow", group: "首頁 · 服務", label: "上方小標", fallback: "官網服務" },
  { key: "home.service.heading", group: "首頁 · 服務", label: "標題", fallback: "MAPOROO 在你身邊" },

  // ── 商品列表頁 ────────────────────────────────────────
  { key: "products.eyebrow", group: "商品列表頁", label: "上方小標", fallback: "ALL PRODUCTS" },
  { key: "products.heading", group: "商品列表頁", label: "頁面標題", fallback: "全部商品" },
  {
    key: "products.lead",
    group: "商品列表頁",
    label: "頁面說明",
    fallback:
      "MAPOROO 全系列共 {n} 件，分為三個品類。你也可以從肌膚需求或成分出發，找到適合現在的自己那一支。",
    multiline: true,
    hint: "{n} 會自動換成目前上架的商品件數。",
  },
  { key: "products.by_concern", group: "商品列表頁", label: "需求標籤區標題", fallback: "依肌膚需求" },
  { key: "products.by_ingredient", group: "商品列表頁", label: "成分標籤區標題", fallback: "依成分" },

  // ── 分類頁共用 ────────────────────────────────────────
  { key: "taxonomy.count_label", group: "分類頁共用", label: "商品件數說明", fallback: "共 {n} 件商品", hint: "{n} 會換成該分類的商品件數。" },
  { key: "taxonomy.other_collections", group: "分類頁共用", label: "其他品類區標題", fallback: "其他品類" },
  { key: "taxonomy.other_concerns", group: "分類頁共用", label: "其他需求區標題", fallback: "其他肌膚需求" },
  { key: "taxonomy.other_ingredients", group: "分類頁共用", label: "其他成分區標題", fallback: "其他成分" },
  { key: "taxonomy.empty", group: "分類頁共用", label: "沒有商品時顯示", fallback: "這個分類目前沒有上架商品。" },

  // ── 閱讀列表頁 ────────────────────────────────────────
  { key: "read.eyebrow", group: "閱讀列表頁", label: "上方小標", fallback: "閱讀 ─ LIBRARY" },
  { key: "read.heading", group: "閱讀列表頁", label: "頁面標題", fallback: "理解，是保養的開始" },
  {
    key: "read.lead",
    group: "閱讀列表頁",
    label: "頁面說明",
    fallback: "這裡是純粹的知識分享——日常保健、趨勢觀察與生活風格。不推銷任何商品。",
    multiline: true,
  },
  { key: "read.empty", group: "閱讀列表頁", label: "還沒有文章時顯示", fallback: "文章正在準備中。" },

  // ── 社群與聯絡 ────────────────────────────────────────
  // 頁尾在根 layout 裡，這幾個 key 是全站共用的。
  // 留空的欄位前台就不顯示那顆按鈕，不會出現連到空白的圖示。
  {
    key: "social.facebook",
    group: "社群與聯絡",
    label: "FACEBOOK 粉絲專頁網址",
    fallback: "",
    hint: "完整網址，例如 https://www.facebook.com/maporoo。留空就不顯示 FB 按鈕。",
  },
  {
    key: "social.line",
    group: "社群與聯絡",
    label: "LINE 官方帳號網址",
    fallback: "",
    hint: "例如 https://lin.ee/xxxxxxx 或 https://line.me/R/ti/p/@maporoo。留空就不顯示 LINE 按鈕。",
  },
  {
    key: "social.instagram",
    group: "社群與聯絡",
    label: "INSTAGRAM 網址",
    fallback: "",
    hint: "例如 https://www.instagram.com/maporoo。留空就不顯示。",
  },
  {
    key: "social.heading",
    group: "社群與聯絡",
    label: "頁尾社群區標題",
    fallback: "追蹤 MAPOROO",
  },
  {
    key: "footer.tagline",
    group: "社群與聯絡",
    label: "頁尾品牌介紹",
    fallback: "以實證成分於澳洲配製，有效而從容的日常保養。適合各種膚況。",
    multiline: true,
  },
  {
    key: "footer.copyright",
    group: "社群與聯絡",
    label: "頁尾版權文字",
    fallback: "© 2026 MAPOROO",
  },
];

const BY_KEY = new Map(BLOCKS.map((b) => [b.key, b]));

/** 一次把資料庫裡有值的文案讀出來。頁面只查一次，不要每個欄位查一次。 */
export function loadContent(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    for (const r of all<{ key: string; value: string }>(`SELECT key, value FROM content_blocks`)) {
      if (r.value != null && r.value !== "") map.set(r.key, r.value);
    }
  } catch {
    // 資料庫還沒建好時（例如 build 階段）就全部走 fallback。
  }
  return map;
}

/**
 * 取一段多行文案並轉成 HTML。
 * 後台的多行欄位是所見即所得的 Markdown 編輯器，前台要照同一支轉譯器排版，
 * 不然後台看到的跟上線的會是兩回事。
 */
export function richText(content: Map<string, string>, key: string): string {
  return renderMarkdown(text(content, key));
}

/** 取一段文案：資料庫優先，沒有就用程式碼裡的預設值。 */
export function text(content: Map<string, string>, key: string): string {
  const v = content.get(key);
  if (v !== undefined) return v;
  return BY_KEY.get(key)?.fallback ?? "";
}
