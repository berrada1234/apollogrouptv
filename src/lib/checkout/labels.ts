// Customer- and admin-facing names for invoice statuses.
export const invoiceStatusLabels: Record<string, string> = {
  PENDING: "Pending Payment",
  PENDING_CONFIRMATION: "Pending Confirmation",
  PAID: "Paid",
  UNDERPAID: "Underpaid",
  EXPIRED: "Expired",
  CANCELED: "Cancelled",
  FAILED: "Failed",
};

export const invoiceStatuses = [
  "PENDING",
  "PENDING_CONFIRMATION",
  "PAID",
  "UNDERPAID",
  "EXPIRED",
  "CANCELED",
  "FAILED",
] as const;
