import "server-only";
import { z } from "zod";
import { decryptSecret, encryptSecret } from "@/lib/crypto";

/** IPTV login details stored encrypted on a subscription. Only the owner and admins ever see them decrypted. */
export const accessFields = ["iptvUsername", "iptvPassword", "m3uUrl", "magUrl", "xtreamServer", "xtreamUsername", "xtreamPassword"] as const;
export type AccessField = (typeof accessFields)[number];
export type IptvAccess = Record<AccessField, string>;

const urlOrEmpty = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Use a full http:// or https:// address");

export const accessSchema = z.object({
  iptvUsername: z.string().trim().max(120),
  iptvPassword: z.string().trim().max(200),
  m3uUrl: urlOrEmpty,
  magUrl: urlOrEmpty,
  xtreamServer: urlOrEmpty,
  xtreamUsername: z.string().trim().max(120),
  xtreamPassword: z.string().trim().max(200),
});

export const emptyAccess: IptvAccess = { iptvUsername: "", iptvPassword: "", m3uUrl: "", magUrl: "", xtreamServer: "", xtreamUsername: "", xtreamPassword: "" };

export function sealAccess(access: IptvAccess) {
  return encryptSecret(JSON.stringify(access));
}

export function openAccess(sealed: string | null | undefined): IptvAccess | null {
  if (!sealed) return null;
  const plain = decryptSecret(sealed);
  if (!plain) return null;
  const parsed = accessSchema.safeParse(JSON.parse(plain));
  return parsed.success ? parsed.data : null;
}

/** A customer can log in with at least one complete set: Xtream, M3U playlist, or username + password. */
export function hasUsableLogin(a: IptvAccess) {
  return Boolean((a.xtreamServer && a.xtreamUsername && a.xtreamPassword) || a.m3uUrl || a.magUrl || (a.iptvUsername && a.iptvPassword));
}
