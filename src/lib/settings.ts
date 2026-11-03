import "server-only";
import { cache } from "react";
import { z } from "zod";
import { db } from "@/lib/db";

const url = z.union([z.literal(""), z.url({ protocol: /^https?$/ })]);

export const settingsSchemas = {
  general: z.object({
    brandName: z.string().trim().min(2).max(80),
    tagline: z.string().trim().max(160),
    supportEmail: z.union([z.literal(""), z.email()]),
    supportPhone: z.string().trim().max(40),
    supportHours: z.string().trim().max(120),
    // International format digits only, e.g. 15551234567 — enables WhatsApp buttons.
    whatsapp: z.union([z.literal(""), z.string().trim().regex(/^\d{7,15}$/, "Digits only, with country code")]),
    address: z.string().trim().max(240),
  }),
  social: z.object({
    x: url,
    facebook: url,
    instagram: url,
    youtube: url,
    telegram: url,
  }),
  seo: z.object({
    defaultTitle: z.string().trim().min(5).max(70),
    defaultDescription: z.string().trim().min(20).max(170),
    googleSiteVerification: z.string().trim().max(120),
  }),
  referral: z.object({
    // Rewards are never advertised while `enabled` is false.
    enabled: z.boolean(),
    rewardDescription: z.string().trim().max(240),
    qualifyingRule: z.string().trim().max(500),
  }),
  apps: z.object({
    // App-wide details shown on Apps & Guides. Blank values are simply hidden.
    appVersion: z.string().trim().max(20).default(""),
    releaseNotes: z.string().trim().max(2000).default(""),
    platforms: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(60),
          verified: z.boolean(),
          downloadUrl: url,
          instructions: z.string().trim().max(2000),
          method: z.string().trim().max(80).default(""),
          downloadLabel: z.string().trim().max(40).default(""),
          copyLabel: z.string().trim().max(40).default(""),
          copyValue: z.string().trim().max(200).default(""),
        }),
      )
      .max(20),
  }),
  legal: z.object({
    // Policies stay marked “draft” and noindex until the owner approves them here.
    approved: z.boolean(),
    lastUpdated: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
    entityName: z.string().trim().max(160),
    entityAddress: z.string().trim().max(300),
    governingLaw: z.string().trim().max(120),
    officialDomain: z.string().trim().max(120),
    refundTerms: z.string().trim().max(4000),
    dmcaAgentName: z.string().trim().max(160),
    dmcaAgentEmail: z.union([z.literal(""), z.email()]),
    dmcaAgentAddress: z.string().trim().max(300),
  }),
  // Homepage hero claims. The owner is responsible for keeping these true; blank hides an item.
  highlights: z.object({
    moneyBackDays: z.union([z.literal(""), z.string().trim().regex(/^\d{1,3}$/, "Days as a number, e.g. 7")]),
    liveChannels: z.string().trim().max(20),
    moviesShows: z.string().trim().max(20),
  }),
  notifications: z.object({
    adminEmail: z.union([z.literal(""), z.email()]),
    notifyOnNewTicket: z.boolean(),
    notifyOnNewReview: z.boolean(),
  }),
} as const;

export type SettingsKey = keyof typeof settingsSchemas;
export type Settings = { [K in SettingsKey]: z.infer<(typeof settingsSchemas)[K]> };

export const defaultSettings: Settings = {
  general: {
    brandName: "Apollo Group TV",
    tagline: "Your entertainment, organized.",
    supportEmail: "",
    supportPhone: "",
    supportHours: "",
    whatsapp: "",
    address: "",
  },
  social: { x: "", facebook: "", instagram: "", youtube: "", telegram: "" },
  seo: {
    defaultTitle: "Apollo Group TV — Digital Entertainment Platform",
    defaultDescription:
      "Flexible plans, an organized channel catalog, multi-device apps and responsive support from Apollo Group TV.",
    googleSiteVerification: "",
  },
  referral: { enabled: false, rewardDescription: "", qualifyingRule: "" },
  apps: { appVersion: "", releaseNotes: "", platforms: [] },
  highlights: { moneyBackDays: "7", liveChannels: "22,000+", moviesShows: "90,000+" },
  notifications: { adminEmail: "", notifyOnNewTicket: false, notifyOnNewReview: false },
  legal: {
    approved: false,
    lastUpdated: "",
    entityName: "",
    entityAddress: "",
    governingLaw: "",
    officialDomain: "",
    refundTerms: "",
    dmcaAgentName: "",
    dmcaAgentEmail: "",
    dmcaAgentAddress: "",
  },
};

/** Reads all settings once per request, falling back to defaults per key. */
export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await db.siteSetting.findMany();
  const result: Settings = structuredClone(defaultSettings);
  for (const row of rows) {
    const key = row.key as SettingsKey;
    if (!(key in settingsSchemas)) continue;
    const parsed = settingsSchemas[key].safeParse({ ...defaultSettings[key], ...(row.value as object) });
    if (parsed.success) (result as Record<SettingsKey, unknown>)[key] = parsed.data;
  }
  return result;
});
