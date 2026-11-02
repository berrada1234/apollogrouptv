"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { submitReview } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FormMessage, Input, Textarea } from "@/components/ui/form";
import type { ActionState } from "@/lib/action-state";
import { reviewSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

type Values = z.input<typeof reviewSchema>;

export function ReviewForm() {
  const [result, setResult] = useState<ActionState | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, title: "", body: "" } });
  const rating = Number(useWatch({ control, name: "rating" }));

  const onSubmit = handleSubmit(async (values) => {
    const res = await submitReview(values);
    setResult(res);
    if (res.ok) reset();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium text-text">Your rating</legend>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setValue("rating", n, { shouldValidate: true })}
              className="rounded-md p-1"
            >
              <svg viewBox="0 0 20 20" className={cn("h-7 w-7 transition-colors", n <= rating ? "fill-accent" : "fill-border-strong hover:fill-muted")} aria-hidden>
                <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.1 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.7l5.9-.9L10 1.5z" />
              </svg>
            </button>
          ))}
        </div>
        <FieldError message={errors.rating?.message} />
      </fieldset>
      <Field label="Title" htmlFor="review-title" error={errors.title?.message}>
        <Input id="review-title" maxLength={120} aria-invalid={!!errors.title} {...register("title")} />
      </Field>
      <Field label="Your review" htmlFor="review-body" error={errors.body?.message}>
        <Textarea id="review-body" rows={5} maxLength={2000} aria-invalid={!!errors.body} {...register("body")} />
      </Field>
      <FormMessage ok={result?.ok} message={result?.message} />
      <Button type="submit" loading={isSubmitting}>
        Submit review
      </Button>
    </form>
  );
}
