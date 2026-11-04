/** Common misspellings of the biggest mailbox domains, mapped to the intended domain. */
const DOMAIN_FIXES: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmaill.com": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.co": "outlook.com",
  "outlook.con": "outlook.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "icloud.co": "icloud.com",
  "iclod.com": "icloud.com",
  "icloud.con": "icloud.com",
};

/** Returns the corrected address when the domain is a known typo, otherwise null. */
export function suggestEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const fix = DOMAIN_FIXES[email.slice(at + 1)];
  return fix ? `${email.slice(0, at)}@${fix}` : null;
}
