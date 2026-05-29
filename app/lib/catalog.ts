// MAPOROO catalog — medical-grade skincare brand (per approved preview).
// All content is MAPOROO brand copy.

export type Collection = {
  zh: string;
  en: string;
  d: string;
  products: string[];
};

export const collections: Collection[] = [
  {
    zh: "修復",
    en: "RESTORE",
    d: "以 PDRN、外泌體與胜肽配製，安撫並支持肌膚的自我修復。適合各種膚況，亦適合療程期間使用。",
    products: ["PDRN 修復精華液", "賦活原生露", "玫瑰胜肽面膜"]
  },
  {
    zh: "亮白",
    en: "CLARITY",
    d: "針對暗沉與不均勻膚色，溫和提亮，逐步回復清透。",
    products: ["亮白精粹", "嫩白霜", "活顏澎潤霜"]
  },
  {
    zh: "保濕",
    en: "HYDRATION",
    d: "從清潔到精華的補水配方，以多分子玻尿酸重建水潤屏障。",
    products: ["玻尿酸保濕精華", "水光卸妝水", "深層卸妝液"]
  },
  {
    zh: "香氛",
    en: "AROMATICS",
    d: "以香氣陪伴日常——沐浴、護髮與隨身香氛。",
    products: ["悅香水", "赤香水", "玫瑰沐浴露", "護髮油"]
  },
  {
    zh: "頭皮",
    en: "SCALP",
    d: "平衡並調理頭皮，照顧髮絲的源頭。",
    products: ["頭皮調理精華", "頭皮洗髮乳"]
  }
];

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

// "依需求" facets
export const needs = [
  { en: "BY CONCERN", zh: "依肌膚困擾", items: ["暗沉", "乾燥缺水", "膚色不均", "泛紅敏感", "細紋老化"] },
  { en: "BY SKIN TYPE", zh: "依膚質", items: ["一般", "乾性", "油性", "混合性", "敏感性"] },
  { en: "BY INGREDIENT", zh: "依成分", items: ["PDRN", "外泌體", "胜肽", "玻尿酸", "維他命 C"] }
];

// Five collections shown as the icon row (zh/en + simple SVG path set key)
export const iconRow = [
  { zh: "修復", en: "RESTORE", icon: "restore" },
  { zh: "亮白", en: "CLARITY", icon: "clarity" },
  { zh: "保濕", en: "HYDRATION", icon: "hydration" },
  { zh: "香氛", en: "AROMATICS", icon: "aromatics" },
  { zh: "頭皮", en: "SCALP", icon: "scalp" }
] as const;

// Brand pillars (Ma · Po · Roo)
export const pillars = [
  { k: "Ma", t: "醫學的嚴謹", d: "以實證為基礎，選擇真正有效的成分。" },
  { k: "Po", t: "溫和的守護", d: "有效之餘，也對肌膚溫柔以待。" },
  { k: "Roo", t: "從容的日常", d: "讓保養，回到一種安靜的日常儀式。" }
];

// Alliance / partnership offers
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

// Online services
export const services = [
  { t: "線上膚況諮詢", d: "回答幾個關於膚況的問題，由我們為你推薦合適的配方與順序。", cta: "開始諮詢" },
  { t: "門市體驗", d: "親手感受質地與香氣，並由專人協助你挑選。台北・台中・高雄。", cta: "查看門市" },
  { t: "會員禮遇", d: "首購禮、回購點數與會員專屬活動，讓每一次保養更值得。", cta: "加入會員" }
];
