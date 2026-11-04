"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Copy, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input } from "@/components/ui/form";
import { PasswordInput } from "@/components/forms/password-input";

type Msg = { ok: boolean; message: string } | null;
type Setup = { uri: string; secret: string; backupCodes: string[]; qr: string };

function errorText(error: { status?: number; message?: string } | null | undefined, fallback: string) {
  if (!error) return fallback;
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (/password/i.test(error.message ?? "")) return "That password is incorrect.";
  return fallback;
}

function BackupCodes({ codes }: { codes: string[] }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-bg-secondary p-4">
      <p className="text-sm font-medium text-text">Backup codes</p>
      <p className="mt-1 text-xs text-muted">Each code works once if you lose your phone. Save them somewhere safe, such as a password manager. They won&rsquo;t be shown again.</p>
      <ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm text-text">
        {codes.map((c) => (
          <li key={c} className="rounded-lg bg-white/[0.04] px-2 py-1.5 text-center">
            {c}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(codes.join("\n")).then(() => setCopied(true));
        }}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-light-blue"
      >
        <Copy className="h-4 w-4" aria-hidden /> {copied ? "Copied" : "Copy all codes"}
      </button>
    </div>
  );
}

/** Turn two-step sign-in (authenticator app) on or off for the signed-in account. */
export function TwoFactorSettings({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState("");
  const [freshCodes, setFreshCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  useEffect(() => {
    if (!setup || setup.qr) return;
    QRCode.toDataURL(setup.uri, { margin: 1, width: 240, color: { dark: "#000000", light: "#ffffff" } })
      .then((qr) => setSetup((s) => (s ? { ...s, qr } : s)))
      .catch(() => undefined);
  }, [setup]);

  async function start() {
    if (!password) return setMsg({ ok: false, message: "Enter your current password." });
    setBusy(true);
    setMsg(null);
    const { data, error } = await authClient.twoFactor.enable({ password }).catch(() => ({ data: null, error: { message: "network" } }));
    setBusy(false);
    if (error || !data || !("totpURI" in data) || !data.totpURI) return setMsg({ ok: false, message: errorText(error, "Couldn't start setup. Please try again.") });
    const secret = new URL(data.totpURI).searchParams.get("secret") ?? "";
    setSetup({ uri: data.totpURI, secret, backupCodes: data.backupCodes ?? [], qr: "" });
    setPassword("");
  }

  async function confirm() {
    if (code.length !== 6) return setMsg({ ok: false, message: "Enter the 6-digit code from the app." });
    setBusy(true);
    setMsg(null);
    const { error } = await authClient.twoFactor.verifyTotp({ code }).catch(() => ({ error: { message: "network" } as { status?: number; message?: string } }));
    setBusy(false);
    if (error) {
      setCode("");
      return setMsg({ ok: false, message: errorText(error, "That code didn't match. Check the time on your phone and use the current code.") });
    }
    setMsg({ ok: true, message: "Two-step sign-in is on. You'll be asked for a code when you sign in on a new device." });
    setFreshCodes(setup?.backupCodes ?? null);
    setSetup(null);
    router.refresh();
  }

  async function disable() {
    if (!password) return setMsg({ ok: false, message: "Enter your current password to turn it off." });
    setBusy(true);
    setMsg(null);
    const { error } = await authClient.twoFactor.disable({ password }).catch(() => ({ error: { message: "network" } as { status?: number; message?: string } }));
    setBusy(false);
    setPassword("");
    if (error) return setMsg({ ok: false, message: errorText(error, "Couldn't turn it off. Please try again.") });
    setMsg({ ok: true, message: "Two-step sign-in is off." });
    router.refresh();
  }

  async function regenerate() {
    if (!password) return setMsg({ ok: false, message: "Enter your current password to make new backup codes." });
    setBusy(true);
    setMsg(null);
    const { data, error } = await authClient.twoFactor.generateBackupCodes({ password }).catch(() => ({ data: null, error: { message: "network" } }));
    setBusy(false);
    setPassword("");
    if (error || !data) return setMsg({ ok: false, message: errorText(error, "Couldn't make new codes. Please try again.") });
    setFreshCodes(data.backupCodes);
    setMsg({ ok: true, message: "New backup codes made. The old ones no longer work." });
  }

  if (setup) {
    return (
      <div className="space-y-5">
        <ol className="space-y-1.5 text-sm text-muted">
          <li>1. Open an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy…).</li>
          <li>2. Scan this QR code, or enter the key by hand.</li>
          <li>3. Type the 6-digit code the app shows.</li>
        </ol>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="grid h-[180px] w-[180px] shrink-0 place-items-center rounded-2xl bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- local data: URL */}
            {setup.qr ? <img src={setup.qr} alt="QR code for your authenticator app" width={164} height={164} /> : null}
          </div>
          <div className="min-w-0 text-sm">
            <p className="text-muted">Setup key</p>
            <p className="mt-1 break-all font-mono text-text">{setup.secret}</p>
          </div>
        </div>
        <BackupCodes codes={setup.backupCodes} />
        <Field label="Code from the app" htmlFor="tf-setup-code">
          <Input
            id="tf-setup-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-12 text-center font-mono text-xl tracking-[0.4em]"
          />
        </Field>
        <FormMessage ok={msg?.ok} message={msg?.message} />
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => void confirm()} loading={busy}>
            Turn on two-step sign-in
          </Button>
          <Button type="button" variant="secondary" onClick={() => setSetup(null)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-sm">
        <ShieldCheck className={enabled ? "h-4 w-4 text-success" : "h-4 w-4 text-muted"} aria-hidden />
        <span className={enabled ? "text-text" : "text-muted"}>{enabled ? "On. New devices need a code from your authenticator app." : "Off. Anyone with your password can sign in."}</span>
      </p>
      {freshCodes && <BackupCodes codes={freshCodes} />}
      <Field label="Current password" htmlFor="tf-password">
        <PasswordInput id="tf-password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <FormMessage ok={msg?.ok} message={msg?.message} />
      {enabled ? (
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={() => void regenerate()} loading={busy}>
            New backup codes
          </Button>
          <Button type="button" variant="danger" onClick={() => void disable()} loading={busy}>
            Turn off
          </Button>
        </div>
      ) : (
        <Button type="button" onClick={() => void start()} loading={busy}>
          Set up two-step sign-in
        </Button>
      )}
    </div>
  );
}
