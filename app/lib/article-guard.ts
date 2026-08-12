import "server-only";

// 文章上架前的自動檢查。
//
// 這裡實作的是老闆 2026-08-05 拍板、寫在 000_Agent/knowledge/maporoo-brand-dna.md
// 第三節的規則：**部落格零商品置入**。
//
// 為什麼要用程式擋：規則寫在文件裡，靠人記得；寫在這裡，靠系統擋。
// 三個月後換一個寫手接手，他不會讀完那 18KB 的 DNA，但他會撞到這個檢查。

import { products } from "./catalog";

export type Violation = { rule: string; detail: string };
export type GuardResult = {
  blocking: Violation[]; // 有任何一項就不准發布
  warnings: Violation[]; // 提醒，不擋發布
};

// 老闆的個人禁詞（DNA 2.7）。任何載體都不准出現。
const BANNED_WORDS = ["激推", "必收", "對自己好一點", "你值得", "犒賞自己", "儀式感", "節奏"];

// 法規紅線裡的身分誤導用語（compliance-redlines 第二節）。
const FORBIDDEN_CLAIMS = ["醫療級", "醫美級", "療程級", "藥用", "處方級", "院線級"];

// AI 腔（DNA 2.8）。這幾個詞太常見，硬擋會很痛苦，所以列為提醒，
// 由總編輯逐句判斷要不要改。
const AI_TONE_MARKERS = ["不是", "而是", "因為", "所以", "這樣", "你可以"];

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let n = 0;
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    n++;
    i = haystack.indexOf(needle, i + needle.length);
  }
  return n;
}

export function checkArticle(input: {
  title: string;
  description: string;
  body: string;
  kind: string; // A / B / C / D
  sources: unknown[];
  disclaimer: boolean;
}): GuardResult {
  const blocking: Violation[] = [];
  const warnings: Violation[] = [];

  const all = [input.title, input.description, input.body].join("\n");

  // ── 1. 零商品置入 ────────────────────────────────────────
  for (const p of products) {
    if (all.includes(p.name)) {
      blocking.push({
        rule: "零商品置入",
        detail: `文中出現商品名「${p.name}」。部落格不提任何 MAPOROO 商品名稱。`,
      });
    }
  }

  if (/\/products\//.test(all)) {
    blocking.push({
      rule: "零商品置入",
      detail: "文中有指向 /products/ 的連結。部落格不放商品連結。",
    });
  }

  // 擦邊置入的常見句型。
  const softSell = [
    "留意成分表",
    "建議選擇含有",
    "可以留意是否含有",
    "推薦使用",
    "我們的產品",
    "MAPOROO 的產品",
    "本產品",
  ];
  for (const phrase of softSell) {
    if (all.includes(phrase)) {
      blocking.push({
        rule: "零商品置入",
        detail: `出現擦邊置入語句「${phrase}」。知識文只解決問題，不引導購買。`,
      });
    }
  }

  // ── 2. 禁詞 ──────────────────────────────────────────────
  for (const w of BANNED_WORDS) {
    const n = countOccurrences(all, w);
    if (n > 0) {
      blocking.push({
        rule: "老闆禁詞",
        detail: `出現「${w}」${n} 次。這個詞任何載體都不准使用。`,
      });
    }
  }

  for (const w of FORBIDDEN_CLAIMS) {
    if (all.includes(w)) {
      blocking.push({
        rule: "法規紅線",
        detail: `出現身分誤導用語「${w}」，會讓消費者誤認產品具醫療屬性。`,
      });
    }
  }

  // ── 3. 型態 B／C 的出處與聲明 ────────────────────────────
  if (input.kind === "B" || input.kind === "C") {
    if (!Array.isArray(input.sources) || input.sources.length === 0) {
      blocking.push({
        rule: "出處",
        detail:
          "轉述名人或醫師說法的文章（型態 B／C）必須填寫可查證的出處。查不到來源的說法不寫。",
      });
    }
    if (!input.disclaimer) {
      blocking.push({
        rule: "非醫療建議聲明",
        detail: "型態 B／C 必須勾選「附非醫療建議聲明」，文末會自動加上該段文字。",
      });
    }
  }

  // ── 4. AI 腔（提醒，不擋） ───────────────────────────────
  const hits = AI_TONE_MARKERS.filter((w) => all.includes(w));
  if (hits.length) {
    warnings.push({
      rule: "AI 腔",
      detail: `出現 ${hits.map((h) => `「${h}」`).join("、")}。逐句看一下，能改成正面直述就改。`,
    });
  }

  // ── 5. 基本完整度（提醒） ────────────────────────────────
  if (!input.description.trim()) {
    warnings.push({ rule: "SEO", detail: "沒有填 meta description，搜尋結果的摘要會由 Google 自己抓。" });
  } else if (input.description.length > 150) {
    warnings.push({ rule: "SEO", detail: `meta description ${input.description.length} 字，建議控制在 150 字內。` });
  }

  if (input.body.trim().length < 300) {
    warnings.push({ rule: "篇幅", detail: "內文偏短。教育文要吃長尾關鍵字，通常需要更完整的段落結構。" });
  }

  return { blocking, warnings };
}

/** 型態 B／C 文末要自動附上的聲明。 */
export const DISCLAIMER_TEXT =
  "以上為個人經驗分享與知識整理，不是醫療建議。個別狀況請諮詢專業人員。";
