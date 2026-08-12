// 運費規則。前台的購物袋與伺服器端的下單都讀這裡——
// 兩邊各寫一份的話，遲早會出現「畫面顯示免運、實際收費 80」這種對不起來的狀況。

export const FREE_SHIPPING_OVER = 1500;
export const SHIPPING_FEE = 80;

export function shippingFor(subtotalTwd: number): number {
  if (subtotalTwd <= 0) return 0;
  return subtotalTwd >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
}
