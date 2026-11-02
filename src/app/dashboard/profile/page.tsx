import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { PreferencesForm, ProfileForm } from "@/components/forms/account-forms";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await requireUser("/dashboard/profile");
  return (
    <>
      <PageHeader title="My Profile" description="Your personal details and communication preferences." />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Personal information" />
            <CardBody>
              <ProfileForm name={user.name} email={user.email} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Notification preferences" description="Choose which optional emails you'd like to receive." />
            <CardBody>
              <PreferencesForm marketingOptIn={user.marketingOptIn} productUpdatesOptIn={user.productUpdatesOptIn} />
            </CardBody>
          </Card>
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
