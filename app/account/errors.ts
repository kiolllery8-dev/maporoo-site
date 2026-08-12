// 錯誤碼 → 顯示訊息。
//
// 刻意獨立成一個模組：actions.ts 標了 "use server"，那種檔案只能匯出 async function，
// 常數放進去會讓 build 直接失敗。

export const ERRORS: Record<string, string> = {
  missing: "請把欄位填完整。",
  email: "請輸入正確的 Email 格式。",
  taken: "這個 Email 已經註冊過了。改用登入，或換一個 Email。",
  credentials: "Email 或密碼不正確。",
  disabled: "這個帳號目前無法登入，請與 MAPOROO 聯繫。",
  session: "登入狀態已過期，請重新登入。",
  current: "目前的密碼不正確。",
  same: "新密碼與目前的密碼相同。",
};
