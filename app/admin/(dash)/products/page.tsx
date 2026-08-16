import Image from "next/image";
import Link from "next/link";
import { all, get } from "../../../lib/db";
import { requireAdmin } from "../../../lib/admin";
import { can } from "../../../lib/permissions";
import { products as catalogProducts } from "../../../lib/catalog";
import { productImages } from "../../../lib/product-images";
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
} from "../../ui";
import { importCatalogAction } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  en: string;
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
  searchParams: Promise<{ ok?: string; e?: string; created?: string; skipped?: string; q?: string; status?: string; page?: string }>;
}) {
  const admin = await requireAdmin("products.view");
  const mayEdit = can(admin.role, "products.edit");
  const sp = await searchParams;

  const q = (sp.q ?? "").trim();
  const status = sp.status ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

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

  const rows = all<Row>(
    `SELECT id, slug, sku, name, en, size, price, list_price, collection,
            concerns_json, stock, track_stock, status, featured
       FROM products ${whereSql}
      ORDER BY sort, id
      LIMIT ? OFFSET ?`,
    ...params,
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE
  );

  // 頁籤上的數字要看全部，不受目前搜尋條件影響。
  const counts = {
    all: get<{ c: number }>(`SELECT COUNT(*) AS c FROM products`)?.c ?? 0,
    active: get<{ c: number }>(`SELECT COUNT(*) AS c FROM products WHERE status = 'active'`)?.c ?? 0,
    draft: get<{ c: number }>(`SELECT COUNT(*) AS c FROM products WHERE status = 'draft'`)?.c ?? 0,
    sold_out: get<{ c: number }>(`SELECT COUNT(*) AS c FROM products WHERE status = 'sold_out'`)?.c ?? 0,
    low: get<{ c: number }>(
      `SELECT COUNT(*) AS c FROM products WHERE track_stock = 1 AND stock <= ?`,
      LOW_STOCK
    )?.c ?? 0,
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (extra: Record<string, string | number>) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    for (const [k, v] of Object.entries(extra)) p.set(k, String(v));
    return `/admin/products?${p.toString()}`;
  };

  const OK_MSG: Record<string, string> = {
    deleted: "商品已刪除。",
  };
  const ok =
    sp.ok && OK_MSG[sp.ok]
      ? OK_MSG[sp.ok]
      : sp.ok === "import"
      ? `匯入完成：新增 ${sp.created ?? 0} 筆，略過 ${sp.skipped ?? 0} 筆（已存在的不覆蓋）。`
      : undefined;

  return (
    <>
      <PageHeader
        eyebrow="PRODUCTS"
        title="商品管理"
        stats={
          counts.all === 0
            ? "資料庫裡還沒有商品"
            : `共 ${counts.all} 件・上架 ${counts.active}・草稿 ${counts.draft}${counts.low ? `・低庫存 ${counts.low}` : ""}`
        }
        actions={
          mayEdit && (
            <>
              <PrimaryLink href="/admin/products/new">＋ 新增商品</PrimaryLink>
              <form action={importCatalogAction}>
              <button
                type="submit"
                style={{
                  cursor: "pointer",
                  background: counts.all === 0 ? "var(--ink)" : "transparent",
                  color: counts.all === 0 ? "var(--paper)" : "var(--ink)",
                  border: "1px solid var(--line)",
                  padding: "9px 18px",
                  fontFamily: "inherit",
                  fontSize: ".9rem",
                  fontWeight: 700,
                }}
              >
                從 catalog.ts 匯入（{catalogProducts.length} 支）
              </button>
              </form>
            </>
          )
        }
      />

      <AdminNotice ok={ok} e={sp.e} />

      {counts.all === 0 ? (
        <Empty>
          資料庫裡還沒有商品，所以前台目前顯示的是程式碼裡那份（
          <code>app/lib/catalog.ts</code>，{catalogProducts.length} 支）。
          <br />
          <br />
          按右上角的<strong style={{ color: "var(--ink)" }}>匯入</strong>把它們帶進資料庫。
          匯入之後前台就改讀資料庫，你在這裡改什麼、網站就顯示什麼。
        </Empty>
      ) : (
        <>
          <SearchBox defaultValue={q} placeholder="搜尋商品名稱、SKU、slug、英文名⋯" hidden={status ? { status } : undefined} />

          <FilterTabs
            current={status}
            tabs={[
              { key: "", label: "全部", count: counts.all, href: q ? `/admin/products?q=${encodeURIComponent(q)}` : "/admin/products" },
              { key: "active", label: "上架", count: counts.active, href: qs({ status: "active", page: 1 }) },
              { key: "draft", label: "草稿", count: counts.draft, href: qs({ status: "draft", page: 1 }) },
              { key: "sold_out", label: "已售完", count: counts.sold_out, href: qs({ status: "sold_out", page: 1 }) },
            ]}
          />

          <p style={{ fontSize: ".85rem", color: "var(--mute)", marginBottom: 12 }}>
            顯示 {rows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + rows.length} / 共 {total} 件
          </p>

          {rows.length === 0 ? (
            <Empty>{q ? `找不到符合「${q}」的商品。` : "這個狀態目前沒有商品。"}</Empty>
          ) : (
            <Table head={["商品", "品類", "售價", "庫存", "狀態", "操作"]}>
              {rows.map((p) => {
                const img = productImages[p.sku]?.[0];
                const low = p.track_stock === 1 && p.stock <= LOW_STOCK;
                let concerns: string[] = [];
                try {
                  const parsed = JSON.parse(p.concerns_json || "[]");
                  if (Array.isArray(parsed)) concerns = parsed.map(String);
                } catch {
                  concerns = [];
                }
                return (
                  <tr key={p.id}>
                    <Td>
                      <span style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                        <span
                          style={{
                            position: "relative",
                            width: 52,
                            height: 62,
                            flexShrink: 0,
                            background: "var(--paper2)",
                            border: "1px solid var(--line)",
                            overflow: "hidden",
                          }}
                        >
                          {img && <Image src={img} alt="" fill sizes="52px" style={{ objectFit: "cover" }} />}
                        </span>
                        <span style={{ minWidth: 0 }}>
                          <AdminLink href={`/admin/products/${p.id}`}>{p.name}</AdminLink>
                          {p.featured === 1 && (
                            <span style={{ marginLeft: 7, fontSize: ".74rem", color: "var(--accent)", fontWeight: 700 }}>
                              精選
                            </span>
                          )}
                          <br />
                          <span style={{ fontSize: ".8rem", color: "var(--mute)" }}>/{p.slug}</span>
                          <br />
                          <span style={{ fontSize: ".78rem", color: "var(--accent)", fontWeight: 700 }}>
                            SKU {p.sku || "—"}
                          </span>
                          {concerns.length > 0 && (
                            <>
                              <br />
                              <span style={{ display: "inline-block", marginTop: 5 }}>
                                {concerns.slice(0, 3).map((c) => (
                                  <Tag key={c}>{c}</Tag>
                                ))}
                              </span>
                            </>
                          )}
                        </span>
                      </span>
                    </Td>
                    <Td nowrap dim>{COLLECTION_LABEL[p.collection] ?? p.collection ?? "—"}</Td>
                    <Td nowrap>
                      <span style={{ color: "var(--ink)", fontWeight: 700 }}>NT$ {p.price.toLocaleString()}</span>
                      {p.list_price ? (
                        <>
                          <br />
                          <span style={{ color: "var(--mute)", textDecoration: "line-through", fontSize: ".85rem" }}>
                            {p.list_price.toLocaleString()}
                          </span>
                        </>
                      ) : null}
                      {p.size && (
                        <>
                          <br />
                          <span style={{ color: "var(--mute)", fontSize: ".8rem" }}>{p.size}</span>
                        </>
                      )}
                    </Td>
                    <Td nowrap>
                      {p.track_stock ? (
                        <span style={{ color: low ? "#9B4A2F" : "var(--soft)", fontWeight: low ? 700 : 500 }}>
                          {p.stock}
                          {low && " ⚠"}
                        </span>
                      ) : (
                        <span style={{ color: "var(--mute)" }}>不控管</span>
                      )}
                    </Td>
                    <Td nowrap>
                      <Pill tone={p.status === "active" ? "on" : p.status === "draft" ? "warn" : "off"}>
                        {STATUS_LABEL[p.status] ?? p.status}
                      </Pill>
                    </Td>
                    <Td nowrap>
                      {mayEdit && <AdminLink href={`/admin/products/${p.id}`}>編輯</AdminLink>}
                      <span style={{ margin: "0 8px", color: "var(--line)" }}>·</span>
                      <Link href={`/products/${p.slug}`} style={{ color: "var(--soft)", fontWeight: 700 }}>
                        看前台
                      </Link>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          )}

          {pages > 1 && (
            <p style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap", fontSize: ".92rem", fontWeight: 700 }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={qs({ page: n })} style={{ color: n === page ? "var(--ink)" : "var(--mute)" }}>
                  {n}
                </Link>
              ))}
            </p>
          )}
        </>
      )}
    </>
  );
}
