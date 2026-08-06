// Single source of truth for site-wide identity strings.
// Imported by metadata, JSON-LD, sitemap, robots and llms.txt so they can
// never drift apart.

export const SITE = {
  url: "https://maporoo.com",
  name: "MAPOROO",
  nameZh: "MAPOROO 保養",
  slogan: "有效與舒適，可以並存",
  description:
    "MAPOROO 是澳洲配製的保養品牌，產品線涵蓋臉部保養、頭皮髮絲與沐浴香氛。以 PDRN、玻尿酸、胜肽與泛醇 B5 等成分配製，主張有效的成分值得溫和的對待。",
} as const;
