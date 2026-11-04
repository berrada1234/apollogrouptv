import { Gift, Users } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, Notice, StatCard } from "@/components/ui/misc";
import { ReferralShare } from "@/components/referral-share";
import { db } from "@/lib/db";
import { displayName } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { absoluteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

/** Server component: referral code, sharing tools and history for one user. */
export async function ReferralPanel({ userId, referralCode }: { userId: string; referralCode: string | null }) {
  const [settings, referrals, rewards] = await Promise.all([
    getSettings(),
    db.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, status: true, createdAt: true, referee: { select: { name: true } } },
    }),
    db.referralReward.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const qualified = referrals.filter((r) => r.status === "QUALIFIED" || r.status === "REWARDED").length;

  return (
    <div className="space-y-6">
      {!settings.referral.enabled && (
        <Notice title="Referral rewards are not active yet">
          You can already share your link, and sign-ups are tracked. Rewards will be applied once the program rules are published.
        </Notice>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Friends referred" value={referrals.length} icon={Users} />
        <StatCard label="Qualified referrals" value={qualified} icon={Users} />
        <StatCard label="Rewards" value={rewards.length} icon={Gift} />
      </div>
      <Card>
        <CardHeader title="Share your link" description="Friends who create an account with your link are recorded as your referrals." />
        <CardBody>
          {referralCode ? (
            <ReferralShare code={referralCode} link={absoluteUrl(`/create-account?ref=${referralCode}`)} />
          ) : (
            <p className="text-sm text-muted">Your referral code is being generated. Refresh the page in a moment.</p>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Referral history" />
        <CardBody className="p-0 sm:p-0">
          {referrals.length === 0 ? (
            <EmptyState icon={Users} title="No referrals yet" description="Share your link to invite friends." className="m-5 sm:m-6" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted">
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 font-medium sm:px-6">Friend</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 text-text sm:px-6">{displayName(r.referee.name)}</td>
                      <td className="px-5 py-3 text-muted">{formatDate(r.createdAt)}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
      {rewards.length > 0 && (
        <Card>
          <CardHeader title="Rewards" />
          <CardBody>
            <ul className="divide-y divide-border">
              {rewards.map((rw) => (
                <li key={rw.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="text-text">{rw.description}</span>
                  <StatusBadge status={rw.status} />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
