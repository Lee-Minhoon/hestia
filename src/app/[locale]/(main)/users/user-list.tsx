"use client";

import { useMemo } from "react";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { InfiniteList } from "@/components/ui/infinite-list";
import { useBreakpointValue } from "@/lib/hooks/use-breakpoint-value";
import { useIsServer } from "@/lib/hooks/use-is-server";
import { useLoadMoreUsers } from "@/lib/react-query/api";
import { parseCursor } from "@/lib/validation";

import UserCard from "./user-card";

export default function UserList() {
  const isServer = useIsServer();

  const searchParams = useSearchParams();

  const { order } = parseCursor({
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
    <div className="flex flex-col gap-4">
      <InfiniteList
        rows={rows}
        renderItem={UserCard}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
      <Button
        onClick={() => fetchNextPage()}
        disabled={isServer || !hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading more..." : "Load More"}
      </Button>
    </div>
  );
}
