import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { toggleChannel } from "@/actions/admin";
import { ActionForm } from "@/components/admin/action-form";
import { ChannelForm } from "@/components/admin/channel-form";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Channels" };
const PAGE_SIZE = 30;

export default async function AdminChannelsPage({ searchParams }: PageProps<"/admin/channels">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const q = param(sp, "q");
  const category = param(sp, "category");
  const page = pageParam(sp);
  const where: Prisma.ChannelWhereInput = {
    ...(q ? { name: { contains: q } } : {}),
    ...(category ? { categoryId: category } : {}),
  };
  const [channels, total, categories] = await Promise.all([
    db.channel.findMany({ where, orderBy: { name: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { category: { select: { name: true } } } }),
    db.channel.count({ where }),
    db.channelCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);

  return (
    <>
      <PageHeader
        title="Channels"
        description={`${total} catalog entries. Only list content you are authorized to offer.`}
        actions={<ButtonLink href="/admin/channels/categories" variant="secondary">Manage categories</ButtonLink>}
      />
      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="Channel name" />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue={category ?? ""}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
      </FilterBar>
      <DataTable head={["Channel", "Category", "Language", "HD", "Status", ""]}>
        {channels.length === 0 ? (
          <EmptyRow colSpan={6}>No channels found.</EmptyRow>
        ) : (
          channels.map((c) => (
            <tr key={c.id}>
              <Td>
                <Link href={`/admin/channels/${c.id}`} className="font-medium text-text hover:text-light-blue">{c.name}</Link>
              </Td>
              <Td className="text-muted">{c.category.name}</Td>
              <Td className="text-muted">{c.language ?? "—"}</Td>
              <Td className="text-muted">{c.isHd ? "Yes" : "No"}</Td>
              <Td><StatusBadge status={c.isActive ? "ACTIVE" : "INACTIVE"} label={c.isActive ? "Published" : "Hidden"} /></Td>
              <Td className="text-right">
                <ActionForm
                  action={toggleChannel}
                  inline
                  submitLabel={c.isActive ? "Hide" : "Publish"}
                  submitVariant="ghost"
                  confirm={c.isActive ? { title: `Hide ${c.name}?`, description: "It will be removed from the public catalog until you publish it again.", tone: "danger" } : undefined}
                >
                  <input type="hidden" name="id" value={c.id} />
                </ActionForm>
              </Td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/channels", sp, p)} />
      <Card className="mt-8 max-w-3xl">
        <CardHeader title="Add a channel" />
        <CardBody>
          {categories.length === 0 ? (
            <p className="text-sm text-muted">
              Create a <Link href="/admin/channels/categories" className="text-accent">category</Link> first.
            </p>
          ) : (
            <ChannelForm categories={categories} />
          )}
        </CardBody>
      </Card>
    </>
  );
}
