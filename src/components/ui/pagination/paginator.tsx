"use client";

import { useCallback } from "react";

import { UrlObject } from "url";

import { clamp } from "lodash-es";
import { useSearchParams } from "next/navigation";

import { usePathname } from "@/lib/i18n/navigation";
import { QueryParamKeys } from "@/lib/queryParams";
import { toQueryString } from "@/lib/routes";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

import { generatePages } from "./helpers";

interface PaginatorProps {
  pageIndex: number;
  pageSize: number;
  rowCount: number;
}

function Paginator({ pageIndex, pageSize, rowCount }: PaginatorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(rowCount / pageSize);
  const safePageIndex = clamp(pageIndex, 1, totalPages);

  const getHref = useCallback(
    (page: number): UrlObject => {
      return {
        pathname,
        query: toQueryString(
          new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            [QueryParamKeys.PageIndex]: page.toString(),
          })
        ),
      };
    },
    [pathname, searchParams]
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getHref(safePageIndex - 1)}
            isDisabled={rowCount === 0 || safePageIndex === 1}
          />
        </PaginationItem>
        {generatePages(safePageIndex, totalPages, { count: 5 }).map((page) => (
          <PaginationItem key={page} className="list-item sm:hidden">
            {typeof page === "number" ? (
              <PaginationLink
                href={getHref(page)}
                isActive={safePageIndex === page}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        {generatePages(safePageIndex, totalPages).map((page) => (
          <PaginationItem key={page} className="hidden sm:list-item ">
            {typeof page === "number" ? (
              <PaginationLink
                href={getHref(page)}
                isActive={safePageIndex === page}
              >
                {page}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={getHref(safePageIndex + 1)}
            isDisabled={rowCount === 0 || safePageIndex === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { Paginator };
