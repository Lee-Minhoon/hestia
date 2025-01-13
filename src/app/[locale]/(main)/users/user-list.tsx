"use client";

import { useMemo, useRef } from "react";

import { useSearchParams } from "next/navigation";

import {
  VirtualizedList,
  VirtualizedListContainer,
  VirtualizedListLoadMore,
} from "@/components/virtualized-list";
import { useBreakpointValue } from "@/lib/hooks/use-breakpoint-value";
import { useIsServer } from "@/lib/hooks/use-is-server";
import { useLoadMoreUsers } from "@/lib/react-query/fetchers";
import { toRem } from "@/lib/utils";
import { cursorSchema } from "@/lib/validation";

import UserCard from "./user-card";

export default function UserList() {
  const listRef = useRef<HTMLDivElement>(null);

  const isServer = useIsServer();

  const searchParams = useSearchParams();

  const { order } = cursorSchema.parse({
    order: searchParams.get("order"),
  });

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useLoadMoreUsers({ order });

  const countPerRow = useBreakpointValue(
    {
      sm: 2,
      lg: 3,
      xl: 4,
    },
    1
  );

  const rows = useMemo(() => {
    const users = data?.pages.flatMap((page) => page.data.data) ?? [];
    const rows = [];
    for (let i = 0; i < users.length; i += countPerRow) {
      rows.push(users.slice(i, i + countPerRow));
    }
    return rows;
  }, [countPerRow, data?.pages]);

  return (
    <div ref={listRef} className="flex flex-col gap-4">
      {isServer ? (
        <ul
          className={
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
          }
        >
          {rows.map((row, rowIndex) => {
            return (
              <li key={rowIndex}>
                {row.map((col, i) => (
                  <UserCard key={i} data={col} />
                ))}
              </li>
            );
          })}
        </ul>
      ) : (
        <VirtualizedList
          count={rows.length}
          estimateSize={() => 0}
          scrollMargin={listRef.current?.offsetTop}
          gap={toRem(0.5)}
        >
          <div className="flex flex-col gap-2">
            <VirtualizedListContainer>
              {({ index }) => (
                <div
                  className={`grid gap-x-2`}
                  style={{ gridTemplateColumns: `repeat(${countPerRow}, 1fr)` }}
                >
                  {rows[index].map((col, i) => (
                    <UserCard key={i} data={col} />
                  ))}
                </div>
              )}
            </VirtualizedListContainer>
            <div className="flex justify-center">
              <VirtualizedListLoadMore
                onLoadMore={fetchNextPage}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </VirtualizedListLoadMore>
            </div>
          </div>
        </VirtualizedList>
      )}
    </div>
  );
}
