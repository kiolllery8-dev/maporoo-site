import { notFound } from "next/navigation";
import { get } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";
import { AdminField, AdminLink, AdminNotice, AdminSelect, AdminSubmit, Panel } from "../../../ui";
import { deleteProductAction, saveProductAction } from "../actions";

export const dynamic = "force-dynamic";

type Product = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  en: string;
  size: string;
  price: number;
  list_price: number | null;
  collection: string;
  origin: string;
  tagline: string;
  about: string;
  suits: string;
  note: string;
  caution: string;
  stock: number;
  track_stock: number;
  status: string;
  featured: number;
  sort: number;
};

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; e?: string }>;
}) {
  // 編輯頁直接要求 products.edit——沒有編輯權的人看列表就好，不必進到表單。
  await requireAdmin("products.edit");
  const { id } = await params;
  const sp = await searchParams;

  const p = get<Product>(`SELECT * FROM products WHERE id = ?`, Number(id));
  if (!p) notFound();

  return (
    <>
      <p style={{ marginBottom: 20, fontSize: ".9rem" }}>
        <AdminLink href="/admin/products">← 回商品列表</AdminLink>
      </p>

      <AdminNotice
        ok={sp.ok === "saved" ? "已儲存。" : sp.ok === "created" ? "商品已建立，目前是草稿。確認內容後把狀態改成「上架中」就會出現在前台。" : undefined}
        m={sp.e === "activedelete" ? "上架中的商品不能直接刪除。請先把狀態改成草稿，再刪。" : undefined}
      />

      <Panel title={p.name}>
        <p style={{ marginBottom: 26, fontSize: ".9rem", color: "var(--mute)", lineHeight: 1.5 }}>
          slug <code>{p.slug}</code>　·　SKU {p.sku || "未設定"}　·　品類 {p.collection || "未分類"}
          {p.origin && `　·　產地 ${p.origin}`}
          <br />
          文案改動請照 <code>000_Agent/knowledge/compliance-redlines.md</code> 的紅線寫，
          尤其避開醫療效能、誇大保證，以及「醫療級／醫美級」這類身分誤導用語。
        </p>

        <form action={saveProductAction} style={{ maxWidth: 640 }}>
          <input type="hidden" name="id" value={p.id} />

          <AdminField label="品名" name="name" required defaultValue={p.name} />
          <AdminField label="英文名" name="en" defaultValue={p.en} />
          <AdminField label="容量" name="size" defaultValue={p.size} />

          <div className="grid g2" style={{ gap: 20 }}>
            <AdminField label="售價（TWD）" name="price" type="number" required defaultValue={p.price} />
            <AdminField
              label="原價（TWD）"
              name="list_price"
              type="number"
              defaultValue={p.list_price ?? ""}
              hint="留空 = 不顯示原價"
            />
          </div>

          <AdminField label="一句話定位" name="tagline" defaultValue={p.tagline} />
          <AdminField label="商品敘述" name="about" textarea rows={6} defaultValue={p.about} />
          <AdminField label="適合" name="suits" defaultValue={p.suits} />
          <AdminField label="使用提醒" name="note" textarea rows={3} defaultValue={p.note} />
          <AdminField label="注意事項" name="caution" textarea rows={3} defaultValue={p.caution} />

          <div className="grid g2" style={{ gap: 20 }}>
            <AdminField label="庫存" name="stock" type="number" defaultValue={p.stock} />
            <AdminField label="排序" name="sort" type="number" defaultValue={p.sort} />
          </div>

          <AdminSelect
            label="狀態"
            name="status"
            defaultValue={p.status}
            options={[
              { value: "active", label: "上架中" },
              { value: "draft", label: "草稿（前台不顯示）" },
              { value: "sold_out", label: "已售完" },
            ]}
          />

          <label style={{ display: "block", marginBottom: 14, fontSize: ".95rem", fontWeight: 500, color: "var(--soft)" }}>
            <input type="checkbox" name="track_stock" defaultChecked={p.track_stock === 1} style={{ marginRight: 8 }} />
            控管庫存（不勾＝永遠可以下單）
          </label>
          <label style={{ display: "block", marginBottom: 28, fontSize: ".95rem", fontWeight: 500, color: "var(--soft)" }}>
            <input type="checkbox" name="featured" defaultChecked={p.featured === 1} style={{ marginRight: 8 }} />
            設為精選商品
          </label>

          <AdminSubmit>儲存</AdminSubmit>
        </form>

        <div style={{ marginTop: 34, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={p.id} />
            <button
              type="submit"
              style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: ".92rem", fontWeight: 700, color: "#9B4A2F" }}
            >
              刪除這個商品
            </button>
          </form>
          <p style={{ marginTop: 8, fontSize: ".85rem", color: "var(--mute)", lineHeight: 1.6 }}>
            上架中的商品不能刪，要先改成草稿。歷史訂單不受影響——訂單明細存的是下單當下的品名與價格。
          </p>
        </div>
      </Panel>
    </>
  );
}
