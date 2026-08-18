import Link from "next/link";
import { requireAdmin } from "../../../lib/admin";
import {
  adminTaxonomies,
  KIND_LABEL,
  SEED_COUNTS,
  taxonomyCounts,
  type Kind,
} from "../../../lib/taxonomy";
import {
  AdminCheckbox,
  AdminField,
  AdminNotice,
  AdminSubmit,
  DangerButton,
  Empty,
  FieldRow,
  FilterTabs,
  Note,
  PageHeader,
  Panel,
  Pill,
} from "../../ui";
import RichTextEditor from "../../RichTextEditor";
import {
  createTaxonomyAction,
  deleteTaxonomyAction,
  importTaxonomiesAction,
  saveTaxonomyAction,
} from "./actions";

export const dynamic = "force-dynamic";

const KINDS: Kind[] = ["collection", "concern", "ingredient"];

const WHERE: Record<Kind, string> = {
  collection: "首頁品類區、商品列表的分區標題、頁尾「品類」欄，以及 /collections/ 分類頁。",
  concern: "商品列表上方的需求標籤、頁尾「依肌膚需求」欄，以及 /concerns/ 需求頁。",
  ingredient: "頁尾「成分知識」欄，以及 /ingredients/ 成分頁（含這是什麼、怎麼用與 FAQ）。",
};

const PATH: Record<Kind, string> = {
  collection: "/collections",
  concern: "/concerns",
  ingredient: "/ingredients",
};

const ERR: Record<string, string> = {
  missing: "slug 與中文名稱是必填的。",
  taken: "這個 slug 在同一組分類裡已經有人用了。",
  notfound: "找不到這一筆。",
  livedelete: "前台還顯示中的分類不能直接刪除。請先取消勾選「前台顯示」，再刪。",
};

