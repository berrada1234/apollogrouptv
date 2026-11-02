import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ChangePasswordForm, SessionsManager } from "@/components/forms/account-forms";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Security Settings" };

export default async function SecurityPage() {
  const user = await requireUser("/dashboard/security");
  return (
    <>
      <PageHeader title="Security Settings" description="Manage your password and the devices signed in to your account." />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Change password" />
            <CardBody>
              <ChangePasswordForm />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Active sessions" description="Sign out of devices you don't recognise." />
            <CardBody>
              <SessionsManager currentSessionId={user.sessionId} />
            </CardBody>
          </Card>
        </div>
        <Card className="h-fit">
          <CardHeader title="Account security" />
          <CardBody>
            <ul className="space-y-3 text-sm text-muted">
              {[
                user.emailVerified ? "Your email address is verified." : "Your email address is not verified yet.",
                "Passwords are stored as salted hashes — never in plain text.",
                "Sign-in attempts are rate-limited to block guessing attacks.",
                "Changing your password can sign out all other devices.",
                "We will never ask for your password by email or chat.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
