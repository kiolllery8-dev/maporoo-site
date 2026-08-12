"use client";

// 訂單成立之後把購物袋清空。
// 訂單已經寫進資料庫了，購物袋只是瀏覽器裡的暫存，清掉是安全的；
// 重新整理這一頁會再清一次，而清空一個已經空的購物袋不會有副作用。

import { useEffect } from "react";
import { useCart } from "../../lib/cart";

export default function ClearCart() {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready) clear();
    // clear 每次 render 都是新的函式參考，放進相依陣列會造成無限迴圈，
    // 所以這裡只在 ready 變成 true 的那一次執行。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return null;
}
