import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { Apple, Download, Flame, Info, Laptop, LifeBuoy, Mic, MonitorSmartphone, ShieldCheck, Smartphone, Sparkles, Tv, Wrench, Zap, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { CopyField } from "@/components/dashboard/copy-field";
import { RichText } from "@/components/rich-text";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { getCurrentSubscription } from "@/components/dashboard/overview";
import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { cn, slugify } from "@/lib/utils";

export const metadata: Metadata = { title: "Apps & Guides" };

const panel = "rounded-[14px] border border-border bg-card shadow-card";

/** "Label | value" lines → pairs (used for stats, copyable values and players). */
function pairs(text: string) {
  return text
    .split("\n")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter(([a, b]) => a && b)
    .map(([label, value]) => ({ label, value }));
}

function WindowsGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path fill="currentColor" d="M0 0h7.5v7.5H0zM8.5 0H16v7.5H8.5zM0 8.5h7.5V16H0zM8.5 8.5H16V16H8.5z" />
    </svg>
  );
}

function deviceIcon(name: string): LucideIcon | typeof WindowsGlyph {
  const n = name.toLowerCase();
  if (/fire|android\s*tv|google\s*tv/.test(n)) return Flame;
  if (/windows|\bpc\b/.test(n)) return WindowsGlyph;
  if (/mac/.test(n)) return Laptop;
  if (/apple\s*tv|tvos/.test(n)) return Tv;
  if (/iphone|ipad|ios|apple/.test(n)) return Apple;
  if (/android|phone|tablet/.test(n)) return Smartphone;
  return MonitorSmartphone;
}

const noteIcons = [Sparkles, Mic, Zap, ShieldCheck];

