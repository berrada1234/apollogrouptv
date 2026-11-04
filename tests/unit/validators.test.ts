import { describe, expect, it } from "vitest";
import {
  changePasswordSchema,
  createAccountSchema,
  faqSchema,
  passwordSchema,
  planSchema,
  reviewSchema,
  signInSchema,
  ticketSchema,
} from "@/lib/validators";

describe("passwordSchema", () => {
  it("accepts a strong password", () => {
    expect(passwordSchema.safeParse("Correct-Horse9").success).toBe(true);
  });
  it.each([
    ["short", "Ab1"],
    ["no uppercase", "lowercase123"],
    ["no lowercase", "UPPERCASE123"],
    ["no number", "NoNumbersHere"],
  ])("rejects a password with %s", (_, pw) => {
    expect(passwordSchema.safeParse(pw).success).toBe(false);
  });
  it("rejects passwords over 128 characters", () => {
    expect(passwordSchema.safeParse(`Aa1${"x".repeat(130)}`).success).toBe(false);
  });
});

describe("createAccountSchema", () => {
  const valid = { name: "Jane Doe", email: "Jane@Example.com ", password: "Str0ngPassword", acceptTerms: true };

  it("normalizes email to lowercase and trims it", () => {
    const r = createAccountSchema.parse(valid);
    expect(r.email).toBe("jane@example.com");
  });
  it("rejects a weak password", () => {
    const r = createAccountSchema.safeParse({ ...valid, password: "short" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(["password"]);
  });
  it("requires accepting the terms", () => {
    expect(createAccountSchema.safeParse({ ...valid, acceptTerms: false }).success).toBe(false);
  });
  it("rejects an invalid email", () => {
    expect(createAccountSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("requires a password", () => {
    expect(signInSchema.safeParse({ email: "a@b.co", password: "", rememberMe: true }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("rejects mismatched confirmation", () => {
    const r = changePasswordSchema.safeParse({ currentPassword: "x", newPassword: "NewPassw0rd!", confirmPassword: "nope", revokeOtherSessions: true });
    expect(r.success).toBe(false);
  });
});

describe("reviewSchema", () => {
  it("coerces rating and enforces 1–5", () => {
    expect(reviewSchema.safeParse({ rating: "5", title: "Great", body: "x".repeat(25) }).success).toBe(true);
    expect(reviewSchema.safeParse({ rating: 0, title: "Great", body: "x".repeat(25) }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 6, title: "Great", body: "x".repeat(25) }).success).toBe(false);
  });
  it("requires a meaningful body", () => {
    expect(reviewSchema.safeParse({ rating: 4, title: "Ok", body: "short" }).success).toBe(false);
  });
});

describe("ticketSchema", () => {
  it("does not allow customers to set URGENT priority", () => {
    expect(ticketSchema.safeParse({ subject: "Help please", priority: "URGENT", message: "Something broke today" }).success).toBe(false);
  });
});

describe("planSchema (admin form data)", () => {
  const form = {
    name: "Starter",
    slug: "starter",
    description: "A plan for getting started.",
    price: "12.50",
    currency: "usd",
    interval: "MONTHLY",
    features: "Feature one\n\n  Feature two  \n",
    sortOrder: "1",
    isActive: "on",
  };
  it("parses form strings into typed values", () => {
    const r = planSchema.parse(form);
    expect(r.price).toBe(12.5);
    expect(r.currency).toBe("USD");
    expect(r.features).toEqual(["Feature one", "Feature two"]);
    expect(r.isActive).toBe(true);
    expect(r.highlighted).toBe(false);
  });
  it("rejects slugs with invalid characters", () => {
    expect(planSchema.safeParse({ ...form, slug: "Bad Slug!" }).success).toBe(false);
  });
  it("rejects negative prices", () => {
    expect(planSchema.safeParse({ ...form, price: "-1" }).success).toBe(false);
  });
});

describe("faqSchema", () => {
  it("treats a missing checkbox as unpublished", () => {
    const r = faqSchema.parse({ category: "Billing", question: "How do I pay?", answer: "Through checkout.", sortOrder: "0" });
    expect(r.isPublished).toBe(false);
  });
});
