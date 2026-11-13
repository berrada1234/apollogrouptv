import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

/** A date `days` from now (negative for the past). */
export function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

/** yyyy-mm-dd for <input type="date">. */
export function isoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export const intervalLabels = {
  MONTHLY: "Monthly",
  QUARTERLY: "Every 3 months",
  SEMIANNUAL: "Every 6 months",
  YEARLY: "Yearly",
  BIENNIAL: "Every 2 years",
  ONE_TIME: "One-time",
} as const;

export const intervalShort = {
  MONTHLY: "/mo",
  QUARTERLY: "/3 mo",
  SEMIANNUAL: "/6 mo",
  YEARLY: "/yr",
  BIENNIAL: "/2 yr",
  ONE_TIME: "",
} as const;

export function humanize(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/** Parses a plan's JSON feature list into a clean string array. */
export function parseFeatures(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Only allow same-site relative redirect targets (prevents open redirects). */
export function safeRedirect(target: string | null | undefined, fallback = "/dashboard") {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  return target;
}
