// 訪客端的聊天 API。
//
// GET  讀自己這條對話（沒有就回空的，不建資料）
// POST 送一則訊息（第一次送才建對話）
//
// 身分只認 cookie 裡的 token，前端送什麼 thread id 都不理——
// 不然任何人改一個數字就能讀別人的對話。

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentMember } from "../../lib/auth";
import {
  addVisitorMessage,
  attachMember,
  cleanBody,
  createThread,
  markReadByVisitor,
  messagesOf,
  newChatToken,
  RATE_LIMIT,
  recentVisitorCount,
  threadByToken,
  updateThreadContact,
} from "../../lib/chat";

export const dynamic = "force-dynamic";

const COOKIE = "maporoo_chat";
const TTL_DAYS = 90;

function publicShape(messages: { id: number; sender: string; author: string; body: string; created_at: string }[]) {
  return messages.map((m) => ({
    id: m.id,
    from: m.sender === "admin" ? "staff" : "you",
    author: m.author,
    body: m.body,
    at: m.created_at,
  }));
}

export async function GET(req: Request) {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value ?? "";
  const thread = token ? threadByToken(token) : undefined;

  if (!thread) return NextResponse.json({ messages: [], unread: 0 });

  const after = Number(new URL(req.url).searchParams.get("after")) || 0;
  const messages = messagesOf(thread.id, after);

  // 訪客有打開視窗在讀，就把「客服回覆未讀」歸零。
  if (thread.unread_visitor > 0 && after === 0) markReadByVisitor(thread.id);

  return NextResponse.json({
    messages: publicShape(messages),
    unread: after === 0 ? 0 : thread.unread_visitor,
  });
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "bad" }, { status: 400 });
  }

  const data = (payload ?? {}) as Record<string, unknown>;
  const body = cleanBody(data.body);
  if (!body) return NextResponse.json({ error: "empty" }, { status: 400 });

  const jar = await cookies();
  let token = jar.get(COOKIE)?.value ?? "";
  let thread = token ? threadByToken(token) : undefined;

  if (!thread) {
    token = newChatToken();
    const page = typeof data.page === "string" ? data.page : "";
    thread = createThread(token, { page });
    jar.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: TTL_DAYS * 24 * 60 * 60,
    });
  }

  // 洗版防線。訊息已經寫不進去就不要再累加未讀，否則後台會看到假的數字。
  if (recentVisitorCount(thread.id) >= RATE_LIMIT) {
    return NextResponse.json({ error: "toomany" }, { status: 429 });
  }

  // 登入會員第一次發言時把身分補上，客服就知道對面是誰。
  const member = await currentMember();
  if (member) attachMember(thread.id, member.id);

  if (typeof data.name === "string" || typeof data.email === "string") {
    updateThreadContact(
      thread.id,
      typeof data.name === "string" ? data.name : thread.name,
      typeof data.email === "string" ? data.email : thread.email
    );
  }

  addVisitorMessage(thread, body);

  return NextResponse.json({ messages: publicShape(messagesOf(thread.id, 0)) });
}
