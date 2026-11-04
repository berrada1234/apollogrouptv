"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, FieldError, FormMessage, Input } from "@/components/ui/form";
import { PasswordInput } from "@/components/forms/password-input";
import { PasswordStrength } from "@/components/forms/password-strength";
import { createAccountSchema, forgotPasswordSchema, resetPasswordSchema, signInSchema } from "@/lib/validators";
import { suggestEmail } from "@/lib/email-typos";
import { OTP_LENGTH, OTP_MINUTES, OTP_RESEND_SECONDS } from "@/lib/otp";
import { safeRedirect } from "@/lib/utils";

type Msg = { ok: boolean; message: string } | null;

function authErrorMessage(error: { status?: number; message?: string; code?: string } | null | undefined) {
  if (!error) return "Something went wrong. Please try again.";
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (error.code === "EMAIL_NOT_VERIFIED" || (error.status === 403 && /verif/i.test(error.message ?? ""))) {
    return "Please verify your email first. We've sent you a new code.";
  }
  if (error.code === "INVALID_EMAIL_OR_PASSWORD") return "Incorrect email or password.";
  if (error.code === "USER_ALREADY_EXISTS" || error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    return "An account with this email already exists. Sign in instead, or reset your password if you’ve forgotten it.";
  }
  if (error.code === "INVALID_OTP") return "That code isn't right. Check the latest email and try again.";
  if (error.code === "OTP_EXPIRED") return "That code has expired. Send a new one below.";
  if (error.code === "TOO_MANY_ATTEMPTS") return "Too many wrong codes. Send a new one below.";
  return error.message ?? "Something went wrong. Please try again.";
}

/** The code entry screen, keeping the email and where to go once it's verified. */
function verifyPath(email: string, next?: string) {
  const qs = new URLSearchParams({ email });
  if (next) qs.set("next", safeRedirect(next));
  return `/verify-email?${qs}`;
}

const NETWORK_ERROR = "We couldn’t reach the server. Check your connection and try again.";

