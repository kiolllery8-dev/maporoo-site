"use server";

// 商品相簿的動作。全部走原生表單 POST，不需要前端 JS。
//
// 上傳的圖同時進媒體庫（media）與這個商品的相簿（product_images）。
// 從相簿移除只會斷開關聯，檔案留在媒體庫給其他地方用；
// 要真的刪檔案請到媒體庫，那裡會先檢查還有沒有人在用。

import { redirect } from "next/navigation";
import { requireAdmin } from "../../../lib/admin";
import { get } from "../../../lib/db";
import {
  addMedia,
  appendProductImage,
  makeProductCover,
  mediaByUrl,
  moveProductImage,
  removeProductImage,
  setProductImageAlt,
} from "../../../lib/media";
import { saveUpload } from "../../../lib/uploads";

function productId(form: FormData): number {
  const id = Number(form.get("product_id"));
  if (!Number.isInteger(id) || id <= 0) redirect("/admin/products");
  if (!get<{ id: number }>(`SELECT id FROM products WHERE id = ?`, id)) {
    redirect("/admin/products");
  }
  return id;
}

function back(id: number, q: string) {
  redirect(`/admin/products/${id}?${q}#gallery`);
}

export async function uploadProductImagesAction(form: FormData) {
  const admin = await requireAdmin("products.edit");
  const id = productId(form);

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) back(id, "e=empty");

  let added = 0;
  let failed = "";

  for (const file of files) {
    const r = await saveUpload(file);
    if (!r.ok) {
      failed = r.reason;
      continue;
    }
    // 同一顆檔案內容每次上傳都會拿到新檔名，所以 media 不會撞號。
    if (!mediaByUrl(r.url)) {
      addMedia({
        url: r.url,
        filename: r.filename,
        mime: r.mime,
        bytes: r.bytes,
        uploadedBy: admin.username,
      });
    }
    appendProductImage(id, r.url);
    added++;
  }

  if (added === 0) back(id, `e=${failed || "empty"}`);
  back(id, `ok=uploaded&n=${added}${failed ? `&e=${failed}` : ""}`);
}

/** 從媒體庫挑一張已經上傳過的圖加進這個商品。 */
export async function attachProductImageAction(form: FormData) {
  await requireAdmin("products.edit");
  const id = productId(form);
  const url = String(form.get("url") ?? "");
  if (!mediaByUrl(url)) back(id, "e=notfound");
  appendProductImage(id, url);
  back(id, "ok=attached");
}

export async function removeProductImageAction(form: FormData) {
  await requireAdmin("products.edit");
  const id = productId(form);
  removeProductImage(Number(form.get("id")), id);
  back(id, "ok=removed");
}

export async function moveProductImageAction(form: FormData) {
  await requireAdmin("products.edit");
  const id = productId(form);
  const dir = form.get("dir") === "up" ? "up" : "down";
  moveProductImage(Number(form.get("id")), id, dir);
  back(id, "ok=moved");
}

export async function coverProductImageAction(form: FormData) {
  await requireAdmin("products.edit");
  const id = productId(form);
  makeProductCover(Number(form.get("id")), id);
  back(id, "ok=cover");
}

export async function altProductImageAction(form: FormData) {
  await requireAdmin("products.edit");
  const id = productId(form);
  setProductImageAlt(Number(form.get("id")), id, String(form.get("alt") ?? ""));
  back(id, "ok=alt");
}
