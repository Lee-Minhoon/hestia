"use client";

import { useCallback } from "react";

import { useSearchParams as _useSearchParams } from "next/navigation";

import { usePathname } from "@/lib/i18n/navigation";
import { buildUrl, toQueryString } from "@/lib/routes";

import { useProgressRouter } from "./use-progress-router";

type SetSearchParamsAction =
  | string
  | Record<string, string>
  | React.SetStateAction<URLSearchParams>;

interface SetSearchParamsActionOptions {
  replace: boolean;
}

function useSearchParams() {
  const searchParams = _useSearchParams();
  const pathname = usePathname();
  const router = useProgressRouter();

  const setSearchParams = useCallback(
    (value: SetSearchParamsAction, options?: SetSearchParamsActionOptions) => {
      const { replace = false } = options ?? {};

      if (typeof value === "function") {
        value = value(new URLSearchParams(searchParams));
      }

      const routingFn = replace ? router.replace : router.push;

      routingFn(buildUrl(pathname, toQueryString(value)));
    },
    [pathname, router.push, router.replace, searchParams]
  );

  return { searchParams, setSearchParams };
}

export { useSearchParams };
