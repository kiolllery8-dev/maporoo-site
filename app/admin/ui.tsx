// 後台共用元件。版面與命名對照 auslife-www 的 components/AdminPageHeader
// 與各列表頁，改用 Tailwind class 而不是內嵌 style，日後兩邊互相搬移比較容易。
//
// 全部是 server component；表單走原生 POST ＋ server action，不需要 client JS。

import Link from "next/link";
import type { ReactNode } from "react";
import { ADMIN_ERRORS } from "./errors";

type Crumb = { label: string; href?: string };

export function PageHeader({
  eyebrow,
  title,
  stats,
  crumbs,
  actions,
}: {
  eyebrow: string;
  title: string;
  stats?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {crumbs && crumbs.length > 0 && (
        <nav className="text-[11px] tracking-[0.25em] text-ink/50 mb-2 flex flex-wrap items-center gap-1">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {c.href ? (
                <Link href={c.href} className="hover:text-ink">{c.label}</Link>
              ) : (
                <span className="text-ink">{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span className="opacity-40">/</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.3em] text-brand-600">{eyebrow}</p>
          <h2 className="serif text-2xl md:text-3xl mt-1">{title}</h2>
          {stats && <p className="text-sm text-ink/60 mt-1">{stats}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
  href,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "accent";
  href?: string;
}) {
  const toneCls =
    tone === "good"
      ? "text-green-700"
      : tone === "warn"
        ? "text-amber-700"
        : tone === "bad"
          ? "text-red-700"
          : tone === "accent"
            ? "text-brand-700"
            : "text-ink";
  const inner = (
    <>
      <p className="text-[11px] tracking-[0.25em] text-ink/50 uppercase">{label}</p>
      <p className={"serif text-3xl mt-1 " + toneCls}>{value}</p>
      {hint && <p className="text-[11px] text-ink/50 mt-1">{hint}</p>}
    </>
  );
  if (href) {
    return (
      <Link href={href} className="block bg-white border border-brand-200 p-5 hover:border-ink transition group">
        {inner}
        <p className="text-[10px] tracking-[0.3em] text-brand-600 mt-3 opacity-0 group-hover:opacity-100 transition">
          查看 →
        </p>
      </Link>
    );
  }
  return <div className="bg-white border border-brand-200 p-5">{inner}</div>;
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-8 bg-white border border-brand-200">
      <div className="flex items-baseline justify-between gap-4 flex-wrap px-5 py-4 border-b border-brand-100">
        <h3 className="serif text-lg">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
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
      className={
        "mb-5 px-4 py-3 text-sm border-l-[3px] " +
        (good ? "border-ink bg-brand-50 text-ink/80" : "border-red-700 bg-red-50 text-red-800")
      }
    >
      {text}
    </p>
  );
}

export function Pill({ tone, children }: { tone: "on" | "off" | "warn"; children: ReactNode }) {
  const cls =
    tone === "on"
      ? "bg-green-50 text-green-800 border-green-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";
  const dot = tone === "on" ? "bg-green-600" : tone === "warn" ? "bg-amber-500" : "bg-red-600";
  return (
    <span className={"inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border whitespace-nowrap " + cls}>
      <span className={"w-1.5 h-1.5 rounded-full " + dot} />
      {children}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-1.5 py-0.5 bg-brand-100 text-brand-700 text-[10px] mr-1 whitespace-nowrap">
      {children}
    </span>
  );
}

export function FilterTabs({
  tabs,
  current,
}: {
  tabs: Array<{ href: string; label: string; count?: number; key: string; tone?: "on" | "off" }>;
  current: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 text-xs mb-4">
      {tabs.map((t) => {
        const active = t.key === current;
        const activeCls =
          t.tone === "on"
            ? "bg-green-700 text-white border-green-700"
            : t.tone === "off"
              ? "bg-red-700 text-white border-red-700"
              : "bg-ink text-cream border-ink";
        return (
          <Link
            key={t.key || "all"}
            href={t.href}
            className={"px-3 py-1.5 border " + (active ? activeCls : "border-brand-300 hover:bg-brand-50")}
          >
            {t.label}
            {typeof t.count === "number" ? " (" + t.count + ")" : ""}
          </Link>
        );
      })}
    </div>
  );
}

export function SearchBox({
  name = "q",
  defaultValue,
  placeholder,
  hidden,
  clearHref,
}: {
  name?: string;
  defaultValue?: string;
  placeholder: string;
  hidden?: Record<string, string>;
  clearHref?: string;
}) {
  return (
    <form className="flex flex-wrap gap-2 mb-4">
      {hidden &&
        Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="adm-input flex-1 min-w-[220px] max-w-xl"
      />
      <button className="btn btn-primary" type="submit">
        搜尋
      </button>
      {defaultValue && clearHref && (
        <Link href={clearHref} className="btn btn-outline">
          清除
        </Link>
      )}
    </form>
  );
}

/** 資料表。外層自帶橫向捲動，寬表格在手機上不會撐破版面。 */
export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="bg-white border border-brand-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-brand-50 text-xs uppercase tracking-wider text-brand-700">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="text-left p-3 whitespace-nowrap font-medium">
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

export function Tr({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return <tr className={"border-t border-brand-100 " + (muted ? "bg-red-50/40" : "")}>{children}</tr>;
}

export function Td({
  children,
  nowrap,
  dim,
  align = "left",
}: {
  children: ReactNode;
  nowrap?: boolean;
  dim?: boolean;
  align?: "left" | "right" | "center";
}) {
  const alignCls = align === "right" ? "text-right" : align === "center" ? "text-center" : "";
  return (
    <td
      className={
        "p-3 align-top " +
        (nowrap ? "whitespace-nowrap " : "") +
        (dim ? "text-ink/50 " : "text-ink/80 ") +
        alignCls
      }
    >
      {children}
    </td>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="p-10 text-center text-ink/60 bg-white border border-brand-200 text-sm leading-relaxed">
      {children}
    </div>
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
    className: "adm-input",
  };
  return (
    <label className="block mb-4">
      <span className="adm-label">{label}</span>
      {textarea ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
      {hint && <span className="block mt-1.5 text-[12px] text-ink/50 leading-relaxed">{hint}</span>}
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
    <label className="block mb-4">
      <span className="adm-label">{label}</span>
      <select name={name} defaultValue={defaultValue} className="adm-input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminSubmit({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className="btn btn-primary">
      {children}
    </button>
  );
}

export function AdminLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-ink font-medium hover:text-brand-700 underline underline-offset-4 decoration-brand-300"
    >
      {children}
    </Link>
  );
}

export function GhostLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="btn btn-ghost">
      {children}
    </Link>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="btn btn-primary">
      {children}
    </Link>
  );
}

/** 表格裡的危險動作（刪除／停用）。 */
export function DangerButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="text-xs font-medium text-red-700 hover:text-red-900 bg-transparent border-none p-0 cursor-pointer"
    >
      {children}
    </button>
  );
}

/** 表格底下的頁碼。href 由呼叫端組，因為每一頁的查詢字串不一樣。 */
export function Pagination({
  page,
  pages,
  href,
}: {
  page: number;
  pages: number;
  href: (n: number) => string;
}) {
  if (pages <= 1) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-5 text-xs">
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={href(n)}
          className={
            "px-3 py-1.5 border " +
            (n === page ? "bg-ink text-cream border-ink" : "border-brand-300 hover:bg-brand-50")
          }
        >
          {n}
        </Link>
      ))}
    </div>
  );
}

