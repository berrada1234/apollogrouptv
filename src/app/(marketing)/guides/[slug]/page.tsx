import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideLayout } from "@/components/guide-layout";
import { generalGuides } from "@/content/guides";
import { getDeviceGuides } from "@/lib/guides";
import { shareImage } from "@/lib/share-image";
import { coverShare } from "@/lib/covers";

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
    openGraph: { ...shareImage, ...coverShare(`/guides/${slug}`, meta.title, "Setup guide"), title: meta.metaTitle, description: meta.description, url: `/guides/${slug}` },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const g = await resolve(slug);
  if (!g) notFound();

  const devices = await getDeviceGuides();
  const related = [
    ...generalGuides.filter((x) => x.slug !== slug).map((x) => ({ href: `/guides/${x.slug}`, title: x.title })),
    ...devices.filter((d) => d.slug !== slug).map((d) => ({ href: `/guides/${d.slug}`, title: d.title })),
  ];
  const asFaq = (items: { q: string; a: string }[]) => items.map((f, i) => ({ id: `${slug}-${i}`, category: "Guide", question: f.q, answer: f.a }));

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
        faqs={asFaq(x.faqs)}
        related={related}
      />
    );
  }

  const d = g.device;
  const p = d.profile;
  const adminSteps = d.instructions
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => ({ title: line, body: "" }));
  // The admin's numbered steps already start with the download; the profile adds the right sign-in step for this device.
  const steps = [...adminSteps, p.finish];

  return (
    <GuideLayout
      slug={slug}
      title={d.title}
      intro={d.intro}
      requirements={p.requirements}
      steps={steps}
      troubleshooting={p.troubleshooting}
      security={p.security}
      faqs={asFaq(p.faqs)}
      related={related}
      download={d.downloadUrl ? { url: d.downloadUrl, label: `Official download for ${d.name}` } : undefined}
    />
  );
}
