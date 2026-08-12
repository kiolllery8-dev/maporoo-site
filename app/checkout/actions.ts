"use server";

// 送出訂單。
//
// 安全前提：購物袋活在瀏覽器的 localStorage 裡，所以表單送上來的東西**只有
// 商品 slug 與數量可信**。價格、小計、運費、合計一律在伺服器這邊重算，
// 完全不看前端傳了什麼金額——否則有人改一改 DOM 就能用 1 元買走精華液。

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { get, run, transaction } from "../lib/db";
import { currentMember } from "../lib/auth";
import { getProduct } from "../lib/catalog";
import { shippingFor } from "../lib/shipping";
import { availableMethods, type PaymentMethod } from "../lib/payment";

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/** MP + 日期 + 4 碼亂數。亂數是為了讓訂單編號無法被猜出來。 */
function newOrderNo() {
  const d = new Date();
  const ymd = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
  return `MP${ymd}${rand}`;
}

export async function placeOrderAction(form: FormData) {
  const member = await currentMember();

  // ── 收件資訊 ──────────────────────────────────────────────
  const recipient = field(form, "recipient");
  const phone = field(form, "phone");
  const email = field(form, "email") || member?.email || "";
  const zipcode = field(form, "zipcode");
  const city = field(form, "city");
  const address = field(form, "address");
  const note = field(form, "note").slice(0, 500);

  if (!recipient || !phone || !address || !email) redirect("/checkout?e=missing");

  // ── 付款方式 ──────────────────────────────────────────────
  const requested = field(form, "payment_method") as PaymentMethod;
  const allowed = availableMethods();
  const paymentMethod: PaymentMethod = allowed.includes(requested) ? requested : allowed[0];

  // ── 購物袋內容：只信 slug 與數量 ──────────────────────────
  const slugs = form.getAll("slug").map(String);
  const qtys = form.getAll("qty").map((q) => Math.trunc(Number(q)));

  const lines: Array<{ slug: string; name: string; size: string; price: number; qty: number }> = [];
  for (let i = 0; i < slugs.length; i++) {
    const p = getProduct(slugs[i]);
    const qty = qtys[i];
    if (!p) continue; // 商品不存在就直接忽略這一列
    if (!Number.isFinite(qty) || qty < 1) continue;
    lines.push({
      slug: p.slug,
      name: p.name,
      size: p.size ?? "",
      price: p.price, // ← 價格取自伺服器端的商品資料，不是表單
      qty: Math.min(99, qty),
    });
  }

  if (lines.length === 0) redirect("/checkout?e=empty");

  // ── 金額全部重算 ──────────────────────────────────────────
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  // ── 寫入 ──────────────────────────────────────────────────
  const orderNo = newOrderNo();

  const place = transaction(() => {
    const { lastInsertRowid: orderId } = run(
      `INSERT INTO orders
         (order_no, member_id, email, recipient, phone, zipcode, city, address,
          subtotal_twd, shipping_twd, discount_twd, total_twd,
          payment_method, payment_status, order_status, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 'pending', 'new', ?)`,
      orderNo,
      member?.id ?? null,
      email,
      recipient,
      phone,
      zipcode,
      city,
      address,
      subtotal,
      shipping,
      total,
      paymentMethod,
      note
    );

    for (const l of lines) {
      run(
        `INSERT INTO order_items
           (order_id, product_slug, name, size, unit_price_twd, qty, total_twd)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        orderId,
        l.slug,
        l.name,
        l.size,
        l.price,
        l.qty,
        l.price * l.qty
      );

      // 商品若已匯入資料庫且有開庫存控管，這裡才扣。還沒匯入就跳過——
      // 前台目前仍讀 catalog.ts，庫存控管要等切換讀取來源之後才真正生效。
      const dbProduct = get<{ id: number; track_stock: number }>(
        `SELECT id, track_stock FROM products WHERE slug = ?`,
        l.slug
      );
      if (dbProduct?.track_stock) {
        run(`UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?`, l.qty, dbProduct.id);
      }
    }

    run(
      `INSERT INTO order_events (order_id, actor, field, from_value, to_value)
       VALUES (?, ?, 'order_status', '', 'new')`,
      orderId,
      member ? `member:${member.id}` : "guest"
    );
  });

  place();

  redirect(`/checkout/done/${orderNo}`);
}
