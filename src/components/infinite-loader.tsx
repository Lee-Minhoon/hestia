import { createContext, useContext, useEffect } from "react";

import { Slot, SlotProps } from "@radix-ui/react-slot";
import { useInView } from "react-intersection-observer";

import { Button } from "./ui/button";

interface InfiniteLoaderContextValue {
  autoLoad?: boolean;
  disabled: boolean;
  onLoadMore: () => void;
}

const InfiniteLoaderContext = createContext<
  InfiniteLoaderContextValue | undefined
>(undefined);

function useInfiniteLoader() {
  const context = useContext(InfiniteLoaderContext);
  if (!context) {
    throw new Error(
      "useInfiniteList must be used within an InfiniteListProvider"
    );
  }
  return context;
}

type InfiniteLoaderProps = {
  autoLoad?: boolean;
  disabled: boolean;
  children?: React.ReactNode;
  onLoadMore: () => void;
};

function InfiniteLoader({
  autoLoad = true,
  disabled,
  children,
  onLoadMore,
}: InfiniteLoaderProps) {
  return (
    <InfiniteLoaderContext.Provider value={{ autoLoad, disabled, onLoadMore }}>
      {children}
    </InfiniteLoaderContext.Provider>
  );
}

interface InfiniteLoaderLoadMoreProps extends SlotProps {
  asChild?: boolean;
}

function InfiniteLoaderLoadMore({
  asChild,
  ...props
}: InfiniteLoaderLoadMoreProps) {
  const { ref, inView } = useInView();

  const { autoLoad, disabled, onLoadMore } = useInfiniteLoader();

  const Comp = asChild ? Slot : Button;

  useEffect(() => {
    if (!autoLoad || disabled || !inView) {
      return;
    }

    onLoadMore();
  }, [autoLoad, disabled, inView, onLoadMore]);

  return <Comp ref={ref} onClick={onLoadMore} disabled={disabled} {...props} />;
}

export { InfiniteLoader, InfiniteLoaderLoadMore };
