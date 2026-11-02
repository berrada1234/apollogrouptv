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
  { icon: Trophy, title: "Live Sports", topics: "Major events · Live coverage · Top competitions" },
  { icon: Flag, title: "UK Sports", topics: "Football · Rugby · Cricket · Tennis · Motorsport" },
  { icon: Flag, title: "US Sports", topics: "American football · Basketball · Baseball · Ice hockey · College sports" },
  { icon: Flag, title: "Canadian Sports", topics: "Ice hockey · Canadian football · Basketball · Soccer" },
  { icon: Flag, title: "European Sports", topics: "Football · Basketball · Cycling · Tennis · Racing" },
  { icon: Goal, title: "Football", topics: "Domestic leagues · Continental cups · International matches" },
  { icon: Swords, title: "Combat Sports", topics: "Boxing · Mixed martial arts · Title fights" },
  { icon: Car, title: "Motorsport", topics: "Open-wheel racing · Motorcycle racing · Rally" },
  { icon: Medal, title: "Tennis", topics: "Men's and women's tours · Major tournaments" },
  { icon: Award, title: "Basketball", topics: "Pro leagues · College games · International play" },
  { icon: Shield, title: "Rugby", topics: "Club rugby · International fixtures · Tournaments" },
  { icon: Timer, title: "Cricket", topics: "Test · One-day · T20 · International matches" },
  { icon: Target, title: "Golf", topics: "Pro tours · Major championships" },
  { icon: Volleyball, title: "More Sports", topics: "Volleyball · Cycling · Athletics · Winter sports" },
  { icon: Earth, title: "Worldwide Sports", topics: "International events · Global competitions" },
  { icon: Satellite, title: "Sports Channels", topics: "Regional · International · Dedicated sports networks" },
  { icon: Flame, title: "Big Events", topics: "Finals · Championships · Playoffs · Special events" },
  { icon: Globe, title: "Multi-Region Coverage", topics: "USA · UK · Canada · Europe · Worldwide" },
];

const strip = ["Football", "Basketball", "Boxing", "MMA", "Tennis", "Rugby", "Cricket", "Motorsport", "Golf", "Ice hockey", "Baseball"];

export function SportsSection({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <section aria-labelledby="sports-heading" className="relative overflow-hidden border-t border-border py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_80%_0%,rgb(59_130_246/0.14),transparent_70%)]" aria-hidden />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow>Live sports</Eyebrow>
            <H id="sports-heading" className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-[2.5rem]">
              Watch Live Sports on Apollo Group TV
            </H>
            <p className="mt-3 font-display text-lg font-medium text-light-blue">Follow every match in HD, Full HD and 4K where available</p>
          </div>
          <p className="leading-relaxed text-muted">
            Catch the big game on the screens you already own. Apollo TV organizes sports channels by sport and by region, so finding the match
            takes seconds — from football and basketball to fight night and race day. Picture quality depends on each channel&apos;s broadcast and your
            connection. Which sports channels and events you can watch depends on licensing in your region, and the channel guide always shows
            current listings.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sports.map((s) => (
            <li key={s.title} className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 shadow-card transition-colors hover:border-accent/40 hover:bg-card-hover">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-accent transition-colors group-hover:bg-primary group-hover:text-white">
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-text">{s.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{s.topics}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-5 rounded-lg border border-primary/25 bg-gradient-to-r from-[#10284a] to-card p-6 shadow-card md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-display text-lg font-semibold text-text">
              <Radio className="h-5 w-5 text-accent" aria-hidden /> Sports streaming on Apollo TV
            </p>
            <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted">
              {strip.map((x, i) => (
                <span key={x}>
                  {x}
                  {i < strip.length - 1 && <span className="ml-2 text-subtle">·</span>}
                </span>
              ))}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <ButtonLink href="/channels">
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
