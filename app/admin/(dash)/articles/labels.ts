// 文章的中文對照。獨立成模組，不要從 page.tsx 匯出額外的名稱。

export const KIND_LABEL: Record<string, string> = {
  A: "日常保健",
  B: "名人／醫師經驗",
  C: "醫美趨勢科普",
  D: "生活推薦",
};

export const STATUS_LABEL: Record<string, string> = {
  draft: "草稿",
  pending_compliance: "待法遵審查",
  pending_voice: "待語調確認",
  published: "已發布",
};

export const CATEGORY_OPTIONS = [
  { value: "日常保健", label: "日常保健" },
  { value: "趨勢觀察", label: "趨勢觀察" },
  { value: "生活風格", label: "生活風格" },
];

export const KIND_OPTIONS = [
  { value: "A", label: "A 日常保健（怎麼吃、身體會怎樣）" },
  { value: "B", label: "B 名人／醫師經驗轉述（需附出處）" },
  { value: "C", label: "C 醫美趨勢科普（需附出處）" },
  { value: "D", label: "D 生活推薦（哪裡好玩好吃）" },
];
