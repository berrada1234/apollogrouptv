import { cn, humanize } from "@/lib/utils";

const tones = {
  neutral: { box: "border-border-strong bg-inset text-muted", dot: "bg-subtle" },
  blue: { box: "border-primary/35 bg-primary/10 text-light-blue", dot: "bg-accent" },
  success: { box: "border-success/35 bg-success/10 text-success", dot: "bg-success" },
  warning: { box: "border-warning/35 bg-warning/10 text-warning", dot: "bg-warning" },
  error: { box: "border-error/35 bg-error/10 text-error", dot: "bg-error" },
};

export type Tone = keyof typeof tones;

export function Badge({
  tone = "neutral",
  dot,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone].box,
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", tones[tone].dot)} aria-hidden />}
      {children}
    </span>
  );
}

const statusTones: Record<string, Tone> = {
  ACTIVE: "success",
  APPROVED: "success",
  SUCCEEDED: "success",
  PAID: "success",
  RESOLVED: "success",
  REWARDED: "success",
  ISSUED: "success",
  QUALIFIED: "blue",
  IN_PROGRESS: "blue",
  OPEN: "blue",
  PENDING: "warning",
  PENDING_CONFIRMATION: "blue",
  UNDERPAID: "warning",
  PAST_DUE: "warning",
  WAITING_ON_CUSTOMER: "warning",
  PARTIALLY_REFUNDED: "warning",
  SUSPENDED: "error",
  REJECTED: "error",
  FAILED: "error",
  CANCELED: "neutral",
  EXPIRED: "neutral",
  CLOSED: "neutral",
  REFUNDED: "neutral",
  INACTIVE: "neutral",
  ADMIN: "blue",
  SUPPORT: "blue",
  USER: "neutral",
  URGENT: "error",
  HIGH: "warning",
  NORMAL: "neutral",
  LOW: "neutral",
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <Badge tone={statusTones[status] ?? "neutral"} dot>
      {label ?? humanize(status)}
    </Badge>
  );
}
