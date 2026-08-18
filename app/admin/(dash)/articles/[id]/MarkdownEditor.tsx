"use client";

// 左右對照的 Markdown 編輯器。
//
// 右邊的預覽用的是 app/lib/markdown.ts 那支轉譯器——跟前台文章頁同一支，
// 所以這裡看到的排版就是讀者會看到的排版，不會出現「後台好看、上線跑掉」。
// 那支是純函式（零 import、先跳脫再解析），搬到瀏覽器端跑沒有安全問題：
// 輸入是作者自己剛打的字，輸出的 HTML 也不含原始 HTML 穿透的路。
//
// 桌機左右並排並且捲動同步；手機寬度不夠並排，改成「寫作／對照」兩個頁籤。

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { renderMarkdown } from "../../../../lib/markdown";

type Tool =
  | { kind: "prefix"; label: string; title: string; mark: string; ordered?: boolean }
  | { kind: "wrap"; label: string; title: string; mark: string }
  | { kind: "link"; label: string; title: string };

const TOOLS: Tool[] = [
  { kind: "prefix", label: "H2", title: "大標", mark: "## " },
  { kind: "prefix", label: "H3", title: "小標", mark: "### " },
  { kind: "wrap", label: "B", title: "粗體", mark: "**" },
  { kind: "wrap", label: "I", title: "斜體", mark: "*" },
  { kind: "prefix", label: "・清單", title: "項目清單", mark: "- " },
  { kind: "prefix", label: "1. 清單", title: "編號清單", mark: "1. ", ordered: true },
  { kind: "prefix", label: "引言", title: "引言", mark: "> " },
  { kind: "link", label: "連結", title: "插入連結" },
  { kind: "wrap", label: "`程式`", title: "行內程式碼", mark: "`" },
];

