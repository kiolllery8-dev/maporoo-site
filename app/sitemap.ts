import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";
import { collections, concerns, ingredientPages, products } from "./lib/catalog";

// Every indexable URL on the site. Generated from the catalogue, so adding a
// product or a taxonomy entry puts it in the sitemap automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

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

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE.url}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...collectionPages, ...concernPages, ...ingredientDocs, ...productPages];
}
