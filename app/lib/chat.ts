import "server-only";

// 線上客服的資料存取與防濫用規則。
//
// 訪客不用註冊。身分是一個 httpOnly cookie 裡的隨機 token，對應一條對話；
// 拿 token 只撈得到自己那一條，撈不到別人的——所以路由層一律用 token 查，
// 不要用 thread id 查。
//
// 訊息一律當純文字存、純文字顯示。聊天室的輸入來自陌生人，
// 不讓它走 Markdown：連結預覽與 HTML 都不值得為此開一條路。

import crypto from "node:crypto";
import { all, get, run } from "./db";

export const MAX_BODY = 2000;
/** 同一條對話在 WINDOW_MS 內最多幾則。擋洗版，不擋正常對話。 */
export const RATE_LIMIT = 20;
export const WINDOW_MS = 5 * 60 * 1000;

export type Thread = {
  id: number;
  token: string;
  member_id: number | null;
  name: string;
  email: string;
  status: string;
  first_page: string;
  unread_admin: number;
  unread_visitor: number;
  last_message_at: string | null;
  created_at: string;
};

export type Message = {
  id: number;
  thread_id: number;
  sender: string;
  author: string;
  body: string;
  created_at: string;
};

export function newChatToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function threadByToken(token: string): Thread | undefined {
  if (!token) return undefined;
  return get<Thread>(`SELECT * FROM chat_threads WHERE token = ?`, token);
}

export function threadById(id: number): Thread | undefined {
  return get<Thread>(`SELECT * FROM chat_threads WHERE id = ?`, id);
}

export function createThread(token: string, opts: { memberId?: number | null; page?: string }) {
  run(
    `INSERT INTO chat_threads (token, member_id, first_page, last_message_at)
     VALUES (?, ?, ?, datetime('now'))`,
    token,
    opts.memberId ?? null,
    (opts.page ?? "").slice(0, 200)
  );
  return threadByToken(token)!;
}

export function messagesOf(threadId: number, afterId = 0): Message[] {
  return all<Message>(
    `SELECT * FROM chat_messages WHERE thread_id = ? AND id > ? ORDER BY id`,
    threadId,
    afterId
  );
}

/** 這條對話最近 5 分鐘發了幾則訪客訊息。 */
export function recentVisitorCount(threadId: number): number {
  const since = new Date(Date.now() - WINDOW_MS).toISOString().slice(0, 19).replace("T", " ");
  return (
    get<{ c: number }>(
      `SELECT COUNT(*) AS c FROM chat_messages
        WHERE thread_id = ? AND sender = 'visitor' AND created_at >= ?`,
      threadId,
      since
    )?.c ?? 0
  );
}

export function addVisitorMessage(thread: Thread, body: string) {
  run(
    `INSERT INTO chat_messages (thread_id, sender, body) VALUES (?, 'visitor', ?)`,
    thread.id,
    body
  );
  run(
    `UPDATE chat_threads
        SET unread_admin = unread_admin + 1,
            status = 'open',
            last_message_at = datetime('now')
      WHERE id = ?`,
    thread.id
  );
}

export function addAdminMessage(threadId: number, author: string, body: string) {
  run(
    `INSERT INTO chat_messages (thread_id, sender, author, body) VALUES (?, 'admin', ?, ?)`,
    threadId,
    author.slice(0, 60),
    body
  );
  run(
    `UPDATE chat_threads
        SET unread_visitor = unread_visitor + 1,
            last_message_at = datetime('now')
      WHERE id = ?`,
    threadId
  );
}

/** 客服打開對話就算看過了。 */
export function markReadByAdmin(threadId: number) {
  run(`UPDATE chat_threads SET unread_admin = 0 WHERE id = ?`, threadId);
}

/** 訪客打開聊天視窗就算看過了。 */
export function markReadByVisitor(threadId: number) {
  run(`UPDATE chat_threads SET unread_visitor = 0 WHERE id = ?`, threadId);
}

export function updateThreadContact(threadId: number, name: string, email: string) {
  run(
    `UPDATE chat_threads SET name = ?, email = ? WHERE id = ?`,
    name.slice(0, 60),
    email.slice(0, 160),
    threadId
  );
}

export function setThreadStatus(threadId: number, status: "open" | "closed") {
  run(`UPDATE chat_threads SET status = ? WHERE id = ?`, status, threadId);
}

export function attachMember(threadId: number, memberId: number) {
  run(`UPDATE chat_threads SET member_id = ? WHERE id = ? AND member_id IS NULL`, memberId, threadId);
}

export type ThreadRow = Thread & { messages: number; preview: string };

/** 後台收件匣。一次把筆數與最後一句撈出來，列表不要 N+1。 */
export function inboxThreads(status: string, limit = 100): ThreadRow[] {
  const where = status === "open" || status === "closed" ? `WHERE t.status = ?` : "";
  const params = where ? [status] : [];
  return all<ThreadRow>(
    `SELECT t.*,
            (SELECT COUNT(*) FROM chat_messages m WHERE m.thread_id = t.id) AS messages,
            COALESCE((SELECT m.body FROM chat_messages m
                       WHERE m.thread_id = t.id ORDER BY m.id DESC LIMIT 1), '') AS preview
       FROM chat_threads t
       ${where}
      ORDER BY t.unread_admin DESC, t.last_message_at DESC
      LIMIT ?`,
    ...params,
    limit
  );
}

export function chatCounts() {
  const n = (sql: string) => get<{ c: number }>(sql)?.c ?? 0;
  return {
    open: n(`SELECT COUNT(*) AS c FROM chat_threads WHERE status = 'open'`),
    closed: n(`SELECT COUNT(*) AS c FROM chat_threads WHERE status = 'closed'`),
    all: n(`SELECT COUNT(*) AS c FROM chat_threads`),
    unread: n(`SELECT COUNT(*) AS c FROM chat_threads WHERE unread_admin > 0`),
  };
}

/** 清掉訊息裡的控制字元，長度也砍到上限。回傳空字串代表這則不該收。 */
export function cleanBody(raw: unknown): string {
  if (typeof raw !== "string") return "";
  // eslint-disable-next-line no-control-regex
  const stripped = raw.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  return stripped.trim().slice(0, MAX_BODY);
}
