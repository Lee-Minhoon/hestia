import { and, count, isNull, like } from "drizzle-orm";
import { clamp } from "lodash-es";

import { DataTable } from "@/components/ui/data-table";
import { Paginator } from "@/components/ui/pagination";
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

  const rowCount = (
    await db.select({ count: count() }).from(users).where(condition)
  )[0].count;

  const data = await withPagination(
    withSorting(qb, [{ table: users, column, order }]),
    clamp(pageIndex, 0, Math.ceil(rowCount / pageSize)),
    pageSize
  ).execute();

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} data={data} />
      <Paginator
        pageIndex={pageIndex}
        pageSize={pageSize}
        rowCount={rowCount}
      />
    </div>
  );
}