export default async function TaxonomiesPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; ok?: string; e?: string; created?: string; skipped?: string }>;
}) {
  await requireAdmin("products.edit");
  const sp = await searchParams;
  const kind: Kind = KINDS.includes(sp.kind as Kind) ? (sp.kind as Kind) : "collection";

  const rows = adminTaxonomies(kind);
  const counts = taxonomyCounts();

  const ok =
    sp.ok === "import"
      ? `匯入完成：新增 ${sp.created ?? 0} 筆，略過 ${sp.skipped ?? 0} 筆（已存在的不覆蓋）。`
      : sp.ok === "created"
        ? "已新增。往下捲把說明文字補完。"
        : sp.ok === "saved"
          ? "已儲存。前台最多 5 分鐘內更新。"
          : sp.ok === "deleted"
            ? "已刪除。"
            : undefined;

  return (
    <>
      <PageHeader
        eyebrow="TAXONOMIES"
        title="分類管理"
        crumbs={[{ label: "後台", href: "/admin" }, { label: "分類" }]}
        stats={`品類 ${counts.collection.live}／${counts.collection.total}・肌膚需求 ${counts.concern.live}／${counts.concern.total}・成分 ${counts.ingredient.live}／${counts.ingredient.total}`}
      />

      <AdminNotice ok={ok} m={sp.e ? ERR[sp.e] ?? "操作沒有完成。" : undefined} />

      <FilterTabs
        current={kind}
        tabs={KINDS.map((k) => ({
          key: k,
          label: KIND_LABEL[k],
          count: counts[k].total,
          href: `/admin/taxonomies?kind=${k}`,
        }))}
      />

      <Note>
        這一組出現在：{WHERE[kind]}
        <br />
        「前台顯示」取消勾選之後，前台的選單與頁面就看不到它，網址也會變成找不到頁面。
        改到的文字最多 5 分鐘內生效。
      </Note>

      {rows.length === 0 ? (
        <Empty>
          資料庫裡還沒有{KIND_LABEL[kind]}，所以前台顯示的是程式碼裡那份（
          <code>app/lib/catalog.ts</code>，{SEED_COUNTS[kind]} 筆）。
          <br />
          <br />
          按下面的匯入把它們帶進資料庫，之後在這裡改什麼、網站就顯示什麼。
          <div className="mt-4">
            <form action={importTaxonomiesAction}>
              <input type="hidden" name="kind" value={kind} />
              <button type="submit" className="btn btn-primary">
                匯入 catalog.ts 的 {SEED_COUNTS[kind]} 筆{KIND_LABEL[kind]}
              </button>
            </form>
          </div>
        </Empty>
      ) : (
        rows.map((r) => (
          <Panel
            key={r.id}
            title={`${r.zh || r.slug}`}
            action={
              <span className="flex items-center gap-3">
                <Pill tone={r.disabled ? "off" : "on"}>{r.disabled ? "前台隱藏" : "前台顯示"}</Pill>
                {r.disabled === 0 && (
                  <Link
                    href={`${PATH[kind]}/${r.slug}`}
                    className="text-xs text-ink/60 hover:text-ink"
                  >
                    看前台
                  </Link>
                )}
              </span>
            }
          >
            <form action={saveTaxonomyAction}>
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="id" value={r.id} />

              <div className="max-w-[620px]">
                <p className="mb-4 text-xs text-ink/50">
                  網址 <code>{PATH[kind]}/{r.slug}</code>　·　slug 建立後不能改，改了舊網址會失效
                </p>

                <FieldRow>
                  <AdminField label="中文名稱" name="zh" defaultValue={r.zh} required />
                  <AdminField label="英文名稱" name="en" defaultValue={r.en} hint="顯示在中文名上方的小標。" />
                </FieldRow>

                <AdminField
                  label="一句話描述"
                  name="d"
                  defaultValue={r.d}
                  hint="出現在商品列表的分區標題旁邊與各種列表。一句講完。"
                />
              </div>

              {kind === "ingredient" ? (
                <>
                  <RichTextEditor
                    label="這是什麼"
                    name="what"
                    defaultValue={r.what}
                    rows={8}
                    hint="成分頁的第一段。寫成分本身，不要寫療效。"
                  />
                  <RichTextEditor
                    label="在保養品裡怎麼用"
                    name="how"
                    defaultValue={r.how}
                    rows={8}
                    hint="搭配什麼成分、出現在哪一類產品。避開醫療效能與療程的推論。"
                  />
                </>
              ) : (
                <RichTextEditor
                  label="分類頁導言"
                  name="intro"
                  defaultValue={r.intro}
                  rows={6}
                  hint="分類頁最上方那段。"
                />
              )}

              <div className="max-w-[620px]">
                <FieldRow>
                  <AdminField label="排序" name="sort" type="number" defaultValue={r.sort} />
                  <div className="flex items-end pb-4">
                    <AdminCheckbox
                      name="disabled"
                      label="從前台隱藏"
                      defaultChecked={r.disabled === 1}
                    />
                  </div>
                </FieldRow>

                <div className="flex items-center gap-5">
                  <AdminSubmit>儲存</AdminSubmit>
                </div>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-brand-100">
              <form action={deleteTaxonomyAction}>
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={r.id} />
                <DangerButton>刪除這個分類</DangerButton>
              </form>
              <p className="mt-2 text-xs text-ink/50 leading-relaxed max-w-[560px]">
                前台顯示中的不能刪，要先隱藏。商品身上記的是 slug，刪掉分類不會動到商品，
                但那些商品會變成沒有分類。
              </p>
            </div>
          </Panel>
        ))
      )}

      <Panel title={`新增${KIND_LABEL[kind]}`}>
        <Note>
          先建立，說明文字建立完在上面補。slug 會變成網址的一段，建立後就別再改。
        </Note>
        <form action={createTaxonomyAction} className="max-w-[520px]">
          <input type="hidden" name="kind" value={kind} />
          <AdminField
            label="SLUG（網址）"
            name="slug"
            required
            hint={`只收小寫英數與連字號。網址會是 ${PATH[kind]}/這一段。`}
          />
          <AdminField label="中文名稱" name="zh" required />
          <AdminField label="英文名稱" name="en" />
          <AdminField label="一句話描述" name="d" />
          <AdminSubmit>新增</AdminSubmit>
        </form>
      </Panel>

      {rows.length > 0 && (
        <Panel title="從 catalog.ts 補匯入">
          <Note>
            程式碼裡那份有 {SEED_COUNTS[kind]} 筆。已經存在的 slug 會略過不覆蓋，
            所以這顆按鈕重複按是安全的。
          </Note>
          <form action={importTaxonomiesAction}>
            <input type="hidden" name="kind" value={kind} />
            <button type="submit" className="btn btn-ghost">
              匯入缺少的{KIND_LABEL[kind]}
            </button>
          </form>
        </Panel>
      )}
    </>
  );
}
