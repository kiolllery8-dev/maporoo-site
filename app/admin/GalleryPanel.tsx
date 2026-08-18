// 商品相簿的編輯面板。
//
// 全部是 server component＋原生表單：上傳、排序、設封面、改替代文字、移除，
// 每一個動作都是一次 POST。沒有拖拉排序——那需要前端狀態，而「上移／下移／
// 設為封面」三顆按鈕就足以把順序排好，鍵盤也能操作。

import { ACCEPT, MAX_BYTES } from "../lib/uploads";
import type { ProductImage } from "../lib/media";
import { Panel } from "./ui";
import {
  altProductImageAction,
  coverProductImageAction,
  moveProductImageAction,
  removeProductImageAction,
  uploadProductImagesAction,
} from "./(dash)/products/gallery-actions";

export function GalleryPanel({
  productId,
  images,
  fallback,
}: {
  productId: number;
  images: ProductImage[];
  /** 還沒設過相簿時，前台目前實際顯示的那組圖（來自 SKU 對照表）。 */
  fallback: string[];
}) {
  return (
    <div id="gallery">
      <Panel title={`商品相簿（${images.length}）`}>
        <p className="mb-4 max-w-[680px] text-sm text-ink/70 leading-relaxed">
          第一張就是封面，商品列表、購物袋、首頁都用它。
          可以一次選多張上傳，上限單張 {Math.round(MAX_BYTES / 1024 / 1024)}MB，
          收 JPG、PNG、WebP、GIF、AVIF。
        </p>

        <form action={uploadProductImagesAction} className="mb-6 flex flex-wrap items-end gap-3">
          <input type="hidden" name="product_id" value={productId} />
          <label className="block">
            <span className="adm-label">選擇圖片（可多選）</span>
            <input
              type="file"
              name="files"
              multiple
              accept={ACCEPT}
              className="adm-input file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-cream file:text-xs file:cursor-pointer"
            />
          </label>
          <button type="submit" className="btn btn-primary mb-4">
            上傳
          </button>
        </form>

        {images.length === 0 ? (
          <div className="border border-dashed border-brand-300 p-6 text-sm text-ink/60 leading-relaxed">
            這個商品還沒有自己的相簿。
            {fallback.length > 0 ? (
              <>
                {" "}
                前台目前顯示的是程式碼裡那組對照圖（{fallback.length} 張，依 SKU 比對）。
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 mt-3">
                  {fallback.slice(0, 8).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="w-full aspect-square object-cover border border-brand-200 opacity-70"
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs text-ink/50">
                  在上面上傳任何一張，前台就改看你上傳的這組，這些對照圖不再顯示。
                </p>
              </>
            ) : (
              " 前台目前沒有圖可以顯示，商品頁會是一塊空的底色。"
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={img.id} className="border border-brand-200 bg-white flex flex-col">
                <div className="relative product-img aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-0 left-0 bg-ink text-cream text-[10px] tracking-widest px-2 py-1">
                      封面
                    </span>
                  )}
                  <span className="absolute top-0 right-0 bg-white/85 text-ink text-[10px] px-1.5 py-0.5">
                    {i + 1}
                  </span>
                </div>

                <div className="p-2.5 flex flex-col gap-2">
                  <form action={altProductImageAction} className="flex gap-1.5">
                    <input type="hidden" name="product_id" value={productId} />
                    <input type="hidden" name="id" value={img.id} />
                    <input
                      name="alt"
                      defaultValue={img.alt}
                      placeholder="替代文字"
                      className="adm-input text-xs py-1 flex-1 min-w-0"
                    />
                    <button
                      type="submit"
                      className="text-xs text-ink hover:text-brand-700 bg-transparent border-none px-1 cursor-pointer"
                    >
                      存
                    </button>
                  </form>

                  <div className="flex items-center justify-between gap-1 text-xs">
                    <span className="flex gap-1">
                      <MoveButton productId={productId} id={img.id} dir="up" disabled={i === 0} />
                      <MoveButton
                        productId={productId}
                        id={img.id}
                        dir="down"
                        disabled={i === images.length - 1}
                      />
                    </span>
                    <span className="flex items-center gap-2">
                      {i !== 0 && (
                        <form action={coverProductImageAction}>
                          <input type="hidden" name="product_id" value={productId} />
                          <input type="hidden" name="id" value={img.id} />
                          <button
                            type="submit"
                            className="text-xs text-ink hover:text-brand-700 bg-transparent border-none p-0 cursor-pointer whitespace-nowrap"
                          >
                            設為封面
                          </button>
                        </form>
                      )}
                      <form action={removeProductImageAction}>
                        <input type="hidden" name="product_id" value={productId} />
                        <input type="hidden" name="id" value={img.id} />
                        <button
                          type="submit"
                          className="text-xs text-red-700 hover:text-red-900 bg-transparent border-none p-0 cursor-pointer"
                        >
                          移除
                        </button>
                      </form>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <p className="mt-4 text-xs text-ink/50 leading-relaxed">
            「移除」只是把圖從這個商品拿掉，檔案留在媒體庫，其他地方還用得到。
            替代文字寫商品在圖裡的樣子，讀螢幕的人與 Google 都靠它理解這張圖。
          </p>
        )}
      </Panel>
    </div>
  );
}

function MoveButton({
  productId,
  id,
  dir,
  disabled,
}: {
  productId: number;
  id: number;
  dir: "up" | "down";
  disabled: boolean;
}) {
  const label = dir === "up" ? "←" : "→";
  if (disabled) {
    return <span className="px-1.5 py-0.5 border border-brand-100 text-ink/25">{label}</span>;
  }
  return (
    <form action={moveProductImageAction}>
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button
        type="submit"
        title={dir === "up" ? "往前移" : "往後移"}
        className="px-1.5 py-0.5 border border-brand-300 hover:border-ink bg-white cursor-pointer text-ink"
      >
        {label}
      </button>
    </form>
  );
}
