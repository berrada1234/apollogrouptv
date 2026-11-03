import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import { accountTabs, SectionTabs } from "@/components/dashboard/section-tabs";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState, Notice, Pagination } from "@/components/ui/misc";
import { MarkAllReadButton } from "@/components/forms/support-forms";
import { PreferencesForm } from "@/components/forms/account-forms";
import { db } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";
import { requireUser } from "@/lib/session";
import { cn, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };

const PAGE_SIZE = 20;

export default async function NotificationsPage({ searchParams }: PageProps<"/dashboard/notifications">) {
  const user = await requireUser("/dashboard/notifications");
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(String(sp.page ?? "1"), 10) || 1);
  const [notifications, total, unreadCount] = await Promise.all([
    db.notification.findMany({ where: { userId: user.id, audience: "USER" }, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.notification.count({ where: { userId: user.id, audience: "USER" } }),
    db.notification.count({ where: { userId: user.id, audience: "USER", readAt: null } }),
  ]);
  const emailReady = isEmailConfigured();

  return (
    <>
      <PageHeader
        title="My Accounts"
        description="Your profile, sign-in security and notifications in one place."
        actions={unreadCount > 0 ? <MarkAllReadButton /> : undefined}
      />
      <SectionTabs tabs={accountTabs(unreadCount)} current="/dashboard/notifications" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div>
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
                  // Opening marks it read, then continues to the details.
                  <Link key={n.id} href={`/api/notifications/${n.id}`} prefetch={false} className="block px-5 py-4 hover:bg-card-hover">
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
          <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => `/dashboard/notifications?page=${p}`} />
        </div>

        <Card id="preferences" className="h-fit scroll-mt-24">
          <CardHeader title="Email preferences" description="In-dashboard notifications for your account and tickets are always on." />
          <CardBody className="space-y-5">
            {!emailReady && (
              <Notice tone="warning" title="Email delivery isn't set up yet">
                Your choices are saved, but emails can’t be sent until the site’s email service is configured. Dashboard notifications still work.
              </Notice>
            )}
            <PreferencesForm marketingOptIn={user.marketingOptIn} productUpdatesOptIn={user.productUpdatesOptIn} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
