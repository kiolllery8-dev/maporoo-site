import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";
import { collections, concerns, ingredientPages } from "./lib/catalog";
import { shopProducts } from "./lib/shop";
import { all } from "./lib/db";

// Every indexable URL on the site. Generated from the catalogue, so adding a
// product or a taxonomy entry puts it in the sitemap automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/read`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // 已發布的文章。教育文是自然流量的主力，收錄優先度給高一點。
  // 資料庫還沒建立時（例如 build 環境沒有 data/）就給空陣列，別讓 sitemap 整個掛掉。
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    articlePages = all<{ slug: string; published_at: string | null }>(
      `SELECT slug, published_at FROM articles WHERE status = 'published'`
    ).map((a) => ({
      url: `${SITE.url}/read/${a.slug}`,
      lastModified: a.published_at ? new Date(a.published_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    articlePages = [];
  }

  const collectionPages: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE.url}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const concernPages: MetadataRoute.Sitemap = concerns.map((c) => ({
    url: `${SITE.url}/concerns/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const ingredientDocs: MetadataRoute.Sitemap = ingredientPages.map((i) => ({
    url: `${SITE.url}/ingredients/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = shopProducts().map((p) => ({
    url: `${SITE.url}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    ...staticPages,
    ...articlePages,
    ...collectionPages,
    ...concernPages,
    ...ingredientDocs,
    ...productPages,
  ];
}
