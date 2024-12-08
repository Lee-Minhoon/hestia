import { useCallback, useMemo } from "react";

import { OnChangeFn, SortingState } from "@tanstack/react-table";

import { useSearchParams } from "@/lib/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";

// https://tanstack.com/table/v8/docs/framework/react/examples/query-router-search-params
export function useSorting() {
  const { searchParams, setSearchParams } = useSearchParams();

  const sortBy = useMemo(() => {
    const sortBy = searchParams.get(QueryParamKeys.SortBy);
    if (!sortBy) return [];

    const [id, desc] = sortBy.split(".");
    return [{ id, desc: desc === "desc" }];
  }, [searchParams]);

  const onSortingChange = useCallback<OnChangeFn<SortingState>>(
    (updaterOrValue) => {
      const newSortingState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sortBy)
          : updaterOrValue;

      const sort = newSortingState[0];

      setSearchParams((searchParams) => {
        searchParams.set(
          QueryParamKeys.SortBy,
          `${sort.id}.${sort.desc ? "desc" : "asc"}`
        );
        return searchParams;
      });
    },
    [setSearchParams, sortBy]
  );

  return { sortBy, onSortingChange };
}
