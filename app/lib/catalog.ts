// MAPOROO catalog — medical-grade skincare brand (per approved preview).
// All content is original MAPOROO brand copy.

export type KeyIngredient = { name: string; desc: string };

export type Product = {
  slug: string;
  collection: string; // collection slug
  name: string;
  en: string;
  size: string;
  price: number;
  tagline: string;
  about: string;
  keyIngredients: KeyIngredient[];
  howToUse: string[];
  suits: string;
  fullIngredients: string;
  tone: "light" | "deep";
};

export type Collection = {
  slug: string;
  zh: string;
  en: string;
  d: string;
};

export const collections: Collection[] = [
  { slug: "restore", zh: "修復", en: "RESTORE", d: "以 PDRN、外泌體與胜肽配製，安撫並支持肌膚的自我修復。適合各種膚況，亦適合療程期間使用。" },
  { slug: "clarity", zh: "亮白", en: "CLARITY", d: "針對暗沉與不均勻膚色，溫和提亮，逐步回復清透。" },
  { slug: "hydration", zh: "保濕", en: "HYDRATION", d: "從清潔到精華的補水配方，以多分子玻尿酸重建水潤屏障。" },
  { slug: "aromatics", zh: "香氛", en: "AROMATICS", d: "以香氣陪伴日常——沐浴、護髮與隨身香氛。" },
  { slug: "scalp", zh: "頭皮", en: "SCALP", d: "平衡並調理頭皮，照顧髮絲的源頭。" }
];

