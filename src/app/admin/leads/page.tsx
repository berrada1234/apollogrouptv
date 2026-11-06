import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Mail, MessageCircle, Phone, ReceiptText, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { DesktopAlertsToggle } from "@/components/admin/desktop-alerts-toggle";
import { MarkSignupsSeen } from "@/components/admin/mark-signups-seen";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/form";
import { Pagination, StatCard } from "@/components/ui/misc";
import { invoiceStatusLabels } from "@/lib/checkout/labels";
import { db } from "@/lib/db";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { whatsappLink } from "@/lib/phone";
import { requireRole } from "@/lib/session";
import { daysFromNow, formatDateTime, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Not purchased" };
export const dynamic = "force-dynamic";
const PAGE_SIZE = 30;
const PERIODS = { "24h": 1, "7d": 7, "30d": 30 } as const;

/** Customers who created an account but have never paid: who they are, how to reach them, what they picked. */
export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const q = param(sp, "q");
  const period = oneOf(param(sp, "period"), ["24h", "7d", "30d"] as const);
  const verified = oneOf(param(sp, "verified"), ["yes", "no"] as const);
  const page = pageParam(sp);

  const notBought: Prisma.UserWhereInput = {
    role: "USER",
    subscriptions: { none: {} },
    orders: { none: { status: "PAID" } },
  };
  const where: Prisma.UserWhereInput = {
    ...notBought,
    ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }] } : {}),
    ...(period ? { createdAt: { gte: daysFromNow(-PERIODS[period]) } } : {}),
    ...(verified ? { emailVerified: verified === "yes" } : {}),
  };

  const [users, total, last24h, withPack, openValue] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        remindersOptOut: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { number: true, status: true, amountCents: true, currency: true, createdAt: true, plan: { select: { name: true } } },
        },
        _count: { select: { emailReminders: true } },
      },
    }),
    db.user.count({ where }),
    db.user.count({ where: { ...notBought, createdAt: { gte: daysFromNow(-1) } } }),
    db.user.count({ where: { ...notBought, orders: { some: {}, none: { status: "PAID" } } } }),
    db.order.aggregate({
      where: { status: { in: ["PENDING", "PENDING_CONFIRMATION", "UNDERPAID"] }, user: notBought },
      _sum: { amountCents: true },
    }),
  ]);


  const currency = users.find((u) => u.orders[0])?.orders[0]?.currency ?? "USD";

  return (
    <>
      <PageHeader
        title="Not purchased"
        description="Everyone who created an account but hasn't paid yet. Contact them while they're still interested."
        actions={<DesktopAlertsToggle />}
      />
      <MarkSignupsSeen />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Not purchased" value={total.toLocaleString()} icon={Users} hint={period || verified || q ? "Matching these filters" : "All time"} />
        <StatCard label="New in the last 24 hours" value={last24h.toLocaleString()} icon={UserPlus} href="/admin/leads?period=24h" />
        <StatCard label="Chose a pack, didn't pay" value={withPack.toLocaleString()} icon={ReceiptText} />
        <StatCard label="Value of open invoices" value={formatMoney(openValue._sum.amountCents ?? 0, currency)} icon={ReceiptText} hint="Unpaid invoices from these customers" />
      </div>

      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="Name, email or phone" />
        </div>
        <div>
          <Label htmlFor="period">Signed up</Label>
          <Select id="period" name="period" defaultValue={period ?? ""}>
            <option value="">Any time</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="verified">Email</Label>
          <Select id="verified" name="verified" defaultValue={verified ?? ""}>
            <option value="">All</option>
            <option value="yes">Verified</option>
            <option value="no">Not verified</option>
          </Select>
        </div>
      </FilterBar>

      <DataTable head={["Customer", "Contact", "Pack and price", "Signed up", "Reminders"]} minWidth={920}>
        {users.length === 0 ? (
          <EmptyRow colSpan={5}>No customers match these filters.</EmptyRow>
        ) : (
          users.map((u) => {
            const order = u.orders[0];
            return (
              <tr key={u.id} className="align-top hover:bg-card-hover">
                <Td>
                  <Link href={`/admin/users/${u.id}`} className="font-medium text-text hover:text-light-blue">
                    {u.name}
                  </Link>
                  <div className="mt-1">
                    <StatusBadge status={u.emailVerified ? "ACTIVE" : "PENDING"} label={u.emailVerified ? "email verified" : "email not verified"} />
                  </div>
                </Td>
                <Td>
                  <div className="space-y-1.5 text-sm">
                    <a href={`mailto:${u.email}`} className="flex items-center gap-1.5 text-light-blue hover:underline">
                      <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden /> {u.email}
                    </a>
                    {u.phone ? (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <a href={`tel:${u.phone}`} className="flex items-center gap-1.5 text-text hover:underline">
                          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden /> {u.phone}
                        </a>
                        <a href={whatsappLink(u.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-success hover:underline">
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden /> WhatsApp
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-subtle">No phone given</p>
                    )}
                  </div>
                </Td>
                <Td>
                  {order ? (
                    <div className="text-sm">
                      <p className="font-medium text-text">
                        {order.plan.name} · {formatMoney(order.amountCents, order.currency)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {order.number ?? "Invoice"} · {invoiceStatusLabels[order.status] ?? order.status} · {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-subtle">No pack chosen yet</p>
                  )}
                </Td>
                <Td className="whitespace-nowrap text-sm text-muted">{formatDateTime(u.createdAt)}</Td>
                <Td className="text-sm text-muted">{u.remindersOptOut ? "Opted out" : `${u._count.emailReminders} sent`}</Td>
              </tr>
            );
          })
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/leads", sp, p)} />
    </>
  );
}
