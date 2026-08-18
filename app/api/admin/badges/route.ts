import { NextResponse } from "next/server";
import { get } from "../../../lib/db";
import { currentAdmin } from "../../../lib/auth";

// 側欄的待辦數字。每 60 秒被輪詢一次，所以要輕。
//
// 這是登入後才看得到的內部資料，未登入一律回 401——
// 不要讓人不登入就數得出這間店有幾筆待出貨訂單。

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorised" }, { status: 401 });

  const count = (sql: string) => get<{ c: number }>(sql)?.c ?? 0;

  return NextResponse.json(
    {
      newOrders: count(`SELECT COUNT(*) AS c FROM orders WHERE order_status = 'new'`),
      unpaid: count(`SELECT COUNT(*) AS c FROM orders WHERE payment_status = 'pending'`),
      draftArticles: count(`SELECT COUNT(*) AS c FROM articles WHERE status <> 'published'`),
    },
    { headers: { "cache-control": "no-store" } }
  );
}
