import { and, count, eq, isNull, like } from "drizzle-orm";

import { DataTable } from "@/components/ui/data-table";
import db from "@/lib/db";
import { withPagination, withSorting } from "@/lib/db/query-helpers";
import { posts, users } from "@/lib/db/schema";
import { QueryParamKeys } from "@/lib/queryParams";
import { paginationSchema } from "@/lib/validation";

import { columns } from "./columns";

interface PostTableProps {
  [QueryParamKeys.PageIndex]?: string;
  [QueryParamKeys.PageSize]?: string;
  [QueryParamKeys.SortBy]?: string;
  [QueryParamKeys.Search]?: string;
}

export default async function PostTable(props: PostTableProps) {
  const { pageIndex, pageSize, search } = paginationSchema.parse(props);

  const condition = and(
    search ? like(posts.title, `%${search}%`) : undefined,
    isNull(posts.deletedAt)
  );

  const qb = db
    .select()
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(condition)
    .$dynamic();

  const [table, sortBy] = (
    props[QueryParamKeys.SortBy] ?? "post_id.desc"
  ).split("_");

  const [column, order] = sortBy.split(".");

  const data = await withPagination(
    withSorting(qb, [
      { table: table === "user" ? users : posts, column, order },
      { table: posts, column: "id", order: "desc" },
    ]),
    pageIndex,
    pageSize
  ).execute();

  const rowCount = (
    await db.select({ count: count() }).from(posts).where(condition)
  )[0].count;

  return <DataTable columns={columns} data={data} rowCount={rowCount} />;
}
