import { cn, formatDateTime, initials } from "@/lib/utils";

type Message = { id: string; body: string; isStaff: boolean; createdAt: Date; author: { name: string } };

export function TicketThread({ messages, viewer }: { messages: Message[]; viewer: "customer" | "staff" }) {
  return (
    <ol className="space-y-4">
      {messages.map((m) => {
        const mine = viewer === "staff" ? m.isStaff : !m.isStaff;
        return (
          <li key={m.id} className={cn("flex gap-3", mine && "flex-row-reverse")}>
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold",
                m.isStaff ? "bg-primary text-white" : "bg-card-hover text-light-blue",
              )}
              aria-hidden
            >
              {initials(m.author.name)}
            </span>
            <div className={cn("max-w-[85%] rounded-card border px-4 py-3", mine ? "border-primary/40 bg-primary/10" : "border-border bg-card")}>
              <p className="text-xs text-muted">
                <span className="font-medium text-text">{m.isStaff ? `${m.author.name} · Support` : m.author.name}</span> ·{" "}
                {formatDateTime(m.createdAt)}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap break-words text-text/90">{m.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
