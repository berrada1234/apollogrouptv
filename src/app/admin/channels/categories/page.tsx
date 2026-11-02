import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { deleteCategory, saveCategory } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Channel categories" };

export default async function CategoriesPage() {
  await requireRole("ADMIN");
  const categories = await db.channelCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { channels: true } } },
  });

  return (
    <>
      <Link href="/admin/channels" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Channels
      </Link>
      <PageHeader title="Channel categories" description="Categories group the catalog on the public Channels page." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          {categories.length === 0 && <p className="text-sm text-muted">No categories yet.</p>}
          {categories.map((c) => (
            <Card key={c.id}>
              <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <ActionForm action={saveCategory} inline submitLabel="Save" submitVariant="secondary" className="flex-1">
                  <input type="hidden" name="id" value={c.id} />
                  <Input name="name" defaultValue={c.name} aria-label="Name" className="h-9 w-40" required />
                  <Input name="slug" defaultValue={c.slug} aria-label="Slug" className="h-9 w-36" pattern="[a-z0-9-]+" required />
                  <Input name="sortOrder" type="number" defaultValue={c.sortOrder} aria-label="Sort order" className="h-9 w-20" />
                </ActionForm>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{c._count.channels} channels</span>
                  <ActionForm action={deleteCategory} inline submitLabel="Delete" submitVariant="ghost" confirm={`Delete category "${c.name}"?`}>
                    <input type="hidden" name="id" value={c.id} />
                  </ActionForm>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <Card className="h-fit">
          <CardHeader title="New category" />
          <CardBody>
            <ActionForm action={saveCategory} submitLabel="Create category" resetOnSuccess>
              <Field label="Name" htmlFor="cat-name">
                <Input id="cat-name" name="name" required maxLength={120} />
              </Field>
              <Field label="Slug" htmlFor="cat-slug">
                <Input id="cat-slug" name="slug" required pattern="[a-z0-9-]+" maxLength={80} />
              </Field>
              <Field label="Sort order" htmlFor="cat-sort">
                <Input id="cat-sort" name="sortOrder" type="number" defaultValue={0} />
              </Field>
            </ActionForm>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
