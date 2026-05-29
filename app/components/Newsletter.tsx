"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="pad" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="wrap" style={{ maxWidth: 580 }}>
        <p className="eyebrow rv">保持聯繫</p>
        <p className="rv" style={{ marginTop: 16, color: "var(--soft)", fontSize: "1.1rem", fontWeight: 500 }}>
          收到新品上市與保養新知。
        </p>
        {done ? (
          <p className="rv in" style={{ marginTop: 26, color: "var(--soft)", fontWeight: 500 }}>
            謝謝你 ── 我們會把新知，慢慢寄到你的信箱。
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
            className="rv"
            style={{ marginTop: 26, display: "flex", gap: 16, alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: 10, maxWidth: 400 }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="你的 Email"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "1.05rem", color: "var(--ink)", fontWeight: 500, fontFamily: "inherit" }}
            />
            <button type="submit" className="lnk-dark" style={{ cursor: "pointer", background: "none" }}>訂閱</button>
          </form>
        )}
      </div>
    </section>
  );
}
