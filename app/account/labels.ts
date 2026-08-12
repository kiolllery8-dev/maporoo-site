// 訂單狀態給會員看的中文。後台另有一份（admin/(dash)/orders/labels.ts）——
// 刻意分開：對外的措辭跟對內的可以不一樣，而且改一邊不會不小心動到另一邊。

export const ORDER_STATUS: Record<string, string> = {
  new: "已成立",
  processing: "處理中",
  shipped: "已出貨",
  done: "已完成",
  cancelled: "已取消",
};

export const PAYMENT_STATUS: Record<string, string> = {
  pending: "待付款",
  paid: "已付款",
  refunded: "已退款",
  failed: "付款失敗",
};

export const METHOD: Record<string, string> = {
  bank_transfer: "匯款轉帳",
  cod: "貨到付款",
};
