import { all } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { can } from "../../../lib/permissions";
import { products as catalogProducts } from "../../../lib/catalog";
import { AdminLink, AdminNotice, Empty, Panel, Table, Td } from "../../ui";
import { importCatalogAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  size: string;
  price: number;
  list_price: number | null;
  collection: string;
  stock: number;
  track_stock: number;
  status: string;
  featured: number;
};

const STATUS: Record<string, string> = {
  active: "上架中",
  draft: "草稿",
  sold_out: "已售完",
};

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; e?: string; created?: string; skipped?: string }>;
}) {
  const admin = await requireAdmin("products.view");
  const mayEdit = can(admin.role, "products.edit");
  const sp = await searchParams;
  const rows = all<Row>(
    `SELECT id, slug, sku, name, size, price, list_price, collection, stock, track_stock, status, featured
       FROM products ORDER BY sort, id`
  );

  const ok =
    sp.ok === "import"
      ? `匯入完成：新增 ${sp.created ?? 0} 筆，略過 ${sp.skipped ?? 0} 筆（已存在的不覆蓋）。`
      : undefined;

  return (
    <>
      <AdminNotice ok={ok} e={sp.e} />

      <Panel
        title={`商品（${rows.length}）`}
        action={
          mayEdit ? (
            <form action={importCatalogAction}>
              <button
                type="submit"
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "1px solid var(--line)",
                  padding: "8px 16px",
                  fontFamily: "inherit",
                  fontSize: ".93rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                從 catalog.ts 匯入（{catalogProducts.length} 支）
              </button>
            </form>
          ) : null
        }
      >
        {rows.length === 0 ? (
          <Empty>
            資料庫裡還沒有商品。按右上角的匯入，把 <code>app/lib/catalog.ts</code> 現有的{" "}
            {catalogProducts.length} 支商品帶進來。
            <br />
            <br />
            提醒：匯入之後前台仍然讀 catalog.ts，不是讀資料庫。切換讀取來源是下一步，
            這樣才能先在後台把資料核對完再切，不會中途出現半套資料的頁面。
          </Empty>
        ) : (
          <Table head={["商品", "SKU", "品類", "容量", "售價", "原價", "庫存", "狀態", ""]}>
            {rows.map((p) => (
              <tr key={p.id}>
                <Td>
                  <AdminLink href={`/admin/products/${p.id}`}>{p.name}</AdminLink>
                  {p.featured === 1 && (
                    <span style={{ marginLeft: 8, fontSize: ".78rem", color: "var(--mute)" }}>精選</span>
                  )}
                  <br />
                  <span style={{ fontSize: ".82rem", color: "var(--mute)" }}>{p.slug}</span>
                </Td>
                <Td nowrap dim>{p.sku || "—"}</Td>
                <Td nowrap dim>{p.collection || "—"}</Td>
                <Td nowrap>{p.size || "—"}</Td>
                <Td nowrap>NT$ {p.price.toLocaleString()}</Td>
                <Td nowrap dim>{p.list_price ? `NT$ ${p.list_price.toLocaleString()}` : "—"}</Td>
                <Td nowrap>{p.track_stock ? p.stock : "不控管"}</Td>
                <Td nowrap>{STATUS[p.status] ?? p.status}</Td>
                <Td nowrap>
                  <AdminLink href={`/products/${p.slug}`}>看前台</AdminLink>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </>
  );
}
