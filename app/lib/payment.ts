import "server-only";

// ─────────────────────────────────────────────────────────────────────────
// 金流交接口
//
// 老闆 2026-08-06 決定：付款先留在本地，線上金流由後續工程師接手。
// 目前只開「匯款」與「貨到付款」，兩者都由後台人工對帳。
//
// 給接手的工程師：
//   你只需要新增一個 PaymentProvider 實作、把它註冊進 PROVIDERS，
//   再把 .env 的 PAYMENT_PROVIDER 改成你的代號。訂單流程、資料表、
//   後台介面都不必動。
//
//   1. 實作 begin()：回傳要把使用者導去哪裡（金流商的付款頁）。
//   2. 實作 handleCallback()：驗簽 → 更新 orders.payment_status。
//      對應的路由請開在 app/api/payment/[provider]/callback/route.ts。
//   3. orders 表已經留好欄位：payment_ref（交易序號）、payment_info（JSON）。
//   4. 台灣常見的是藍新 NewebPay 與綠界 ECPay。auslife.tw（N:\澳客萊網站）
//      已經有一份藍新的實作可以參考：lib/payment/。
//
// 鐵則：信用卡號、CVC 一律不進我們的伺服器，也不寫進資料庫。
//       一律導去金流商的頁面刷卡，我們只收回傳結果。
// ─────────────────────────────────────────────────────────────────────────

export type PaymentMethod = "bank_transfer" | "cod";

export type BeginResult =
  | { kind: "instructions" } // 站內顯示付款指示，不需要導轉
  | { kind: "redirect"; url: string } // 導去金流商
  | { kind: "form"; action: string; fields: Record<string, string> }; // 表單自動送出

export type PaymentProvider = {
  code: string;
  label: string;
  /** 這個 provider 支援哪些付款方式 */
  methods: PaymentMethod[];
  /** 建立訂單後呼叫，決定下一步要把使用者帶去哪裡 */
  begin(orderNo: string, amountTwd: number, method: PaymentMethod): Promise<BeginResult>;
};

/** 目前唯一的實作：不串接任何金流商，付款指示直接顯示在訂單完成頁。 */
const manual: PaymentProvider = {
  code: "manual",
  label: "人工對帳",
  methods: ["bank_transfer", "cod"],
  async begin() {
    return { kind: "instructions" };
  },
};

const PROVIDERS: Record<string, PaymentProvider> = {
  manual,
  // newebpay: 待後續工程師實作
  // ecpay:    待後續工程師實作
};

export function activeProvider(): PaymentProvider {
  const code = process.env.PAYMENT_PROVIDER || "manual";
  return PROVIDERS[code] ?? manual;
}

export function isOnlinePaymentReady(): boolean {
  return activeProvider().code !== "manual";
}

/** 匯款資訊。顯示在訂單完成頁與通知信裡，值來自 .env。 */
export function bankTransferInfo() {
  return {
    bankName: process.env.BANK_NAME || "",
    account: process.env.BANK_ACCOUNT || "",
    holder: process.env.BANK_HOLDER || "",
    configured: Boolean(process.env.BANK_NAME && process.env.BANK_ACCOUNT),
  };
}

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  bank_transfer: "匯款轉帳",
  cod: "貨到付款",
};

/** 目前開放給客人選的付款方式。金流接上之後這裡會自動變長。 */
export function availableMethods(): PaymentMethod[] {
  const provider = activeProvider();
  if (provider.code === "manual") {
    // 匯款帳號沒設定的話就別讓客人選，否則訂單完成頁會是一片空白。
    return bankTransferInfo().configured ? ["bank_transfer", "cod"] : ["cod"];
  }
  return provider.methods;
}
