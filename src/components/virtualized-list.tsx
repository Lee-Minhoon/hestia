import { createContext, useContext, useRef } from "react";

import { Slot, SlotProps } from "@radix-ui/react-slot";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@/lib/utils";

interface VirtualizedListContextValue {
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
  count: number;
  gap?: number;
  children?: React.ReactNode;
};

const VirtualizedList = ({ count, gap, children }: VirtualizedListProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => 0,
    scrollMargin: ref.current?.offsetTop,
    gap,
  });

  return (
    <div ref={ref}>
      <VirtualizedListContext.Provider value={{ virtualizer }}>
        {children}
      </VirtualizedListContext.Provider>
    </div>
  );
};

interface VirtualizedListContainerProps extends Omit<SlotProps, "children"> {
  asChild?: boolean;
  children?: (props: { index: number }) => React.ReactNode;
}

const VirtualizedListContainer = ({
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

export { VirtualizedList, VirtualizedListContainer };
