import { count } from "drizzle-orm";

import { DataTable } from "@/components/ui/data-table";
import db from "@/lib/db";
import { withPagination, withSorting } from "@/lib/db/query-helpers";
import { users } from "@/lib/db/schema";
import { parsePagination } from "@/lib/validation";

import { columns } from "./columns";
import UserTestSection from "./user-test-section";

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{
    pageIndex: string;
    pageSize: string;
    sortBy: string;
  }>;
}) {
  const { pageIndex, pageSize, sortBy } = await searchParams;

  const pagination = parsePagination({
    pageIndex,
    pageSize,
  });

  const data = await withPagination(
    withSorting(db.select().from(users).$dynamic(), users, sortBy),
    pagination.pageIndex,
    pagination.pageSize
  ).execute();

  const rowCount = (await db.select({ count: count() }).from(users))[0].count;

  return (
    <div className="flex flex-col gap-4">
      <UserTestSection />
      <DataTable columns={columns} data={data} rowCount={rowCount} />
    </div>
  );
}
