"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Laptop, Smartphone } from "lucide-react";
import { updatePreferences, updateProfile } from "@/actions/user";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox, Field, FormMessage, Input } from "@/components/ui/form";
import { PasswordInput } from "@/components/forms/password-input";
import type { ActionState } from "@/lib/action-state";
import { changePasswordSchema, preferencesSchema, profileSchema } from "@/lib/validators";
import { formatDateTime } from "@/lib/utils";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionState | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.input<typeof profileSchema>>({ resolver: zodResolver(profileSchema), defaultValues: { name } });

  const onSubmit = handleSubmit(async (values) => {
    const res = await updateProfile(values);
    setResult(res);
    if (res.ok) router.refresh();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label="Email" htmlFor="email" hint="Contact support to change the email on your account.">
        <Input id="email" value={email} readOnly disabled />
      </Field>
      <FormMessage ok={result?.ok} message={result?.message} />
      <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
        Save changes
      </Button>
    </form>
  );
}

export function PreferencesForm(defaults: z.input<typeof preferencesSchema>) {
  const [result, setResult] = useState<ActionState | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.input<typeof preferencesSchema>>({ resolver: zodResolver(preferencesSchema), defaultValues: defaults });

  return (
    <form onSubmit={handleSubmit(async (v) => setResult(await updatePreferences(v)))} className="space-y-4">
      <Checkbox label="Product updates — important changes to plans, apps and the service" {...register("productUpdatesOptIn")} />
      <Checkbox label="Offers and promotions — occasional marketing emails" {...register("marketingOptIn")} />
      <p className="text-xs text-muted">Account and security emails (verification, password resets) are always sent.</p>
      <FormMessage ok={result?.ok} message={result?.message} />
      <Button type="submit" variant="secondary" loading={isSubmitting}>
        Save preferences
      </Button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "", revokeOtherSessions: true },
  });

  const onSubmit = handleSubmit(async (v) => {
    const { error } = await authClient.changePassword({
      currentPassword: v.currentPassword,
      newPassword: v.newPassword,
      revokeOtherSessions: v.revokeOtherSessions,
    });
    if (error) {
      return setMsg({
        ok: false,
        message: error.status === 429 ? "Too many attempts. Please wait and try again." : "Your current password is incorrect.",
      });
    }
    reset();
    setMsg({ ok: true, message: "Password changed successfully." });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Current password" htmlFor="currentPassword" error={errors.currentPassword?.message}>
        <PasswordInput id="currentPassword" autoComplete="current-password" aria-invalid={!!errors.currentPassword} {...register("currentPassword")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
          <PasswordInput id="newPassword" autoComplete="new-password" aria-invalid={!!errors.newPassword} {...register("newPassword")} />
        </Field>
        <Field label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
        </Field>
      </div>
      <Checkbox label="Sign out of all other devices" {...register("revokeOtherSessions")} />
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" loading={isSubmitting}>
        Change password
      </Button>
    </form>
  );
}

type SessionRow = { id: string; token: string; userAgent?: string | null; ipAddress?: string | null; createdAt: Date; updatedAt: Date };

function describeAgent(ua?: string | null) {
  if (!ua) return { label: "Unknown device", mobile: false };
  const mobile = /mobile|android|iphone|ipad/i.test(ua);
  const browser = /edg\//i.test(ua) ? "Edge" : /chrome/i.test(ua) ? "Chrome" : /firefox/i.test(ua) ? "Firefox" : /safari/i.test(ua) ? "Safari" : "Browser";
  const os = /windows/i.test(ua) ? "Windows" : /mac os/i.test(ua) ? "macOS" : /android/i.test(ua) ? "Android" : /iphone|ipad|ios/i.test(ua) ? "iOS" : /linux/i.test(ua) ? "Linux" : "";
  return { label: `${browser}${os ? ` on ${os}` : ""}`, mobile };
}

export function SessionsManager({ currentSessionId }: { currentSessionId: string }) {
  const [sessions, setSessions] = useState<SessionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const { data, error } = await authClient.listSessions();
    if (error) setError("Could not load sessions.");
    else setSessions(data as SessionRow[]);
  }

  useEffect(() => {
    let active = true;
    authClient.listSessions().then(({ data, error }) => {
      if (!active) return;
      if (error) setError("Could not load sessions.");
      else setSessions(data as SessionRow[]);
    });
    return () => {
      active = false;
    };
  }, []);

  async function revoke(token: string) {
    setBusy(token);
    await authClient.revokeSession({ token });
    await load();
    setBusy(null);
  }

  async function revokeOthers() {
    setBusy("others");
    await authClient.revokeOtherSessions();
    await load();
    setBusy(null);
  }

  if (error) return <FormMessage ok={false} message={error} />;
  if (!sessions) return <p className="text-sm text-muted">Loading sessions…</p>;

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-border">
        {sessions.map((s) => {
          const { label, mobile } = describeAgent(s.userAgent);
          const current = s.id === currentSessionId;
          const Icon = mobile ? Smartphone : Laptop;
          return (
            <li key={s.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-muted" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">
                    {label} {current && <Badge tone="success" className="ml-1.5">This device</Badge>}
                  </p>
                  <p className="text-xs text-muted">
                    {s.ipAddress ? `${s.ipAddress} · ` : ""}Last active {formatDateTime(s.updatedAt)}
                  </p>
                </div>
              </div>
              {!current && (
                <Button variant="ghost" size="sm" loading={busy === s.token} onClick={() => revoke(s.token)}>
                  Sign out
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {sessions.length > 1 && (
        <Button variant="secondary" size="sm" loading={busy === "others"} onClick={revokeOthers}>
          Sign out of all other devices
        </Button>
      )}
    </div>
  );
}
