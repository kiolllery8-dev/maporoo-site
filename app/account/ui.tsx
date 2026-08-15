// 會員區共用的版面元件。全部是 server component，表單不需要 client-side JS。

import Link from "next/link";
import { ERRORS } from "./errors";

export function Shell({
  eyebrow,
  title,
  lead,
  children,
  narrow = true,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <section className="pad-lg">
      <div className={narrow ? "wrap-narrow" : "wrap"}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 style={{ marginTop: 18, fontSize: "clamp(28px,4.4vw,44px)", fontWeight: 900, lineHeight: 1.3 }}>
          {title}
        </h1>
        {lead && (
          <p style={{ marginTop: 18, color: "var(--soft)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 620 }}>
            {lead}
          </p>
        )}
        <div style={{ marginTop: 38 }}>{children}</div>
      </div>
    </section>
  );
}

/** 把 ?e=code 或 ?m=訊息 轉成一行提示。兩個都沒有就不顯示。 */
export function Notice({
  e,
  m,
  ok,
}: {
  e?: string;
  m?: string;
  ok?: string;
}) {
  const text = ok ?? (m ? m : e ? ERRORS[e] ?? "操作沒有完成，請再試一次。" : "");
  if (!text) return null;
  const good = Boolean(ok);
  return (
    <p
      role="status"
      style={{
        margin: "0 0 26px",
        padding: "13px 16px",
        borderLeft: `2px solid ${good ? "var(--ink)" : "#9B4A2F"}`,
        background: "var(--paper2)",
        color: good ? "var(--soft)" : "#7A3722",
        fontSize: ".98rem",
        lineHeight: 1.5,
        fontWeight: 500,
      }}
    >
      {text}
    </p>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  hint,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <label style={{ display: "block", marginBottom: 24 }}>
      <span
        style={{
          display: "block",
          fontSize: ".82rem",
          letterSpacing: ".14em",
          color: "var(--accent)",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {label}
        {!required && <span style={{ color: "var(--mute)", letterSpacing: 0 }}>（可留空）</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid var(--line)",
          outline: "none",
          padding: "8px 0",
          fontSize: "1.05rem",
          color: "var(--ink)",
          fontWeight: 500,
          fontFamily: "inherit",
        }}
      />
      {hint && (
        <span style={{ display: "block", marginTop: 8, fontSize: ".85rem", color: "var(--mute)", lineHeight: 1.45 }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export function Submit({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="lnk-dark"
      style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: "1rem" }}
    >
      {children}
    </button>
  );
}

export function Aside({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ marginTop: 34, paddingTop: 24, borderTop: "1px solid var(--line)", color: "var(--soft)", fontSize: ".98rem", lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

export function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p style={{ padding: "13px 0", borderTop: "1px solid var(--line)", display: "flex", gap: 20, flexWrap: "wrap", fontSize: "1rem", color: "var(--soft)", fontWeight: 500 }}>
      <span className="en" style={{ display: "inline-block", width: 120, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "var(--ink)" }}>{value}</span>
    </p>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="lnk-dark">
      {children}
    </Link>
  );
}
