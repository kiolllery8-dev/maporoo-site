"use server";

import { redirect } from "next/navigation";
import { get, run, transaction } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin";
import { can } from "../../../../lib/permissions";

const ORDER_STATUSES = ["new", "processing", "shipped", "done", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "refunded", "failed"];

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * 更新訂單。每一個有變動的欄位都寫進 order_events，
 * 之後對帳或客訴時查得到是誰、什麼時候、改了什麼。
 */
export async function updateOrderAction(form: FormData) {
  // orders.fulfil 是進到這個動作的最低門檻（出貨人員有）。
  // 付款相關欄位再單獨檢查 orders.payment。
  const admin = await requireAdmin("orders.fulfil");
  const mayTouchPayment = can(admin.role, "orders.payment");

  const orderNo = field(form, "order_no");
  const current = get<{
    id: number;
    order_status: string;
    payment_status: string;
    payment_ref: string;
    shipping_no: string;
    admin_note: string;
  }>(
    `SELECT id, order_status, payment_status, payment_ref, shipping_no, admin_note
       FROM orders WHERE order_no = ?`,
    orderNo
  );
  if (!current) redirect("/admin/orders?e=notfound");

  const next = {
    order_status: field(form, "order_status"),
    payment_status: field(form, "payment_status"),
    payment_ref: field(form, "payment_ref"),
    shipping_no: field(form, "shipping_no"),
    admin_note: field(form, "admin_note"),
  };

  // 狀態值只接受白名單裡的，避免表單被改後塞進奇怪的值。
  if (!ORDER_STATUSES.includes(next.order_status)) next.order_status = current.order_status;
  if (!PAYMENT_STATUSES.includes(next.payment_status)) next.payment_status = current.payment_status;

  // 沒有 orders.payment 的角色（出貨人員），付款欄位一律保持原值。
  // 畫面上本來就不會顯示這兩個欄位，但表單可以被直接送出，所以這裡必須再擋一次。
  if (!mayTouchPayment) {
    next.payment_status = current.payment_status;
    next.payment_ref = current.payment_ref;
  }

  const apply = transaction(() => {
    run(
      `UPDATE orders SET
         order_status = ?, payment_status = ?, payment_ref = ?,
         shipping_no = ?, admin_note = ?, updated_at = datetime('now')
       WHERE id = ?`,
      next.order_status,
      next.payment_status,
      next.payment_ref,
      next.shipping_no,
      next.admin_note,
      current.id
    );

    for (const key of Object.keys(next) as Array<keyof typeof next>) {
      const from = String(current[key] ?? "");
      const to = String(next[key] ?? "");
      if (from === to) continue;
      run(
        `INSERT INTO order_events (order_id, actor, field, from_value, to_value)
         VALUES (?, ?, ?, ?, ?)`,
        current.id,
        `admin:${admin.id}`,
        key,
        from,
        to
      );
    }
  });

  apply();
  redirect(`/admin/orders/${orderNo}?ok=saved`);
}
