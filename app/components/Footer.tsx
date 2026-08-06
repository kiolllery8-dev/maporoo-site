import Link from "next/link";
import { collections, concerns, ingredientPages } from "../lib/catalog";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "66px 0 42px", background: "var(--paper2)" }}>
      <div className="wrap">
        <p className="font-black text-[1.5rem] tracking-[.3em]">MAPOROO</p>
        <p style={{ marginTop: 14, color: "var(--soft)", fontSize: "1rem", maxWidth: 420, lineHeight: 1.95, fontWeight: 500 }}>
          以實證成分於澳洲配製，有效而從容的日常保養。適合各種膚況。
        </p>

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
          </div>
          <div className="ftcol">
            <p className="t">合作與服務</p>
            <a href="/#alliance">直播分潤</a>
            <a href="/#alliance">經銷合作</a>
            <a href="/#service">膚況諮詢</a>
            <Link href="/cart">購物袋</Link>
          </div>
        </div>

        <div className="rule" style={{ margin: "42px 0 24px" }} />
        <p style={{ fontSize: ".78rem", letterSpacing: ".08em", color: "var(--mute)", fontWeight: 500, lineHeight: 1.9, maxWidth: 760 }}>
          MAPOROO 商品為化粧品，作用於肌膚角質層，非藥品亦非醫療器材，不具療效。個別膚況問題請諮詢皮膚科醫師。
        </p>
        <p style={{ marginTop: 12, fontSize: ".78rem", letterSpacing: ".14em", color: "var(--mute)", fontWeight: 500 }}>
          © 2026 MAPOROO
        </p>
      </div>
    </footer>
  );
}
