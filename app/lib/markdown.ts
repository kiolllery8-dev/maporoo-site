// 刻意受限的 Markdown 轉譯器。
//
// 為什麼不裝 marked / markdown-it：那些套件預設會讓原始 HTML 直接穿透，
// 要安全就得再配一個 sanitizer，等於兩個相依套件加一組要持續跟進的 CVE。
// 文章只需要標題、段落、清單、引言、粗體、連結——這個範圍自己寫得完，
// 而且**先跳脫再解析**，原始 HTML 完全沒有進來的路。
//
// 支援：## / ###、- 清單、1. 清單、> 引言、空行分段、**粗體**、*斜體*、
//       [文字](網址)、`程式碼`
// 不支援：原始 HTML、圖片語法、表格。需要的話再加，別開放 HTML 穿透。

const ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ESCAPE[c]);
}

/** 只放行 http、https 與站內的相對路徑。javascript: 之類一律擋掉。 */
function safeHref(raw: string): string | null {
  const url = raw.trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (url.startsWith("#")) return url;
  return null;
}

/** 行內語法。輸入必須已經跳脫過。 */
function inline(escaped: string): string {
  let out = escaped;

  // `程式碼`
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");

  // [文字](網址)
  //
  // 括號的部分允許一層巢狀：維基百科那類網址本身就帶括號
  // （例：/wiki/PDRN_(成分)），用 [^)]+ 會在第一個 ) 就截斷。
  out = out.replace(
    /\[([^\]]+)\]\(((?:[^()\s]|\([^()]*\))*)\)/g,
    (_whole, text: string, href: string) => {
      const safe = safeHref(href);
      // 網址不安全就只留文字。整段連結語法都吃掉，不要留下孤兒括號。
      if (!safe) return text;
      const external = /^https?:\/\//i.test(safe);
      const attrs = external ? ' rel="noopener noreferrer"' : "";
      return `<a href="${safe}"${attrs}>${text}</a>`;
    }
  );

  // **粗體** 要先於 *斜體*
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");

  return out;
}

export function renderMarkdown(src: string): string {
  const lines = escapeHtml(src.replace(/\r\n/g, "\n")).split("\n");
  const out: string[] = [];

  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let quote: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      out.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`);
      quote = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) {
      flushAll();
      continue;
    }

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      flushAll();
      out.push(`<h3>${inline(h3[1])}</h3>`);
      continue;
    }

    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      flushAll();
      out.push(`<h2>${inline(h2[1])}</h2>`);
      continue;
    }

    const quoted = line.match(/^&gt;\s?(.*)$/); // 跳脫過，所以 > 變成 &gt;
    if (quoted) {
      flushParagraph();
      flushList();
      quote.push(quoted[1]);
      continue;
    }

    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul) {
      flushParagraph();
      flushQuote();
      if (listType !== "ul") {
        flushList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      flushParagraph();
      flushQuote();
      if (listType !== "ol") {
        flushList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line.trim());
  }

  flushAll();
  return out.join("\n");
}

/** 給列表頁用的純文字摘要。 */
export function excerpt(src: string, max = 90): string {
  const text = src
    .replace(/^#{2,3}\s+.*$/gm, "")
    .replace(/[*`>#-]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max)}⋯` : text;
}
