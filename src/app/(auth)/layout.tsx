import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, LifeBuoy, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** What really happens after sign-up, in order. Kept free of database reads: some auth pages are built statically. */
const journey = [
  { t: "Create your account", b: "Name, email and a password. It takes about a minute." },
  { t: "Confirm your email", b: "Enter the 6-digit code we email you." },
  { t: "Choose a pack and pay", b: "One to twelve months, paid once. Nothing renews by itself." },
  { t: "Start watching", b: "Our team activates your pack and you install the app on your device." },
];

const devices = "Fire TV, Android, Windows, Mac, iPhone, iPad and Apple TV";

function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden border-r border-border bg-bg-secondary lg:flex lg:flex-col lg:justify-between lg:gap-10 lg:p-12 xl:p-16">
      <div className="bg-spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <Logo className="relative" height={52} />

      <div className="relative">
        <h2 className="max-w-md font-hero text-3xl font-medium leading-tight tracking-[-0.035em] text-text xl:text-4xl">
          Live TV and on-demand on the screens you already own.
        </h2>
        <p className="mt-4 max-w-md text-muted">One account holds your pack, invoices and support tickets.</p>

        <figure className="mt-8 max-w-md overflow-hidden rounded-[14px] border border-border-strong bg-card shadow-lg">
          <Image
            src="/images/app/apollo-group-tv-app-home.webp"
            alt="The Apollo Group TV app home screen"
            width={1672}
            height={941}
            sizes="(min-width: 1024px) 28rem, 0px"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-border px-4 py-2.5 text-xs text-subtle">The Apollo TV app on a TV screen</figcaption>
        </figure>

        <ol className="mt-8 max-w-md space-y-4">
          {journey.map(({ t, b }, i) => (
            <li key={t} className="flex gap-3.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-xs font-semibold text-accent">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-semibold text-text">{t}</span>
                <span className="block text-sm text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <ul className="relative flex flex-wrap gap-x-6 gap-y-2 text-xs text-subtle">
        <li className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-accent" aria-hidden /> Email-verified accounts
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Check className="h-4 w-4 text-accent" aria-hidden /> {devices}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <LifeBuoy className="h-4 w-4 text-accent" aria-hidden /> Written replies by ticket
        </li>
      </ul>
    </aside>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1fr]">
      <BrandPanel />
      <main id="main" className="relative flex flex-col px-5 py-6 sm:px-10 sm:py-8">
        <div className="bg-spotlight pointer-events-none absolute inset-0 lg:hidden" aria-hidden />
        <div className="relative flex items-center justify-between">
          <Logo className="lg:hidden" height={34} />
          <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to site
          </Link>
        </div>
        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
        <p className="relative text-center text-xs text-subtle">
          By continuing you agree to our{" "}
          <Link href="/terms-and-conditions" className="underline-offset-2 hover:text-muted hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline-offset-2 hover:text-muted hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
