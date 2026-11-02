import type { Metadata } from "next";
import { deleteFaq, moveFaq, saveFaq, toggleFaq } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import type { Faq } from "@prisma/client";

export const metadata: Metadata = { title: "FAQ" };

function FaqFields({ faq, categories }: { faq?: Faq; categories: string[] }) {
  const k = faq?.id ?? "new";
  return (
    <>
      {faq && <input type="hidden" name="id" value={faq.id} />}
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Field label="Category" htmlFor={`cat-${k}`}>
          <Input id={`cat-${k}`} name="category" defaultValue={faq?.category} list="faq-categories" required maxLength={80} />
        </Field>
        <Field label="Order" htmlFor={`ord-${k}`}>
          <Input id={`ord-${k}`} name="sortOrder" type="number" min="0" defaultValue={faq?.sortOrder ?? 0} />
        </Field>
      </div>
      <Field label="Question" htmlFor={`q-${k}`}>
        <Input id={`q-${k}`} name="question" defaultValue={faq?.question} required maxLength={255} />
      </Field>
      <Field label="Answer" htmlFor={`a-${k}`} hint="Link to a page with [link text](/path), e.g. [Plans page](/plans).">
        <Textarea id={`a-${k}`} name="answer" defaultValue={faq?.answer} rows={4} required maxLength={5000} />
      </Field>
      <Checkbox name="isPublished" label="Published" defaultChecked={faq?.isPublished ?? true} />
      <datalist id="faq-categories">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </>
  );
}

export default async function AdminFaqPage() {
  await requireRole("ADMIN");
  const faqs = await db.faq.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] });
  const categories = [...new Set(faqs.map((f) => f.category))];

  return (
    <>
      <PageHeader title="FAQ" description="Questions shown on the FAQ page and in previews across the site." />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          {categories.length === 0 && <p className="text-sm text-muted">No FAQ entries yet.</p>}
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="mb-3 font-display text-lg font-semibold text-text">{cat}</h2>
              <div className="space-y-3">
                {faqs
                  .filter((f) => f.category === cat)
                  .map((f) => (
                    <Card key={f.id}>
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
                          <span className="min-w-0 font-medium text-text">{f.question}</span>
                          <StatusBadge status={f.isPublished ? "ACTIVE" : "PENDING"} label={f.isPublished ? "Published" : "Draft"} />
                        </summary>
                        <div className="space-y-4 border-t border-border px-5 py-4">
                          <ActionForm action={saveFaq} submitLabel="Save">
                            <FaqFields faq={f} categories={categories} />
                          </ActionForm>
                          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                            <ActionForm action={moveFaq} inline submitLabel="Move up" submitVariant="ghost">
                              <input type="hidden" name="id" value={f.id} />
                              <input type="hidden" name="direction" value="up" />
                            </ActionForm>
                            <ActionForm action={moveFaq} inline submitLabel="Move down" submitVariant="ghost">
                              <input type="hidden" name="id" value={f.id} />
                              <input type="hidden" name="direction" value="down" />
                            </ActionForm>
                            <ActionForm action={toggleFaq} inline submitLabel={f.isPublished ? "Unpublish" : "Publish"} submitVariant="secondary">
                              <input type="hidden" name="id" value={f.id} />
                            </ActionForm>
                            <ActionForm action={deleteFaq} inline submitLabel="Delete" submitVariant="danger" confirm="Delete this FAQ entry?">
                              <input type="hidden" name="id" value={f.id} />
                            </ActionForm>
                          </div>
                        </div>
                      </details>
                    </Card>
                  ))}
              </div>
            </section>
          ))}
        </div>
        <Card className="h-fit xl:sticky xl:top-24">
          <CardHeader title="Add a question" />
          <CardBody>
            <ActionForm action={saveFaq} submitLabel="Add FAQ" resetOnSuccess>
              <FaqFields categories={categories} />
            </ActionForm>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
