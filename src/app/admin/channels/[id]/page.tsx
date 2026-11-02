import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChannelForm } from "@/components/admin/channel-form";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Edit channel" };

export default async function EditChannelPage({ params }: PageProps<"/admin/channels/[id]">) {
  await requireRole("ADMIN");
  const { id } = await params;
  const [channel, categories] = await Promise.all([
    db.channel.findUnique({ where: { id } }),
    db.channelCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!channel) notFound();
  return (
    <>
      <Link href="/admin/channels" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All channels
      </Link>
      <PageHeader title={`Edit ${channel.name}`} />
      <Card className="max-w-3xl">
        <CardBody>
          <ChannelForm channel={channel} categories={categories} />
        </CardBody>
      </Card>
    </>
  );
}
