import type { Metadata } from "next";
import { TwoFactorForm } from "@/components/forms/auth-forms";
import { safeRedirect } from "@/lib/utils";

export const metadata: Metadata = { title: "Two-step sign-in", robots: { index: false, follow: false } };

export default async function TwoFactorPage({ searchParams }: PageProps<"/two-factor">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? safeRedirect(sp.next) : undefined;
  return (
    <>
      <h1 className="font-hero text-3xl font-medium tracking-[-0.035em] text-text">Enter your sign-in code</h1>
      <p className="mt-2 text-muted">Open your authenticator app and type the 6-digit code shown for Apollo Group TV.</p>
      <div className="mt-8">
        <TwoFactorForm next={next} />
      </div>
    </>
  );
}
