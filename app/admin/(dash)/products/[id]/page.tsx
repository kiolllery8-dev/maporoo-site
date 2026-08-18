import Link from "next/link";
import { notFound } from "next/navigation";
import { get } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";
import {
  AdminCheckbox,
  AdminField,
  AdminNotice,
  AdminSelect,
  AdminSubmit,
  BackLink,
  DangerButton,
  FieldRow,
  Note,
  PageHeader,
  Panel,
  Pill,
} from "../../../ui";
import { deleteProductAction, saveProductAction } from "../actions";
import { GalleryPanel } from "../../../GalleryPanel";
import { productImageRows } from "../../../../lib/media";
import { productImages } from "../../../../lib/product-images";
import { UPLOAD_ERRORS } from "../../../../lib/uploads";

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

const STATUS_LABEL: Record<string, string> = {
  active: "上架中",
  draft: "草稿",
  sold_out: "已售完",
};

const GALLERY_OK: Record<string, (n?: string) => string> = {
  uploaded: (n) => `已上傳 ${n ?? ""} 張，接在相簿最後面。第一張是封面。`,
  removed: () => "已從這個商品移除。檔案留在媒體庫。",
  moved: () => "順序已更新。",
  cover: () => "已設為封面。商品列表與首頁跟著換。",
  alt: () => "替代文字已儲存。",
  attached: () => "已從媒體庫加入相簿。",
};

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; e?: string; n?: string }>;
}) {
  // 編輯頁直接要求 products.edit——沒有編輯權的人看列表就好，不必進到表單。
  await requireAdmin("products.edit");
  const { id } = await params;
  const sp = await searchParams;

  const p = get<Product>(`SELECT * FROM products WHERE id = ?`, Number(id));
  if (!p) notFound();

  const gallery = productImageRows(p.id);

  const listed = p.status === "active";

  return (
    <>
      <BackLink href="/admin/products">← 回商品列表</BackLink>

      <PageHeader
        eyebrow="PRODUCT"
        title={p.name}
        crumbs={[
          { label: "後台", href: "/admin" },
          { label: "商品", href: "/admin/products" },
          { label: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name },
        ]}
        stats={`/${p.slug}・SKU ${p.sku || "未設定"}・${p.collection || "未分類"}${p.origin ? `・產地 ${p.origin}` : ""}`}
        actions={
          <>
            <Pill tone={listed ? "on" : p.status === "draft" ? "warn" : "off"}>
              {STATUS_LABEL[p.status] ?? p.status}
            </Pill>
            {listed && (
              <Link href={`/products/${p.slug}`} className="btn btn-outline">
                看前台
              </Link>
            )}
          </>
        }
      />

      <AdminNotice
        ok={
          sp.ok === "saved"
            ? "已儲存。"
            : sp.ok === "created"
              ? "商品已建立，目前是草稿。確認內容後把狀態改成「上架中」就會出現在前台。"
              : sp.ok
                ? GALLERY_OK[sp.ok]?.(sp.n) ?? "相簿已更新。"
                : undefined
        }
        m={
          sp.e === "activedelete"
            ? "上架中的商品不能直接刪除。請先把狀態改成草稿，再刪。"
            : sp.e
              ? UPLOAD_ERRORS[sp.e] ?? undefined
              : undefined
        }
      />

      <Panel title="商品內容">
        <Note>
          文案改動請照 <code>000_Agent/knowledge/compliance-redlines.md</code> 的紅線寫，
          尤其避開醫療效能、誇大保證，以及「醫療級／醫美級」這類身分誤導用語。
        </Note>

        <form action={saveProductAction} className="max-w-[640px]">
          <input type="hidden" name="id" value={p.id} />

          <AdminField label="品名" name="name" required defaultValue={p.name} />

          <FieldRow>
            <AdminField label="英文名" name="en" defaultValue={p.en} />
            <AdminField label="容量" name="size" defaultValue={p.size} />
          </FieldRow>

          <FieldRow>
            <AdminField label="售價（TWD）" name="price" type="number" required defaultValue={p.price} />
            <AdminField
              label="原價（TWD）"
              name="list_price"
              type="number"
              defaultValue={p.list_price ?? ""}
              hint="留空 = 不顯示原價"
            />
          </FieldRow>

          <AdminField label="一句話定位" name="tagline" defaultValue={p.tagline} />
          <AdminField label="商品敘述" name="about" textarea rows={6} defaultValue={p.about} />
          <AdminField label="適合" name="suits" defaultValue={p.suits} />
          <AdminField label="使用提醒" name="note" textarea rows={3} defaultValue={p.note} />
          <AdminField label="注意事項" name="caution" textarea rows={3} defaultValue={p.caution} />

          <FieldRow>
            <AdminField label="庫存" name="stock" type="number" defaultValue={p.stock} />
            <AdminField label="排序" name="sort" type="number" defaultValue={p.sort} />
          </FieldRow>

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

          <AdminCheckbox
            name="track_stock"
            defaultChecked={p.track_stock === 1}
            label="控管庫存（不勾＝永遠可以下單）"
          />
          <AdminCheckbox name="featured" defaultChecked={p.featured === 1} label="設為精選商品" />

          <AdminSubmit>儲存</AdminSubmit>
        </form>

        <div className="mt-8 pt-5 border-t border-brand-100">
          <form action={deleteProductAction}>
            <input type="hidden" name="id" value={p.id} />
            <DangerButton>刪除這個商品</DangerButton>
          </form>
          <p className="mt-2 text-xs text-ink/50 leading-relaxed max-w-[520px]">
            上架中的商品不能刪，要先改成草稿。歷史訂單不受影響——訂單明細存的是下單當下的品名與價格。
          </p>
        </div>
      </Panel>

      <GalleryPanel
        productId={p.id}
        images={gallery}
        fallback={productImages[p.sku] ?? []}
      />
    </>
  );
}
