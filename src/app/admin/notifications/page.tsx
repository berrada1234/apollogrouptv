import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { markAdminNotificationsRead } from "@/actions/subscriptions-admin";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState, Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { cn, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };
const PAGE_SIZE = 25;

export default async function AdminNotificationsPage({ searchParams }: PageProps<"/admin/notifications">) {
  const admin = await requireRole("ADMIN");
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(String(sp.page ?? "1"), 10) || 1);
  const where = { userId: admin.id, audience: "ADMIN" as const };
  const [items, total, unread] = await Promise.all([
    db.notification.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.notification.count({ where }),
    db.notification.count({ where: { ...where, readAt: null } }),
  ]);

  return (
    <>
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread` : "You're all caught up."}
        actions={unread > 0 ? <ActionForm action={markAdminNotificationsRead} submitLabel="Mark All as Read" submitVariant="secondary" inline /> : undefined}
      />
      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="New registrations, orders and payment confirmations will appear here." />
      ) : (
        <Card className="divide-y divide-border">
          {items.map((n) => (
            <Link key={n.id} href={`/api/notifications/${n.id}`} prefetch={false} className={cn("block px-5 py-4 hover:bg-card-hover", !n.readAt && "bg-primary/[0.04]")}>
              <div className="flex items-start justify-between gap-3">
                <p className={cn("text-sm font-semibold", n.readAt ? "text-muted" : "text-text")}>
                  {!n.readAt && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" aria-hidden />}
                  {n.title}
                  {!n.readAt && <span className="sr-only"> (unread)</span>}
                </p>
                <time className="shrink-0 text-xs text-muted" dateTime={n.createdAt.toISOString()}>
                  {formatDateTime(n.createdAt)}
                </time>
              </div>
              <p className="mt-1 text-sm text-muted">{n.body}</p>
              {n.href?.startsWith("/admin/users/") && <span className="mt-2 inline-block text-xs font-semibold text-accent">View Customer →</span>}
            </Link>
          ))}
        </Card>
      )}
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => `/admin/notifications?page=${p}`} />
    </>
  );
}
