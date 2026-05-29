import Hero from "./components/Hero";
import Reveal from "./components/Reveal";
import Newsletter from "./components/Newsletter";
import {
  collections,
  ingredients,
  reads,
  needs,
  iconRow,
  pillars,
  alliance,
  services
} from "./lib/catalog";

const icons: Record<string, React.ReactNode> = {
  restore: (<><path d="M21 12a9 9 0 1 1-2.6-6.3" /><path d="M21 4v4h-4" /></>),
  clarity: (<><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="3.2" /></>),
  hydration: (<path d="M12 3c0 0-6.5 7-6.5 11a6.5 6.5 0 0 0 13 0C18.5 10 12 3 12 3Z" />),
  aromatics: (<><path d="M10 3h4v3h-4z" /><path d="M9.2 6.5h5.6a1 1 0 0 1 1 1V19a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2V7.5a1 1 0 0 1 1-1Z" /><path d="M9.5 12h5" /></>),
  scalp: (<><path d="M12 21V10" /><path d="M12 13c0-3-2.6-4.5-4.8-3.8C7 12 9 13.5 12 13.5" /><path d="M12 11c0-3 2.6-4.8 4.8-4C16.8 10.5 15 11.5 12 11.5" /><path d="M8 21h8" /></>)
};

export default function Home() {
  return (
    <>
      <Hero />

      {/* ICON ROW */}
      <section style={{ padding: "62px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <p className="eyebrow rv" style={{ textAlign: "center", display: "block" }}>五個系列</p>
          <div className="icons rv" style={{ marginTop: 34 }}>
            {iconRow.map((it) => (
              <a key={it.zh} className="icon-item" href="#collections">
                <svg viewBox="0 0 24 24">{icons[it.icon]}</svg>
                <span className="zh">{it.zh}</span>
                <span className="en">{it.en}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="pad-lg">
        <div className="wrap-narrow">
          <p className="eyebrow rv">我們相信</p>
          <h2 className="rv" style={{ marginTop: 22 }}>有效與舒適，可以並存。</h2>
          <p className="lead rv" style={{ marginTop: 26, maxWidth: 700 }}>
            MAPOROO 在科學實證的基礎上，選擇可信的成分——PDRN、外泌體、胜肽與玻尿酸——配製兼具功效與感官的保養。我們相信，有效的成分，值得被溫和地對待。
          </p>
          <div className="rv" style={{ marginTop: 30 }}><a className="lnk-dark" href="#story">我們的故事</a></div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="pad" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <div className="grid g2" style={{ alignItems: "center", gap: 52 }}>
            <div className="rv ph" style={{ aspectRatio: "4/5" }}><span>PDRN SERUM</span></div>
            <div className="rv">
              <p className="eyebrow">精選配方</p>
              <h2 style={{ marginTop: 16 }}>PDRN 修復精華液</h2>
              <p className="en" style={{ marginTop: 8 }}>PDRN SERUM ─ 30ml</p>
              <p style={{ marginTop: 22, color: "var(--soft)", fontSize: "1.08rem", lineHeight: 2, maxWidth: 460 }}>
                以 PDRN 與多分子玻尿酸配製，層層滲透、安撫並支持肌膚的自我修復。質地清盈，適合各種膚況每日使用，亦適合療程期間。
              </p>
              <div style={{ marginTop: 26, fontSize: "1rem", color: "var(--soft)", fontWeight: 500 }}>
                <p style={{ padding: "9px 0", borderTop: "1px solid var(--line)" }}><span className="en" style={{ display: "inline-block", width: 92 }}>成分</span>PDRN・多分子玻尿酸</p>
                <p style={{ padding: "9px 0", borderTop: "1px solid var(--line)" }}><span className="en" style={{ display: "inline-block", width: 92 }}>適合</span>各種膚況・療程期間</p>
                <p style={{ padding: "9px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}><span className="en" style={{ display: "inline-block", width: 92 }}>容量</span>30ml　NT$ 1,680</p>
              </div>
              <p className="en" style={{ marginTop: 26 }}>如何使用 ─ HOW TO USE</p>
              <ol className="steps" style={{ marginTop: 14 }}>
                <li>潔膚與調理後，取 2–3 滴於掌心。</li>
                <li>輕壓於臉部，由內而外輕拍至吸收。</li>
                <li>後續可疊加保濕乳霜，鎖住水分。</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="pad-lg">
        <div className="wrap">
          <p className="eyebrow rv">COLLECTIONS</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 10 }}>五個系列</h2>
          <p className="lead rv" style={{ marginBottom: 32 }}>
            醫美，是我們對功效的標準——美白、保濕、修復。適合各種膚況，也適合正在進行療程的你。
          </p>
          {collections.map((c) => (
            <div key={c.zh} className="rv" style={{ padding: "32px 0", borderTop: "1px solid var(--line)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "2rem", fontWeight: 900 }}>{c.zh}</h3>
                <span className="en">{c.en}</span>
              </div>
              <p style={{ color: "var(--soft)", fontSize: "1.05rem", maxWidth: 700, lineHeight: 1.95, marginTop: 10 }}>{c.d}</p>
              <div style={{ marginTop: 18 }}>
                {c.products.map((p) => (
                  <span key={p} style={{ display: "inline-block", margin: "0 20px 10px 0", fontSize: ".98rem", color: "var(--soft)", borderBottom: "1px solid var(--line)", paddingBottom: 3, fontWeight: 500 }}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEEDS */}
      <section id="needs" className="pad" style={{ background: "var(--paper2)" }}>
        <div className="wrap">
          <p className="eyebrow rv">依需求選擇</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 46 }}>從你的肌膚出發</h2>
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
          <p className="eyebrow rv">配方哲學</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 10 }}>我們選擇的成分</h2>
          <p className="lead rv" style={{ marginBottom: 22 }}>
            每一支配方，都建立在科學實證之上。我們相信，成分的可信，是照顧的前提。
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
          <p className="eyebrow rv">我們的故事</p>
          <h2 className="rv" style={{ marginTop: 18 }}>關於 MAPOROO</h2>
          <p className="lead rv" style={{ marginTop: 24 }}>
            MAPOROO 相信，肌膚的照顧不必在功效與舒適之間二選一。我們在科學實證的基礎上選擇可信的成分，配製出有效、溫和、且令人安心的日常保養——適合每一種膚況，也陪伴每一次想對自己更好一點的時刻。
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
          <p className="eyebrow rv" style={{ color: "#B9B3A4" }}>合作聯盟 ─ PARTNERSHIP</p>
          <h2 className="rv" style={{ marginTop: 18, color: "#F5F1E8" }}>一起把好的配方，分享出去</h2>
          <p className="lead rv" style={{ marginTop: 24, color: "rgba(237,232,221,.78)", maxWidth: 640 }}>
            MAPOROO 歡迎直播主、團購主與通路夥伴加入。我們提供清楚的分潤機制與完整的品牌素材，讓合作簡單、透明。
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
          <p className="eyebrow rv">官網服務</p>
          <h2 className="rv" style={{ marginTop: 16, marginBottom: 46 }}>我們在你身邊</h2>
          <div className="grid g3">
            {services.map((s) => (
              <div key={s.t} className="rv">
                <h3 style={{ fontSize: "1.5rem" }}>{s.t}</h3>
                <p style={{ color: "var(--soft)", fontSize: "1.02rem", marginTop: 12, lineHeight: 1.95 }}>{s.d}</p>
                <div style={{ marginTop: 16 }}><a className="lnk-dark" href="#service">{s.cta}</a></div>
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

      <Newsletter />
      <Reveal />
    </>
  );
}
