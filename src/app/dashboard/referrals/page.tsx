import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ReferralPanel } from "@/components/referral-panel";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Referral Program" };

export default async function ReferralsPage() {
  const user = await requireUser("/dashboard/referrals");
  return (
    <>
      <PageHeader title="Referral Program" description="Share your link and track the friends who join." />
      <ReferralPanel userId={user.id} referralCode={user.referralCode} />
    </>
  );
}
