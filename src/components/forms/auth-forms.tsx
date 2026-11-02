"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { MailCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, FieldError, FormMessage, Input } from "@/components/ui/form";
import { PasswordInput } from "@/components/forms/password-input";
import { PasswordStrength } from "@/components/forms/password-strength";
import { createAccountSchema, forgotPasswordSchema, resetPasswordSchema, signInSchema } from "@/lib/validators";
import { safeRedirect } from "@/lib/utils";

type Msg = { ok: boolean; message: string } | null;

function authErrorMessage(error: { status?: number; message?: string; code?: string } | null | undefined) {
  if (!error) return "Something went wrong. Please try again.";
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (error.code === "EMAIL_NOT_VERIFIED" || (error.status === 403 && /verif/i.test(error.message ?? ""))) {
    return "Please verify your email first. We've sent you a new verification link.";
  }
  if (error.code === "INVALID_EMAIL_OR_PASSWORD") return "Incorrect email or password.";
  return error.message ?? "Something went wrong. Please try again.";
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
    const { error } = await authClient.signIn
      .email({ email: values.email, password: values.password, rememberMe: values.rememberMe })
      .catch(() => ({ error: { message: NETWORK_ERROR } }));
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

export function CreateAccountForm({ referralCode, verifyEmail = true }: { referralCode?: string; /** false only in local testing mode */ verifyEmail?: boolean }) {
  const router = useRouter();
  const [msg, setMsg] = useState<Msg>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof createAccountSchema>>({
    mode: "onTouched",
    resolver: zodResolver(createAccountSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
  });
  const password = useWatch({ control, name: "password" }) ?? "";

  const onSubmit = handleSubmit(async (values) => {
    setMsg(null);
    const { error } = await authClient.signUp
      .email({ name: values.name, email: values.email, password: values.password, callbackURL: "/verify-email?status=done" })
      .catch(() => ({ error: { message: NETWORK_ERROR } }));
    if (error) return setMsg({ ok: false, message: authErrorMessage(error) });
    // Local testing mode signs the new account in immediately — go straight to the dashboard.
    if (!verifyEmail) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }
    setSentTo(values.email);
  });

  if (sentTo) {
    return (
      <div className="rounded-card border border-border bg-card p-6 text-center">
        <MailCheck className="mx-auto h-10 w-10 text-accent" aria-hidden />
        <h2 className="mt-4 font-display text-xl font-semibold text-text">Check your inbox</h2>
        <p className="mt-2 text-sm text-muted">
          If <span className="text-text">{sentTo}</span> can be registered, we’ve sent a verification link to it. Open it to activate your account.
        </p>
        <Link href="/verify-email" className="mt-5 inline-block text-sm text-accent hover:text-light-blue">
          Didn’t get it? Resend the email
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {referralCode && (
        <p className="rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-2.5 text-sm text-light-blue">
          Referral code <span className="font-mono font-semibold">{referralCode}</span> will be applied.
        </p>
      )}
      <Field label="Full name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="name-error" {...register("name")} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="email-error" {...register("email")} />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby="password-error password-rules" {...register("password")} />
        <PasswordStrength value={password} id="password-rules" />
      </Field>
      <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
        <PasswordInput id="confirmPassword" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} aria-describedby="confirmPassword-error" {...register("confirmPassword")} />
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
        Create account
      </Button>
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

export function ResendVerificationForm() {
  const [msg, setMsg] = useState<Msg>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  const onSubmit = handleSubmit(async ({ email }) => {
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL: "/verify-email?status=done" });
    if (error?.status === 429) return setMsg({ ok: false, message: authErrorMessage(error) });
    setMsg({ ok: true, message: "If that account needs verification, a new link has been sent." });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <FormMessage ok={msg?.ok} message={msg?.message} />
      <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
        Resend verification email
      </Button>
    </form>
  );
}
