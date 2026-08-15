import Link from "next/link";
import { collections, concerns, ingredientPages } from "../lib/catalog";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "66px 0 42px", background: "var(--paper2)" }}>
      <div className="wrap">
        <p className="font-black text-[1.5rem] tracking-[.3em]">MAPOROO</p>
        <p style={{ marginTop: 14, color: "var(--soft)", fontSize: "1rem", maxWidth: 420, lineHeight: 1.6, fontWeight: 500 }}>
          以實證成分於澳洲配製，有效而從容的日常保養。適合各種膚況。
        </p>

        {/* 五欄：品類、需求、成分、會員與訂單、合作。
            會員那一欄是 2026-08-13 補的——改版時把會員入口整個弄丟了，
            頁面都在但客人點不到。 */}
        <div className="grid g4" style={{ marginTop: 42, gap: 34 }}>
          <div className="ftcol">
            <p className="t">品類</p>
            {collections.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`}>{c.zh}</Link>
            ))}
            <Link href="/products">全部商品</Link>
          </div>
          <div className="ftcol">
            <p className="t">依肌膚需求</p>
            {concerns.map((c) => (
              <Link key={c.slug} href={`/concerns/${c.slug}`}>{c.zh}</Link>
            ))}
          </div>
          <div className="ftcol">
            <p className="t">成分知識</p>
            {ingredientPages.map((i) => (
              <Link key={i.slug} href={`/ingredients/${i.slug}`}>{i.zh}</Link>
            ))}
            <Link href="/read">閱讀</Link>
          </div>
          <div className="ftcol">
            <p className="t">會員與訂單</p>
            <Link href="/account">會員中心</Link>
            <Link href="/account/register">加入會員</Link>
            <Link href="/account">訂單查詢</Link>
            <Link href="/cart">購物袋</Link>
          </div>
          <div className="ftcol">
            <p className="t">合作</p>
            <a href="/#alliance">直播分潤</a>
            <a href="/#alliance">經銷合作</a>
            <a href="/#needs">依肌膚需求</a>
          </div>
        </div>

        <div className="rule" style={{ margin: "42px 0 24px" }} />
        {/* 化粧品免責聲明已於 2026-08-13 依老闆指示移除。
            風險評估與後續建議記錄在 000_Agent/knowledge/compliance-redlines.md 第五節第 9 項。 */}
        <p style={{ fontSize: ".78rem", letterSpacing: ".14em", color: "var(--mute)", fontWeight: 500 }}>
          © 2026 MAPOROO
        </p>
      </div>
    </footer>
  );
}
