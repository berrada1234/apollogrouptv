import { describe, expect, it } from "vitest";
import { stripRich } from "@/components/rich-text";
import { paymentGuides, type PaymentGuide } from "@/content/payment-guides";

const wordCount = (g: PaymentGuide) =>
  [
    ...g.intro,
    ...g.needs,
    ...g.sections.flatMap((s) => [s.intro ?? "", ...s.steps.map((x) => `${x.title} ${x.body} ${x.tip ?? ""} ${x.note ?? ""}`)]),
    ...(g.extras ?? []).flatMap((e) => [...e.paragraphs, ...(e.list ?? [])]),
    ...g.after,
    ...g.faqs.map((f) => `${f.q} ${f.a}`),
  ]
    .join(" ")
    .split(/\s+/).length;

describe("payment guides", () => {
  it("has ten guides with unique slugs, titles and descriptions", () => {
    expect(paymentGuides).toHaveLength(10);
    for (const key of ["slug", "title", "metaTitle", "description"] as const) {
      expect(new Set(paymentGuides.map((g) => g[key])).size).toBe(paymentGuides.length);
    }
  });

  it("keeps search snippets within limits", () => {
    for (const g of paymentGuides) {
      expect(g.metaTitle.length, g.slug).toBeLessThanOrEqual(65);
      expect(g.description.length, g.slug).toBeLessThanOrEqual(160);
    }
  });

  it("links only to other guides that exist", () => {
    const slugs = new Set(paymentGuides.map((g) => g.slug));
    for (const g of paymentGuides) for (const r of g.related) expect(slugs.has(r), `${g.slug} → ${r}`).toBe(true);
  });

  it("is long-form and never repeats a step between guides", () => {
    const seen = new Map<string, string>();
    for (const g of paymentGuides) {
      expect(wordCount(g), g.slug).toBeGreaterThanOrEqual(700);
      for (const step of g.sections.flatMap((s) => s.steps)) {
        const body = stripRich(step.body);
        expect(seen.get(body), `${g.slug} repeats "${body.slice(0, 40)}"`).toBeUndefined();
        seen.set(body, g.slug);
      }
    }
  });
});
