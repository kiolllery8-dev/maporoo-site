import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { all } from "../../lib/db";
import { currentMember } from "../../lib/auth";
import AccountNav from "../AccountNav";
import { Field, Notice, Shell, Submit } from "../ui";
import { addAddressAction, deleteAddressAction, setDefaultAddressAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "收件地址｜MAPOROO",
  robots: { index: false, follow: false },
};

type Row = {
  id: number;
  recipient: string;
  phone: string;
  zipcode: string;
  city: string;
  address: string;
  is_default: number;
};

const OK: Record<string, string> = {
  added: "地址已新增。",
  default: "已設為預設地址。",
  deleted: "地址已刪除。",
};

export default async function AddressesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; e?: string }>;
}) {
  const member = await currentMember();
  if (!member) redirect("/account/login?next=/account/addresses");

  const sp = await searchParams;
  const rows = all<Row>(
    `SELECT id, recipient, phone, zipcode, city, address, is_default
       FROM member_addresses WHERE member_id = ? ORDER BY is_default DESC, id`,
    member.id
  );

  return (
    <Shell eyebrow="會員中心" title="收件地址" narrow={false}>
      <AccountNav current="/account/addresses" />

      <Notice ok={sp.ok ? OK[sp.ok] : undefined} e={sp.e} />

      <div style={{ maxWidth: 640 }}>
        {rows.length === 0 ? (
          <p style={{ color: "var(--soft)", lineHeight: 1.95, marginBottom: 40 }}>
            還沒有儲存的地址。存一筆之後，結帳時就不用每次重打。
          </p>
        ) : (
          <div style={{ marginBottom: 46 }}>
            {rows.map((a) => (
              <div key={a.id} style={{ padding: "18px 0", borderTop: "1px solid var(--line)" }}>
                <p style={{ color: "var(--ink)", fontWeight: 700, fontSize: "1.02rem" }}>
                  {a.recipient}
                  {a.phone && <span style={{ color: "var(--soft)", fontWeight: 500 }}>　{a.phone}</span>}
                  {a.is_default === 1 && (
                    <span
                      style={{ marginLeft: 10, padding: "2px 8px", background: "var(--ink)", color: "var(--paper)", fontSize: ".72rem", letterSpacing: ".1em", fontWeight: 700 }}
                    >
                      預設
                    </span>
                  )}
                </p>
                <p style={{ color: "var(--soft)", fontSize: "1rem", marginTop: 6, lineHeight: 1.85 }}>
                  {a.zipcode} {a.city} {a.address}
                </p>
                <p style={{ marginTop: 12, display: "flex", gap: 20 }}>
                  {a.is_default === 0 && (
                    <form action={setDefaultAddressAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <button
                        type="submit"
                        style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: ".9rem", fontWeight: 700, color: "var(--ink)" }}
                      >
                        設為預設
                      </button>
                    </form>
                  )}
                  <form action={deleteAddressAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: ".9rem", fontWeight: 700, color: "#9B4A2F" }}
                    >
                      刪除
                    </button>
                  </form>
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="eyebrow" style={{ marginBottom: 20 }}>新增地址</p>
        <form action={addAddressAction}>
          <Field label="收件人" name="recipient" required autoComplete="name" />
          <Field label="手機" name="phone" type="tel" autoComplete="tel" />
          <Field label="郵遞區號" name="zipcode" autoComplete="postal-code" />
          <Field label="縣市" name="city" autoComplete="address-level1" />
          <Field label="地址" name="address" required autoComplete="street-address" />
          <label style={{ display: "block", marginBottom: 24, color: "var(--soft)", fontSize: ".97rem" }}>
            <input type="checkbox" name="is_default" style={{ marginRight: 8 }} />
            設為預設地址
          </label>
          <Submit>新增</Submit>
        </form>
      </div>
    </Shell>
  );
}
