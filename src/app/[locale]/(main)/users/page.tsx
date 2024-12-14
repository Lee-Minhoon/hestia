import { count, like } from "drizzle-orm";

import { TableControls } from "@/components/controls/table-controls";
import { DataTable } from "@/components/ui/data-table";
import db from "@/lib/db";
import { withPagination, withSorting } from "@/lib/db/query-helpers";
import { users } from "@/lib/db/schema";
import { parsePagination } from "@/lib/validation";

import { columns } from "./columns";
import UserList from "./user-list";
import UserTestSection from "./user-test-section";

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{
    pageIndex?: string;
    pageSize?: string;
    sortBy?: string;
    search?: string;
    viewType?: string;
  }>;
}) {
  const { sortBy, search, viewType, ...rest } = await searchParams;

  const { pageIndex, pageSize } = parsePagination(rest);

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <UserTestSection />
        <TableControls />
      </div>
      {viewType !== "grid" ? (
        <DataTable columns={columns} data={data} rowCount={rowCount} />
      ) : (
        <UserList />
      )}
    </div>
  );
}
