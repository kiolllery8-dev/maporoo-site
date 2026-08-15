import Link from "next/link";
import Image from "next/image";
import Hero from "./components/Hero";
import { loadContent, text } from "./lib/content";
import Reveal from "./components/Reveal";
import {
  collections,
  productsByCollection,
  getProduct,
  heroImage,
  products,
  ingredients,
  reads,
  needs,
  iconRow,
  pillars,
  alliance,
  services
} from "./lib/catalog";

// The hero product on the homepage. Falls back to the first item in the
// catalogue so a slug change can never blank out this section.
const featured = getProduct("pdrn-hyaluronic-serum-200ml") ?? products[0];
const featuredImg = heroImage(featured);

const icons: Record<string, React.ReactNode> = {
  restore: (<><path d="M21 12a9 9 0 1 1-2.6-6.3" /><path d="M21 4v4h-4" /></>),
  clarity: (<><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="3.2" /></>),
  hydration: (<path d="M12 3c0 0-6.5 7-6.5 11a6.5 6.5 0 0 0 13 0C18.5 10 12 3 12 3Z" />),
  aromatics: (<><path d="M10 3h4v3h-4z" /><path d="M9.2 6.5h5.6a1 1 0 0 1 1 1V19a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2V7.5a1 1 0 0 1 1-1Z" /><path d="M9.5 12h5" /></>),
  scalp: (<><path d="M12 21V10" /><path d="M12 13c0-3-2.6-4.5-4.8-3.8C7 12 9 13.5 12 13.5" /><path d="M12 11c0-3 2.6-4.8 4.8-4C16.8 10.5 15 11.5 12 11.5" /><path d="M8 21h8" /></>)
};

// 首頁的文字可以在後台「前台文案」修改，所以要讀資料庫。
// 用 ISR 而不是完全動態：每 5 分鐘重新產生一次就夠了，
// 不需要每一次請求都查一次資料庫。
export const revalidate = 300;