export default function MarkdownEditor({
  name,
  defaultValue,
  rows = 24,
}: {
  name: string;
  defaultValue: string;
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => renderMarkdown(value), [value]);

  const stats = useMemo(() => {
    const text = value.trim();
    return {
      chars: text.length,
      // 中文沒有空白分詞，用字數當篇幅指標比詞數準。
      paragraphs: text ? text.split(/\n{2,}/).filter(Boolean).length : 0,
      headings: (value.match(/^#{2,3} /gm) ?? []).length,
    };
  }, [value]);

  /**
   * 改內容並把游標放回指定範圍——不做的話每次按工具列游標都會跳到最後面。
   * 選取範圍要等 React 把新的 value 寫進 DOM 之後才能設，所以先記在 ref，
   * 由下面的 useEffect 在 commit 之後補上。（用 requestAnimationFrame 會太早。）
   */
  const pendingSel = useRef<[number, number] | null>(null);

  const apply = useCallback((next: string, selStart: number, selEnd: number) => {
    pendingSel.current = [selStart, selEnd];
    setValue(next);
  }, []);

  useEffect(() => {
    const sel = pendingSel.current;
    const el = areaRef.current;
    if (!sel || !el) return;
    pendingSel.current = null;
    el.focus();
    el.setSelectionRange(sel[0], sel[1]);
  }, [value]);

  const run = useCallback(
    (tool: Tool) => {
      const el = areaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.slice(start, end);

      if (tool.kind === "wrap") {
        const m = tool.mark;

        // 開關行為。包完之後選取的是裡面的字，符號留在選取範圍外面，
        // 所以兩種情形都要認：符號在選取裡，或符號緊貼在選取外。
        const insideWrapped =
          selected.startsWith(m) && selected.endsWith(m) && selected.length > m.length * 2;
        const outsideWrapped =
          value.slice(start - m.length, start) === m && value.slice(end, end + m.length) === m;

        // 斜體是單顆 *，遇到 **粗體** 時外圍那顆屬於粗體，不要拆它。
        const partOfBold =
          m === "*" && (value.slice(start - 2, start) === "**" || value.slice(end, end + 2) === "**");

        if (insideWrapped) {
          const inner = selected.slice(m.length, selected.length - m.length);
          apply(value.slice(0, start) + inner + value.slice(end), start, start + inner.length);
          return;
        }
        if (outsideWrapped && !partOfBold) {
          const next = value.slice(0, start - m.length) + selected + value.slice(end + m.length);
          apply(next, start - m.length, start - m.length + selected.length);
          return;
        }

        const body = selected || tool.title;
        const next = value.slice(0, start) + m + body + m + value.slice(end);
        apply(next, start + m.length, start + m.length + body.length);
        return;
      }

      if (tool.kind === "link") {
        const text = selected || "連結文字";
        const next = value.slice(0, start) + `[${text}](https://)` + value.slice(end);
        // 游標停在網址上，直接貼上就好。
        const urlAt = start + text.length + 3;
        apply(next, urlAt, urlAt + 8);
        return;
      }

      // prefix：整行加前綴，選了多行就每一行都加。
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineEndRaw = value.indexOf("\n", end);
      const lineEnd = lineEndRaw === -1 ? value.length : lineEndRaw;
      const block = value.slice(lineStart, lineEnd);
      const lines = block.split("\n");

      const already = lines.every((l) => l.startsWith(tool.mark));
      const rewritten = lines
        .map((l, i) => {
          if (already) return l.slice(tool.mark.length);
          const cleaned = l.replace(/^(#{2,3} |[-*] |\d+\. |> )/, "");
          return tool.ordered ? `${i + 1}. ${cleaned}` : tool.mark + cleaned;
        })
        .join("\n");

      const next = value.slice(0, lineStart) + rewritten + value.slice(lineEnd);
      apply(next, lineStart, lineStart + rewritten.length);
    },
    [value, apply]
  );

  /** 捲動同步：用比例對齊，兩邊行高不同也不會越捲越歪。 */
  const syncScroll = useCallback(() => {
    const a = areaRef.current;
    const p = previewRef.current;
    if (!a || !p) return;
    const aMax = a.scrollHeight - a.clientHeight;
    const pMax = p.scrollHeight - p.clientHeight;
    if (aMax <= 0 || pMax <= 0) return;
    p.scrollTop = (a.scrollTop / aMax) * pMax;
  }, []);

  // 用 rem 不用 em：em 會各自對照兩邊的字級，左右就會一高一矮。
  const paneH = `${rows * 1.55}rem`;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-1.5">
        <span className="adm-label mb-0">內文（MARKDOWN）</span>
        {/* 手機用頁籤切換，桌機直接左右並排 */}
        <div className="flex lg:hidden gap-1 text-xs">
          {(["write", "preview"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={
                "px-3 py-1 border " +
                (tab === k ? "bg-ink text-cream border-ink" : "border-brand-300 hover:bg-brand-50")
              }
            >
              {k === "write" ? "寫作" : "對照"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.title}
            onClick={() => run(t)}
            className="px-2 py-1 text-xs border border-brand-300 bg-white hover:bg-brand-50 hover:border-ink text-ink"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-3 items-stretch">
        <div className={tab === "write" ? "" : "hidden lg:block"}>
          <textarea
            ref={areaRef}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onScroll={syncScroll}
            rows={rows}
            style={{ height: paneH }}
            className="adm-input font-mono text-[13px] leading-[1.7] resize-y w-full"
            spellCheck={false}
          />
        </div>

        <div className={tab === "preview" ? "" : "hidden lg:block"}>
          <div
            ref={previewRef}
            style={{ height: paneH }}
            className="article-body bg-white border border-brand-200 px-5 py-4 overflow-y-auto text-ink/80 leading-relaxed"
            // renderMarkdown 先跳脫再解析，原始 HTML 進不來。
            dangerouslySetInnerHTML={{ __html: html || '<p class="text-ink/40">開始打字，這裡會即時排版。</p>' }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-1.5 text-[12px] text-ink/50">
        <span>{stats.chars} 字</span>
        <span>{stats.paragraphs} 段</span>
        <span>{stats.headings} 個標題</span>
        <span className="hidden sm:inline">
          支援 ## 標題、### 小標、- 清單、1. 清單、&gt; 引言、**粗體**、[文字](網址)。不支援原始 HTML。
        </span>
      </div>
    </div>
  );
}
