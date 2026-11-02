"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { createTicket, markNotificationsRead, replyToTicket } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import type { ActionState } from "@/lib/action-state";
import { ticketReplySchema, ticketSchema } from "@/lib/validators";

export function NewTicketForm({ defaultSubject = "", defaultMessage = "" }: { defaultSubject?: string; defaultMessage?: string }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionState | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { subject: defaultSubject, priority: "NORMAL", message: defaultMessage },
  });

  const onSubmit = handleSubmit(async (values) => {
    const res = await createTicket(values);
    setResult(res);
    if (res.ok && res.ticketId) router.push(`/dashboard/support/${res.ticketId}`);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
        <Field label="Subject" htmlFor="subject" error={errors.subject?.message}>
          <Input id="subject" maxLength={160} aria-invalid={!!errors.subject} {...register("subject")} />
        </Field>
        <Field label="Priority" htmlFor="priority">
          <Select id="priority" {...register("priority")}>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
          </Select>
        </Field>
      </div>
      <Field label="How can we help?" htmlFor="message" error={errors.message?.message} hint="Include your device model and any error messages you see.">
        <Textarea id="message" rows={7} maxLength={5000} aria-invalid={!!errors.message} {...register("message")} />
      </Field>
      <FormMessage ok={result?.ok} message={result?.message} />
      <Button type="submit" loading={isSubmitting}>
        Submit ticket
      </Button>
    </form>
  );
}

export function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [result, setResult] = useState<ActionState | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof ticketReplySchema>>({ resolver: zodResolver(ticketReplySchema), defaultValues: { ticketId, message: "" } });

  const onSubmit = handleSubmit(async (values) => {
    const res = await replyToTicket(values);
    setResult(res.ok ? null : res);
    if (res.ok) {
      reset({ ticketId, message: "" });
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <input type="hidden" {...register("ticketId")} />
      <Field label="Your reply" htmlFor="reply" error={errors.message?.message}>
        <Textarea id="reply" rows={4} maxLength={5000} aria-invalid={!!errors.message} {...register("message")} />
      </Field>
      <FormMessage ok={result?.ok} message={result?.message} />
      <Button type="submit" loading={isSubmitting}>
        Send reply
      </Button>
    </form>
  );
}

export function MarkAllReadButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <Button
      variant="secondary"
      size="sm"
      loading={pending}
      onClick={async () => {
        setPending(true);
        await markNotificationsRead();
        router.refresh();
        setPending(false);
      }}
    >
      Mark all as read
    </Button>
  );
}
