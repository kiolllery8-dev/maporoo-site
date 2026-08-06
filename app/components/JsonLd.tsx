// Structured data (schema.org / JSON-LD).
//
// This is what makes the catalogue legible to machines: Google reads it for
// rich results and Merchant listings, and answer engines (GPT / Claude /
// Perplexity) lean on it to state facts about a product without guessing from
// prose. Every fact emitted here must match what a human sees on the page.

import { SITE } from "../lib/site";
import type { Faq, Product } from "../lib/catalog";
import { imagesFor } from "../lib/catalog";

function Ld({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the one sequence that can break
      // out of a <script> block.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationLd() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE.url}#organization`,
        name: SITE.name,
        alternateName: SITE.nameZh,
        url: SITE.url,
        logo: `${SITE.url}/images/maporoo-logo.webp`,
        description: SITE.description,
        slogan: SITE.slogan,
      }}
    />
  );
}

export function WebSiteLd() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "zh-Hant-TW",
        publisher: { "@id": `${SITE.url}#organization` },
      }}
    />
  );
}

export function BreadcrumbLd({ trail }: { trail: { name: string; url: string }[] }) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          item: `${SITE.url}${t.url}`,
        })),
      }}
    />
  );
}

export function FaqLd({ faq }: { faq: Faq[] }) {
  if (!faq.length) return null;
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

export function ProductLd({ product }: { product: Product }) {
  const url = `${SITE.url}/products/${product.slug}`;
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        alternateName: product.en,
        sku: product.sku,
        image: imagesFor(product),
        description: product.about,
        brand: { "@type": "Brand", name: SITE.name, url: SITE.url },
        category: product.collection,
        ...(product.origin ? { countryOfOrigin: product.origin } : {}),
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "TWD",
          price: String(product.price),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE.url}#organization` },
        },
      }}
    />
  );
}

export function ItemListLd({
  items,
  name,
}: {
  items: { slug: string; name: string }[];
  name: string;
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        numberOfItems: items.length,
        itemListElement: items.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE.url}/products/${p.slug}`,
        })),
      }}
    />
  );
}
