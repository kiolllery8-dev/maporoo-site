import "server-only";

// 圖片上傳。檔案寫進 public/uploads/，資料庫只存路徑。
//
// 為什麼不看副檔名就收：副檔名是使用者說了算的。這裡改成讀檔頭的魔術位元組，
// 檔案真的是那個格式才收，並且用我們自己產生的檔名落地——上傳的原始檔名
// 完全不參與路徑，路徑穿越（../）與同名覆蓋這兩件事就不存在。
//
// 沒有做縮圖或轉檔：那需要 sharp，一個要跟著 Node 版本走的原生相依套件。
// 改成擋大小（單張 8MB），需要壓縮請在上傳前處理好。

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const MAX_BYTES = 8 * 1024 * 1024;
export const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

export type UploadOk = { ok: true; url: string; mime: string; bytes: number; filename: string };
export type UploadFail = { ok: false; reason: "empty" | "toobig" | "type" | "write" };

/** 檔頭魔術位元組 → 副檔名。認不出來就不收。 */
function sniff(buf: Buffer): { ext: string; mime: string } | null {
  if (buf.length < 12) return null;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: "png", mime: "image/png" };
  }
  // GIF: GIF87a / GIF89a
  if (buf.subarray(0, 6).toString("latin1").match(/^GIF8[79]a$/)) {
    return { ext: "gif", mime: "image/gif" };
  }
  // RIFF....WEBP
  if (
    buf.subarray(0, 4).toString("latin1") === "RIFF" &&
    buf.subarray(8, 12).toString("latin1") === "WEBP"
  ) {
    return { ext: "webp", mime: "image/webp" };
  }
  // AVIF: ....ftypavif（也認 avis 序列）
  if (buf.subarray(4, 8).toString("latin1") === "ftyp") {
    const brand = buf.subarray(8, 12).toString("latin1");
    if (brand === "avif" || brand === "avis") return { ext: "avif", mime: "image/avif" };
  }
  return null;
}

function uploadDir() {
  return path.join(process.cwd(), "public", "uploads");
}

/**
 * 收一個上傳的檔案，落地到 public/uploads/。
 * 回傳的 url 是前台可以直接用的絕對路徑（/uploads/xxx.jpg）。
 */
export async function saveUpload(file: File): Promise<UploadOk | UploadFail> {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return { ok: false, reason: "empty" };
  }
  if (file.size > MAX_BYTES) return { ok: false, reason: "toobig" };

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind) return { ok: false, reason: "type" };

  // 檔名自己產生，上傳的原始檔名只留在資料庫當顯示用。
  const name = `${crypto.randomBytes(12).toString("hex")}.${kind.ext}`;

  try {
    const dir = uploadDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), buf);
  } catch {
    return { ok: false, reason: "write" };
  }

  return {
    ok: true,
    url: `/uploads/${name}`,
    mime: kind.mime,
    bytes: buf.length,
    filename: (file.name || "").slice(0, 120),
  };
}

/** 刪掉 public/uploads/ 底下的檔案。只接受這個資料夾裡的路徑。 */
export function removeUpload(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const name = url.slice("/uploads/".length);
  // 再擋一次：只收我們自己產生的那種檔名，不讓 ../ 或子路徑進來。
  if (!/^[a-f0-9]{24}\.(jpg|png|gif|webp|avif)$/.test(name)) return;
  try {
    fs.unlinkSync(path.join(uploadDir(), name));
  } catch {
    // 檔案本來就不在就算了，資料庫那筆照樣刪掉。
  }
}

export const UPLOAD_ERRORS: Record<string, string> = {
  empty: "沒有選到檔案。",
  toobig: "圖片太大了，單張上限 8MB。請先壓縮再上傳。",
  type: "只收 JPG、PNG、WebP、GIF、AVIF。檔案內容不是圖片的話也會被擋下來。",
  write: "寫入失敗，伺服器的上傳資料夾可能沒有權限。",
};
