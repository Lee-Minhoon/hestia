"use client";

import { UrlObject } from "url";

import { clamp } from "lodash-es";
import { useSearchParams } from "next/navigation";

import { usePathname } from "@/lib/i18n/routing";
import { QueryParamKeys } from "@/lib/queryParams";
import { toQueryString } from "@/lib/routes";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

interface PaginatorProps {
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  pageCount?: number;
}

function Paginator({
  pageIndex,
  pageSize,
  rowCount,
  pageCount = 10,
}: PaginatorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(rowCount / pageSize);
  const safePageIndex = clamp(pageIndex, 1, totalPages);

  const startPage = Math.floor((safePageIndex - 1) / pageCount) * pageCount + 1;
  const endPage = Math.min(startPage + pageCount - 1, totalPages);

  const getHref = (page: number): UrlObject => {
    return {
      pathname,
      query: toQueryString(
        new URLSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          [QueryParamKeys.PageIndex]: page.toString(),
        })
      ),
    };
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getHref(safePageIndex - 1)}
            isDisabled={rowCount === 0 || safePageIndex === 1}
          />
        </PaginationItem>
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={getHref(page)}
              isActive={safePageIndex === page}
            >
              {page}
            </PaginationLink>
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
