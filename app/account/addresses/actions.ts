"use server";

// 會員的收件地址簿。
// 每一個動作都先確認這筆地址真的屬於目前登入的會員——
// 只比對 id 的話，改一下表單的 id 就能刪別人的地址。

import { redirect } from "next/navigation";
import { get, run, transaction } from "../../lib/db";
import { currentMember } from "../../lib/auth";

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/** 確認這筆地址屬於這個會員。不屬於就當作不存在。 */
function ownedBy(addressId: number, memberId: number) {
  return get<{ id: number }>(
    `SELECT id FROM member_addresses WHERE id = ? AND member_id = ?`,
    addressId,
    memberId
  );
}

export async function addAddressAction(form: FormData) {
  const member = await currentMember();
  if (!member) redirect("/account/login?next=/account/addresses");

  const recipient = field(form, "recipient");
  const address = field(form, "address");
  if (!recipient || !address) redirect("/account/addresses?e=missing");

  const makeDefault = Boolean(form.get("is_default"));
  const existing = get<{ c: number }>(
    `SELECT COUNT(*) AS c FROM member_addresses WHERE member_id = ?`,
    member.id
  );
  // 第一筆地址自動設為預設，不然會員永遠沒有預設地址可用。
  const isDefault = makeDefault || (existing?.c ?? 0) === 0;

  const save = transaction(() => {
    if (isDefault) {
      run(`UPDATE member_addresses SET is_default = 0 WHERE member_id = ?`, member.id);
    }
    run(
      `INSERT INTO member_addresses (member_id, recipient, phone, zipcode, city, address, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      member.id,
      recipient,
      field(form, "phone"),
      field(form, "zipcode"),
      field(form, "city"),
      address,
      isDefault ? 1 : 0
    );
  });
  save();

  redirect("/account/addresses?ok=added");
}

export async function setDefaultAddressAction(form: FormData) {
  const member = await currentMember();
  if (!member) redirect("/account/login?next=/account/addresses");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || !ownedBy(id, member.id)) redirect("/account/addresses?e=notfound");

  const apply = transaction(() => {
    run(`UPDATE member_addresses SET is_default = 0 WHERE member_id = ?`, member.id);
    run(`UPDATE member_addresses SET is_default = 1 WHERE id = ?`, id);
  });
  apply();

  redirect("/account/addresses?ok=default");
}

export async function deleteAddressAction(form: FormData) {
  const member = await currentMember();
  if (!member) redirect("/account/login?next=/account/addresses");

  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || !ownedBy(id, member.id)) redirect("/account/addresses?e=notfound");

  const remove = transaction(() => {
    const wasDefault = get<{ is_default: number }>(
      `SELECT is_default FROM member_addresses WHERE id = ?`,
      id
    );
    run(`DELETE FROM member_addresses WHERE id = ?`, id);
    // 刪掉的是預設地址的話，把剩下最早的一筆補成預設。
    if (wasDefault?.is_default) {
      const next = get<{ id: number }>(
        `SELECT id FROM member_addresses WHERE member_id = ? ORDER BY id LIMIT 1`,
        member.id
      );
      if (next) run(`UPDATE member_addresses SET is_default = 1 WHERE id = ?`, next.id);
    }
  });
  remove();

  redirect("/account/addresses?ok=deleted");
}
