// MAPOROO catalog — all content original to the MAPOROO brand.
// Structure mirrors a wellness/lifestyle site's information architecture
// (collections → products, plus journal & finder), filled with original copy.

export type Product = {
  slug: string;
  name: string;
  en: string;
  blurb: string;
  price: number;
  tone: "light" | "deep"; // placeholder tile shade
  tags: string[]; // for gift-finder (mood / recipient)
};

export type Collection = {
  slug: string;
  name: string;
  en: string;
  tagline: string;
  description: string;
  products: Product[];
};

export const collections: Collection[] = [
  {
    slug: "plush",
    name: "玩偶",
    en: "Plush & Companions",
    tagline: "可以抱著入睡的那一種陪伴",
    description:
      "從一隻金色方塊裡探出頭的小袋鼠開始，MAPOROO 的玩偶系列被設計成「剛好一個懷抱」的大小——柔軟、安靜、願意聽你說話。",
    products: [
      { slug: "roo-classic", name: "經典袋鼠 ROO", en: "Roo the Original", blurb: "標誌性的炭灰小袋鼠，棉絨手感，肚子上有一個剛好放進掌心的育兒袋弧度。", price: 880, tone: "deep", tags: ["comfort", "kids", "self"] },
      { slug: "roo-mini", name: "口袋袋鼠", en: "Pocket Roo", blurb: "可以塞進外套口袋、書包側袋的迷你版，陪你通勤、出差、考試。", price: 480, tone: "light", tags: ["travel", "self", "friend"] },
      { slug: "moon-roo", name: "月亮抱枕袋鼠", en: "Moonlit Cushion Roo", blurb: "枕頭與玩偶之間的尺寸，午睡、追劇、發呆都剛好。", price: 1280, tone: "light", tags: ["comfort", "home", "self"] },
      { slug: "duo-roo", name: "成對袋鼠", en: "A Pair of Roo", blurb: "兩隻一組，一隻給你、一隻給你想念的人。", price: 1520, tone: "deep", tags: ["couple", "friend", "gift"] }
    ]
  },
  {
    slug: "stationery",
    name: "文具",
    en: "Paper & Stationery",
    tagline: "把今天的溫柔，寫下來",
    description:
      "適合慢慢寫字的紙、捨不得用掉的貼紙、可以一直撕的紙膠帶。MAPOROO 文具系列陪你把日常的小情緒，留成可以翻回去的痕跡。",
    products: [
      { slug: "warm-notebook", name: "擁抱手帳", en: "Warm Embrace Notebook", blurb: "米金色內頁、平攤不回彈的裝訂，寫日記或塗鴉都順手。", price: 420, tone: "light", tags: ["self", "writer", "kids"] },
      { slug: "roo-stickers", name: "袋鼠貼紙組", en: "Roo Sticker Set", blurb: "一整頁的小袋鼠表情，貼在筆電、水壺、給朋友的信上。", price: 180, tone: "deep", tags: ["kids", "friend", "self"] },
      { slug: "gold-tape", name: "金箔紙膠帶", en: "Gilded Washi Tape", blurb: "低調的香檳金，封信、拼貼、做手帳都好看。", price: 150, tone: "light", tags: ["writer", "self", "gift"] },
      { slug: "letter-set", name: "想念信箋組", en: "A Letter to Someone", blurb: "信紙＋信封＋封蠟貼，給那些想說卻說不出口的話。", price: 360, tone: "deep", tags: ["friend", "couple", "gift"] }
    ]
  },
  {
    slug: "home",
    name: "居家",
    en: "Home & Living",
    tagline: "讓家，更像一個被接住的地方",
    description:
      "馬克杯的握感、香氛的氣味、抱枕的重量——MAPOROO 居家系列在意的，是那些讓你一回家就鬆一口氣的細節。",
    products: [
      { slug: "roo-mug", name: "袋鼠馬克杯", en: "Roo Morning Mug", blurb: "厚實杯壁、保溫久一點，杯底藏著一隻偷看你的小袋鼠。", price: 580, tone: "light", tags: ["home", "self", "gift"] },
      { slug: "warm-candle", name: "暖香蠟燭", en: "Warm Hours Candle", blurb: "前調是曬過太陽的棉被，尾韻一點點焦糖與木質。燃時約 40 小時。", price: 920, tone: "deep", tags: ["home", "self", "couple"] },
      { slug: "hug-cushion", name: "擁抱抱枕", en: "The Hug Cushion", blurb: "比一般抱枕重一些，被它壓著的踏實感，像有人輕輕抱住你。", price: 1180, tone: "light", tags: ["comfort", "home", "self"] },
      { slug: "room-mist", name: "房間噴霧", en: "Room Mist", blurb: "睡前在枕頭與窗簾噴兩下，把白天的紛擾換成一室柔軟。", price: 680, tone: "deep", tags: ["home", "self", "comfort"] }
    ]
  },
  {
    slug: "accessories",
    name: "配件",
    en: "Everyday Carry",
    tagline: "把童心，隨身帶著",
    description:
      "鑰匙圈、徽章、帆布袋——體積小、卻能在你低頭的瞬間，提醒你心裡那個小孩還在。",
    products: [
      { slug: "roo-keyring", name: "袋鼠鑰匙圈", en: "Roo Keyring", blurb: "金屬鑲嵌的炭灰小袋鼠，掛在鑰匙、包包、識別證上都剛好。", price: 320, tone: "deep", tags: ["self", "friend", "travel"] },
      { slug: "gold-pin", name: "金色徽章", en: "Gilded Pin", blurb: "一枚低調的金色袋鼠別針，別在外套領口或帆布袋上。", price: 240, tone: "light", tags: ["self", "friend", "gift"] },
      { slug: "canvas-tote", name: "日常帆布袋", en: "Everyday Tote", blurb: "厚磅胚布、可裝下一台筆電與一本書，側邊有隻小小的 ROO。", price: 560, tone: "light", tags: ["travel", "self", "writer"] },
      { slug: "mirror", name: "口袋小鏡", en: "Pocket Mirror", blurb: "翻開的瞬間，先看到一隻對你笑的小袋鼠，再看到你自己。", price: 280, tone: "deep", tags: ["self", "friend", "gift"] }
    ]
  },
  {
    slug: "gifts",
    name: "禮盒",
    en: "Gifts & Kits",
    tagline: "把心意，包成剛剛好的樣子",
    description:
      "為不知道怎麼開口的時刻準備的禮盒。每一組都附一張可以手寫的卡片，因為最暖的，往往是你自己的那句話。",
    products: [
      { slug: "first-hug-kit", name: "初次擁抱禮盒", en: "First Hug Kit", blurb: "經典袋鼠 ROO ＋ 暖香蠟燭 ＋ 手寫卡，送給剛認識或想重新靠近的人。", price: 1680, tone: "deep", tags: ["gift", "friend", "couple"] },
      { slug: "desk-comfort-kit", name: "桌上的安心組", en: "Desk Comfort Kit", blurb: "口袋袋鼠 ＋ 擁抱手帳 ＋ 金色徽章，給每天努力的自己或同事。", price: 1280, tone: "light", tags: ["self", "writer", "gift"] },
      { slug: "goodnight-kit", name: "晚安儀式組", en: "Goodnight Ritual Kit", blurb: "房間噴霧 ＋ 月亮抱枕袋鼠 ＋ 暖香蠟燭，把睡前變成一段溫柔的儀式。", price: 2380, tone: "deep", tags: ["comfort", "home", "couple"] },
      { slug: "little-one-kit", name: "給小小孩禮盒", en: "For the Little One", blurb: "經典袋鼠 ROO ＋ 袋鼠貼紙組 ＋ 袋鼠馬克杯，給家裡的小朋友。", price: 1480, tone: "light", tags: ["kids", "gift", "family"] }
    ]
  }
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function allProducts(): { product: Product; collection: Collection }[] {
  return collections.flatMap((c) => c.products.map((p) => ({ product: p, collection: c })));
}

// Journal — original short editorial entries (MAPOROO 誌).
export type JournalEntry = {
  slug: string;
  kicker: string;
  title: string;
  excerpt: string;
  read: string;
};

export const journal: JournalEntry[] = [
  {
    slug: "why-a-kangaroo",
    kicker: "品牌的事",
    title: "為什麼是一隻袋鼠",
    excerpt: "袋鼠把最在乎的孩子，放進育兒袋、貼著心口帶著走；而且牠只能向前跳、不會後退。我們想，這正是陪伴與成長最溫柔的樣子。",
    read: "4 分鐘"
  },
  {
    slug: "the-weight-of-a-hug",
    kicker: "設計的事",
    title: "一個擁抱的重量",
    excerpt: "我們花了很久，去調整抱枕裡的填充比例——因為被剛好的重量壓著時，人才會真正鬆下來。",
    read: "5 分鐘"
  },
  {
    slug: "keeping-childhood",
    kicker: "生活的事",
    title: "把童年留在身上的方法",
    excerpt: "長大不必弄丟那個小孩。也許只是一枚別針、一隻口袋袋鼠，就能把他好好接住。",
    read: "3 分鐘"
  }
];

// Gift-finder facets (original).
export const giftMoods = [
  { id: "comfort", label: "想給一點安心" },
  { id: "self", label: "想犒賞自己" },
  { id: "couple", label: "想對另一半說想念" },
  { id: "friend", label: "想謝謝一位朋友" },
  { id: "kids", label: "想逗笑小朋友" },
  { id: "home", label: "想讓家更暖" }
];
