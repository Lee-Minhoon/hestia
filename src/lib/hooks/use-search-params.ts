"use client";

import { useCallback } from "react";

import {
  useSearchParams as _useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";

import { buildUrl, toQueryString } from "@/lib/routes";

type Search =
  | string
  | Record<string, string>
  | React.SetStateAction<URLSearchParams>;

function useSearchParams() {
  const searchParams = _useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const setSearchParams = useCallback(
    (search: Search) => {
      const queryString =
        typeof search === "function"
          ? search(new URLSearchParams(searchParams)).toString()
          : toQueryString(search);
      push(buildUrl(pathname, queryString));
    },
    [pathname, push, searchParams]
  );

  return { searchParams, setSearchParams };
}

export { useSearchParams };
