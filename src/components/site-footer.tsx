import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui/button";
import { defaultSettings, getSettings, type Settings } from "@/lib/settings";
import { footerNav, siteConfig } from "@/lib/site";

/* Brand glyphs for the social links (lucide no longer ships brand icons). 24×24, filled. */
const socialIcons: Record<keyof Settings["social"], { label: string; path: React.ReactNode }> = {
  x: { label: "X", path: <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" /> },
  facebook: { label: "Facebook", path: <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.2c-.3-.1-1.4-.2-2.6-.2C11.8 2 10 3.6 10 6.5v2H7.2v3.7H10V22h4v-9.8h3l.4-3.7H14Z" /> },
  instagram: {
    label: "Instagram",
    path: (
      <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 3.9 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-9.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
    ),
  },
  youtube: { label: "YouTube", path: <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" /> },
  telegram: { label: "Telegram", path: <path d="M21.9 4.3 18.7 19.5c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9-8.2c.4-.4-.1-.6-.6-.2L6.3 13.1l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 2.9c.9-.3 1.7.2 1.4 1.4Z" /> },
};

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms of Service" },
  { href: "/refund-policy", label: "Refund Policy" },
];

async function loadSettings(): Promise<Settings> {
  // The footer must render even if the database is briefly unreachable.
  try {
    return await getSettings();
  } catch {
    return defaultSettings;
  }
}

export async function SiteFooter() {
  const { general, social, legal } = await loadSettings();
  const address = general.address || legal.entityAddress;
  const socials = (Object.keys(socialIcons) as (keyof Settings["social"])[]).filter((k) => social[k]);

  const contact = [
    general.supportEmail && { icon: Mail, label: general.supportEmail, href: `mailto:${general.supportEmail}` },
    general.whatsapp && { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${general.whatsapp}`, external: true },
    general.supportPhone && { icon: Phone, label: general.supportPhone, href: `tel:${general.supportPhone.replace(/[^\d+]/g, "")}` },
    general.supportHours && { icon: Clock, label: general.supportHours },
    address && { icon: MapPin, label: address },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href?: string; external?: boolean }[];

  return (
    <footer className="relative mt-auto overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(70_224_255/0.5),rgb(157_123_255/0.5),transparent)]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(122_162_255/0.12),transparent)]" aria-hidden />

      <div className="footer-cta relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="glass edge-spectrum flex flex-col gap-6 rounded-[24px] px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <p className="font-hero text-xl font-medium tracking-[-0.03em] text-text sm:text-2xl">Ready when you are.</p>
            <p className="mt-2 text-sm text-muted">Create your account, choose a pack and get set up on your own screens.</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/create-account" className={buttonClasses()}>
              Create account
            </Link>
            <Link href="/plans" className={buttonClasses({ variant: "secondary" })}>
              See plans
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr] lg:gap-16">
          <div className="max-w-sm">
            <Logo height={40} />
            <p className="mt-5 text-sm leading-6 text-muted">
              Live channels and an on-demand library on the screens you already own. One-time packs, a guide for every device, and support that answers in writing.
            </p>

            {contact.length > 0 && (
              <ul className="mt-6 space-y-2.5 text-sm" aria-label="Contact">
                {contact.map((c) => (
                  <li key={c.label} className="flex items-start gap-2.5 text-muted">
                    <c.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    {c.href ? (
                      <a href={c.href} className="hover:text-text" {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {c.label}
                      </a>
                    ) : (
                      <span>{c.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/contact" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-light-blue">
              Contact & support <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>

            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2" aria-label="Social media">
                {socials.map((k) => (
                  <li key={k}>
                    <a
                      href={social[k]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${siteConfig.name} on ${socialIcons[k].label}`}
                      className="grid h-10 w-10 place-items-center rounded-full border border-border-strong bg-white/[0.03] text-muted transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:text-text"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                        {socialIcons[k].path}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-6">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-sm font-semibold text-text">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted transition-colors hover:text-text">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 text-xs text-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Only authorized, properly licensed content is listed in our catalog.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
