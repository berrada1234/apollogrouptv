import type { Metadata } from "next";
import { MailWarning } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { OverviewContent } from "@/components/dashboard/overview";
import { Notice } from "@/components/ui/misc";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const firstName = user.name.split(" ")[0];
  return (
    <>
      <PageHeader title={`Welcome back, ${firstName}`} description="Here's an overview of your account." />
      {!user.emailVerified && (
        <div className="mb-6">
          <Notice tone="warning" title="Email not verified">
            <span className="inline-flex items-center gap-2">
              <MailWarning className="h-4 w-4" aria-hidden /> Check your inbox for the verification link.
            </span>
          </Notice>
        </div>
      )}
      <OverviewContent user={user} />
    </>
  );
}
