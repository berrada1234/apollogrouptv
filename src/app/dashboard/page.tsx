import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MailWarning } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Greeting } from "@/components/dashboard/greeting";
import { OverviewContent } from "@/components/dashboard/overview";
import { Notice } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  // Customers who have never had a pack start on the finish-your-subscription page instead.
  if (user.emailVerified && (await db.subscription.count({ where: { userId: user.id } })) === 0) redirect("/dashboard/get-started");
  const firstName = user.name.split(" ")[0];
  return (
    <>
      <PageHeader title={<Greeting firstName={firstName} />} description="Here's an overview of your account." />
      {!user.emailVerified && (
        <div className="mb-6">
          <Notice tone="warning" title="Email not verified">
            <span className="inline-flex items-center gap-2">
              <MailWarning className="h-4 w-4" aria-hidden /> Check your inbox for your 6-digit verification code.
            </span>
          </Notice>
        </div>
      )}
      <OverviewContent user={user} />
    </>
  );
}
