export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "66px 0 42px", background: "var(--paper2)" }}>
      <div className="wrap">
        <p className="font-black text-[1.5rem] tracking-[.3em]">MAPOROO</p>
        <p style={{ marginTop: 14, color: "var(--soft)", fontSize: "1rem", maxWidth: 420, lineHeight: 1.95, fontWeight: 500 }}>
          以醫學實證的成分，配製有效而從容的日常保養。適合各種膚況。
        </p>

        <div className="grid g4" style={{ marginTop: 42, gap: 34 }}>
          <div className="ftcol">
            <p className="t">系列</p>
            <a href="/products#restore">修復</a>
            <a href="/products#clarity">亮白</a>
            <a href="/products#hydration">保濕</a>
            <a href="/products#aromatics">香氛</a>
            <a href="/products#scalp">頭皮</a>
          </div>
          <div className="ftcol">
            <p className="t">依需求</p>
            <a href="/#needs">依肌膚困擾</a>
            <a href="/#needs">依膚質</a>
            <a href="/#needs">依成分</a>
            <a href="/#needs">膚況診斷</a>
          </div>
          <div className="ftcol">
            <p className="t">合作聯盟</p>
            <a href="/#alliance">直播分潤</a>
            <a href="/#alliance">經銷</a>
            <a href="/#service">企業合作</a>
          </div>
          <div className="ftcol">
            <p className="t">服務</p>
            <a href="/#service">膚況諮詢</a>
            <a href="/#service">門市體驗</a>
            <a href="/#service">會員禮遇</a>
            <a href="/#service">配送與退換</a>
          </div>
        </div>

        <div className="rule" style={{ margin: "42px 0 24px" }} />
        <p style={{ fontSize: ".78rem", letterSpacing: ".14em", color: "var(--mute)", fontWeight: 500 }}>
          © 2026 MAPOROO ─ 以醫學實證的成分，配製有效而從容的日常保養
        </p>
      </div>
    </footer>
  );
}
