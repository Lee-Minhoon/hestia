import { useCallback, useMemo } from "react";

import { OnChangeFn, PaginationState } from "@tanstack/react-table";

import { parsePagination } from "@/lib/validation";

import { useSearchParams } from "./use-search-params";

// https://tanstack.com/table/v8/docs/framework/react/examples/pagination-controlled
export function usePagination() {
  const { searchParams, setSearchParams } = useSearchParams();

  const pagination = useMemo(() => {
    const parsed = parsePagination(Object.fromEntries(searchParams));
    return {
      pageIndex: parsed.pageIndex - 1,
      pageSize: parsed.pageSize,
    };
  }, [searchParams]);

  const onPaginationChange = useCallback<OnChangeFn<PaginationState>>(
    (updaterOrValue) => {
      const newPaginationState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue;

      setSearchParams((searchParams) => {
        searchParams.set(
          "pageIndex",
          (newPaginationState.pageIndex + 1).toString()
        );
        searchParams.set("pageSize", newPaginationState.pageSize.toString());
        return searchParams;
      });
    },
    [setSearchParams, pagination]
  );

  return { pagination, onPaginationChange };
}