export function SignInForm({ next }: { next?: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Msg>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof signInSchema>>({
    mode: "onTouched",
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMsg(null);
    const { data, error } = await authClient.signIn
      .email({ email: values.email, password: values.password, rememberMe: values.rememberMe })
      .catch(() => ({ data: null, error: { message: NETWORK_ERROR } as AuthError }));
    // Accounts with two-step sign-in still need their authenticator code.
    if (!error && data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
      return router.push(next ? `/two-factor?next=${encodeURIComponent(safeRedirect(next))}` : "/two-factor");
    }
    // Signing in with an unverified email sends a fresh code, so go straight to the code screen.
    if (error && (error.code === "EMAIL_NOT_VERIFIED" || (error.status === 403 && /verif/i.test(error.message ?? "")))) {
      return router.push(verifyPath(values.email, next));
    }
    if (error) return setMsg({ ok: false, message: authErrorMessage(error) });
    router.replace(safeRedirect(next));
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="email-error" {...register("email")} />
      </Field>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-text">
            Password
          </label>
          <Link href="/forgot-password" className="text-sm text-accent hover:text-light-blue">
            Forgot password?
          </Link>
        </div>
        <PasswordInput id="password" autoComplete="current-password" aria-invalid={!!errors.password} aria-describedby="password-error" {...register("password")} />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>
      <Checkbox label="Keep me signed in on this device" {...register("rememberMe")} />
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}

export function CreateAccountForm({
  referralCode,
  verifyEmail = true,
  next,
}: {
  referralCode?: string;
  /** false only in local testing mode */
  verifyEmail?: boolean;
  /** Where to land after sign-up, e.g. the checkout for a pack chosen on the Plans page. */
  next?: string;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<Msg>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof createAccountSchema>>({
    mode: "onTouched",
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: "", email: "", password: "", acceptTerms: false },
  });
  const password = useWatch({ control, name: "password" }) ?? "";
  const email = useWatch({ control, name: "email" }) ?? "";
  // Offered once the field is left, so it doesn't flash while someone is still typing.
  const [emailDone, setEmailDone] = useState(false);
  const suggestion = emailDone ? suggestEmail(email) : null;
  const emailField = register("email");

  const onSubmit = handleSubmit(async (values) => {
    setMsg(null);
    const { error } = await authClient.signUp
      .email({ name: values.name, email: values.email, password: values.password })
      .catch(() => ({ error: { message: NETWORK_ERROR } }));
    if (error) return setMsg({ ok: false, message: authErrorMessage(error) });
    // Local testing mode signs the new account in immediately — go straight on.
    if (!verifyEmail) {
      router.replace(safeRedirect(next));
      router.refresh();
      return;
    }
    router.push(verifyPath(values.email, next));
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {referralCode && (
        <p className="rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-2.5 text-sm text-light-blue">
          Referral code <span className="font-mono font-semibold">{referralCode}</span> will be applied.
        </p>
      )}
      <Field label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" placeholder="e.g. Jordan Smith" aria-invalid={!!errors.name} aria-describedby="name-error" {...register("name")} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby="email-error email-hint"
          {...emailField}
          onBlur={(e) => {
            setEmailDone(true);
            return emailField.onBlur(e);
          }}
        />
        {suggestion ? (
          <p id="email-hint" className="mt-1.5 text-sm text-warning" role="status">
            Did you mean{" "}
            <button
              type="button"
              className="font-semibold underline underline-offset-2 hover:text-text"
              onClick={() => setValue("email", suggestion, { shouldValidate: true })}
            >
              {suggestion}
            </button>
            ?
          </p>
        ) : (
          <p id="email-hint" className="mt-1.5 text-xs text-muted">
            We’ll send your verification code here.
          </p>
        )}
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby="password-error password-rules" {...register("password")} />
        <PasswordStrength value={password} id="password-rules" />
      </Field>
      <div>
        <Checkbox
          label={
            <>
              I agree to the{" "}
              <Link href="/terms-and-conditions" className="text-accent hover:text-light-blue" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-accent hover:text-light-blue" target="_blank">
                Privacy Policy
              </Link>
              .
            </>
          }
          aria-invalid={!!errors.acceptTerms}
          {...register("acceptTerms")}
        />
        <FieldError message={errors.acceptTerms?.message} />
      </div>
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        {verifyEmail ? "Create account and get my code" : "Create account"}
      </Button>
      <p className="text-center text-xs text-muted">No payment is taken now. You choose and pay for a pack after confirming your email.</p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [msg, setMsg] = useState<Msg>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  const onSubmit = handleSubmit(async ({ email }) => {
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    if (error?.status === 429) return setMsg({ ok: false, message: authErrorMessage(error) });
    // Same message whether or not the account exists, to prevent email enumeration.
    setMsg({ ok: true, message: "If an account exists for that email, a reset link is on its way." });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Send reset link
      </Button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Msg>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof resetPasswordSchema>>({
    mode: "onTouched",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" }) ?? "";

  const onSubmit = handleSubmit(async ({ password }) => {
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    if (error) return setMsg({ ok: false, message: "This reset link is invalid or has expired. Please request a new one." });
    setMsg({ ok: true, message: "Password updated. Redirecting to sign in…" });
    setTimeout(() => router.push("/sign-in"), 1500);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="New password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby="password-rules" {...register("password")} />
        <PasswordStrength value={password} id="password-rules" />
      </Field>
      <Field label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <PasswordInput id="confirmPassword" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
      </Field>
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Update password
      </Button>
    </form>
  );
}

type AuthError = { message?: string; status?: number; code?: string };

/**
 * Enter the 6-digit code from the verification email. A correct code verifies the address and signs the
 * customer in, then sends them on to `next` (their chosen pack) or the dashboard.
 */
export function VerifyCodeForm({ email: initialEmail, next }: { email?: string; next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail ?? "");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);
  // Arriving with an email means a code was just sent (sign-up or sign-in), so resending starts on a cooldown.
  const [wait, setWait] = useState(initialEmail ? OTP_RESEND_SECONDS : 0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function verify(otp: string) {
    if (!validEmail) return setMsg({ ok: false, message: "Enter the email you signed up with." });
    if (otp.length !== OTP_LENGTH) return setMsg({ ok: false, message: `Enter the ${OTP_LENGTH}-digit code from the email.` });
    setBusy(true);
    setMsg(null);
    const { error } = await authClient.emailOtp
      .verifyEmail({ email: email.trim(), otp })
      .catch(() => ({ error: { message: NETWORK_ERROR } as AuthError }));
    if (error) {
      setBusy(false);
      setCode("");
      codeRef.current?.focus();
      return setMsg({ ok: false, message: authErrorMessage(error) });
    }
    setMsg({ ok: true, message: "Email verified. Taking you to your account…" });
    router.replace(safeRedirect(next));
    router.refresh();
  }

  async function resend() {
    if (!validEmail) return setMsg({ ok: false, message: "Enter the email you signed up with." });
    setMsg(null);
    const { error } = await authClient.emailOtp
      .sendVerificationOtp({ email: email.trim(), type: "email-verification" })
      .catch(() => ({ error: { message: NETWORK_ERROR } as AuthError }));
    if (error) return setMsg({ ok: false, message: authErrorMessage(error) });
    setWait(OTP_RESEND_SECONDS);
    setCode("");
    codeRef.current?.focus();
    // Same wording whether or not the account exists, to prevent email enumeration.
    setMsg({ ok: true, message: "If that account still needs verifying, a new code is on its way." });
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
      {initialEmail ? (
        <p className="text-sm text-muted">
          Code sent to <span className="font-medium text-text">{initialEmail}</span>.{" "}
          <Link href="/create-account" className="text-accent hover:text-light-blue">
            Wrong email?
          </Link>
        </p>
      ) : (
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
      )}
      <Field label="Verification code" htmlFor="code">
        <Input
          ref={codeRef}
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus={!!initialEmail}
          placeholder={"•".repeat(OTP_LENGTH)}
          maxLength={OTP_LENGTH}
          value={code}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
            setCode(digits);
            // Typing or pasting the last digit submits, so most people never press the button.
            if (digits.length === OTP_LENGTH && !busy) void verify(digits);
          }}
          className="h-14 text-center font-mono text-2xl tracking-[0.5em] placeholder:tracking-[0.5em]"
          aria-describedby="code-help"
        />
        <p id="code-help" className="mt-1.5 text-xs text-muted">
          {OTP_LENGTH} digits, valid for {OTP_MINUTES} minutes. If it isn’t in your inbox, check spam or promotions.
        </p>
      </Field>
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" size="lg" className="w-full" loading={busy}>
        Verify email
      </Button>
      <p className="text-center text-sm text-muted">
        Didn’t get a code?{" "}
        <button
          type="button"
          onClick={() => void resend()}
          disabled={wait > 0}
          className="font-medium text-accent hover:text-light-blue disabled:cursor-not-allowed disabled:text-muted"
        >
          {wait > 0 ? `Send a new code in ${wait}s` : "Send a new code"}
        </button>
      </p>
    </form>
  );
}

/** Second sign-in step: a code from the authenticator app, or one of the saved backup codes. */
export function TwoFactorForm({ next }: { next?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"app" | "backup">("app");
  const [code, setCode] = useState("");
  const [trust, setTrust] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  async function verify(value: string) {
    if (mode === "app" && value.length !== 6) return setMsg({ ok: false, message: "Enter the 6-digit code from your authenticator app." });
    if (mode === "backup" && value.length < 8) return setMsg({ ok: false, message: "Enter one of your backup codes." });
    setBusy(true);
    setMsg(null);
    const call =
      mode === "app"
        ? authClient.twoFactor.verifyTotp({ code: value, trustDevice: trust })
        : authClient.twoFactor.verifyBackupCode({ code: value, trustDevice: trust });
    const { error } = await call.catch(() => ({ error: { message: NETWORK_ERROR } as AuthError }));
    if (error) {
      setBusy(false);
      setCode("");
      codeRef.current?.focus();
      const code = (error as { code?: string }).code;
      const expired = code === "INVALID_TWO_FACTOR_COOKIE" || /cookie|expired/i.test(error.message ?? "");
      return setMsg({
        ok: false,
        message: expired
          ? "This sign-in has timed out. Go back and sign in again."
          : code === "ACCOUNT_TEMPORARILY_LOCKED" || code === "TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE"
            ? "Too many wrong codes. Wait a few minutes, then sign in again."
            : error.status === 429
            ? "Too many attempts. Please wait a minute and try again."
            : mode === "app"
              ? "That code didn't work. Codes change every 30 seconds, so use the current one."
              : "That backup code didn't work, or it was already used.",
      });
    }
    setMsg({ ok: true, message: "Verified. Taking you to your account…" });
    router.replace(safeRedirect(next));
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
      <Field label={mode === "app" ? "Authenticator code" : "Backup code"} htmlFor="tf-code">
        <Input
          ref={codeRef}
          id="tf-code"
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
            if (digits.length === 6 && !busy) void verify(digits);
          }}
          className={mode === "app" ? "h-14 text-center font-mono text-2xl tracking-[0.5em] placeholder:tracking-[0.5em]" : "h-12 text-center font-mono text-lg"}
        />
      </Field>
      <Checkbox label="Trust this device for 30 days" checked={trust} onChange={(e) => setTrust(e.target.checked)} />
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" size="lg" className="w-full" loading={busy}>
        Verify and sign in
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
        <Link href="/sign-in" className="text-muted hover:text-text">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
