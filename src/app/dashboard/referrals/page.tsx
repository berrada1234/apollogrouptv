import type { Metadata } from "next";
import { Gift, Heart } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ReferralPanel } from "@/components/referral-panel";
import { ButtonLink } from "@/components/ui/button";
import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Referrals & Gifts" };

export default async function ReferralsPage() {
  const user = await requireUser("/dashboard/referrals");
  const settings = await getSettings();
  const reward = settings.referral.enabled && settings.referral.rewardDescription ? settings.referral.rewardDescription : null;

  return (
    <>
      <PageHeader title="Referrals & Gifts" description="Invite friends with your personal link, or give someone a pack of their own." />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <section className="relative overflow-hidden rounded-[14px] border border-primary/25 bg-[#0d1238] p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_100%_0%,rgb(70_224_255/0.18),transparent_70%)]" aria-hidden />
          <div className="relative">
            <Gift className="h-6 w-6 text-accent" aria-hidden />
            <h2 className="mt-3 font-display text-xl font-bold text-text">{reward ?? "Refer a friend"}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              {reward
                ? "Share your link below. Rewards follow the program rules shown on this page."
                : "Share your personal link below and track every friend who signs up. Rewards are announced here when the program opens."}
            </p>
          </div>
        </section>
        <section className="rounded-[14px] border border-border bg-card p-6 shadow-card">
          <Heart className="h-6 w-6 text-accent" aria-hidden />
          <h2 className="mt-3 font-display text-xl font-bold text-text">Gift a pack</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Want to buy access for someone special? Tell us who it&apos;s for and which pack — our team arranges the payment with you and activates it on their account.
          </p>
          <ButtonLink href="/dashboard/support/new?topic=gift" variant="secondary" size="sm" className="mt-4">
            Request a gift pack
          </ButtonLink>
        </section>
      </div>

      <ReferralPanel userId={user.id} referralCode={user.referralCode} />
    </>
  );
}
