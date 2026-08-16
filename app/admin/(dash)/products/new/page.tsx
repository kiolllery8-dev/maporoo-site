import { requireAdmin } from "../../../../lib/admin";
import { collections } from "../../../../lib/catalog";
import { AdminField, AdminLink, AdminNotice, AdminSelect, AdminSubmit, PageHeader, Panel } from "../../../ui";
import { createProductAction } from "../actions";

export const dynamic = "force-dynamic";

const ERR: Record<string, string> = {
  missing: "品名與 slug 是必填的。",
  price: "售價要大於 0。",
  taken: "這個 slug 已經有商品在用了。",
  sku: "這個 SKU 已經有商品在用了。",
};

export default async function NewProduct({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  await requireAdmin("products.edit");
  const sp = await searchParams;

  return (
    <>
      <p style={{ marginBottom: 18, fontSize: ".9rem" }}>
        <AdminLink href="/admin/products">← 回商品列表</AdminLink>
      </p>

      <PageHeader
        eyebrow="NEW PRODUCT"
        title="新增商品"
        stats="建立後以草稿狀態存在，檢查完再上架"
      />

      <AdminNotice m={sp.e ? ERR[sp.e] ?? "沒有建立成功，請再試一次。" : undefined} />

      <Panel title="基本資料">
        <p style={{ marginBottom: 24, color: "var(--soft)", fontSize: ".95rem", lineHeight: 1.7, maxWidth: 640 }}>
          這裡只填最必要的。成分、使用步驟、FAQ 這些建立完之後在編輯頁補——
          一次要填二十個欄位，沒有人填得完。
          <br />
          文案請照 <code>000_Agent/knowledge/compliance-redlines.md</code> 的紅線寫：
          避開醫療效能、誇大保證，以及「醫療級／醫美級」這類身分誤導用語。
        </p>

        <form action={createProductAction} style={{ maxWidth: 640 }}>
          <AdminField label="品名" name="name" required hint="前台顯示的名稱，例如 PDRN超導玻尿酸精華液 200ml。" />
          <AdminField
            label="SLUG（網址）"
            name="slug"
            required
            hint="只收小寫英數與連字號，例如 pdrn-hyaluronic-serum-200ml。網址會是 /products/這一段。"
          />

          <div className="grid g2" style={{ gap: 20 }}>
            <AdminField label="SKU" name="sku" hint="商品編號，用來對應商品圖。" />
            <AdminField label="英文名" name="en" />
          </div>

          <div className="grid g2" style={{ gap: 20 }}>
            <AdminField label="容量" name="size" hint="例如 200ml、5 片。" />
            <AdminField label="產地" name="origin" hint="例如 澳洲。" />
          </div>

          <div className="grid g2" style={{ gap: 20 }}>
            <AdminField label="售價（TWD）" name="price" type="number" required />
            <AdminField label="原價（TWD）" name="list_price" type="number" hint="留空 = 不顯示原價" />
          </div>

          <AdminSelect
            label="品類"
            name="collection"
            defaultValue={collections[0]?.slug}
            options={collections.map((c) => ({ value: c.slug, label: `${c.zh}（${c.slug}）` }))}
          />

          <AdminField label="一句話定位" name="tagline" hint="講成分與情境，一句講完。" />
          <AdminField label="商品敘述" name="about" textarea rows={5} hint="質地 → 成分 → 適用情境 → 使用時機。" />
          <AdminField label="適合" name="suits" hint="用「・」分隔，例如 乾燥缺水・敏弱不安定・各種膚況。" />

          <div className="grid g2" style={{ gap: 20 }}>
            <AdminField label="庫存" name="stock" type="number" defaultValue={0} />
            <span />
          </div>
          <label style={{ display: "block", marginBottom: 26, fontSize: ".95rem", fontWeight: 500, color: "var(--soft)" }}>
            <input type="checkbox" name="track_stock" style={{ marginRight: 8 }} />
            控管庫存（不勾＝永遠可以下單）
          </label>

          <AdminSubmit>建立草稿</AdminSubmit>
        </form>
      </Panel>
    </>
  );
}
