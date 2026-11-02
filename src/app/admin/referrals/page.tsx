import type { Metadata } from "next";
import Link from "next/link";
import { issueReferralReward, setReferralStatus } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { Notice, Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Referrals" };
const PAGE_SIZE = 25;
const STATUSES = ["PENDING", "QUALIFIED", "REWARDED", "REJECTED"] as const;

export default async function AdminReferralsPage({ searchParams }: PageProps<"/admin/referrals">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const status = oneOf(param(sp, "status"), STATUSES);
  const page = pageParam(sp);
  const where = status ? { status } : {};
  const [referrals, total, settings] = await Promise.all([
    db.referral.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        referrer: { select: { id: true, name: true, email: true } },
        referee: { select: { id: true, name: true, email: true, subscriptions: { where: { status: "ACTIVE" }, select: { id: true } } } },
        _count: { select: { rewards: true } },
      },
    }),
    db.referral.count({ where }),
    getSettings(),
  ]);

  return (
    <>
      <PageHeader
        title="Referrals"
        description="A referral qualifies only when the referred user has an active subscription."
        actions={<ButtonLink href="/admin/settings#referral" variant="secondary">Referral rules</ButtonLink>}
      />
      <div className="mb-6">
        {settings.referral.enabled ? (
          <Notice title="Referral program is active">{settings.referral.rewardDescription || "No reward description set."}</Notice>
        ) : (
          <Notice tone="warning" title="Referral program is not active">
            Sign-ups through referral links are tracked, but rewards can’t be issued until you enable the program and publish its rules in Settings.
          </Notice>
        )}
      </div>
      <FilterBar>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
      </FilterBar>
      <DataTable head={["Referrer", "Referred user", "Joined", "Active sub", "Status", "Actions"]} minWidth={900}>
        {referrals.length === 0 ? (
          <EmptyRow colSpan={6}>No referrals recorded.</EmptyRow>
        ) : (
          referrals.map((r) => (
            <tr key={r.id}>
              <Td>
                <Link href={`/admin/users/${r.referrer.id}`} className="text-text hover:text-light-blue">{r.referrer.name}</Link>
                <span className="block text-xs text-muted">{r.referrer.email}</span>
              </Td>
              <Td>
                <Link href={`/admin/users/${r.referee.id}`} className="text-text hover:text-light-blue">{r.referee.name}</Link>
                <span className="block text-xs text-muted">{r.referee.email}</span>
              </Td>
              <Td className="text-muted">{formatDate(r.createdAt)}</Td>
              <Td className="text-muted">{r.referee.subscriptions.length > 0 ? "Yes" : "No"}</Td>
              <Td><StatusBadge status={r.status} /></Td>
              <Td>
                <div className="flex flex-col gap-2">
                  {r.status !== "REWARDED" && (
                    <ActionForm action={setReferralStatus} inline submitLabel="Set" submitVariant="secondary">
                      <input type="hidden" name="referralId" value={r.id} />
                      <Select name="status" defaultValue={r.status} aria-label="Referral status" className="h-9 w-32">
                        <option value="PENDING">Pending</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="REJECTED">Rejected</option>
                      </Select>
                    </ActionForm>
                  )}
                  {r.status === "QUALIFIED" && settings.referral.enabled && (
                    <ActionForm action={issueReferralReward} inline submitLabel="Issue reward">
                      <input type="hidden" name="referralId" value={r.id} />
                      <Input name="description" placeholder="Reward description" aria-label="Reward description" className="h-9 w-48" required />
                    </ActionForm>
                  )}
                </div>
              </Td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/referrals", sp, p)} />
    </>
  );
}
