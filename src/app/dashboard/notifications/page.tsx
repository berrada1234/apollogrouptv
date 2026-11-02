import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/misc";
import { MarkAllReadButton } from "@/components/forms/support-forms";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { cn, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const user = await requireUser("/dashboard/notifications");
  const notifications = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });
  const unread = notifications.some((n) => !n.readAt);

  return (
    <>
      <PageHeader title="Notifications" description="Updates about your account and support requests." actions={unread ? <MarkAllReadButton /> : undefined} />
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="We'll let you know here when something needs your attention." />
      ) : (
        <Card className="divide-y divide-border">
          {notifications.map((n) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <p className={cn("text-sm font-medium", n.readAt ? "text-muted" : "text-text")}>
                    {!n.readAt && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" aria-hidden />}
                    {n.title}
                    {!n.readAt && <span className="sr-only"> (unread)</span>}
                  </p>
                  <time className="shrink-0 text-xs text-muted" dateTime={n.createdAt.toISOString()}>
                    {formatDateTime(n.createdAt)}
                  </time>
                </div>
                <p className="mt-1 text-sm text-muted">{n.body}</p>
              </>
            );
            return n.href?.startsWith("/") ? (
              <Link key={n.id} href={n.href} className="block px-5 py-4 hover:bg-card-hover">
                {inner}
              </Link>
            ) : (
              <div key={n.id} className="px-5 py-4">
                {inner}
              </div>
            );
          })}
        </Card>
      )}
    </>
  );
}
