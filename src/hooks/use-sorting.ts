import { useCallback, useMemo } from "react";

import { OnChangeFn, SortingState } from "@tanstack/react-table";

import { useSearchParams } from "./use-search-params";

// https://tanstack.com/table/v8/docs/framework/react/examples/query-router-search-params
export function useSorting() {
  const { searchParams, setSearchParams } = useSearchParams();

  const sortBy = useMemo(() => {
    const sortBy = searchParams.get("sortBy");
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
        searchParams.set("sortBy", `${sort.id}.${sort.desc ? "desc" : "asc"}`);
        return searchParams;
      });
    },
    [setSearchParams, sortBy]
  );

  return { sortBy, onSortingChange };
}
