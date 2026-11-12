import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { ChangePasswordForm, SessionsManager } from "@/components/forms/account-forms";
import { TwoFactorSettings } from "@/components/forms/two-factor-settings";
import { db } from "@/lib/db";
import { hasRole, requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Security" };
export const dynamic = "force-dynamic";

/**
 * Two-step sign-in (2FA) for the signed-in staff account, inside the admin area. Uses the same authenticator-app
 * setup as the customer dashboard (Better Auth twoFactor: QR code, 6-digit codes, 10 single-use backup codes).
 * Admins also see which staff accounts have it switched on.
 */
export default async function AdminSecurityPage() {
  const user = await requireRole("SUPPORT", "/admin/security");
  const isAdmin = hasRole(user, "ADMIN");
  const [account, staff] = await Promise.all([
    db.user.findUnique({ where: { id: user.id }, select: { twoFactorEnabled: true } }),
    isAdmin
      ? db.user.findMany({
          where: { role: { not: "USER" } },
          select: { id: true, name: true, email: true, role: true, twoFactorEnabled: true },
          orderBy: [{ role: "desc" }, { name: "asc" }],
        })
      : Promise.resolve([]),
  ]);
  const on = !!account?.twoFactorEnabled;

  return (
    <>
      <PageHeader title="Security" description="Two-step sign-in, password and signed-in devices for your staff account." />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="space-y-6">
          <Card id="two-step">
            <CardHeader
              title="Two-step sign-in (2FA)"
              description="After your password, sign-in asks for a 6-digit code from an authenticator app on your phone (Google Authenticator, Microsoft Authenticator, 1Password, Authy…)."
            />
            <CardBody>
              <TwoFactorSettings enabled={on} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Change password" />
            <CardBody>
              <ChangePasswordForm />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Signed-in devices" description="Sign out of any device you don't recognise." />
            <CardBody>
              <SessionsManager currentSessionId={user.sessionId} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          {isAdmin && (
            <Card>
              <CardHeader title="Staff accounts" description="Who has two-step sign-in switched on. Each person turns it on from this page when signed in." />
              <CardBody>
                <ul className="divide-y divide-border text-sm">
                  {staff.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-text">{s.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {s.email} · {s.role.toLowerCase()}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${s.twoFactorEnabled ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}
                      >
                        {s.twoFactorEnabled ? "2FA on" : "2FA off"}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader title="Before you switch it on" />
            <CardBody>
              <ul className="space-y-3 text-sm text-muted">
                {[
                  "Install an authenticator app on your phone first.",
                  "Save the 10 backup codes somewhere safe, such as a password manager. Each works once if you lose your phone.",
                  "“Trust this device” skips the code on that browser for 30 days.",
                  "Turning it off asks for your password again.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden /> {t}
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
