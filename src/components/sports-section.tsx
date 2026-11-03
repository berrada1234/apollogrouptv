import {
  ArrowRight,
  Award,
  Car,
  Earth,
  Flag,
  Flame,
  Globe,
  Goal,
  Medal,
  Radio,
  Satellite,
  Shield,
  Swords,
  Target,
  Timer,
  Trophy,
  Tv,
  Volleyball,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/misc";
import { Eyebrow } from "@/components/home/hero";

/*
 * Sports categories by sport and region. Deliberately generic: no league, team, event or broadcaster
 * names (those are trademarks and imply specific distribution rights). Listings depend on licensing.
 */
const sports: { icon: LucideIcon; title: string; topics: string }[] = [
  {
    icon: Trophy,
    title: "Live Sports",
    topics: "Major events · Live coverage · Top competitions",
  },
  {
    icon: Flag,
    title: "UK Sports",
    topics: "Football · Rugby · Cricket · Tennis · Motorsport",
  },
  {
    icon: Flag,
    title: "US Sports",
    topics:
      "American football · Basketball · Baseball · Ice hockey · College sports",
  },
  {
    icon: Flag,
    title: "Canadian Sports",
    topics: "Ice hockey · Canadian football · Basketball · Soccer",
  },
  {
    icon: Flag,
    title: "European Sports",
    topics: "Football · Basketball · Cycling · Tennis · Racing",
  },
  {
    icon: Goal,
    title: "Football",
    topics: "Domestic leagues · Continental cups · International matches",
  },
  {
    icon: Swords,
    title: "Combat Sports",
    topics: "Boxing · Mixed martial arts · Title fights",
  },
  {
    icon: Car,
    title: "Motorsport",
    topics: "Open-wheel racing · Motorcycle racing · Rally",
  },
  {
    icon: Medal,
    title: "Tennis",
    topics: "Men's and women's tours · Major tournaments",
  },
  {
    icon: Award,
    title: "Basketball",
    topics: "Pro leagues · College games · International play",
  },
  {
    icon: Shield,
    title: "Rugby",
    topics: "Club rugby · International fixtures · Tournaments",
  },
  {
    icon: Timer,
    title: "Cricket",
    topics: "Test · One-day · T20 · International matches",
  },
  { icon: Target, title: "Golf", topics: "Pro tours · Major championships" },
  {
    icon: Volleyball,
    title: "More Sports",
    topics: "Volleyball · Cycling · Athletics · Winter sports",
  },
  {
    icon: Earth,
    title: "Worldwide Sports",
    topics: "International events · Global competitions",
  },
  {
    icon: Satellite,
    title: "Sports Channels",
    topics: "Regional · International · Dedicated sports networks",
  },
  {
    icon: Flame,
    title: "Big Events",
    topics: "Finals · Championships · Playoffs · Special events",
  },
  {
    icon: Globe,
    title: "Multi-Region Coverage",
    topics: "USA · UK · Canada · Europe · Worldwide",
  },
];

const strip = [
  "Football",
  "Basketball",
  "Boxing",
  "MMA",
  "Tennis",
  "Rugby",
  "Cricket",
  "Motorsport",
  "Golf",
  "Ice hockey",
  "Baseball",
];

const defaultCopy = {
  title: "Watch Live Sports on Apollo Group TV",
  tagline: "Follow every match in HD, Full HD and 4K where available",
  intro:
    "Catch the big game on the screens you already own. Apollo TV organizes sports channels by sport and by region, so finding the match takes seconds — from football and basketball to fight night and race day. Picture quality depends on each channel's broadcast and your connection. Which sports channels and events you can watch depends on licensing in your region, and the channel guide always shows current listings.",
};

export function SportsSection({
  headingLevel = "h2",
  limit,
  copy = defaultCopy,
}: {
  headingLevel?: "h2" | "h3";
  limit?: number;
  /** Lets each page describe the same categories in its own words. */
  copy?: { title: string; tagline: string; intro: string };
}) {
  const H = headingLevel;
  const shown = limit ? sports.slice(0, limit) : sports;
  const hidden = sports.length - shown.length;
  return (
    <section
      aria-labelledby="sports-heading"
      className="section-y relative overflow-hidden border-t border-border"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_85%_0%,rgb(34_211_238/0.1),transparent_70%)]"
        aria-hidden
      />
      <Container className="relative">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>Live sports</Eyebrow>
            <H
              id="sports-heading"
              className="mt-3 font-display text-[1.875rem] font-bold leading-[1.15] tracking-[-0.02em] text-text sm:text-4xl lg:text-[2.625rem]"
            >
              {copy.title}
            </H>
            <p className="mt-3 font-display text-lg font-semibold text-accent">
              {copy.tagline}
            </p>
          </div>
          <p className="text-base leading-7 text-muted lg:col-span-6">
            {copy.intro}{" "}
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {shown.map((s) => (
            <li
              key={s.title}
              className="group flex items-center gap-4 rounded-[14px] border border-border bg-card p-4 shadow-card transition-[border-color,background-color] duration-200 hover:border-primary/30 hover:bg-card-hover"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-primary/20 bg-primary/10 text-accent transition-colors group-hover:bg-primary group-hover:text-on-primary">
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-text">{s.title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-muted">
                  {s.topics}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-5 rounded-[14px] border border-primary/20 bg-gradient-to-r from-primary/[0.08] to-card p-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-display text-base font-bold text-text">
              <Radio className="h-5 w-5 text-accent" aria-hidden />{" "}
              {hidden > 0
                ? `Plus ${hidden} more sport and region categories`
                : "Sports streaming on Apollo TV"}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted">
              {strip.map((x, i) => (
                <span key={x}>
                  {x}
                  {i < strip.length - 1 && (
                    <span className="ml-2 text-subtle">·</span>
                  )}
                </span>
              ))}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <ButtonLink href="/channels#sports">
              <Tv className="h-4 w-4" aria-hidden /> Find sports channels
            </ButtonLink>
            <ButtonLink href="/plans" variant="ghost">
              See packs <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
