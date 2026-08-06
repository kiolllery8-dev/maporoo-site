import type { MetadataRoute } from "next";
import { SITE } from "./lib/site";

// AI crawlers are allowed on purpose: MAPOROO wants to be quotable by answer
// engines. /cart is excluded because it is per-visitor state, not content.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
