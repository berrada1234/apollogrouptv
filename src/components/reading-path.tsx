import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The customer journey as an ordered reading path, shown on every page that belongs to it.
 * Each step links to the page that answers the next question a new customer usually has.
 */
export const readingPath = [
  { href: "/blog/what-is-iptv", label: "Understand IPTV", title: "What IPTV is and how it works" },
  { href: "/blog/how-to-get-apollo-tv", label: "Get started", title: "How to get Apollo TV" },
  { href: "/blog/apollo-tv-downloader-code", label: "Install", title: "Install with the Downloader code" },
  { href: "/blog/xtream-codes-login", label: "Sign in", title: "Your login details explained" },
  { href: "/blog/how-to-update-apollo-group-tv", label: "Keep it updated", title: "How to update Apollo Group TV" },
  { href: "/blog/is-apollo-tv-down", label: "Fix problems", title: "Is Apollo TV down? What to check" },
  { href: "/apollo-group-tv-renewal", label: "Renew", title: "Renew your subscription" },
] as const;

export function ReadingPath({ current }: { current: string }) {
  const i = readingPath.findIndex((s) => s.href === current);
  if (i < 0) return null;
  const prev = readingPath[i - 1];
  const next = readingPath[i + 1];

  return (
    <nav aria-labelledby="reading-path" className="glass mt-12 rounded-[20px] p-5 sm:p-6">
      <p id="reading-path" className="text-sm font-semibold text-text">
        Apollo Group TV, step by step <span className="font-normal text-subtle">· step {i + 1} of {readingPath.length}</span>
      </p>
      <ol className="mt-4 flex flex-wrap gap-2">
        {readingPath.map((s, n) => (
          <li key={s.href}>
            <Link
              href={s.href}
              aria-current={n === i ? "step" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                n === i ? "border-transparent bg-[image:var(--spectrum)] text-on-primary" : "border-border text-muted hover:border-accent/40 hover:text-text",
              )}
            >
              <span className="tabular-nums">{n + 1}</span> {s.label}
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={prev.href} className="group rounded-[14px] border border-border p-4 transition-colors hover:border-accent/40">
            <span className="flex items-center gap-1.5 text-xs text-subtle">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous step
            </span>
            <span className="mt-1 block text-sm font-semibold text-text group-hover:text-light-blue">{prev.title}</span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link href={next.href} className="group rounded-[14px] border border-border p-4 text-right transition-colors hover:border-accent/40">
            <span className="flex items-center justify-end gap-1.5 text-xs text-subtle">
              Next step <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="mt-1 block text-sm font-semibold text-text group-hover:text-light-blue">{next.title}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
