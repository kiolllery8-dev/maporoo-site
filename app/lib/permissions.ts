// 後台角色與權限。
//
// 設計原則：權限綁在「能做什麼」而不是「是什麼職稱」。
// 新增一個角色＝在 ROLE_CAPS 加一行，其餘程式碼不用動。
//
// 這個檔案沒有 server-only，因為前端也要靠 can() 決定按鈕要不要顯示。
// 但**畫面隱藏不算權限控管**——每一個會改資料的 server action 都必須自己再檢查一次。

export type Role = "owner" | "manager" | "shipping" | "editor";

export type Capability =
  | "orders.view"
  | "orders.fulfil" // 改訂單狀態、填物流單號
  | "orders.payment" // 改付款狀態、填付款備查
  | "products.view"
  | "products.edit"
  | "members.view"
  | "members.manage" // 停用／恢復會員
  | "articles.manage"
  | "content.manage"
  | "reports.view"
  | "staff.manage"; // 新增／停用管理者、改別人的角色

const ALL: Capability[] = [
  "orders.view",
  "orders.fulfil",
  "orders.payment",
  "products.view",
  "products.edit",
  "members.view",
  "members.manage",
  "articles.manage",
  "content.manage",
  "reports.view",
  "staff.manage",
];

export const ROLE_CAPS: Record<Role, Capability[]> = {
  // 老闆。含管理者帳號的管理，這是唯一能動別人權限的角色。
  owner: ALL,

  // 日常營運。除了管理者帳號之外都能做。
  manager: ALL.filter((c) => c !== "staff.manage"),

  // 出貨人員。看得到訂單、能出貨，但**動不了金額與付款狀態**，
  // 也看不到會員名單與商品定價。
  shipping: ["orders.view", "orders.fulfil"],

  // 內容編輯。只碰文章與文案，看不到任何訂單與會員資料。
  editor: ["articles.manage", "content.manage"],
};

export const ROLE_LABEL: Record<Role, string> = {
  owner: "負責人",
  manager: "營運人員",
  shipping: "出貨人員",
  editor: "內容編輯",
};

export const ROLE_DESC: Record<Role, string> = {
  owner: "全部權限，含新增與停用其他管理者。",
  manager: "商品、訂單、會員、文章、文案、報表都能管，不能改管理者帳號。",
  shipping: "只看得到訂單，能改訂單狀態與物流單號。改不了付款狀態與金額，也看不到會員名單。",
  editor: "只能管文章與文案，看不到訂單與會員。",
};

export function isRole(v: string): v is Role {
  return v === "owner" || v === "manager" || v === "shipping" || v === "editor";
}

export function can(role: string, cap: Capability): boolean {
  if (!isRole(role)) return false;
  return ROLE_CAPS[role].includes(cap);
}

/** 這個角色進後台時，第一個看得到的頁面。 */
export function landingFor(role: string): string {
  if (can(role, "reports.view")) return "/admin";
  if (can(role, "orders.view")) return "/admin/orders";
  if (can(role, "articles.manage")) return "/admin/articles";
  return "/admin/denied";
}
