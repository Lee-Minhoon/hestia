import { ComponentType, useEffect, useRef } from "react";

import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { BaseSchema } from "@/lib/db/schema";
import { useIsServer } from "@/lib/hooks/use-is-server";
import { toRem } from "@/lib/utils";

interface InfiniteListProps<T extends BaseSchema> {
  rows: T[] | T[][];
  renderItem: ComponentType<{ data: T }>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const InfiniteList = <T extends BaseSchema>({
  rows,
  renderItem,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteListProps<T>) => {
  const isServer = useIsServer();

  const listRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 0,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    gap: toRem(0.5),
  });

  const countPerRow = rows[0] && Array.isArray(rows[0]) ? rows[0].length : 1;

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...items].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage?.();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, items, rows.length]);

  return (
    <div ref={listRef}>
      <ul
        className={"relative flex flex-col gap-2"}
        style={{
          height: isServer ? "initial" : `${virtualizer.getTotalSize()}px`,
        }}
      >
        {isServer
          ? rows.map((row, rowIndex) => {
              return (
                <li key={rowIndex}>
                  <Row
                    row={row}
                    renderItem={renderItem}
                    countPerRow={countPerRow}
                  />
                </li>
              );
            })
          : items.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <li
                  key={virtualRow.index}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                  className={"absolute top-0 left-0 right-0"}
                  style={{
                    transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
                  }}
                >
                  <Row
                    row={row}
                    renderItem={renderItem}
                    countPerRow={countPerRow}
                  />
                </li>
              );
            })}
      </ul>
    </div>
  );
};

interface RowProps<T extends BaseSchema> {
  row: T | T[];
  renderItem: ComponentType<{ data: T }>;
  countPerRow: number;
}

const Row = <T extends BaseSchema>({
  row,
  renderItem: Item,
  countPerRow,
}: RowProps<T>) => {
  return (
    <>
      {Array.isArray(row) ? (
        <div
          className={"grid gap-x-2"}
          style={{ gridTemplateColumns: `repeat(${countPerRow}, 1fr)` }}
        >
          {row.map((item, i) => (
            <Item key={i} data={item} />
          ))}
        </div>
      ) : (
        <Item data={row} />
      )}
    </>
  );
};
