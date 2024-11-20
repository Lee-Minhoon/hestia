import { DataTable } from "@/components/ui/data-table";
import db from "@/lib/db";
import { withSorting } from "@/lib/db/query-helpers";
import { users } from "@/lib/db/schema";

import { columns } from "./columns";

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{ sortBy?: string }>;
}) {
  const { sortBy } = await searchParams;

  const data = await withSorting(
    db.select().from(users).$dynamic(),
    users,
    sortBy
  ).execute();

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
