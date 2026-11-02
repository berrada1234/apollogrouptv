import type { Metadata } from "next";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { PageHeader } from "@/components/page-header";
import { Input, Label } from "@/components/ui/form";
import { Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Audit Logs" };
const PAGE_SIZE = 50;

export default async function AuditLogsPage({ searchParams }: PageProps<"/admin/audit-logs">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const action = param(sp, "action", 80);
  const page = pageParam(sp);
  const where = action ? { action: { startsWith: action } } : {};
  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { actor: { select: { name: true, email: true } } },
    }),
    db.auditLog.count({ where }),
  ]);

  return (
    <>
      <PageHeader title="Audit Logs" description="Record of sensitive administrative actions. Secrets are redacted before logging." />
      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="action">Action prefix</Label>
          <Input id="action" name="action" defaultValue={action} placeholder="e.g. user. or plan." />
        </div>
      </FilterBar>
      <DataTable head={["When", "Actor", "Action", "Target", "Details", "IP"]} minWidth={900}>
        {logs.length === 0 ? (
          <EmptyRow colSpan={6}>No audit entries.</EmptyRow>
        ) : (
          logs.map((l) => (
            <tr key={l.id}>
              <Td className="whitespace-nowrap text-muted">{formatDateTime(l.createdAt)}</Td>
              <Td>
                <span className="text-text">{l.actor?.name ?? "Deleted user"}</span>
                {l.actor && <span className="block text-xs text-muted">{l.actor.email}</span>}
              </Td>
              <Td className="font-mono text-xs text-light-blue">{l.action}</Td>
              <Td className="text-xs text-muted">
                {l.targetType}
                {l.targetId && <span className="block font-mono">{l.targetId}</span>}
              </Td>
              <Td className="max-w-xs">
                {l.metadata ? <code className="block truncate text-xs text-muted" title={JSON.stringify(l.metadata)}>{JSON.stringify(l.metadata)}</code> : <span className="text-muted">—</span>}
              </Td>
              <Td className="font-mono text-xs text-muted">{l.ipAddress ?? "—"}</Td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/audit-logs", sp, p)} />
    </>
  );
}
