// Pure helpers for subscription screens (shared by admin and customer pages, and unit-tested).

type SubLike = { status: string; currentPeriodEnd: Date | null } | null | undefined;

export type Display = { key: string; label: string };

/** How a subscription (or, before one exists, its invoice) is described to people. */
export function subscriptionDisplay(sub: SubLike, orderStatus?: string | null, now = new Date()): Display {
  if (sub) {
    if (sub.status === "ACTIVE" && sub.currentPeriodEnd && sub.currentPeriodEnd < now) return { key: "EXPIRED", label: "Expired" };
    switch (sub.status) {
      case "ACTIVE":
        return { key: "ACTIVE", label: "Active" };
      case "CANCELED":
        return { key: "CANCELED", label: "Cancelled" };
      case "EXPIRED":
        return { key: "EXPIRED", label: "Expired" };
      case "PAST_DUE":
        return { key: "PAST_DUE", label: "Past due" };
      default:
        return { key: "PENDING_CONFIRMATION", label: "Pending Review" };
    }
  }
  switch (orderStatus) {
    case "PENDING":
      return { key: "PENDING", label: "Pending Payment" };
    case "PENDING_CONFIRMATION":
    case "UNDERPAID":
      return { key: "PENDING_CONFIRMATION", label: "Pending Review" };
    case "CANCELED":
      return { key: "CANCELED", label: "Cancelled" };
    case "EXPIRED":
      return { key: "EXPIRED", label: "Expired" };
    case "FAILED":
      return { key: "FAILED", label: "Failed" };
    default:
      return { key: "NONE", label: "—" };
  }
}

/** "MM/DD/YYYY" → a date at 12:00 UTC (so it never shifts a day across time zones), or null if invalid. */
export function parseUsDate(value: string): Date | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!m) return null;
  const [mm, dd, yyyy] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(Date.UTC(yyyy, mm - 1, dd, 12));
  return d.getUTCFullYear() === yyyy && d.getUTCMonth() === mm - 1 && d.getUTCDate() === dd ? d : null;
}

export function formatUsDate(date: Date | null | undefined) {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}/${date.getUTCFullYear()}`;
}
