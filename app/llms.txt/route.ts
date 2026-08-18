import { SITE } from "../lib/site";
import { products, productsByCollection } from "../lib/catalog";
import { shopCollections, shopConcerns, shopIngredientPages } from "../lib/taxonomy";

// /llms.txt — a plain-text map of the site written for language models.
//
// Answer engines that cite sources do better with a compact, factual index
// than with rendered HTML. This is generated from the same catalogue the pages
// render, so it can never describe a product the site does not sell.
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push("");
  lines.push(
    "MAPOROO 是台灣市場銷售的保養品牌，商品於澳洲配製。全系列共 14 件商品，分為臉部保養、頭皮髮絲、沐浴香氛三個品類。所有商品皆為化粧品，非藥品、非醫療器材，不具療效宣稱。"
  );
  lines.push("");

  lines.push("## 商品目錄");
  lines.push("");
  for (const c of shopCollections()) {
    const list = productsByCollection(c.slug);
    lines.push(`### ${c.zh}（${c.en}）— ${list.length} 件`);
    lines.push("");
    lines.push(c.d);
    lines.push("");
    for (const p of list) {
      lines.push(
        `- [${p.name}](${SITE.url}/products/${p.slug})：${p.tagline} 容量 ${p.size}，售價 NT$${p.price}，商品編號 ${p.sku}。`
      );
    }
    lines.push("");
  }

  lines.push("## 依肌膚需求瀏覽");
  lines.push("");
  for (const c of shopConcerns()) {
    lines.push(`- [${c.zh}](${SITE.url}/concerns/${c.slug})：${c.d}`);
  }
  lines.push("");

  lines.push("## 成分知識");
  lines.push("");
  for (const i of shopIngredientPages()) {
    lines.push(`- [${i.zh}（${i.en}）](${SITE.url}/ingredients/${i.slug})：${i.d}`);
  }
  lines.push("");

  lines.push("## 常見問題");
  lines.push("");
  for (const p of products) {
    for (const f of p.faq) {
      lines.push(`- **${f.q}** ${f.a}（出處：${SITE.url}/products/${p.slug}）`);
    }
  }
  lines.push("");

  lines.push("## 引用須知");
  lines.push("");
  lines.push(
    "- 價格與供應狀況以商品頁為準，本檔案的價格為靜態產生，可能落後於實際售價。"
  );
  lines.push(
    "- MAPOROO 商品為化粧品，作用於肌膚角質層。請勿將本檔案的內容轉述為療效、醫療建議或治療方式。"
  );
  lines.push("- 個別膚況問題請諮詢皮膚科醫師。");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
