"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Two-step Fire OS / Vega OS check. Vega OS models only install Appstore apps, so they can't run the Apollo TV app. */
export function FireTvCheck() {
  const [answer, setAnswer] = useState<"fire" | "vega" | null>(null);

  return (
    <div className="glass edge-spectrum rounded-[20px] p-6 sm:p-7">
      <h3 className="text-lg font-semibold text-text">Will the app install on my Fire TV?</h3>
      <p className="mt-1 text-sm leading-6 text-muted">Newer Fire TV models run Vega OS, which only installs Amazon Appstore apps. Check yours in under a minute.</p>
      <ol className="mt-5 space-y-2 text-sm text-text/90">
        <li>
          <span className="font-semibold text-light-blue">1.</span> On the Fire TV, open <strong>Settings &gt; My Fire TV</strong> (Device &amp; Software on Fire TV smart TVs) <strong>&gt; About</strong>.
        </li>
        <li>
          <span className="font-semibold text-light-blue">2.</span> Look at the software version. What does it say?
        </li>
      </ol>
      <div role="group" aria-label="Software version shown" className="mt-4 grid grid-cols-2 gap-2">
        {(
          [
            ["fire", "It says Fire OS"],
            ["vega", "Vega OS or something else"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={answer === value}
            onClick={() => setAnswer(value)}
            className={cn(
              "rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
              answer === value ? "border-transparent bg-[image:var(--spectrum)] text-on-primary" : "border-border-strong text-muted hover:border-accent/40 hover:text-text",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {answer === "fire" && (
          <p className="mt-4 flex gap-2.5 rounded-[14px] bg-success/10 p-4 text-sm leading-6 text-text">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            <span>
              Good news: your Fire TV can install the Apollo TV app with the Downloader app. Follow the{" "}
              <Link href="/guides/fire-tv-android-tv" className="font-semibold text-accent hover:text-light-blue">
                Fire TV setup guide
              </Link>
              .
            </span>
          </p>
        )}
        {answer === "vega" && (
          <p className="mt-4 flex gap-2.5 rounded-[14px] bg-warning/10 p-4 text-sm leading-6 text-text">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
            <span>
              This model runs Vega OS and can&apos;t install the Apollo TV app. A Fire OS stick or a Google TV device works instead; our guide to the{" "}
              <Link href="/blog/best-firestick-for-iptv" className="font-semibold text-accent hover:text-light-blue">
                best Fire TV Stick for IPTV
              </Link>{" "}
              lists which models to choose.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
