import type { Metadata } from "next";
import { accountTabs, SectionTabs } from "@/components/dashboard/section-tabs";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import Link from "next/link";
import { ProfileForm } from "@/components/forms/account-forms";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Accounts" };

export default async function ProfilePage() {
  const user = await requireUser("/dashboard/profile");
  const unread = await db.notification.count({ where: { userId: user.id, readAt: null } });

  return (
    <>
      <PageHeader title="My Accounts" description="Your profile, sign-in security and notifications in one place." />
      <SectionTabs tabs={accountTabs(unread)} current="/dashboard/profile" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Personal information" />
            <CardBody>
              <ProfileForm name={user.name} email={user.email} />
            </CardBody>
          </Card>
          <p className="text-sm text-muted">
            Email preferences are under{" "}
            <Link href="/dashboard/notifications#preferences" className="text-accent hover:text-light-blue">
              Notifications
            </Link>
            ; password and devices under{" "}
            <Link href="/dashboard/security" className="text-accent hover:text-light-blue">
              Security Settings
            </Link>
            .
          </p>
        </div>
        <Card className="h-fit">
          <CardHeader title="Account details" />
          <CardBody>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Member since</dt>
                <dd className="text-text">{formatDate(user.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Email status</dt>
                <dd>{user.emailVerified ? <StatusBadge status="ACTIVE" /> : <StatusBadge status="PENDING" />}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Account status</dt>
                <dd>
                  <StatusBadge status={user.status} />
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Referral code</dt>
                <dd className="font-mono text-light-blue">{user.referralCode ?? "—"}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
