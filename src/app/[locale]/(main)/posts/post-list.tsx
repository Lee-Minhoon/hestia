"use client";

import { useMemo } from "react";

import { useSearchParams } from "next/navigation";

import {
  InfiniteLoader,
  InfiniteLoaderLoadMore,
} from "@/components/infinite-loader";
import {
  VirtualizedList,
  VirtualizedListContainer,
} from "@/components/virtualized-list";
import { useBreakpointValue } from "@/lib/hooks/use-breakpoint-value";
import { useIsServer } from "@/lib/hooks/use-is-server";
import { useLoadMorePosts } from "@/lib/react-query/fetchers";
import { toRem } from "@/lib/utils";
import { cursorSchema } from "@/lib/validation";

import PostCard from "./post-card";

export default function PostList() {
  const isServer = useIsServer();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useLoadMorePosts(cursorSchema.parse(Object.fromEntries(useSearchParams())));

  const countPerRow = useBreakpointValue(
    {
      sm: 2,
      lg: 3,
      xl: 4,
    },
    1
  );

  const rows = useMemo(() => {
    const posts = data?.pages.flatMap((page) => page.data.data) ?? [];
    return posts.reduce(
      (acc, _, i) =>
        i % countPerRow ? acc : [...acc, posts.slice(i, i + countPerRow)],
      [] as (typeof posts)[]
    );
  }, [countPerRow, data?.pages]);

  return (
    <InfiniteLoader
      autoLoad={false}
      disabled={!hasNextPage || isFetchingNextPage}
      onLoadMore={fetchNextPage}
    >
      <div className="flex flex-col gap-4">
        {isServer ? (
          <ul
            className={
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
            }
          >
            {rows.map((row, rowIndex) => (
              <li key={rowIndex}>
                {row.map((col, i) => (
                  <PostCard key={i} data={col} />
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <VirtualizedList count={rows.length} gap={toRem(0.5)}>
            <div className="flex flex-col gap-2">
              <VirtualizedListContainer>
                {({ index }) => (
                  <div
                    className={`grid gap-x-2 overflow-hidden`}
                    style={{
                      gridTemplateColumns: `repeat(${countPerRow}, 1fr)`,
                    }}
                  >
                    {rows[index].map((col, i) => (
                      <PostCard key={i} data={col} />
                    ))}
                  </div>
                )}
              </VirtualizedListContainer>
            </div>
          </VirtualizedList>
        )}
        <div className="flex justify-center">
          <InfiniteLoaderLoadMore>
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </InfiniteLoaderLoadMore>
        </div>
      </div>
    </InfiniteLoader>
  );
}