export default async function AppsGuidesPage({ searchParams }: PageProps<"/dashboard/apps">) {
  const user = await requireUser("/dashboard/apps");
  const [settings, subscription, sp] = await Promise.all([getSettings(), getCurrentSubscription(user.id), searchParams]);
  const app = settings.apps;
  // Customers only see devices the owner has verified in Admin → Settings → App platforms.
  const platforms = app.platforms.filter((p) => p.verified);
  const selected = platforms.find((p) => slugify(p.name) === sp.device) ?? platforms[0];
  const steps = selected?.instructions.split("\n").map((s) => s.trim()).filter(Boolean) ?? [];
  const copies = selected ? pairs(selected.copyItems) : [];
  const stats = pairs(app.stats).slice(0, 3);
  const players = pairs(app.players);
  const notes = app.releaseNotes
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split(/\s+[—-]\s+/);
      return { title, body: rest.join(" — ") };
    });
  const qrTarget = app.qrUrl || platforms.find((p) => p.downloadUrl)?.downloadUrl || "";
  const qrSvg = qrTarget ? await QRCode.toString(qrTarget, { type: "svg", margin: 1, color: { dark: "#050607", light: "#ffffff" } }) : null;
  const active = subscription?.status === "ACTIVE" || subscription?.status === "PAST_DUE";

  return (
    <>
      <PageHeader title="Apps & Guides" description="Install the Apollo TV app on every screen and sign in with your account." />

      {/* App hero */}
      <section className="relative overflow-hidden rounded-[20px] border border-border bg-[#0a0d11] p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_80%_at_15%_0%,rgb(34_211_238/0.14),transparent_70%)]" aria-hidden />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1.6fr_auto] lg:items-center">
          <div>
            {app.appVersion && (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden /> v{app.appVersion} · Now available
              </span>
            )}
            <Image src="/brand/apollo-logo.webp" alt="Apollo Group TV" width={466} height={96} className="mt-6 h-14 w-auto sm:h-20" priority />
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              {app.appTagline || "One app for live channels and on-demand viewing. Pick your device below, follow the steps, then sign in with your Apollo Group TV account."}
            </p>
            {stats.length > 0 && (
              <dl className="mt-8 grid max-w-xl grid-cols-3 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse">
                    <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle">{s.label}</dt>
                    <dd className="font-display text-2xl font-extrabold text-text sm:text-3xl">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {qrSvg && (
            <div className="hidden w-56 rounded-2xl border border-border bg-card p-4 text-center lg:block">
              {/* Generated server-side from the owner's link; contains no user data. */}
              <div className="overflow-hidden rounded-xl bg-white p-2 [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <p className="mt-3 text-xs leading-5 text-subtle">Scan with your phone to grab the install link</p>
            </div>
          )}
        </div>
      </section>

      {/* Login note */}
      <div className="mt-6 flex gap-3 rounded-[14px] border border-primary/20 bg-primary/[0.05] px-5 py-4 text-sm">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-accent">
          <Info className="h-4 w-4" aria-hidden />
        </span>
        <div className="text-muted">
          <p className="font-semibold text-text">Apollo TV app login</p>
          <p className="mt-1">
            Use the <span className="font-semibold text-text">email and password you created when you signed up</span> — the same ones you use on this website. No separate credentials needed.
            {!active && (
              <>
                {" "}
                Watching needs an active pack —{" "}
                <Link href="/dashboard/plan" className="font-medium text-accent hover:text-light-blue">
                  choose one in Plans &amp; Billing
                </Link>
                .
              </>
            )}
          </p>
          <p className="mt-2 text-xs text-subtle">
            Third-party players (UHF and others) use your separate player login — find it under{" "}
            <Link href="/dashboard/profile#player-login" className="text-accent hover:text-light-blue">
              My Accounts → Player login
            </Link>
            .
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
          <nav aria-label="Pick your device" className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-text">Pick your device</h2>
              {app.appVersion && <p className="text-xs text-subtle">Latest version · v{app.appVersion}</p>}
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {platforms.map((p) => {
                const on = p === selected;
                const Icon = deviceIcon(p.name);
                return (
                  <li key={p.name}>
                    <Link
                      href={`/dashboard/apps?device=${slugify(p.name)}`}
                      scroll={false}
                      aria-current={on ? "page" : undefined}
                      className={cn(
                        "flex h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors",
                        on ? "border-primary bg-primary text-on-primary shadow-[0_10px_30px_-12px_rgb(34_211_238/0.7)]" : "border-border bg-card text-muted hover:border-border-strong hover:text-text",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{p.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Selected device */}
          <section aria-labelledby="device-heading" className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            <div className={cn(panel, "flex flex-col gap-5 p-6")}>
              <div className="flex items-center gap-4">
                {(() => {
                  const Icon = deviceIcon(selected.name);
                  return (
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-inset text-accent">
                      <Icon className="h-6 w-6" />
                    </span>
                  );
                })()}
                <div className="min-w-0">
                  <h3 id="device-heading" className="font-display text-lg font-bold text-text">
                    {selected.name}
                  </h3>
                  {(selected.method || app.appVersion) && (
                    <p className="text-sm text-muted">{[selected.method, app.appVersion && `v${app.appVersion}`].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
              </div>
              {selected.downloadUrl && (
                <a
                  href={selected.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  <Download className="h-4 w-4" aria-hidden /> {selected.downloadLabel || "Download"}
                </a>
              )}
              {copies.map((c) => (
                <CopyField key={c.label} label={c.label} value={c.value} />
              ))}
            </div>

            <div className={cn(panel, "p-6")}>
              {steps.length > 0 ? (
                <ol className="space-y-5">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 font-display text-sm font-bold text-accent">{i + 1}</span>
                      <p className="pt-1 text-sm leading-6 text-muted [&_strong]:text-text">
                        <RichText text={step} />
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted">Step-by-step instructions for this device are being written. Our team can help in the meantime.</p>
              )}
            </div>
          </section>
          <p className="mt-4 text-xs text-subtle">
            Available on <span className="text-muted">{platforms.map((p) => p.name).join(", ")}</span>.
          </p>
        </>
      )}

      {/* What's new */}
      {notes.length > 0 && (
        <section aria-labelledby="notes-heading" className="mt-12">
          <h2 id="notes-heading" className="font-display text-xl font-bold text-text">
            What&apos;s new{app.appVersion && <span className="text-subtle"> in v{app.appVersion}</span>}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {notes.map((n, i) => {
              const Icon = noteIcons[i % noteIcons.length];
              return (
                <li key={n.title} className={cn(panel, "flex gap-4 p-5")}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-primary/20 bg-primary/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-text">{n.title}</p>
                    {n.body && <p className="mt-1 text-sm leading-6 text-muted">{n.body}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Third-party players */}
      {players.length > 0 && (
        <section aria-labelledby="players-heading" className="mt-12">
          <h2 id="players-heading" className="font-display text-xl font-bold text-text">
            Use a different player
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Prefer a third-party app? The Apollo TV app is the recommended way to watch, but these players can also work with your subscription.
          </p>
          <div className="mt-4 rounded-[14px] border border-warning/30 bg-warning/[0.06] px-5 py-4 text-sm text-muted [&_a]:text-warning">
            <RichText
              text={
                app.playersNote ||
                "**These players use your player login** — the username, password and server shown under [My Accounts → Player login](/dashboard/profile). Don't enter your website email and password in them; those are for the Apollo TV app and this site."
              }
            />
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {players.map((pl) => (
              <li key={pl.label} className={cn(panel, "flex flex-col items-center gap-2 p-4 text-center")}>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-inset font-display text-xs font-bold text-muted">
                  {pl.label.replace(/[^A-Za-z0-9 ]/g, " ").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-text">{pl.label}</span>
                <span className="text-xs text-subtle">{pl.value}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Help */}
      <section className="mt-12 grid gap-4 md:grid-cols-2">
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
            <span className="block font-semibold text-text group-hover:text-light-blue">Device not listed or stuck on a step?</span>
            <span className="mt-1 block text-sm text-muted">Open a ticket with your device model and we&apos;ll walk you through it.</span>
          </span>
        </Link>
      </section>
    </>
  );
}
