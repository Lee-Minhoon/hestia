import { GridControls, TableControls } from "@/components/query-controls";

import UserList from "./user-list";
import UserTable from "./user-table";
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
  const { viewType, ...rest } = await searchParams;

  const isTableView = viewType !== "grid";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <UserTestSection />
        {isTableView ? <TableControls /> : <GridControls />}
      </div>
      {isTableView ? <UserTable {...rest} /> : <UserList />}
    </div>
  );
}
