"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { InfiniteList } from "@/components/ui/infinite-list";
import { useIsServer } from "@/lib/hooks/use-is-server";
import { useLoadMoreUsers } from "@/lib/react-query/api";

import UserCard from "./user-card";

export default function UserList() {
  const isServer = useIsServer();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useLoadMoreUsers();

  const rows = useMemo(() => {
    const users = data?.pages.flatMap((page) => page.data.data) ?? [];
    const rows = [];
    for (let i = 0; i < users.length; i += 4) {
      rows.push(users.slice(i, i + 4));
    }
    return rows;
  }, [data]);

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