export const products: Product[] = [
  // ── 修復 RESTORE ──────────────────────────────────────────
  {
    slug: "pdrn-repair-serum",
    collection: "restore",
    name: "PDRN 修復精華液",
    en: "PDRN Repair Serum",
    size: "30ml",
    price: 1680,
    tagline: "以 PDRN 與多分子玻尿酸，安撫並支持肌膚的自我修復。",
    about:
      "質地清盈、迅速被肌膚吸收的修護精華。以 PDRN 搭配多分子玻尿酸，層層滲透、安撫泛紅與緊繃，支持肌膚自我修復的節奏。適合各種膚況每日使用，亦適合醫美療程後的居家照顧。",
    keyIngredients: [
      { name: "PDRN", desc: "與人體 DNA 相似的修護分子，安撫並支持肌膚的自我修復。" },
      { name: "多分子玻尿酸", desc: "不同分子量層層鎖水，回復水潤屏障。" },
      { name: "泛醇 B5", desc: "舒緩、強化屏障，減少水分散失。" }
    ],
    howToUse: ["潔膚與調理後，取 2–3 滴於掌心。", "輕壓於臉部，由內而外輕拍至吸收。", "後續可疊加保濕乳霜，鎖住水分。"],
    suits: "各種膚況・療程期間・泛紅敏感",
    fullIngredients: "Water, Glycerin, Sodium DNA (PDRN), Sodium Hyaluronate, Panthenol, Butylene Glycol, Niacinamide, Allantoin, Carbomer, Phenoxyethanol.",
    tone: "deep"
  },
  {
    slug: "revival-essence",
    collection: "restore",
    name: "賦活原生露",
    en: "Revival Essence",
    size: "150ml",
    price: 1280,
    tagline: "化妝水與精華之間的第一道修護。",
    about:
      "潔膚後的第一道步驟。水潤質地為肌膚補進水分，同時以外泌體與胜肽鋪墊後續保養的吸收，讓疲憊的肌膚回到安定的起點。",
    keyIngredients: [
      { name: "外泌體", desc: "細胞間的訊息載體，將修護訊號精準傳遞。" },
      { name: "寡胜肽", desc: "支持膠原環境，維持肌膚的彈性。" }
    ],
    howToUse: ["潔膚後，取適量於掌心或化妝棉。", "輕拍或輕抹於全臉，至完全吸收。", "後續接續精華與乳霜。"],
    suits: "各種膚況・暗沉疲憊",
    fullIngredients: "Water, Butylene Glycol, Glycerin, sh-Oligopeptide-1, Exosomes, Sodium Hyaluronate, Panthenol, Betaine, 1,2-Hexanediol.",
    tone: "light"
  },
  {
    slug: "rose-peptide-mask",
    collection: "restore",
    name: "玫瑰胜肽面膜",
    en: "Rose Peptide Mask",
    size: "5 片",
    price: 880,
    tagline: "一場 15 分鐘的安靜修護儀式。",
    about:
      "服貼的精華面膜，飽含胜肽與玫瑰萃取。在忙碌的一天之後，給肌膚 15 分鐘的密集修護與安撫，喚回飽滿與光澤。",
    keyIngredients: [
      { name: "胜肽複合物", desc: "支持膠原環境，維持彈性與飽滿。" },
      { name: "玫瑰萃取", desc: "安撫並柔軟肌膚，留下淡雅餘香。" }
    ],
    howToUse: ["潔膚與調理後，取出面膜服貼於臉部。", "靜敷 15 分鐘。", "取下後輕拍剩餘精華至吸收，無須沖洗。"],
    suits: "各種膚況・乾燥緊繃・需要密集修護時",
    fullIngredients: "Water, Glycerin, Butylene Glycol, Rosa Damascena Flower Extract, Palmitoyl Tripeptide-1, Sodium Hyaluronate, Allantoin, Panthenol, 1,2-Hexanediol.",
    tone: "deep"
  },

  // ── 亮白 CLARITY ──────────────────────────────────────────
  {
    slug: "clarity-concentrate",
    collection: "clarity",
    name: "亮白精粹",
    en: "Clarity Concentrate",
    size: "30ml",
    price: 1580,
    tagline: "針對暗沉與不均，溫和而穩定地提亮。",
    about:
      "以維他命 C 衍生物與菸鹼醯胺配製的提亮精華。溫和對待肌膚，逐步改善暗沉與膚色不均，回復清透均亮的光澤。",
    keyIngredients: [
      { name: "維他命 C 衍生物", desc: "穩定的抗氧化形式，幫助提亮、對抗暗沉。" },
      { name: "菸鹼醯胺", desc: "維他命 B₃ 的一種形式，強化屏障、改善不均。" }
    ],
    howToUse: ["潔膚與調理後，取 2–3 滴。", "輕壓於全臉，重點加強暗沉部位。", "日間使用後請接續防曬。"],
    suits: "暗沉・膚色不均・各種膚況",
    fullIngredients: "Water, Glycerin, Ascorbyl Glucoside, Niacinamide, Butylene Glycol, Sodium Hyaluronate, Ferulic Acid, Tocopherol, 1,2-Hexanediol.",
    tone: "light"
  },
  {
    slug: "brightening-cream",
    collection: "clarity",
    name: "嫩白霜",
    en: "Brightening Cream",
    size: "50ml",
    price: 1380,
    tagline: "提亮與保濕兼具的日常乳霜。",
    about:
      "綿潤好推的乳霜質地，在鎖水保濕的同時持續提亮，讓膚色看起來更勻淨清透。早晚皆宜，作為保養的最後封存步驟。",
    keyIngredients: [
      { name: "菸鹼醯胺", desc: "改善暗沉與不均，強化屏障。" },
      { name: "角鯊烷", desc: "親膚的保濕油脂，柔軟不黏膩。" }
    ],
    howToUse: ["精華吸收後，取適量於指尖。", "由內而外均勻推開於全臉。", "輕壓幫助吸收。"],
    suits: "暗沉・乾燥・一般至混合性肌膚",
    fullIngredients: "Water, Squalane, Glycerin, Niacinamide, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Sodium Hyaluronate, Tocopherol, Phenoxyethanol.",
    tone: "deep"
  },
  {
    slug: "plumping-cream",
    collection: "clarity",
    name: "活顏澎潤霜",
    en: "Plumping Cream",
    size: "50ml",
    price: 1480,
    tagline: "為疲態肌膚注入飽滿與光澤。",
    about:
      "豐潤的乳霜，以胜肽與玻尿酸支持肌膚的彈性與含水量，改善細紋與疲態，讓肌膚看起來更澎潤有生氣。",
    keyIngredients: [
      { name: "胜肽複合物", desc: "支持膠原環境，維持彈性與飽滿。" },
      { name: "多分子玻尿酸", desc: "層層鎖水，回復澎潤觸感。" }
    ],
    howToUse: ["於精華之後取適量。", "均勻推開於全臉與頸部。", "以指腹輕壓提拉至吸收。"],
    suits: "細紋老化・乾燥・各種膚況",
    fullIngredients: "Water, Glycerin, Caprylic/Capric Triglyceride, Cetearyl Alcohol, Palmitoyl Tripeptide-1, Sodium Hyaluronate, Squalane, Shea Butter, Tocopherol, Phenoxyethanol.",
    tone: "light"
  },

  // ── 保濕 HYDRATION ────────────────────────────────────────
  {
    slug: "hyaluronic-hydra-serum",
    collection: "hydration",
    name: "玻尿酸保濕精華",
    en: "Hyaluronic Hydra Serum",
    size: "30ml",
    price: 1280,
    tagline: "以多分子玻尿酸重建水潤屏障。",
    about:
      "清透不黏膩的補水精華，以不同分子量的玻尿酸由內而外層層補水，重建肌膚的水潤屏障，作為各種膚況的日常保濕基底。",
    keyIngredients: [
      { name: "多分子玻尿酸", desc: "不同分子量層層鎖水，回復水潤。" },
      { name: "海藻糖", desc: "幫助維持肌膚含水量，安定屏障。" }
    ],
    howToUse: ["潔膚與調理後，取 2–3 滴。", "輕壓於全臉至吸收。", "後續接續乳霜鎖水。"],
    suits: "乾燥缺水・各種膚況・療程期間",
    fullIngredients: "Water, Glycerin, Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Trehalose, Butylene Glycol, Panthenol, Betaine, 1,2-Hexanediol.",
    tone: "light"
  },
  {
    slug: "glow-cleansing-water",
    collection: "hydration",
    name: "水光卸妝水",
    en: "Glow Cleansing Water",
    size: "250ml",
    price: 780,
    tagline: "溫和卸除，同時補水。",
    about:
      "免沖洗的卸妝水，溫和帶走彩妝與髒污，同時留下水潤不緊繃的觸感。質地清爽，適合作為一天的第一道清潔。",
    keyIngredients: [
      { name: "溫和界面活性劑", desc: "親膚配方，帶走髒污不帶走水分。" },
      { name: "甘油", desc: "清潔後留住水分，避免緊繃。" }
    ],
    howToUse: ["以化妝棉沾濕。", "輕敷並擦拭臉部與眼唇。", "可接續水洗潔顏加強清潔。"],
    suits: "各種膚況・日常淡妝",
    fullIngredients: "Water, Glycerin, Poloxamer 184, PEG-6 Caprylic/Capric Glycerides, Panthenol, Sodium Hyaluronate, Disodium EDTA, 1,2-Hexanediol.",
    tone: "deep"
  },
  {
    slug: "deep-cleansing-oil",
    collection: "hydration",
    name: "深層卸妝液",
    en: "Deep Cleansing Oil",
    size: "150ml",
    price: 880,
    tagline: "溶解濃妝與防曬，沖洗後不緊繃。",
    about:
      "親膚的潔顏油，遇水乳化、徹底溶解濃妝、防曬與毛孔髒污。沖洗後留下柔軟潔淨、不緊繃的肌膚。",
    keyIngredients: [
      { name: "植物潔顏油", desc: "溫和溶解彩妝與防曬。" },
      { name: "維他命 E", desc: "抗氧化，柔軟肌膚。" }
    ],
    howToUse: ["以乾手取適量按摩於乾臉。", "加少量水乳化後沖淨。", "接續水洗潔顏完成雙重清潔。"],
    suits: "濃妝・防曬・各種膚況",
    fullIngredients: "Caprylic/Capric Triglyceride, Ethylhexyl Palmitate, Sorbeth-30 Tetraoleate, Helianthus Annuus Seed Oil, Tocopherol, Parfum.",
    tone: "light"
  },

  // ── 香氛 AROMATICS ────────────────────────────────────────
  {
    slug: "joy-eau-de-parfum",
    collection: "aromatics",
    name: "悅香水",
    en: "Joy Eau de Parfum",
    size: "50ml",
    price: 2980,
    tagline: "清新明亮的柑橘草本，像清晨的第一道光。",
    about:
      "以佛手柑與橙花開場，中段是綠意草本，尾韻落在溫潤的白木質。明亮而從容，適合日常隨身。",
    keyIngredients: [
      { name: "佛手柑", desc: "明亮清新的柑橘前調。" },
      { name: "橙花", desc: "柔和的花香中調。" },
      { name: "白木質", desc: "溫潤悠長的尾韻。" }
    ],
    howToUse: ["噴灑於耳後、手腕等脈搏處。", "避免直接接觸首飾與淺色衣物。"],
    suits: "日常・各種場合",
    fullIngredients: "Alcohol, Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citral, Geraniol.",
    tone: "light"
  },
  {
    slug: "ember-eau-de-parfum",
    collection: "aromatics",
    name: "赤香水",
    en: "Ember Eau de Parfum",
    size: "50ml",
    price: 2980,
    tagline: "溫暖深沉的木質辛香，適合夜晚。",
    about:
      "以胡椒與琥珀的辛香開場，中段為煙燻木質，尾韻是溫暖的香草與麝香。沉穩而有記憶點，適合夜晚與特別的場合。",
    keyIngredients: [
      { name: "粉紅胡椒", desc: "微辛而立體的前調。" },
      { name: "煙燻木質", desc: "深沉的中段氣息。" },
      { name: "琥珀香草", desc: "溫暖綿長的尾韻。" }
    ],
    howToUse: ["噴灑於耳後、手腕等脈搏處。", "避免直接接觸首飾與淺色衣物。"],
    suits: "夜晚・特別場合",
    fullIngredients: "Alcohol, Parfum (Fragrance), Aqua (Water), Coumarin, Linalool, Eugenol, Benzyl Benzoate.",
    tone: "deep"
  },
  {
    slug: "rose-body-wash",
    collection: "aromatics",
    name: "玫瑰沐浴露",
    en: "Rose Body Wash",
    size: "500ml",
    price: 980,
    tagline: "綿密泡沫，留下淡雅玫瑰餘香。",
    about:
      "溫和的沐浴凝露，搓揉出綿密泡沫，溫柔潔淨身體肌膚，沖洗後不緊繃，留下若有似無的玫瑰餘香。",
    keyIngredients: [
      { name: "玫瑰萃取", desc: "安撫肌膚並留下淡雅香氣。" },
      { name: "甘油", desc: "清潔同時保濕，避免乾澀。" }
    ],
    howToUse: ["沐浴時取適量。", "於濕潤肌膚搓出泡沫並按摩。", "以清水沖淨。"],
    suits: "各種膚況・日常沐浴",
    fullIngredients: "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Rosa Damascena Flower Extract, Parfum, Sodium Chloride, Citric Acid.",
    tone: "deep"
  },
  {
    slug: "nourishing-hair-oil",
    collection: "aromatics",
    name: "護髮油",
    en: "Nourishing Hair Oil",
    size: "100ml",
    price: 880,
    tagline: "撫平毛躁，留下光澤與香氣。",
    about:
      "輕盈不油膩的護髮油，撫平毛躁與分岔，為髮絲注入光澤，同時留下溫潤的草本木質香。乾濕髮皆可使用。",
    keyIngredients: [
      { name: "摩洛哥堅果油", desc: "滋養髮絲、撫平毛躁。" },
      { name: "荷荷芭油", desc: "親膚輕盈，賦予光澤。" }
    ],
    howToUse: ["取 1–2 滴於掌心溫熱。", "由髮中塗抹至髮尾。", "避開頭皮。"],
    suits: "毛躁・乾燥髮質",
    fullIngredients: "Caprylic/Capric Triglyceride, Argania Spinosa Kernel Oil, Simmondsia Chinensis Seed Oil, Cyclopentasiloxane, Tocopherol, Parfum.",
    tone: "light"
  },

  // ── 頭皮 SCALP ────────────────────────────────────────────
  {
    slug: "scalp-balancing-serum",
    collection: "scalp",
    name: "頭皮調理精華",
    en: "Scalp Balancing Serum",
    size: "100ml",
    price: 1180,
    tagline: "平衡並調理頭皮，照顧髮絲的源頭。",
    about:
      "清爽的頭皮精華，幫助平衡油脂、舒緩頭皮的緊繃與不適，為健康的髮絲打好基礎。可於洗髮後或日常使用。",
    keyIngredients: [
      { name: "菸鹼醯胺", desc: "舒緩並調理頭皮環境。" },
      { name: "茶樹萃取", desc: "幫助平衡頭皮的清爽感。" }
    ],
    howToUse: ["分區滴於頭皮。", "以指腹輕輕按摩。", "無須沖洗。"],
    suits: "頭皮出油・緊繃不適",
    fullIngredients: "Water, Alcohol Denat., Niacinamide, Melaleuca Alternifolia Leaf Extract, Panthenol, Menthol, Sodium Hyaluronate, 1,2-Hexanediol.",
    tone: "light"
  },
  {
    slug: "scalp-care-shampoo",
    collection: "scalp",
    name: "頭皮洗髮乳",
    en: "Scalp Care Shampoo",
    size: "300ml",
    price: 880,
    tagline: "溫和潔淨，同時照顧頭皮。",
    about:
      "溫和的洗髮乳，徹底潔淨頭皮與髮絲的多餘油脂與髒污，同時舒緩調理頭皮，沖洗後清爽不緊繃。",
    keyIngredients: [
      { name: "胺基酸潔淨成分", desc: "溫和帶走油脂與髒污。" },
      { name: "泛醇 B5", desc: "舒緩頭皮、柔順髮絲。" }
    ],
    howToUse: ["濕髮後取適量。", "於頭皮搓出泡沫並按摩。", "以清水徹底沖淨。"],
    suits: "各種頭皮・日常清潔",
    fullIngredients: "Water, Sodium Cocoyl Glutamate, Cocamidopropyl Betaine, Glycerin, Panthenol, Menthol, Citric Acid, Sodium Chloride, Parfum.",
    tone: "deep"
  }
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
export function productsByCollection(slug: string): Product[] {
  return products.filter((p) => p.collection === slug);
}
export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export type Ingredient = { zh: string; en: string; d: string };

export const ingredients: Ingredient[] = [
  { zh: "PDRN", en: "REPAIR ─ 修復", d: "與人體 DNA 相似的修護分子，支持肌膚的自我修復。" },
  { zh: "外泌體", en: "SIGNAL ─ 傳遞", d: "細胞間的訊息載體，將修護訊號精準傳遞。" },
  { zh: "胜肽", en: "FIRM ─ 緊緻", d: "支持膠原環境，維持肌膚的彈性與飽滿。" },
  { zh: "玻尿酸", en: "HYDRATE ─ 保濕", d: "多分子層層鎖水，回復水潤的屏障。" }
];

export type Read = { cat: string; t: string; time: string };

export const reads: Read[] = [
  { cat: "成分學", t: "PDRN 是什麼，它為肌膚做了什麼", time: "3 分鐘" },
  { cat: "成分學", t: "外泌體與胜肽，差在哪裡", time: "4 分鐘" },
  { cat: "保養指南", t: "進行醫美療程期間，如何照顧肌膚", time: "4 分鐘" },
  { cat: "保養指南", t: "日常的三步驟：清潔・調理・修復", time: "3 分鐘" },
  { cat: "生活文化", t: "關於從容──保養可以是一種日常儀式", time: "3 分鐘" },
  { cat: "設計", t: "我們如何思考一支配方的質地與香氣", time: "5 分鐘" }
];

export const needs = [
  { en: "BY CONCERN", zh: "依肌膚困擾", items: ["暗沉", "乾燥缺水", "膚色不均", "泛紅敏感", "細紋老化"] },
  { en: "BY SKIN TYPE", zh: "依膚質", items: ["一般", "乾性", "油性", "混合性", "敏感性"] },
  { en: "BY INGREDIENT", zh: "依成分", items: ["PDRN", "外泌體", "胜肽", "玻尿酸", "維他命 C"] }
];

export const iconRow = [
  { zh: "修復", en: "RESTORE", icon: "restore", slug: "restore" },
  { zh: "亮白", en: "CLARITY", icon: "clarity", slug: "clarity" },
  { zh: "保濕", en: "HYDRATION", icon: "hydration", slug: "hydration" },
  { zh: "香氛", en: "AROMATICS", icon: "aromatics", slug: "aromatics" },
  { zh: "頭皮", en: "SCALP", icon: "scalp", slug: "scalp" }
] as const;

export const pillars = [
  { k: "Ma", t: "醫學的嚴謹", d: "以實證為基礎，選擇真正有效的成分。" },
  { k: "Po", t: "溫和的守護", d: "有效之餘，也對肌膚溫柔以待。" },
  { k: "Roo", t: "從容的日常", d: "讓保養，回到一種安靜的日常儀式。" }
];

export const alliance = [
  {
    no: "01 ─ LIVE",
    zh: "直播分潤",
    d: "為直播與團購設計的階梯式分潤，銷量越高、回饋越高。提供商品實拍、成分話術與直播素材，開播即用。",
    items: ["階梯式分潤・即時對帳", "直播素材包・成分話術", "專屬窗口協助開播"],
    cta: "申請直播合作"
  },
  {
    no: "02 ─ DISTRIBUTION",
    zh: "經銷",
    d: "提供經銷夥伴專屬批發價與限定組合，毛利空間清晰透明，並附上完整的產品與成分培訓。",
    items: ["經銷批發價・限定組合", "成分與保養知識培訓", "行銷與通路支援"],
    cta: "洽詢經銷合作"
  }
];

export const services = [
  { t: "線上膚況諮詢", d: "回答幾個關於膚況的問題，由我們為你推薦合適的配方與順序。", cta: "開始諮詢" },
  { t: "門市體驗", d: "親手感受質地與香氣，並由專人協助你挑選。台北・台中・高雄。", cta: "查看門市" },
  { t: "會員禮遇", d: "首購禮、回購點數與會員專屬活動，讓每一次保養更值得。", cta: "加入會員" }
];
