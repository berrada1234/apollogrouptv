export const REFERRAL_COOKIE = "agtv_ref";

// No 0/O/1/I/L to keep codes easy to read aloud.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateReferralCode(length = 8) {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function isValidReferralCode(code: string) {
  return /^[A-HJ-KM-NP-Z2-9]{6,16}$/.test(code);
}
