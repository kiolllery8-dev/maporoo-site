// 訂單狀態的中文對照。獨立成模組，避免從 page.tsx 匯出額外的名稱——
// Next 對 page 檔案的匯出有自己的一套檢查，非 config 的具名匯出容易踩到。

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
  bank_transfer: "匯款",
  cod: "貨到付款",
};
