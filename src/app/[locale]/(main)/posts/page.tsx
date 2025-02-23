import { GridControls, TableControls } from "@/components/query-controls";
import { QueryParamKeys } from "@/lib/queryParams";

import PostList from "./post-list";
import PostTable from "./post-table";
import PostTestSection from "./post-test-section";

export default async function Posts({
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
        <PostTestSection />
        {isTableView ? <TableControls /> : <GridControls />}
      </div>
      {isTableView ? <PostTable {...rest} /> : <PostList />}
    </div>
  );
}
