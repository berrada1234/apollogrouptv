"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verifyStaffCode } from "@/actions/staff-verify";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input } from "@/components/ui/form";
import { safeRedirect } from "@/lib/utils";

type Msg = { ok: boolean; message: string } | null;

/** Code check before each admin visit (the sign-in code is asked separately). */
export function StaffVerifyForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"app" | "backup">("app");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  async function verify(value: string) {
    if (busy) return;
    setBusy(true);
    setMsg(null);
    const result = await verifyStaffCode({ code: value, backup: mode === "backup" }).catch(() => ({
      ok: false as const,
      message: "We couldn’t reach the server. Check your connection and try again.",
      signedOut: false,
    }));
    if (!result.ok) {
      setBusy(false);
      setCode("");
      setMsg({ ok: false, message: result.message });
      if ("signedOut" in result && result.signedOut) {
        router.replace(`/sign-in?next=${encodeURIComponent(next)}`);
        return;
      }
      codeRef.current?.focus();
      return;
    }
    setMsg({ ok: true, message: "Verified. Opening the admin area…" });
    router.replace(safeRedirect(next, "/admin"));
    router.refresh();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void verify(code);
      }}
      noValidate
      className="space-y-5"
    >
      <Field label={mode === "app" ? "Authenticator code" : "Backup code"} htmlFor="staff-code">
        <Input
          ref={codeRef}
          id="staff-code"
          name="code"
          inputMode={mode === "app" ? "numeric" : "text"}
          autoComplete="one-time-code"
          autoFocus
          placeholder={mode === "app" ? "••••••" : "xxxxx-xxxxx"}
          maxLength={mode === "app" ? 6 : 24}
          value={code}
          onChange={(e) => {
            if (mode === "backup") return setCode(e.target.value.trim());
            const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
            setCode(digits);
            if (digits.length === 6) void verify(digits);
          }}
          className={mode === "app" ? "h-14 text-center font-mono text-2xl tracking-[0.5em] placeholder:tracking-[0.5em]" : "h-12 text-center font-mono text-lg"}
        />
      </Field>
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" size="lg" className="w-full" loading={busy}>
        Verify and open admin
      </Button>
      <p className="text-center text-sm text-muted">
        {mode === "app" ? "Lost your phone? " : "Have your phone? "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "app" ? "backup" : "app");
            setCode("");
            setMsg(null);
            codeRef.current?.focus();
          }}
          className="font-medium text-accent hover:text-light-blue"
        >
          {mode === "app" ? "Use a backup code" : "Use the authenticator app"}
        </button>
      </p>
      <p className="text-center text-sm">
        <Link href="/dashboard" className="text-muted hover:text-text">
          Back to my dashboard
        </Link>
      </p>
    </form>
  );
}
