import Link from "next/link";
import { requireAdmin } from "../../../lib/admin";
import { landingFor, ROLE_DESC, ROLE_LABEL, type Role } from "../../../lib/permissions";
import { PageHeader, Panel } from "../../ui";

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
    <>
      <PageHeader eyebrow="NO ACCESS" title="這個頁面你沒有權限" />

      <Panel title={`你目前的角色：${ROLE_LABEL[role] ?? admin.role}`}>
        <p className="max-w-[560px] text-sm text-ink/70 leading-relaxed">
          {ROLE_DESC[role] ?? "這個角色的權限範圍未定義，請找負責人確認。"}
        </p>
        {sp.need && (
          <p className="mt-2 text-xs text-ink/50">
            需要的權限：<code>{sp.need}</code>
          </p>
        )}
        <p className="mt-6">
          <Link href={landingFor(admin.role)} className="btn btn-primary">
            回到你能操作的頁面
          </Link>
        </p>
        <p className="mt-5 text-xs text-ink/50 leading-relaxed">
          需要更多權限的話，請負責人到「管理者」頁面調整你的角色。
        </p>
      </Panel>
    </>
  );
}