/** 回上一層的麵包屑連結。 */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="mb-4 text-sm">
      <Link href={href} className="text-ink/60 hover:text-ink">
        {children}
      </Link>
    </p>
  );
}

/** 說明文字。後台到處都有一段講規則的話，統一長相。 */
export function Note({ children }: { children: ReactNode }) {
  return <p className="mb-5 max-w-[680px] text-sm text-ink/70 leading-relaxed">{children}</p>;
}

/** 兩欄表單列，手機自動變一欄。 */
export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-x-5">{children}</div>;
}

export function AdminCheckbox({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-2.5 mb-4 text-sm text-ink/80 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 w-4 h-4 accent-ink shrink-0"
      />
      <span className="leading-relaxed">
        {label}
        {hint && <span className="block text-[12px] text-ink/50 mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

/** 表格／面板裡的次要動作按鈕（送出用）。 */
export function InlineSubmit({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="text-xs font-medium text-ink hover:text-brand-700 bg-transparent border-none p-0 cursor-pointer whitespace-nowrap"
    >
      {children}
    </button>
  );
}

/** 表格裡的小型下拉（例如角色切換），高度對齊 InlineSubmit。 */
export function InlineSelect({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="border border-brand-300 bg-white px-2 py-1 text-xs text-ink focus:outline-none focus:border-ink"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
