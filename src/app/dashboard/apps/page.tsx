import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, Info, LifeBuoy, MonitorSmartphone, Sparkles, Wrench } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { CopyField } from "@/components/dashboard/copy-field";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { getCurrentSubscription } from "@/components/dashboard/overview";
import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { cn, slugify } from "@/lib/utils";

export const metadata: Metadata = { title: "Apps & Guides" };

const panel = "rounded-[14px] border border-border bg-card shadow-card";

export default async function AppsGuidesPage({ searchParams }: PageProps<"/dashboard/apps">) {
  const user = await requireUser("/dashboard/apps");
  const [settings, subscription, sp] = await Promise.all([getSettings(), getCurrentSubscription(user.id), searchParams]);
  const { appVersion, releaseNotes } = settings.apps;
  // Customers only see devices the owner has verified in Admin → Settings → App platforms.
  const platforms = settings.apps.platforms.filter((p) => p.verified);
  const selected = platforms.find((p) => slugify(p.name) === sp.device) ?? platforms[0];
  const steps = selected?.instructions.split("\n").map((s) => s.trim()).filter(Boolean) ?? [];
  const notes = releaseNotes
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split(/\s+[—-]\s+/);
      return { title, body: rest.join(" — ") };
    });
  const active = subscription?.status === "ACTIVE" || subscription?.status === "PAST_DUE";

  return (
    <>
      <PageHeader title="Apps & Guides" description="Install the Apollo TV app on your devices and sign in with your account." />

      {/* App banner */}
      <section className="relative overflow-hidden rounded-[18px] border border-primary/25 bg-[#07191d] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_100%_0%,rgb(34_211_238/0.18),transparent_70%)]" aria-hidden />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            {appVersion && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-light-blue">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> v{appVersion} · Now available
              </span>
            )}
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">The Apollo TV app</h2>
            <p className="mt-2 max-w-xl text-muted">
              One app for live channels and on-demand viewing. Pick your device below, follow the numbered steps, then sign in with your Apollo Group TV account.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {[
              { k: "Devices", v: platforms.length ? String(platforms.length) : "—" },
              { k: "Login", v: "Your account" },
              { k: "Your pack", v: active ? "Active" : "Not active" },
            ].map((x) => (
              <div key={x.k} className="flex flex-col-reverse bg-card px-3 py-4 text-center">
                <dt className="mt-1 text-xs text-subtle">{x.k}</dt>
                <dd className={cn("font-display text-base font-bold", x.k === "Your pack" && !active ? "text-warning" : "text-text")}>{x.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Login note */}
      <div className="mt-6 flex gap-3 rounded-[14px] border border-border bg-card px-5 py-4 text-sm">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
        <div className="text-muted">
          <p className="font-semibold text-text">Signing in to the app</p>
          <p className="mt-1">
            Use the same email and password you use on this website — there are no separate app credentials. Watching requires an active pack
            {active ? "." : (
              <>
                ; <Link href="/dashboard/plan" className="font-medium text-accent hover:text-light-blue">choose one in Plans &amp; Billing</Link>.
              </>
            )}{" "}
            Install only from the official links on this page or an official app store.
          </p>
        </div>
      </div>

      {platforms.length === 0 || !selected ? (
        <EmptyState
          icon={MonitorSmartphone}
          title="Setup guides are being published"
          description="Official download links and step-by-step instructions appear here for each device once it's verified. Until then, our team will walk you through setup."
          action={<ButtonLink href="/dashboard/support/new">Ask for setup help</ButtonLink>}
          className="mt-6"
        />
      ) : (
        <>
          {/* Device picker */}
          <nav aria-label="Pick your device" className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-text">Pick your device</h2>
              {appVersion && <p className="text-xs text-subtle">Latest version v{appVersion}</p>}
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {platforms.map((p) => {
                const on = p === selected;
                return (
                  <li key={p.name}>
                    <Link
                      href={`/dashboard/apps?device=${slugify(p.name)}`}
                      scroll={false}
                      aria-current={on ? "page" : undefined}
                      className={cn(
                        "block rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        on ? "border-primary bg-primary/15 text-light-blue" : "border-border bg-card text-muted hover:border-border-strong hover:text-text",
                      )}
                    >
                      {p.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Selected device */}
          <section aria-labelledby="device-heading" className={cn(panel, "mt-5 p-6 sm:p-8")}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 id="device-heading" className="font-display text-xl font-bold text-text">
                  {selected.name}
                </h3>
                {(selected.method || appVersion) && (
                  <p className="mt-1 text-sm text-muted">{[selected.method, appVersion && `v${appVersion}`].filter(Boolean).join(" · ")}</p>
                )}
              </div>
              {selected.downloadUrl && (
                <a href={selected.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-primary-hover">
                  <Download className="h-4 w-4" aria-hidden /> {selected.downloadLabel || "Download"}
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                </a>
              )}
            </div>

            {selected.copyLabel && selected.copyValue && (
              <div className="mt-6 max-w-md">
                <CopyField label={selected.copyLabel} value={selected.copyValue} />
              </div>
            )}

            {steps.length > 0 ? (
              <ol className="mt-8 space-y-5">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 font-display text-sm font-bold text-accent">{i + 1}</span>
                    <p className="pt-1 text-sm leading-6 text-muted">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-6 text-sm text-muted">Step-by-step instructions for this device are being written. Our team can help in the meantime.</p>
            )}

            <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6 text-sm">
              <Link href={`/guides/${slugify(selected.name)}`} className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-light-blue">
                Full {selected.name} guide <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </section>
        </>
      )}

      {/* What's new */}
      {notes.length > 0 && (
        <section aria-labelledby="notes-heading" className="mt-8">
          <h2 id="notes-heading" className="font-display text-lg font-bold text-text">
            What&apos;s new{appVersion ? ` in v${appVersion}` : ""}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {notes.map((n) => (
              <li key={n.title} className={cn(panel, "p-5")}>
                <p className="font-semibold text-text">{n.title}</p>
                {n.body && <p className="mt-1 text-sm leading-6 text-muted">{n.body}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Help */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/guides/troubleshooting" className={cn(panel, "group flex gap-4 p-5 hover:border-primary/30")}>
          <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <span>
            <span className="block font-semibold text-text group-hover:text-light-blue">App won&apos;t sign in or keeps buffering?</span>
            <span className="mt-1 block text-sm text-muted">Work through the troubleshooting checklist — most issues are fixed in a few minutes.</span>
          </span>
        </Link>
        <Link href="/dashboard/support/new" className={cn(panel, "group flex gap-4 p-5 hover:border-primary/30")}>
          <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <span>
            <span className="block font-semibold text-text group-hover:text-light-blue">Device not listed?</span>
            <span className="mt-1 block text-sm text-muted">Open a ticket with your device model and we&apos;ll tell you honestly whether it works.</span>
          </span>
        </Link>
      </section>
    </>
  );
}
