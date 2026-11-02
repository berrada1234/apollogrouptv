import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export const getActivePlans = cache(() =>
  db.plan.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { priceCents: "asc" }] }),
);

export const getPublishedFaqs = cache(() =>
  db.faq.findMany({ where: { isPublished: true }, orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
);

export async function getApprovedReviews({ take = 12, skip = 0 } = {}) {
  const [reviews, total, aggregate] = await Promise.all([
    db.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true,
        rating: true,
        title: true,
        body: true,
        isVerified: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    }),
    db.review.count({ where: { status: "APPROVED" } }),
    db.review.aggregate({ where: { status: "APPROVED" }, _avg: { rating: true } }),
  ]);
  return { reviews, total, average: aggregate._avg.rating };
}

/** Count of approved reviews per star rating, 5 → 1. */
export async function getRatingDistribution() {
  const rows = await db.review.groupBy({ by: ["rating"], where: { status: "APPROVED" }, _count: { _all: true } });
  return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: rows.find((r) => r.rating === stars)?._count._all ?? 0 }));
}

/** Public display name: first name + last initial, never the email. */
export function displayName(name: string) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
}

export const getChannelCategories = cache(() =>
  db.channelCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, slug: true, name: true, _count: { select: { channels: { where: { isActive: true } } } } },
  }),
);

export async function searchChannels({
  q,
  category,
  page,
  pageSize = 24,
}: {
  q?: string;
  category?: string;
  page: number;
  pageSize?: number;
}) {
  const where: Prisma.ChannelWhereInput = {
    isActive: true,
    ...(q ? { OR: [{ name: { contains: q } }, { description: { contains: q } }] } : {}),
    ...(category ? { category: { slug: category } } : {}),
  };
  const [channels, total] = await Promise.all([
    db.channel.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { name: true, slug: true } } },
    }),
    db.channel.count({ where }),
  ]);
  return { channels, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}
