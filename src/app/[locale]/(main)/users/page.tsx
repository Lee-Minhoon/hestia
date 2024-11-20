import { DataTable } from "@/components/ui/data-table";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";

import { columns } from "./columns";

export default async function Users() {
  const data = await db.select().from(users);

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
