import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { PageHeader } from "@/components/page-header";
import { DataTable, EmptyRow, FilterBar, Td } from "@/components/admin/table";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select } from "@/components/ui/form";
import { Pagination } from "@/components/ui/misc";
import { db } from "@/lib/db";
import { oneOf, pageHref, pageParam, param } from "@/lib/params";
import { requireRole } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Users" };
const PAGE_SIZE = 25;

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  await requireRole("ADMIN");
  const sp = await searchParams;
  const q = param(sp, "q");
  const role = oneOf(param(sp, "role"), ["USER", "SUPPORT", "ADMIN"] as const);
  const status = oneOf(param(sp, "status"), ["ACTIVE", "SUSPENDED"] as const);
  const page = pageParam(sp);

  const where: Prisma.UserWhereInput = {
    ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {}),
    ...(role ? { role } : {}),
    ...(status ? { status } : {}),
  };
  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, name: true, email: true, role: true, status: true, emailVerified: true, createdAt: true, _count: { select: { subscriptions: true } } },
    }),
    db.user.count({ where }),
  ]);

  return (
    <>
      <PageHeader title="Users" description={`${total.toLocaleString()} matching accounts`} />
      <FilterBar>
        <div className="flex-1">
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="Name or email" />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select id="role" name="role" defaultValue={role ?? ""}>
            <option value="">All roles</option>
            <option value="USER">User</option>
            <option value="SUPPORT">Support</option>
            <option value="ADMIN">Admin</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={status ?? ""}>
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </Select>
        </div>
      </FilterBar>
      <DataTable head={["Name", "Email", "Role", "Status", "Verified", "Subscriptions", "Joined"]}>
        {users.length === 0 ? (
          <EmptyRow colSpan={7}>No users match these filters.</EmptyRow>
        ) : (
          users.map((u) => (
            <tr key={u.id} className="hover:bg-card-hover">
              <Td>
                <Link href={`/admin/users/${u.id}`} className="font-medium text-text hover:text-light-blue">
                  {u.name}
                </Link>
              </Td>
              <Td className="text-muted">{u.email}</Td>
              <Td>
                <StatusBadge status={u.role} />
              </Td>
              <Td>
                <StatusBadge status={u.status} />
              </Td>
              <Td className="text-muted">{u.emailVerified ? "Yes" : "No"}</Td>
              <Td className="text-muted">{u._count.subscriptions}</Td>
              <Td className="text-muted">{formatDate(u.createdAt)}</Td>
            </tr>
          ))
        )}
      </DataTable>
      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} total={total} pageSize={PAGE_SIZE} hrefFor={(p) => pageHref("/admin/users", sp, p)} />
    </>
  );
}
