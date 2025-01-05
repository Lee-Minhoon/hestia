import { count, like } from "drizzle-orm";

import { DataTable } from "@/components/ui/data-table";
import db from "@/lib/db";
import { withPagination, withSorting } from "@/lib/db/query-helpers";
import { users } from "@/lib/db/schema";
import { paginationSchema } from "@/lib/validation";

import { columns } from "./columns";

interface UserTableProps {
  pageIndex?: string;
  pageSize?: string;
  sortBy?: string;
  search?: string;
}

export default async function UserTable({
  sortBy,
  search,
  ...rest
}: UserTableProps) {
  const { pageIndex, pageSize } = paginationSchema.parse(rest);

  const condition = search ? like(users.name, `%${search}%`) : undefined;

  const qb = db.select().from(users).where(condition).$dynamic();

  const data = await withPagination(
    withSorting(qb, users, sortBy ?? "id.desc"),
    pageIndex,
    pageSize
  ).execute();

  const rowCount = (
    await db.select({ count: count() }).from(users).where(condition)
  )[0].count;

  return <DataTable columns={columns} data={data} rowCount={rowCount} />;
}
