import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";
import { accountTabs, SectionTabs } from "@/components/dashboard/section-tabs";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import {
  ChangePasswordForm,
  SessionsManager,
} from "@/components/forms/account-forms";
import { Notice } from "@/components/ui/misc";
import { isEmailConfigured } from "@/lib/email";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Security Settings" };

export default async function SecurityPage() {
  const user = await requireUser("/dashboard/security");
  const unread = await db.notification.count({ where: { userId: user.id, audience: "USER", readAt: null } });

  const emailReady = isEmailConfigured();
  return (
    <>
      <PageHeader title="My Accounts" description="Your profile, sign-in security and notifications in one place." />
      <SectionTabs tabs={accountTabs(unread)} current="/dashboard/security" />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Change password" />
            <CardBody>
              <ChangePasswordForm />
            </CardBody>
          </Card>
          <Card>
            <CardHeader
              title="Active sessions"
              description="Sign out of devices you don't recognise."
            />
            <CardBody>
              <SessionsManager currentSessionId={user.sessionId} />
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Forgot your current password?" />
            <CardBody className="space-y-4 text-sm text-muted">
              <p>
                You can’t change it here without the current one. Request a
                reset link instead — it’s sent to{" "}
                <span className="text-text">{user.email}</span> and expires
                after 30 minutes. Resetting signs you out of other devices.
              </p>
              {emailReady ? (
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center gap-2 font-medium text-accent hover:text-light-blue"
                >
                  <KeyRound className="h-4 w-4" aria-hidden /> Send me a reset
                  link
                </Link>
              ) : (
                <Notice tone="warning" title="Reset emails can’t be sent yet">
                  The site’s email service isn’t configured, so reset links
                  can’t be delivered. Please contact support to regain access if
                  needed.
                </Notice>
              )}
              {!user.emailVerified && (
                <p>
                  Your email isn’t verified yet.{" "}
                  <Link
                    href="/verify-email"
                    className="font-medium text-accent hover:text-light-blue"
                  >
                    Resend the verification email
                  </Link>
                  .
                </p>
              )}
            </CardBody>
          </Card>
          <Card className="h-fit">
            <CardHeader title="Account security" />
            <CardBody>
              <ul className="space-y-3 text-sm text-muted">
                {[
                  user.emailVerified
                    ? "Your email address is verified."
                    : "Your email address is not verified yet.",
                  "Passwords are stored as salted hashes — never in plain text.",
                  "Sign-in attempts are rate-limited to block guessing attacks.",
                  "Changing your password can sign out all other devices.",
                  "We will never ask for your password by email or chat.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <ShieldCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      aria-hidden
                    />{" "}
                    {t}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
