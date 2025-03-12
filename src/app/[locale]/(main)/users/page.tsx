import { GridControls, TableControls } from "@/components/query-controls";
import { QueryParamKeys } from "@/lib/queryParams";

import UserActions from "./user-actions";
import UserList from "./user-list";
import UserTable from "./user-table";

export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{
    [QueryParamKeys.PageIndex]?: string;
    [QueryParamKeys.PageSize]?: string;
    [QueryParamKeys.SortBy]?: string;
    [QueryParamKeys.Search]?: string;
    [QueryParamKeys.ViewType]?: string;
  }>;
}) {
  const { viewType, ...rest } = await searchParams;

  const isTableView = viewType !== "grid";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <UserActions />
        {isTableView ? <TableControls /> : <GridControls />}
      </div>
      {isTableView ? <UserTable {...rest} /> : <UserList />}
    </div>
  );
}
