"use client";

import { useState, useTransition } from "react";
import { claimReferralCode } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { FormMessage, Input } from "@/components/ui/form";

export function ReferralClaimForm() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await claimReferralCode({ code });
          setMsg({ ok: res.ok, message: res.message ?? "" });
        });
      }}
      className="space-y-3"
    >
      <div className="flex gap-2">
        <label htmlFor="ref-code" className="sr-only">
          Referral code
        </label>
        <Input id="ref-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Friend's referral code" maxLength={16} autoComplete="off" className="font-mono" />
        <Button type="submit" variant="secondary" loading={pending} disabled={!code.trim()}>
          Apply
        </Button>
      </div>
      <FormMessage ok={msg?.ok} message={msg?.message} />
    </form>
  );
}
