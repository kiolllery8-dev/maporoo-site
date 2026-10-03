"use client";

// 前台右下角的客服聊天。
//
// 做法刻意保守：短輪詢（開著 3 秒、關著 30 秒），不開 WebSocket。
// 這個站是單機 Node 跑在自家主機上，長連線要另外養連線狀態與重連邏輯，
// 以客服的訊息量來說不值得。關掉分頁就停止輪詢，不在背景燒流量。
//
// 訊息一律當純文字渲染（放進 textContent，不是 innerHTML）：
// 聊天室的輸入來自陌生人，不給它任何標記語言的空間。

import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { id: number; from: "you" | "staff"; author: string; body: string; at: string };

const POLL_OPEN = 3000;
const POLL_IDLE = 30000;

export default function ChatWidget({
  greeting,
  placeholder,
  title,
  note,
}: {
  greeting: string;
  placeholder: string;
  title: string;
  note: string;
}) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef(0);

  const load = useCallback(async (quiet: boolean) => {
    try {
      const r = await fetch("/api/chat", { cache: "no-store" });
      if (!r.ok) return;
      const d = (await r.json()) as { messages: Msg[]; unread: number };
      setMsgs(d.messages);
      const newest = d.messages.length ? d.messages[d.messages.length - 1].id : 0;
      // 視窗關著的時候，客服的新回覆要在泡泡上顯示紅點。
      if (quiet && newest > lastIdRef.current && lastIdRef.current !== 0) {
        const added = d.messages.filter((m) => m.id > lastIdRef.current && m.from === "staff");
        if (added.length) setUnread((n) => n + added.length);
      }
      lastIdRef.current = newest;
    } catch {
      // 網路斷了就下一輪再試，不要在畫面上跳錯誤。
    }
  }, []);

  // 第一次掛載先讀一次，之後照視窗狀態決定輪詢間隔。
  // 分頁切到背景就不打 API——沒人在看的時候不要燒對方的流量。
  // 切回來時立刻補讀一次：不然關著的那輪要等 30 秒才看得到新回覆。
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    const tick = async () => {
      if (document.visibilityState === "visible") await load(!open);
      if (stopped) return;
      timer = setTimeout(tick, open ? POLL_OPEN : POLL_IDLE);
    };
    tick();

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      clearTimeout(timer);
      void tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [open, load]);

  // 開視窗就把紅點清掉，並捲到最新一則。
  useEffect(() => {
    if (!open) return;
    setUnread(0);
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, msgs.length]);

  const send = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body, page: location.pathname }),
      });
      if (r.status === 429) {
        setError("訊息太密集了，請等幾分鐘再送。");
        return;
      }
      if (!r.ok) {
        setError("沒有送出去，請再試一次。");
        return;
      }
      const d = (await r.json()) as { messages: Msg[] };
      setMsgs(d.messages);
      lastIdRef.current = d.messages.length ? d.messages[d.messages.length - 1].id : 0;
      setDraft("");
    } catch {
      setError("連線不穩，訊息沒有送出去。");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && (
        <section className="chat-panel" role="dialog" aria-label={title}>
          <header className="chat-head">
            <span>{title}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="關閉客服視窗">
              ✕
            </button>
          </header>

          <div className="chat-body" ref={listRef}>
            <p className="chat-greeting">{greeting}</p>
            {msgs.map((m) => (
              <div key={m.id} className={m.from === "you" ? "chat-msg me" : "chat-msg them"}>
                {m.from === "staff" && m.author && <span className="chat-who">{m.author}</span>}
                <p>{m.body}</p>
                <time>{m.at.slice(5, 16)}</time>
              </div>
            ))}
            {msgs.length > 0 && !msgs.some((m) => m.from === "staff") && (
              <p className="chat-note">{note}</p>
            )}
          </div>

          {error && <p className="chat-error">{error}</p>}

          <div className="chat-input">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                // Enter 送出、Shift+Enter 換行。手機的 Enter 是換行，靠按鈕送。
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder={placeholder}
              rows={2}
              maxLength={2000}
            />
            <button type="button" onClick={() => void send()} disabled={sending || !draft.trim()}>
              {sending ? "送出中" : "送出"}
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        className="chat-bubble"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "關閉客服視窗" : "開啟線上客服"}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M12 3c5.52 0 10 3.58 10 8s-4.48 8-10 8c-.9 0-1.78-.1-2.6-.28L5 21l.93-3.2C4.12 16.32 2 14.37 2 11c0-4.42 4.48-8 10-8Z" />
        </svg>
        {unread > 0 && <span className="chat-dot">{unread > 9 ? "9+" : unread}</span>}
      </button>
    </>
  );
}
