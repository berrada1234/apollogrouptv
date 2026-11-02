"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import type { ActionState } from "@/lib/action-state";
import { CONTACT_TOPICS, contactSchema } from "@/lib/validators";

type Values = z.input<typeof contactSchema>;

export function ContactForm({ defaultName = "", defaultEmail = "" }: { defaultName?: string; defaultEmail?: string }) {
  const [result, setResult] = useState<ActionState | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    mode: "onTouched",
    resolver: zodResolver(contactSchema),
    defaultValues: { name: defaultName, email: defaultEmail, topic: "General question", subject: "", message: "", website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const res = await sendContactMessage(values).catch(() => ({ ok: false, message: "We couldn't reach the server. Please try again." }));
    setResult(res);
    if (res.ok) reset({ name: defaultName, email: defaultEmail, topic: "General question", subject: "", message: "", website: "" });
  });

  if (result?.ok) {
    return (
      <div className="rounded-lg border border-success/30 bg-success/5 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden />
        <p className="mt-3 font-display text-lg font-semibold text-text">Message sent</p>
        <p className="mt-1 text-sm text-muted">{result.message}</p>
        <Button variant="secondary" size="sm" className="mt-5" onClick={() => setResult(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="c-name" error={errors.name?.message}>
          <Input id="c-name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>
        <Field label="Email address" htmlFor="c-email" error={errors.email?.message}>
          <Input id="c-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
        <Field label="Topic" htmlFor="c-topic">
          <Select id="c-topic" {...register("topic")}>
            {CONTACT_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Subject" htmlFor="c-subject" error={errors.subject?.message}>
          <Input id="c-subject" maxLength={160} aria-invalid={!!errors.subject} {...register("subject")} />
        </Field>
      </div>
      <Field label="Message" htmlFor="c-message" error={errors.message?.message} hint="For setup problems, include your device model and what you see on screen.">
        <Textarea id="c-message" rows={6} maxLength={5000} aria-invalid={!!errors.message} {...register("message")} />
      </Field>
      {/* Honeypot — hidden from people and assistive tech */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="c-website">Website</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <FormMessage ok={false} message={result && !result.ok ? result.message : undefined} />
      <Button type="submit" loading={isSubmitting}>
        Send message
      </Button>
      <p className="text-xs text-subtle">
        We use your details only to reply. See our{" "}
        <Link href="/privacy-policy" className="text-accent hover:text-light-blue">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
