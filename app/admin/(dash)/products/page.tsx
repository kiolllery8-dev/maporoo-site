import Link from "next/link";
import { all, get } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { can } from "../../../lib/permissions";
import { products as catalogProducts } from "../../../lib/catalog";
import { productImages } from "../../../lib/product-images";
import { imagesByProductId } from "../../../lib/media";
import {
  AdminLink,
  AdminNotice,
  Empty,
  FilterTabs,
  PageHeader,
  Pill,
  PrimaryLink,
  SearchBox,
  Table,
  Tag,
  Td,
  Tr,
} from "../../ui";
import { importCatalogAction } from "./actions";

// 版面照 auslife-www 的 app/admin/page.tsx：
// 手機是兩欄卡片格（好點、不用橫向捲），桌機是資料表（一次看得到更多欄位）。

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
  concerns_json: string;
  stock: number;
  track_stock: number;
  status: string;
  featured: number;
};

const STATUS_LABEL: Record<string, string> = {
  active: "上架",
  draft: "草稿",
  sold_out: "已售完",
};

const COLLECTION_LABEL: Record<string, string> = {
  "facial-care": "臉部保養",
  "hair-scalp": "頭皮髮絲",
  "bath-fragrance": "沐浴香氛",
};

const PAGE_SIZE = 30;
const LOW_STOCK = 20;

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{
    ok?: string; e?: string; created?: string; skipped?: string;
    q?: string; status?: string; page?: string;
  }>;
}) {
  const admin = await requireAdmin("products.view");
  const mayEdit = can(admin.role, "products.edit");
  const sp = await searchParams;

  const q = (sp.q ?? "").trim();
  const status = sp.status ?? "";

  const where: string[] = [];
  const params: (string | number)[] = [];
  if (q) {
    where.push(`(name LIKE ? OR sku LIKE ? OR slug LIKE ? OR en LIKE ?)`);
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  if (status && STATUS_LABEL[status]) {
    where.push(`status = ?`);
    params.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const total = get<{ c: number }>(`SELECT COUNT(*) AS c FROM products ${whereSql}`, ...params)?.c ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(sp.page) || 1), pages);

  const rows = all<Row>(
    `SELECT id, slug, sku, name, size, price, list_price, collection,
            concerns_json, stock, track_stock, status, featured
       FROM products ${whereSql}
      ORDER BY sort, id
      LIMIT ? OFFSET ?`,
    ...params,
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE
  );

  // 相簿封面一次撈完，列表每一列不用各查一次。
  const gallery = imagesByProductId();
  const coverOf = (row: Row) => gallery.get(row.id)?.[0] ?? productImages[row.sku]?.[0];

  // 頁籤數字看全部，不受目前搜尋條件影響。
  const n = (sql: string, ...p: (string | number)[]) => get<{ c: number }>(sql, ...p)?.c ?? 0;
  const counts = {
    all: n(`SELECT COUNT(*) AS c FROM products`),
    active: n(`SELECT COUNT(*) AS c FROM products WHERE status = 'active'`),
    draft: n(`SELECT COUNT(*) AS c FROM products WHERE status = 'draft'`),
    sold_out: n(`SELECT COUNT(*) AS c FROM products WHERE status = 'sold_out'`),
    low: n(`SELECT COUNT(*) AS c FROM products WHERE track_stock = 1 AND stock <= ?`, LOW_STOCK),
  };

  const qs = (extra: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    for (const [k, v] of Object.entries(extra)) {
      if (v === undefined || v === "") p.delete(k);
      else p.set(k, String(v));
    }
    const s = p.toString();
    return s ? `/admin/products?${s}` : "/admin/products";
  };

  const ok =
    sp.ok === "deleted"
      ? "商品已刪除。"
      : sp.ok === "import"
        ? `匯入完成：新增 ${sp.created ?? 0} 筆，略過 ${sp.skipped ?? 0} 筆（已存在的不覆蓋）。`
        : undefined;

  const parseConcerns = (raw: string): string[] => {
    try {
      const v = JSON.parse(raw || "[]");
      return Array.isArray(v) ? v.map(String) : [];
    } catch {
      return [];
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="PRODUCTS"
        title="商品管理"
        crumbs={[{ label: "後台", href: "/admin" }, { label: "商品" }]}
        stats={
          counts.all === 0
            ? "資料庫裡還沒有商品"
            : `共 ${counts.all} 件・上架 ${counts.active}・草稿 ${counts.draft}${counts.low ? `・低庫存 ${counts.low}` : ""}`
        }
        actions={
          mayEdit ? (
            <>
              <form action={importCatalogAction}>
                <button type="submit" className="btn btn-ghost">
                  匯入 catalog.ts（{catalogProducts.length}）
                </button>
              </form>
              <PrimaryLink href="/admin/products/new">＋ 新增商品</PrimaryLink>
            </>
          ) : null
        }
      />

      <AdminNotice ok={ok} e={sp.e} />

      {counts.all === 0 ? (
        <Empty>
          資料庫裡還沒有商品，所以前台顯示的是程式碼裡那份（
          <code>app/lib/catalog.ts</code>，{catalogProducts.length} 支）。
          <br />
          <br />
          按右上角的<strong className="text-ink">匯入</strong>把它們帶進資料庫。
          匯入之後前台就改讀資料庫，你在這裡改什麼、網站就顯示什麼。
        </Empty>
      ) : (
        <>
          <SearchBox
            defaultValue={q}
            placeholder="搜尋商品名稱、SKU、slug、英文名⋯"
            hidden={status ? { status } : undefined}
            clearHref="/admin/products"
          />

          <FilterTabs
            current={status}
            tabs={[
              { key: "", label: "全部", count: counts.all, href: qs({ status: undefined, page: undefined }) },
              { key: "active", label: "上架", count: counts.active, tone: "on", href: qs({ status: "active", page: undefined }) },
              { key: "draft", label: "草稿", count: counts.draft, href: qs({ status: "draft", page: undefined }) },
              { key: "sold_out", label: "已售完", count: counts.sold_out, tone: "off", href: qs({ status: "sold_out", page: undefined }) },
            ]}
          />

          <p className="text-xs text-ink/50 mb-3">
            {q ? `搜尋「${q}」— ` : ""}
            顯示 {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + rows.length} / 共 {total} 件
          </p>

          {rows.length === 0 ? (
            <Empty>{q ? `找不到符合「${q}」的商品。` : "這個狀態目前沒有商品。"}</Empty>
          ) : (
            <>
              {/* 手機：兩欄卡片格 */}
              <div className="md:hidden grid grid-cols-2 gap-3">
                {rows.map((p) => {
                  const img = coverOf(p);
                  const low = p.track_stock === 1 && p.stock <= LOW_STOCK;
                  const listed = p.status === "active";
                  return (
                    <div
                      key={p.id}
                      className={`bg-white border flex flex-col ${listed ? "border-brand-200" : "border-red-200 bg-red-50/30"}`}
                    >
                      <Link href={`/admin/products/${p.id}`} className="block">
                        <div className="aspect-square product-img flex items-center justify-center overflow-hidden">
                          {img ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] tracking-widest text-brand-500">MAPOROO</span>
                          )}
                        </div>
                      </Link>
                      <div className="p-3 flex-1 flex flex-col gap-1.5">
                        <Link href={`/admin/products/${p.id}`} className="block">
                          <div className="text-sm font-medium leading-snug line-clamp-2 break-all">{p.name}</div>
                        </Link>
                        <div className="text-[11px] text-ink/50 truncate">
                          {COLLECTION_LABEL[p.collection] ?? p.collection ?? "—"}
                        </div>
                        <div className="text-sm">
                          {p.list_price ? (
                            <>
                              <span className="text-red-700 font-medium">NT$ {p.price.toLocaleString()}</span>
                              <span className="text-[11px] line-through text-ink/40 ml-1">
                                {p.list_price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span>NT$ {p.price.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          {p.track_stock ? (
                            p.stock === 0 ? (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700">售罄</span>
                            ) : low ? (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800">低 {p.stock}</span>
                            ) : (
                              <span className="text-ink/60">庫存 {p.stock}</span>
                            )
                          ) : (
                            <span className="text-ink/30">不控管</span>
                          )}
                          {p.featured === 1 && <span className="text-amber-600">★ 精選</span>}
                        </div>
                        <div className="flex items-center justify-between mt-1 pt-2 border-t border-brand-100">
                          <Pill tone={listed ? "on" : p.status === "draft" ? "warn" : "off"}>
                            {STATUS_LABEL[p.status] ?? p.status}
                          </Pill>
                          {mayEdit && (
                            <Link href={`/admin/products/${p.id}`} className="text-xs font-medium text-ink hover:text-brand-700">
                              編輯
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 桌機：資料表 */}
              <div className="hidden md:block">
                <Table head={["商品", "分類", "肌膚需求", "售價", "庫存", "狀態", "操作"]}>
                  {rows.map((p) => {
                    const img = coverOf(p);
                    const low = p.track_stock === 1 && p.stock <= LOW_STOCK;
                    const listed = p.status === "active";
                    const concerns = parseConcerns(p.concerns_json);
                    return (
                      <Tr key={p.id} muted={!listed}>
                        <Td>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 product-img flex items-center justify-center overflow-hidden shrink-0">
                              {img ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[9px] tracking-widest text-brand-500">MAPOROO</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate max-w-[320px] text-ink">
                                {p.name}
                                {p.featured === 1 && <span className="ml-2 text-[11px] text-amber-600">★ 精選</span>}
                              </div>
                              <div className="text-xs text-ink/50">/{p.slug}</div>
                              {p.sku && <div className="text-[11px] text-brand-700 mt-0.5">SKU: {p.sku}</div>}
                            </div>
                          </div>
                        </Td>
                        <Td nowrap dim>{COLLECTION_LABEL[p.collection] ?? p.collection ?? "—"}</Td>
                        <Td>
                          {concerns.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {concerns.slice(0, 3).map((c) => (
                                <Tag key={c}>{c}</Tag>
                              ))}
                              {concerns.length > 3 && <span className="text-[10px] text-ink/40">+{concerns.length - 3}</span>}
                            </div>
                          ) : (
                            <span className="text-ink/30">—</span>
                          )}
                        </Td>
                        <Td nowrap align="right">
                          <span className={p.list_price ? "text-red-700 font-medium" : "text-ink font-medium"}>
                            NT$ {p.price.toLocaleString()}
                          </span>
                          {p.list_price ? (
                            <>
                              <br />
                              <span className="text-[11px] line-through text-ink/40">
                                {p.list_price.toLocaleString()}
                              </span>
                            </>
                          ) : null}
                          {p.size && (
                            <>
                              <br />
                              <span className="text-[11px] text-ink/40">{p.size}</span>
                            </>
                          )}
                        </Td>
                        <Td nowrap align="right">
                          {p.track_stock ? (
                            <span className={low ? "text-red-700 font-medium" : ""}>
                              {p.stock}
                              {low && " ⚠"}
                            </span>
                          ) : (
                            <span className="text-ink/30">不控管</span>
                          )}
                        </Td>
                        <Td nowrap>
                          <Pill tone={listed ? "on" : p.status === "draft" ? "warn" : "off"}>
                            {STATUS_LABEL[p.status] ?? p.status}
                          </Pill>
                        </Td>
                        <Td nowrap>
                          <div className="flex items-center gap-3 text-xs">
                            {mayEdit && <AdminLink href={`/admin/products/${p.id}`}>編輯</AdminLink>}
                            <Link href={`/products/${p.slug}`} className="text-ink/60 hover:text-ink">
                              看前台
                            </Link>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </Table>
              </div>
            </>
          )}

          {pages > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-5 text-xs">
              {Array.from({ length: pages }, (_, i) => i + 1).map((num) => (
                <Link
                  key={num}
                  href={qs({ page: num })}
                  className={`px-3 py-1.5 border ${
                    num === page ? "bg-ink text-cream border-ink" : "border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  {num}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
