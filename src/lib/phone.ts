/** Optional phone / WhatsApp number from sign-up: digits with an optional leading +, 7 to 15 digits. */
export const PHONE_PATTERN = /^\+?[0-9][0-9 ()\-.]{5,22}$/;

/** Normalises to "+15551234567" style, or null when the value isn't a plausible phone number. */
export function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || !PHONE_PATTERN.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return `${trimmed.startsWith("+") || trimmed.startsWith("00") ? "+" : ""}${digits.replace(/^00/, "")}`;
}

/** wa.me needs the international number without "+". */
export function whatsappLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
