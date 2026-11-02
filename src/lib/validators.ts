import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters.")
  .max(128, "Use at most 128 characters.")
  .regex(/[a-z]/, "Include a lowercase letter.")
  .regex(/[A-Z]/, "Include an uppercase letter.")
  .regex(/[0-9]/, "Include a number.");

// Trim and lowercase first, then validate — so a stray space doesn't fail validation.
export const emailSchema = z.string().trim().toLowerCase().max(255).pipe(z.email("Enter a valid email address."));
export const nameSchema = z.string().trim().min(2, "Enter your full name.").max(120);

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  rememberMe: z.boolean(),
});

export const createAccountSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v, "You must accept the Terms and Privacy Policy."),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
    revokeOtherSessions: z.boolean(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export const profileSchema = z.object({ name: nameSchema });

export const preferencesSchema = z.object({
  marketingOptIn: z.boolean(),
  productUpdatesOptIn: z.boolean(),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating.").max(5),
  title: z.string().trim().min(3, "Add a short title.").max(120),
  body: z.string().trim().min(20, "Tell us a bit more (at least 20 characters).").max(2000),
});

export const ticketSchema = z.object({
  subject: z.string().trim().min(5, "Add a subject (at least 5 characters).").max(160),
  priority: z.enum(["LOW", "NORMAL", "HIGH"]),
  message: z.string().trim().min(10, "Describe the issue (at least 10 characters).").max(5000),
});

export const ticketReplySchema = z.object({
  ticketId: z.string().min(1),
  message: z.string().trim().min(2, "Write a reply.").max(5000),
});

// ─── Admin ──────────────────────────────────────────────────────────────────

const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

export const planSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes.")
    .max(80),
  description: z.string().trim().min(10).max(1000),
  price: z.coerce.number().min(0).max(100000),
  currency: z.string().trim().toUpperCase().length(3),
  interval: z.enum(["MONTHLY", "QUARTERLY", "SEMIANNUAL", "YEARLY", "ONE_TIME"]),
  features: z
    .string()
    .transform((v) =>
      v
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(160)).max(30)),
  sortOrder: z.coerce.number().int().min(0).max(1000),
  highlighted: checkbox,
  isActive: checkbox,
});

export const channelSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/).max(120),
  description: z.string().trim().max(1000).optional().default(""),
  categoryId: z.string().min(1, "Choose a category."),
  logoUrl: z.union([z.literal(""), z.url({ protocol: /^https$/ }), z.string().regex(/^\/[a-zA-Z0-9/_.-]+$/)]),
  country: z.string().trim().max(64).optional().default(""),
  language: z.string().trim().max(64).optional().default(""),
  isHd: checkbox,
  isActive: checkbox,
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/).max(80),
  sortOrder: z.coerce.number().int().min(0).max(1000),
});

export const faqSchema = z.object({
  id: z.string().optional(),
  category: z.string().trim().min(2).max(80),
  question: z.string().trim().min(5).max(255),
  answer: z.string().trim().min(5).max(5000),
  sortOrder: z.coerce.number().int().min(0).max(1000),
  isPublished: checkbox,
});

export const roleSchema = z.enum(["USER", "SUPPORT", "ADMIN"]);
export const ticketStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "WAITING_ON_CUSTOMER", "RESOLVED", "CLOSED"]);

export const CONTACT_TOPICS = ["General question", "Plans and billing", "Setup help", "Account access", "Copyright", "Other"] as const;

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  topic: z.enum(CONTACT_TOPICS),
  subject: z.string().trim().min(4, "Add a short subject.").max(160),
  message: z.string().trim().min(20, "Please include a few more details (at least 20 characters).").max(5000),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional().default(""),
});
