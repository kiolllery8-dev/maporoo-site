import Link from "next/link";
import { requireAdmin } from "../../../lib/admin";
import { landingFor, ROLE_DESC, ROLE_LABEL, type Role } from "../../../lib/permissions";
import { Panel } from "../../ui";

export const dynamic = "force-dynamic";

export default async function Denied({
  searchParams,
}: {
  searchParams: Promise<{ need?: string }>;
}) {
  const admin = await requireAdmin();
  const sp = await searchParams;
  const role = admin.role as Role;

  return (
    <Panel title="這個頁面你沒有權限">
      <p style={{ color: "var(--soft)", fontSize: "1rem", lineHeight: 2, maxWidth: 560 }}>
        你目前的角色是 <strong style={{ color: "var(--ink)" }}>{ROLE_LABEL[role] ?? admin.role}</strong>。
        <br />
        {ROLE_DESC[role] ?? "這個角色的權限範圍未定義，請找負責人確認。"}
        {sp.need && (
          <>
            <br />
            <span style={{ color: "var(--mute)", fontSize: ".9rem" }}>
              需要的權限：<code>{sp.need}</code>
            </span>
          </>
        )}
      </p>
      <p style={{ marginTop: 28 }}>
        <Link href={landingFor(admin.role)} className="lnk-dark">
          回到你能操作的頁面
        </Link>
      </p>
      <p style={{ marginTop: 20, color: "var(--mute)", fontSize: ".9rem", lineHeight: 1.9 }}>
        需要更多權限的話，請負責人到「管理者」頁面調整你的角色。
      </p>
    </Panel>
  );
}
