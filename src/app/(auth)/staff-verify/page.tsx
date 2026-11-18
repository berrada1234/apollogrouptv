import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StaffVerifyForm } from "@/components/forms/staff-verify-form";
import { hasRole, isStaffVerified, requireUser } from "@/lib/session";
import { STAFF_IDLE_MINUTES } from "@/lib/staff-step-up";
import { safeRedirect } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Confirm it's you", robots: { index: false, follow: false } };

export default async function StaffVerifyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = typeof sp.next === "string" ? safeRedirect(sp.next, "/admin") : "/admin";
  // Only admin pages come through here.
  const next = raw === "/admin" || raw.startsWith("/admin/") || raw.startsWith("/admin?") ? raw : "/admin";
  const user = await requireUser(`/staff-verify?next=${encodeURIComponent(next)}`);
  if (!hasRole(user, "SUPPORT")) redirect("/dashboard");
  if (!user.twoFactorEnabled) redirect("/dashboard/security?staff=1#two-step");
  if (await isStaffVerified(user)) redirect(next);

  return (
    <>
      <h1 className="font-hero text-3xl font-medium tracking-[-0.035em] text-text">Confirm it&rsquo;s you</h1>
      <p className="mt-2 text-muted">
        The admin area asks for a fresh code on every visit. Open your authenticator app and type the 6-digit code for Apollo Group TV.
        After {STAFF_IDLE_MINUTES} minutes without activity, or when you close the browser, you&rsquo;ll be asked again.
      </p>
      <div className="mt-8">
        <StaffVerifyForm next={next} />
      </div>
    </>
  );
}
