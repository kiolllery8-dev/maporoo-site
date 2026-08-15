// 後台共用元件。刻意樸素——後台要的是看得清楚、改得快，不是漂亮。
// 全部 server component，表單走原生 POST + server action，不需要 client JS。

import Link from "next/link";
import { ADMIN_ERRORS } from "./errors";

/** 每一頁最上方的標題區：麵包屑、大標、統計、右側動作。 */
export function PageHeader({
  eyebrow,
  title,
  stats,
  actions,
}: {
  eyebrow: string;
  title: string;
  stats?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
        marginBottom: 30,
      }}
    >
      <div>
        <p style={{ fontSize: ".7rem", letterSpacing: ".24em", color: "var(--accent)", fontWeight: 700 }}>
          {eyebrow}
        </p>
        <h1 style={{ marginTop: 9, fontSize: "1.9rem", fontWeight: 900, letterSpacing: ".02em" }}>
          {title}
        </h1>
        {stats && (
          <p style={{ marginTop: 8, fontSize: ".9rem", color: "var(--mute)", fontWeight: 500 }}>{stats}</p>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>{actions}</div>}
    </header>
  );
}

/** 上架／下架這類狀態小標籤。 */
export function Pill({ tone, children }: { tone: "on" | "off" | "warn"; children: React.ReactNode }) {
  const colours = {
    on: { dot: "#2E7D52", fg: "var(--ink)" },
    off: { dot: "#9B4A2F", fg: "#9B4A2F" },
    warn: { dot: "#B8860B", fg: "var(--soft)" },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        border: "1px solid var(--line)",
        background: "var(--paper2)",
        fontSize: ".82rem",
        fontWeight: 700,
        color: colours.fg,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 3, background: colours.dot }} />
      {children}
    </span>
  );
}

/** 分類標籤。 */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: "var(--paper2)",
        border: "1px solid var(--line)",
        fontSize: ".76rem",
        color: "var(--soft)",
        fontWeight: 600,
        marginRight: 5,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/** 列表上方的篩選頁籤。 */
export function FilterTabs({
  tabs,
  current,
}: {
  tabs: Array<{ href: string; label: string; count?: number; key: string }>;
  current: string;
}) {
  return (
    <p style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "0 0 20px" }}>
      {tabs.map((t) => {
        const active = t.key === current;
        return (
          <Link
            key={t.key || "all"}
            href={t.href}
            style={{
              padding: "6px 14px",
              border: "1px solid var(--line)",
              background: active ? "var(--ink)" : "transparent",
              color: active ? "var(--paper)" : "var(--soft)",
              fontSize: ".9rem",
              fontWeight: 700,
            }}
          >
            {t.label}
            {typeof t.count === "number" && `（${t.count}）`}
          </Link>
        );
      })}
    </p>
  );
}

/** 搜尋框。用原生 GET 表單，不需要 client JS。 */
export function SearchBox({
  name = "q",
  defaultValue,
  placeholder,
  hidden,
}: {
  name?: string;
  defaultValue?: string;
  placeholder: string;
  hidden?: Record<string, string>;
}) {
  return (
    <form style={{ display: "flex", gap: 0, marginBottom: 18, maxWidth: 640 }}>
      {hidden &&
        Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "var(--paper2)",
          border: "1px solid var(--line)",
          borderRight: "none",
          padding: "10px 13px",
          fontSize: ".95rem",
          fontFamily: "inherit",
          color: "var(--ink)",
        }}
      />
      <button
        type="submit"
        style={{
          cursor: "pointer",
          background: "var(--ink)",
          color: "var(--paper)",
          border: "none",
          padding: "10px 22px",
          fontSize: ".92rem",
          fontWeight: 700,
          fontFamily: "inherit",
        }}
      >
        搜尋
      </button>
    </form>
  );
}

/** 次要動作按鈕（外框式）。 */
export function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        border: "1px solid var(--line)",
        padding: "9px 16px",
        fontSize: ".9rem",
        fontWeight: 700,
        color: "var(--ink)",
      }}
    >
      {children}
    </Link>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        padding: "9px 18px",
        fontSize: ".9rem",
        fontWeight: 700,
      }}
    >
      {children}
    </Link>
  );
}

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
        lineHeight: 1.5,
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
    <p style={{ color: "var(--mute)", fontSize: ".97rem", lineHeight: 1.5, padding: "18px 0" }}>
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
      lineHeight: 1.45,
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
        <span style={{ display: "block", marginTop: 6, fontSize: ".83rem", color: "var(--mute)", lineHeight: 1.45 }}>
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
