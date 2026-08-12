// 後台錯誤碼 → 顯示訊息。
// 獨立成模組的理由同 app/account/errors.ts：actions.ts 是 "use server"，
// 那種檔案只能匯出 async function。

export const ADMIN_ERRORS: Record<string, string> = {
  missing: "請把欄位填完整。",
  credentials: "帳號或密碼不正確。",
  disabled: "這個管理者帳號已停用。",
  session: "登入狀態已過期，請重新登入。",
  current: "目前的密碼不正確。",
  same: "新密碼與目前的密碼相同。",
  forbidden: "你的權限不足以執行這個動作。",
  notfound: "找不到這筆資料。",
};
