// 後台共用元件。刻意樸素——後台要的是看得清楚、改得快，不是漂亮。
// 全部 server component，表單走原生 POST + server action，不需要 client JS。

import Link from "next/link";
import { ADMIN_ERRORS } from "./errors";

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: ".02em" }}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminNotice({ e, m, ok }: { e?: string; m?: string; ok?: string }) {
  const text = ok ?? (m ? m : e ? ADMIN_ERRORS[e] ?? "操作沒有完成，請再試一次。" : "");
  if (!text) return null;
  const good = Boolean(ok);
  return (
    <p
      role="status"
      style={{
        margin: "0 0 24px",
        padding: "12px 15px",
        borderLeft: `3px solid ${good ? "var(--ink)" : "#9B4A2F"}`,
        background: "var(--paper2)",
        color: good ? "var(--soft)" : "#7A3722",
        fontSize: ".95rem",
        lineHeight: 1.75,
        fontWeight: 500,
      }}
    >
      {text}
    </p>
  );
}

export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 14 }}>
      <p style={{ fontSize: ".78rem", letterSpacing: ".16em", color: "var(--accent)", fontWeight: 700 }}>
        {label}
      </p>
      <p style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1.2, marginTop: 8 }}>{value}</p>
      {sub && <p style={{ fontSize: ".85rem", color: "var(--mute)", marginTop: 4, fontWeight: 500 }}>{sub}</p>}
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".95rem" }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "10px 14px 10px 0",
                  borderBottom: "1px solid var(--ink)",
                  fontSize: ".78rem",
                  letterSpacing: ".14em",
                  color: "var(--accent)",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  nowrap,
  dim,
}: {
  children: React.ReactNode;
  nowrap?: boolean;
  dim?: boolean;
}) {
  return (
    <td
      style={{
        padding: "12px 14px 12px 0",
        borderBottom: "1px solid var(--line)",
        color: dim ? "var(--mute)" : "var(--soft)",
        fontWeight: 500,
        whiteSpace: nowrap ? "nowrap" : undefined,
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: "var(--mute)", fontSize: ".97rem", lineHeight: 1.9, padding: "18px 0" }}>
      {children}
    </p>
  );
}

export function AdminField({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  hint,
  autoComplete,
  textarea,
  rows = 4,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
  hint?: string;
  autoComplete?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const shared = {
    name,
    required,
    defaultValue: defaultValue as string | undefined,
    autoComplete,
    style: {
      width: "100%",
      background: "var(--paper2)",
      border: "1px solid var(--line)",
      outline: "none",
      padding: "9px 11px",
      fontSize: "1rem",
      color: "var(--ink)",
      fontWeight: 500,
      fontFamily: "inherit",
      lineHeight: 1.7,
    } as React.CSSProperties,
  };
  return (
    <label style={{ display: "block", marginBottom: 20 }}>
      <span
        style={{
          display: "block",
          fontSize: ".78rem",
          letterSpacing: ".14em",
          color: "var(--accent)",
          fontWeight: 700,
          marginBottom: 7,
        }}
      >
        {label}
      </span>
      {textarea ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
      {hint && (
        <span style={{ display: "block", marginTop: 6, fontSize: ".83rem", color: "var(--mute)", lineHeight: 1.7 }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export function AdminSelect({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
}) {
  return (
    <label style={{ display: "block", marginBottom: 20 }}>
      <span
        style={{
          display: "block",
          fontSize: ".78rem",
          letterSpacing: ".14em",
          color: "var(--accent)",
          fontWeight: 700,
          marginBottom: 7,
        }}
      >
        {label}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        style={{
          width: "100%",
          background: "var(--paper2)",
          border: "1px solid var(--line)",
          padding: "9px 11px",
          fontSize: "1rem",
          color: "var(--ink)",
          fontWeight: 500,
          fontFamily: "inherit",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminSubmit({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      style={{
        cursor: "pointer",
        background: "var(--ink)",
        color: "var(--paper)",
        border: "none",
        padding: "11px 26px",
        fontSize: ".95rem",
        fontWeight: 700,
        letterSpacing: ".08em",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

export function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{ color: "var(--ink)", fontWeight: 700, borderBottom: "1px solid var(--line)", paddingBottom: 2 }}
    >
      {children}
    </Link>
  );
}
