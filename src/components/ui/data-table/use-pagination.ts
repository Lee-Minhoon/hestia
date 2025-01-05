import { useCallback, useMemo } from "react";

import { OnChangeFn, PaginationState } from "@tanstack/react-table";

import { useSearchParams } from "@/lib/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";
import { paginationSchema } from "@/lib/validation";

// https://tanstack.com/table/v8/docs/framework/react/examples/pagination-controlled
export function usePagination() {
  const { searchParams, setSearchParams } = useSearchParams();

  const pagination = useMemo(() => {
    const parsed = paginationSchema.parse(Object.fromEntries(searchParams));
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
          QueryParamKeys.PageIndex,
          (newPaginationState.pageIndex + 1).toString()
        );
        searchParams.set(
          QueryParamKeys.PageSize,
          newPaginationState.pageSize.toString()
        );
        return searchParams;
      });
    },
    [setSearchParams, pagination]
  );

  return { pagination, onPaginationChange };
}
