import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideLayout } from "@/components/guide-layout";
import { generalGuides } from "@/content/guides";
import { getDeviceGuides } from "@/lib/guides";
import { getPublishedFaqs } from "@/lib/queries";

export const dynamic = "force-dynamic";

async function resolve(slug: string) {
  const general = generalGuides.find((g) => g.slug === slug);
  if (general) return { kind: "general" as const, general };
  const device = (await getDeviceGuides()).find((d) => d.slug === slug);
  return device ? { kind: "device" as const, device } : null;
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = await resolve(slug);
  if (!g) return { title: "Guide not found", robots: { index: false } };
  const meta = g.kind === "general" ? g.general : g.device;
  return {
    title: { absolute: meta.metaTitle },
    description: meta.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: { title: meta.metaTitle, description: meta.description, url: `/guides/${slug}` },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const g = await resolve(slug);
  if (!g) notFound();

  const [faqs, devices] = await Promise.all([getPublishedFaqs(), getDeviceGuides()]);
  const related = [
    ...generalGuides.filter((x) => x.slug !== slug).map((x) => ({ href: `/guides/${x.slug}`, title: x.title })),
    ...devices.filter((d) => d.slug !== slug).map((d) => ({ href: `/guides/${d.slug}`, title: d.title })),
  ];
  const pick = (cats: string[]) => faqs.filter((f) => cats.includes(f.category)).slice(0, 4);

  if (g.kind === "general") {
    const x = g.general;
    return (
      <GuideLayout
        slug={slug}
        title={x.title}
        intro={x.intro}
        requirements={x.requirements}
        steps={x.steps}
        troubleshooting={x.troubleshooting}
        security={x.security}
        faqs={pick(x.faqCategories)}
        related={related}
      />
    );
  }

  const d = g.device;
  const adminSteps = d.instructions
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => ({ title: line, body: "" }));
  const steps = [
    ...(d.downloadUrl ? [{ title: "Download the official app", body: `Use the official download link at the top of this guide on your ${d.name}.` }] : []),
    ...adminSteps,
    { title: "Sign in", body: "Open the app and sign in with the email and password of your Apollo Group TV account. Your plan must be active." },
  ];

  return (
    <GuideLayout
      slug={slug}
      title={d.title}
      intro={d.intro}
      requirements={[`A ${d.name} connected to the internet`, "An active Apollo Group TV plan — check [My Plan](/dashboard/plan)", "Your account email and password"]}
      steps={steps}
      troubleshooting={[
        { q: "The app won't install", a: "Make sure you're using the official link above and that the device has enough free storage, then restart and try again." },
        { q: "Sign-in fails", a: "Reset your password on the [Sign in](/sign-in) page and try again. See the [troubleshooting guide](/guides/troubleshooting) for more." },
      ]}
      security={["Install only from the official link on this page.", "Don't share your account password with anyone.", "Remove the app from devices you no longer use and sign them out under Dashboard → Security."]}
      faqs={pick(["Installation & Setup", "App & Playback"])}
      related={related}
      download={d.downloadUrl ? { url: d.downloadUrl, label: `Official download for ${d.name}` } : undefined}
    />
  );
}
