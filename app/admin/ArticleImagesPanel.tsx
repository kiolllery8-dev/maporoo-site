// 文章的圖片面板：一張封面 ＋ 一個可以插進內文的圖庫。
//
// 「插入內文」是把 ![替代文字](路徑) 接在內文最後面，寫手再剪到想要的位置。
// 之所以不做「插在游標處」：那要把編輯器的游標狀態拉到 server action 這一層，
// 換來的方便有限，剪下貼上兩秒的事。

import { ACCEPT, MAX_BYTES } from "../lib/uploads";
import type { Media } from "../lib/media";
import { Panel } from "./ui";
import {
  insertArticleImageAction,
  setArticleCoverAction,
  setMediaAltAction,
  uploadArticleImageAction,
} from "./(dash)/articles/media-actions";

export function ArticleImagesPanel({
  articleId,
  cover,
  library,
}: {
  articleId: number;
  cover: string;
  library: Media[];
}) {
  return (
    <div id="images">
      <Panel title="封面圖">
        <p className="mb-4 max-w-[680px] text-sm text-ink/70 leading-relaxed">
          封面出現在文章頁最上方與文章列表。用情境圖或示意圖，
          <strong className="text-ink">不要用商品照片</strong>——上架檢查會擋下來。
        </p>

        {cover ? (
          <div className="flex flex-wrap items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              className="w-56 aspect-[3/2] object-cover border border-brand-200"
            />
            <form action={setArticleCoverAction}>
              <input type="hidden" name="article_id" value={articleId} />
              <input type="hidden" name="url" value="" />
              <button
                type="submit"
                className="text-xs font-medium text-red-700 hover:text-red-900 bg-transparent border-none p-0 cursor-pointer"
              >
                移除封面
              </button>
            </form>
          </div>
        ) : (
          <form action={uploadArticleImageAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="article_id" value={articleId} />
            <input type="hidden" name="as_cover" value="1" />
            <label className="block">
              <span className="adm-label">選一張當封面</span>
              <input
                type="file"
                name="files"
                accept={ACCEPT}
                className="adm-input file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-cream file:text-xs file:cursor-pointer"
              />
            </label>
            <button type="submit" className="btn btn-primary mb-4">
              上傳並設為封面
            </button>
          </form>
        )}
      </Panel>

      <Panel title={`圖庫（${library.length}）`}>
        <p className="mb-4 max-w-[680px] text-sm text-ink/70 leading-relaxed">
          上傳的圖都留在這裡，任何一篇文章都能用。單張上限{" "}
          {Math.round(MAX_BYTES / 1024 / 1024)}MB。
          替代文字先寫好，插入內文時會一起帶進去。
        </p>

        <form action={uploadArticleImageAction} className="mb-6 flex flex-wrap items-end gap-3">
          <input type="hidden" name="article_id" value={articleId} />
          <label className="block">
            <span className="adm-label">上傳圖片（可多選）</span>
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

        {library.length === 0 ? (
          <div className="border border-dashed border-brand-300 p-6 text-sm text-ink/60">
            圖庫還是空的。上傳第一張之後，這裡會列出所有能用的圖。
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {library.map((m) => (
              <div key={m.id} className="border border-brand-200 bg-white flex flex-col">
                <div className="product-img aspect-[3/2] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
                  {m.url === cover && (
                    <span className="absolute top-0 left-0 bg-ink text-cream text-[10px] tracking-widest px-2 py-1">
                      封面
                    </span>
                  )}
                </div>

                <div className="p-2.5 flex flex-col gap-2">
                  <form action={setMediaAltAction} className="flex gap-1.5">
                    <input type="hidden" name="article_id" value={articleId} />
                    <input type="hidden" name="url" value={m.url} />
                    <input
                      name="alt"
                      defaultValue={m.alt}
                      placeholder="替代文字／圖說"
                      className="adm-input text-xs py-1 flex-1 min-w-0"
                    />
                    <button
                      type="submit"
                      className="text-xs text-ink hover:text-brand-700 bg-transparent border-none px-1 cursor-pointer"
                    >
                      存
                    </button>
                  </form>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <form action={insertArticleImageAction}>
                      <input type="hidden" name="article_id" value={articleId} />
                      <input type="hidden" name="url" value={m.url} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-ink hover:text-brand-700 bg-transparent border-none p-0 cursor-pointer"
                      >
                        插入內文
                      </button>
                    </form>
                    {m.url !== cover && (
                      <form action={setArticleCoverAction}>
                        <input type="hidden" name="article_id" value={articleId} />
                        <input type="hidden" name="url" value={m.url} />
                        <button
                          type="submit"
                          className="text-xs text-ink/60 hover:text-ink bg-transparent border-none p-0 cursor-pointer whitespace-nowrap"
                        >
                          設為封面
                        </button>
                      </form>
                    )}
                  </div>

                  <p className="text-[10px] text-ink/40 truncate" title={m.filename}>
                    {m.filename || m.url} · {Math.max(1, Math.round(m.bytes / 1024))}KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-ink/50 leading-relaxed">
          「插入內文」會把 <code>![替代文字](路徑)</code> 接在內文最後面，
          你再把那一行剪到想要的位置。整行只有一張圖時，前台會排成帶圖說的區塊。
        </p>
      </Panel>
    </div>
  );
}
