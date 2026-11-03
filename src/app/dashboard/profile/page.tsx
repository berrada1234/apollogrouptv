import type { Metadata } from "next";
import { accountTabs, SectionTabs } from "@/components/dashboard/section-tabs";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import Link from "next/link";
import { ProfileForm } from "@/components/forms/account-forms";
import { CopyField } from "@/components/dashboard/copy-field";
import { decryptSecret } from "@/lib/crypto";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Accounts" };

export default async function ProfilePage() {
  const user = await requireUser("/dashboard/profile");
  // Only the signed-in owner's credentials are ever loaded here.
  const credential = await db.playerCredential.findUnique({
    where: { userId: user.id },
  });
  const playerPassword = credential
    ? decryptSecret(credential.passwordEnc)
    : null;
  const m3uUrl = credential?.m3uUrlEnc
    ? decryptSecret(credential.m3uUrlEnc)
    : null;
  const unread = await db.notification.count({
    where: { userId: user.id, audience: "USER", readAt: null },
  });

  return (
    <>
      <PageHeader
        title="My Accounts"
        description="Your profile, sign-in security and notifications in one place."
      />
      <SectionTabs tabs={accountTabs(unread)} current="/dashboard/profile" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Personal information" />
            <CardBody>
              <ProfileForm name={user.name} email={user.email} />
            </CardBody>
          </Card>
          <Card id="player-login" className="scroll-mt-24">
            <CardHeader
              title="Player login (Xtream)"
              description="For third-party players such as UHF on iPhone, iPad and Apple TV. The Apollo TV app uses your website email and password instead."
            />
            <CardBody>
              {credential ? (
                <div className="space-y-3">
                  {credential.serverUrl && (
                    <CopyField
                      compact
                      label="Server URL"
                      value={credential.serverUrl}
                    />
                  )}
                  <CopyField
                    compact
                    label="Username"
                    value={credential.username}
                  />
                  {playerPassword ? (
                    <CopyField
                      compact
                      secret
                      label="Password"
                      value={playerPassword}
                    />
                  ) : (
                    <p className="text-sm text-warning">
                      Your password needs to be re-issued — please open a
                      support ticket.
                    </p>
                  )}
                  {m3uUrl && (
                    <CopyField compact secret label="M3U link" value={m3uUrl} />
                  )}
                  <p className="text-xs text-subtle">
                    Keep these private. Anyone with them can use your
                    subscription.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted">
                  Your player login appears here once our team activates your
                  pack. Need it now?{" "}
                  <Link
                    href="/dashboard/support/new"
                    className="text-accent hover:text-light-blue"
                  >
                    Open a ticket
                  </Link>
                  .
                </p>
              )}
            </CardBody>
          </Card>
          <p className="text-sm text-muted">
            Email preferences are under{" "}
            <Link
              href="/dashboard/notifications#preferences"
              className="text-accent hover:text-light-blue"
            >
              Notifications
            </Link>
            ; password and devices under{" "}
            <Link
              href="/dashboard/security"
              className="text-accent hover:text-light-blue"
            >
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
                <dd>
                  {user.emailVerified ? (
                    <StatusBadge status="ACTIVE" />
                  ) : (
                    <StatusBadge status="PENDING" />
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Account status</dt>
                <dd>
                  <StatusBadge status={user.status} />
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Referral code</dt>
                <dd className="font-mono text-light-blue">
                  {user.referralCode ?? "—"}
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