export default function Home() {
  const c = loadContent();
  const t = (k: string) => text(c, k);

  return (
    <>
      <Hero />

      {/* ICON ROW */}
      <section style={{ padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <p className="eyebrow rv" style={{ textAlign: "center", display: "block" }}>三個品類</p>
          <div className="icons rv" style={{ marginTop: 18, gridTemplateColumns: `repeat(${iconRow.length}, 1fr)` }}>
            {iconRow.map((it) => (
              <Link key={it.zh} className="icon-item" href={`/collections/${it.slug}`}>
                <svg viewBox="0 0 24 24">{icons[it.icon]}</svg>
                <span className="zh">{it.zh}</span>
                <span className="en">{it.en}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="pad-lg">
        <div className="wrap-narrow">
          <p className="eyebrow rv">{t("home.brand.eyebrow")}</p>
          <h2 className="rv" style={{ marginTop: 12 }}>{t("home.brand.heading")}</h2>
          <p className="lead rv" style={{ marginTop: 14, maxWidth: 700 }}>
            {t("home.brand.body")}
          </p>
          <div className="rv" style={{ marginTop: 30 }}><a className="lnk-dark" href="#story">MAPOROO 的故事</a></div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="pad" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: "center", gap: 52 }}>
            <Link href={`/products/${featured.slug}`} className="rv ph" style={{ aspectRatio: "4/5", position: "relative", overflow: "hidden" }}>
              {featuredImg ? (
                <Image src={featuredImg} alt={featured.name} fill sizes="(max-width: 680px) 100vw, 50vw" style={{ objectFit: "cover" }} />
              ) : (
                <span>{featured.en.toUpperCase()}</span>
              )}
            </Link>
            <div className="rv">
              <p className="eyebrow">精選配方</p>
              <h2 style={{ marginTop: 16, fontSize: "clamp(26px,3.6vw,40px)" }}>{featured.name}</h2>
              <p className="en" style={{ marginTop: 8 }}>{featured.en} ─ {featured.size}</p>
              <p style={{ marginTop: 22, color: "var(--soft)", fontSize: "1.08rem", lineHeight: 2, maxWidth: 460 }}>
                {featured.about}
              </p>
              <div style={{ marginTop: 26, fontSize: "1rem", color: "var(--soft)", fontWeight: 500 }}>
                <p style={{ padding: "9px 0", borderTop: "1px solid var(--line)" }}><span className="en" style={{ display: "inline-block", width: 92 }}>適合</span>{featured.suits}</p>
                {featured.origin && (
                  <p style={{ padding: "9px 0", borderTop: "1px solid var(--line)" }}><span className="en" style={{ display: "inline-block", width: 92 }}>產地</span>{featured.origin}</p>
                )}
                <p style={{ padding: "9px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}><span className="en" style={{ display: "inline-block", width: 92 }}>容量</span>{featured.size}　NT$ {featured.price.toLocaleString()}</p>
              </div>
              <p className="en" style={{ marginTop: 26 }}>如何使用 ─ HOW TO USE</p>
              <ol className="steps" style={{ marginTop: 14 }}>
                {featured.howToUse.map((s) => (
                  <li key={s.t}><strong style={{ color: "var(--ink)", fontWeight: 700 }}>{s.t}</strong><br />{s.d}</li>
                ))}
              </ol>
              <div style={{ marginTop: 26 }}><Link className="lnk-dark" href={`/products/${featured.slug}`}>查看商品詳情</Link></div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="pad-lg">
        <div className="wrap">
          <p className="eyebrow rv">COLLECTIONS</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 10 }}>{t("home.collections.heading")}</h2>
          <p className="lead rv" style={{ marginBottom: 32 }}>
            {t("home.collections.lead")}
          </p>
          {collections.map((c) => (
            <div key={c.zh} className="rv" style={{ padding: "32px 0", borderTop: "1px solid var(--line)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "2rem", fontWeight: 900 }}>{c.zh}</h3>
                <span className="en">{c.en}</span>
              </div>
              <p style={{ color: "var(--soft)", fontSize: "1.05rem", maxWidth: 700, lineHeight: 1.95, marginTop: 10 }}>{c.d}</p>
              <div style={{ marginTop: 18 }}>
                {productsByCollection(c.slug).map((p) => (
                  <Link key={p.slug} href={`/products/${p.slug}`} style={{ display: "inline-block", margin: "0 20px 10px 0", fontSize: ".98rem", color: "var(--soft)", borderBottom: "1px solid var(--line)", paddingBottom: 3, fontWeight: 500 }} className="hover:text-[var(--ink)] transition-colors">{p.name}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEEDS */}
      <section id="needs" className="pad" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <p className="eyebrow rv">{t("home.needs.eyebrow")}</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 46 }}>{t("home.needs.heading")}</h2>
          <div className="grid g3">
            {needs.map((n) => (
              <div key={n.en} className="rv">
                <p className="en">{n.en}</p>
                <h3 style={{ margin: "14px 0 6px", fontSize: "1.3rem" }}>{n.zh}</h3>
                <ul className="clean">{n.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="rv" style={{ marginTop: 42 }}><a className="lnk-dark" href="#needs">了解您的肌膚 ─ 膚況診斷</a></div>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section id="ingredients" className="pad-lg">
        <div className="wrap">
          <p className="eyebrow rv">{t("home.ingredients.eyebrow")}</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 10 }}>{t("home.ingredients.heading")}</h2>
          <p className="lead rv" style={{ marginBottom: 22 }}>
            {t("home.ingredients.lead")}
          </p>
          <div className="grid g4">
            {ingredients.map((g) => (
              <div key={g.zh} className="rv ing">
                <span className="en">{g.en}</span>
                <h3 style={{ fontSize: "1.8rem", marginTop: 10, fontWeight: 900 }}>{g.zh}</h3>
                <p style={{ marginTop: 12, color: "var(--soft)", fontSize: ".98rem", lineHeight: 1.9 }}>{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* READ */}
      <section id="read" className="pad" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <p className="eyebrow rv">閱讀 ─ LIBRARY</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 46 }}>理解，是保養的開始</h2>
          <div className="grid g3">
            {reads.map((r) => (
              <div key={r.t} className="rv">
                <div className="ph" style={{ aspectRatio: "4/3" }} />
                <p className="en" style={{ marginTop: 18 }}>{r.cat}</p>
                <h3 style={{ fontSize: "1.45rem", marginTop: 10, fontWeight: 700, lineHeight: 1.45 }}>{r.t}</h3>
                <p style={{ marginTop: 12, fontSize: ".82rem", letterSpacing: ".12em", color: "var(--mute)", fontWeight: 700 }}>閱讀 · {r.time}</p>
              </div>
            ))}
          </div>
          <div className="rv" style={{ marginTop: 46 }}><a className="lnk-dark" href="#read">查看所有文章</a></div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="pad-lg">
        <div className="wrap-narrow">
          <p className="eyebrow rv">{t("home.story.eyebrow")}</p>
          <h2 className="rv" style={{ marginTop: 18 }}>{t("home.story.heading")}</h2>
          <p className="lead rv" style={{ marginTop: 24 }}>
            {t("home.story.body")}
          </p>
          <div className="rv" style={{ marginTop: 38, display: "grid", gap: 28 }}>
            {pillars.map((p) => (
              <div key={p.k} style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
                <span className="en">{p.k}</span>
                <h3 style={{ fontSize: "1.6rem", marginTop: 8 }}>{p.t}</h3>
                <p style={{ color: "var(--soft)", fontSize: "1.02rem", marginTop: 8 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALLIANCE */}
      <section id="alliance" className="pad-lg" style={{ background: "var(--ink)", color: "#EDE8DD" }}>
        <div className="wrap">
          <p className="eyebrow rv" style={{ color: "#B9B3A4" }}>{t("home.alliance.eyebrow")}</p>
          <h2 className="rv" style={{ marginTop: 18, color: "#F5F1E8" }}>{t("home.alliance.heading")}</h2>
          <p className="lead rv" style={{ marginTop: 24, color: "rgba(237,232,221,.78)", maxWidth: 640 }}>
            {t("home.alliance.lead")}
          </p>
          <div className="grid g2 rv" style={{ marginTop: 48, gap: 24 }}>
            {alliance.map((a) => (
              <div key={a.no} className="alliance-card" style={{ background: "#26241f", borderColor: "#3a372f" }}>
                <p className="en" style={{ color: "#B9B3A4" }}>{a.no}</p>
                <h3 style={{ fontSize: "1.7rem", marginTop: 12, color: "#F5F1E8" }}>{a.zh}</h3>
                <p style={{ marginTop: 14, color: "rgba(237,232,221,.72)", fontSize: "1rem", lineHeight: 1.95 }}>{a.d}</p>
                <ul className="clean" style={{ marginTop: 18 }}>
                  {a.items.map((i) => <li key={i} style={{ borderColor: "#3a372f", color: "#CFC9BC" }}>{i}</li>)}
                </ul>
                <div style={{ marginTop: 22 }}><a className="lnk" href="#alliance">{a.cta}</a></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE */}
      <section id="service" className="pad" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <p className="eyebrow rv">{t("home.service.eyebrow")}</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 46 }}>{t("home.service.heading")}</h2>
          <div className="grid g2">
            {services.map((s) => (
              <div key={s.t} className="rv">
                <h3 style={{ fontSize: "1.5rem" }}>{s.t}</h3>
                <p style={{ color: "var(--soft)", fontSize: "1.02rem", marginTop: 12, lineHeight: 1.95 }}>{s.d}</p>
                <div style={{ marginTop: 16 }}><Link className="lnk-dark" href={s.href}>{s.cta}</Link></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="pad-lg">
        <div className="wrap-narrow">
          <p className="rv" style={{ fontSize: "clamp(24px,3.8vw,38px)", fontWeight: 900, lineHeight: 1.5 }}>
            有效的成分，<br />值得溫和的對待。
          </p>
          <div className="rv" style={{ marginTop: 30 }}><span className="eyebrow">MAPOROO</span></div>
        </div>
      </section>

      <Reveal />
    </>
  );
}
