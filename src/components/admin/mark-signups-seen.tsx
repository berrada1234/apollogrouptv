"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Opening "Not purchased" counts as seeing the new sign-up alerts; the sidebar badge then refreshes. */
export function MarkSignupsSeen() {
  const router = useRouter();
  useEffect(() => {
    void fetch("/api/admin/attention", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ seen: "signups" }) })
      .then((r) => r.ok && router.refresh())
      .catch(() => undefined);
  }, [router]);
  return null;
}
