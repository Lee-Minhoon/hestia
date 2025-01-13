import { createContext, useContext, useEffect } from "react";

import { Slot, SlotProps } from "@radix-ui/react-slot";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

interface VirtualizedListContextValue {
  count: number;
  virtualizer: ReturnType<typeof useWindowVirtualizer>;
}

const VirtualizedListContext = createContext<
  VirtualizedListContextValue | undefined
>(undefined);

const useVirtualizedList = () => {
  const context = useContext(VirtualizedListContext);
  if (!context) {
    throw new Error(
      "useInfiniteList must be used within an InfiniteListProvider"
    );
  }
  return context;
};

type VirtualizedListProps = {
  children?: React.ReactNode;
} & Parameters<typeof useWindowVirtualizer>[0];

export const VirtualizedList = ({
  children,
  ...props
}: VirtualizedListProps) => {
  const virtualizer = useWindowVirtualizer(props);

  return (
    <VirtualizedListContext.Provider
      value={{ count: props.count, virtualizer }}
    >
      {children}
    </VirtualizedListContext.Provider>
  );
};

interface VirtualizedListContainerProps extends Omit<SlotProps, "children"> {
  asChild?: boolean;
  children?: (props: { index: number }) => React.ReactNode;
}

export const VirtualizedListContainer = ({
  asChild,
  children,
  className,
  ...props
}: VirtualizedListContainerProps) => {
  const { virtualizer } = useVirtualizedList();

  const Comp = asChild ? Slot : "ul";

  return (
    <Comp
      className={cn("relative", className)}
      style={{ height: virtualizer.getTotalSize() }}
      {...props}
    >
      {virtualizer.getVirtualItems().map((virtualRow) => {
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
            {children ? children({ index: virtualRow.index }) : null}
          </li>
        );
      })}
    </Comp>
  );
};

interface VirtualizedListLoadMoreProps extends SlotProps {
  asChild?: boolean;
  disabled?: boolean;
  autoLoad?: boolean;
  onLoadMore?: () => void;
}

export const VirtualizedListLoadMore = ({
  asChild,
  disabled,
  autoLoad = true,
  onLoadMore,
  ...props
}: VirtualizedListLoadMoreProps) => {
  const { count, virtualizer } = useVirtualizedList();

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!autoLoad || disabled) {
      return;
    }

    if (items[items.length - 1]?.index >= count - 1) {
      onLoadMore?.();
    }
  }, [autoLoad, count, disabled, items, onLoadMore]);

  const Comp = asChild ? Slot : Button;

  return <Comp onClick={onLoadMore} disabled={disabled} {...props} />;
};
