import { and, count, isNull, like } from "drizzle-orm";

import { DataTable } from "@/components/ui/data-table";
import db from "@/lib/db";
import { withPagination, withSorting } from "@/lib/db/query-helpers";
import { users } from "@/lib/db/schema";
import { QueryParamKeys } from "@/lib/queryParams";
import { paginationSchema } from "@/lib/validation";

import { columns } from "./columns";

interface UserTableProps {
  [QueryParamKeys.PageIndex]?: string;
  [QueryParamKeys.PageSize]?: string;
  [QueryParamKeys.SortBy]?: string;
  [QueryParamKeys.Search]?: string;
}

export default async function UserTable({ sortBy, ...rest }: UserTableProps) {
  const { pageIndex, pageSize, search } = paginationSchema.parse(rest);

  const condition = and(
    search ? like(users.name, `%${search}%`) : undefined,
    isNull(users.deletedAt)
  );

  const qb = db.select().from(users).where(condition).$dynamic();

  const [column, order] = (sortBy ?? "id.desc").split(".");

  const data = await withPagination(
    withSorting(qb, [{ table: users, column, order }]),
    pageIndex,
    pageSize
  ).execute();

  const rowCount = (
    await db.select({ count: count() }).from(users).where(condition)
  )[0].count;

  return <DataTable columns={columns} data={data} rowCount={rowCount} />;
}
