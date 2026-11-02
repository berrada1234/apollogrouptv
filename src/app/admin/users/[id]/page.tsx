import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { grantSubscription, setSubscriptionStatus, setUserRole, setUserStatus, updateUserName } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { DataTable, EmptyRow, Td } from "@/components/admin/table";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/form";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { daysFromNow, formatDate, formatDateTime, formatMoney, isoDay } from "@/lib/utils";

export const metadata: Metadata = { title: "User details" };

export default async function UserDetailPage({ params }: PageProps<"/admin/users/[id]">) {
  const actor = await requireRole("ADMIN");
  const { id } = await params;
  const [user, plans] = await Promise.all([
    db.user.findUnique({
      where: { id },
      include: {
        subscriptions: { orderBy: { createdAt: "desc" }, include: { plan: { select: { name: true } } } },
        payments: { orderBy: { createdAt: "desc" }, take: 10 },
        tickets: { orderBy: { updatedAt: "desc" }, take: 10 },
        referredBy: { include: { referrer: { select: { id: true, name: true } } } },
        _count: { select: { referralsMade: true, sessions: true, reviews: true } },
      },
    }),
    db.plan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!user) notFound();
  const self = user.id === actor.id;
  const today = isoDay(daysFromNow(0));
  const monthLater = isoDay(daysFromNow(30));

  return (
    <>
      <Link href="/admin/users" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All users
      </Link>
      <PageHeader
        title={user.name}
        description={`${user.email} · Joined ${formatDate(user.createdAt)}`}
        actions={
          <>
            <StatusBadge status={user.role} />
            <StatusBadge status={user.status} />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Profile" />
          <CardBody className="space-y-4">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Email verified</dt><dd className="text-text">{user.emailVerified ? "Yes" : "No"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Active sessions</dt><dd className="text-text">{user._count.sessions}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Referral code</dt><dd className="font-mono text-light-blue">{user.referralCode ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Referrals made</dt><dd className="text-text">{user._count.referralsMade}</dd></div>
              <div className="flex justify-between">
                <dt className="text-muted">Referred by</dt>
                <dd className="text-text">
                  {user.referredBy ? <Link href={`/admin/users/${user.referredBy.referrer.id}`} className="hover:text-light-blue">{user.referredBy.referrer.name}</Link> : "—"}
                </dd>
              </div>
            </dl>
            <ActionForm action={updateUserName} submitLabel="Update name" submitVariant="secondary">
              <input type="hidden" name="userId" value={user.id} />
              <Field label="Name" htmlFor="name">
                <Input id="name" name="name" defaultValue={user.name} required />
              </Field>
            </ActionForm>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Role" description="Only administrators can change roles. Changes are audit-logged." />
          <CardBody>
            {self ? (
              <p className="text-sm text-muted">You can’t change your own role.</p>
            ) : (
              <ActionForm action={setUserRole} submitLabel="Change role" submitVariant="secondary" confirm="Change this user's role?">
                <input type="hidden" name="userId" value={user.id} />
                <Field label="Role" htmlFor="role">
                  <Select id="role" name="role" defaultValue={user.role}>
                    <option value="USER">User</option>
                    <option value="SUPPORT">Support staff</option>
                    <option value="ADMIN">Administrator</option>
                  </Select>
                </Field>
              </ActionForm>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Account status" description="Suspending signs the user out of every device." />
          <CardBody>
            {self ? (
              <p className="text-sm text-muted">You can’t suspend your own account.</p>
            ) : user.status === "ACTIVE" ? (
              <ActionForm action={setUserStatus} submitLabel="Suspend account" submitVariant="danger" confirm="Suspend this account and sign the user out everywhere?">
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="status" value="SUSPENDED" />
                <Field label="Reason (internal)" htmlFor="reason">
                  <Input id="reason" name="reason" maxLength={300} />
                </Field>
              </ActionForm>
            ) : (
              <ActionForm action={setUserStatus} submitLabel="Reactivate account">
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="status" value="ACTIVE" />
              </ActionForm>
            )}
          </CardBody>
        </Card>
      </div>

      <h2 className="mb-3 mt-10 font-display text-lg font-semibold text-text">Subscriptions</h2>
      <DataTable head={["Plan", "Status", "Period", "Source", "Change status"]} minWidth={760}>
        {user.subscriptions.length === 0 ? (
          <EmptyRow colSpan={5}>No subscriptions.</EmptyRow>
        ) : (
          user.subscriptions.map((s) => (
            <tr key={s.id}>
              <Td className="font-medium text-text">{s.plan.name}</Td>
              <Td><StatusBadge status={s.status} /></Td>
              <Td className="text-muted">{formatDate(s.currentPeriodStart)} – {formatDate(s.currentPeriodEnd)}</Td>
              <Td className="text-muted">{s.providerSubscriptionId ? "Payment provider" : "Manual"}</Td>
              <Td>
                {s.providerSubscriptionId ? (
                  <span className="text-xs text-muted">Managed by provider</span>
                ) : (
                  <ActionForm action={setSubscriptionStatus} inline submitLabel="Update" submitVariant="secondary">
                    <input type="hidden" name="subscriptionId" value={s.id} />
                    <Select name="status" defaultValue={s.status} aria-label="Subscription status" className="h-9 w-36">
                      {["PENDING", "ACTIVE", "PAST_DUE", "CANCELED", "EXPIRED"].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </Select>
                  </ActionForm>
                )}
              </Td>
            </tr>
          ))
        )}
      </DataTable>

      <Card className="mt-6">
        <CardHeader
          title="Activate a plan manually"
          description="Use this while online checkout is disabled, after confirming payment out-of-band. The action is audit-logged and the user is notified."
        />
        <CardBody>
          {plans.length === 0 ? (
            <p className="text-sm text-muted">Create an active plan first.</p>
          ) : (
            <ActionForm action={grantSubscription} submitLabel="Activate subscription" confirm="Activate this subscription for the user?">
              <input type="hidden" name="userId" value={user.id} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Plan" htmlFor="planId">
                  <Select id="planId" name="planId">
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {formatMoney(p.priceCents, p.currency)}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Start date" htmlFor="start">
                  <Input id="start" name="start" type="date" defaultValue={today} required />
                </Field>
                <Field label="End date" htmlFor="end">
                  <Input id="end" name="end" type="date" defaultValue={monthLater} required />
                </Field>
              </div>
            </ActionForm>
          )}
        </CardBody>
      </Card>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-text">Recent payments</h2>
          <DataTable head={["Date", "Amount", "Status"]} minWidth={360}>
            {user.payments.length === 0 ? (
              <EmptyRow colSpan={3}>No payments recorded.</EmptyRow>
            ) : (
              user.payments.map((p) => (
                <tr key={p.id}>
                  <Td className="text-muted">{formatDate(p.createdAt)}</Td>
                  <Td className="text-text">{formatMoney(p.amountCents, p.currency)}</Td>
                  <Td><StatusBadge status={p.status} /></Td>
                </tr>
              ))
            )}
          </DataTable>
        </div>
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-text">Support tickets</h2>
          <DataTable head={["Subject", "Status", "Updated"]} minWidth={360}>
            {user.tickets.length === 0 ? (
              <EmptyRow colSpan={3}>No tickets.</EmptyRow>
            ) : (
              user.tickets.map((t) => (
                <tr key={t.id}>
                  <Td><Link href={`/admin/support/${t.id}`} className="text-text hover:text-light-blue">{t.subject}</Link></Td>
                  <Td><StatusBadge status={t.status} /></Td>
                  <Td className="text-muted">{formatDateTime(t.updatedAt)}</Td>
                </tr>
              ))
            )}
          </DataTable>
        </div>
      </div>
    </>
  );
}
