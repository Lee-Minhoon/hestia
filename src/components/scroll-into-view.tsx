"use client";

import { createContext, useCallback, useContext, useRef } from "react";

import { Slot, SlotProps } from "@radix-ui/react-slot";

import { Nullable } from "@/types/common";

import { Button } from "./ui/button";

interface ScrollIntoViewContextValue {
  contentRef: React.RefObject<Nullable<HTMLElement>>;
  onScrollIntoView: (options?: ScrollIntoViewOptions) => void;
}

const ScrollIntoViewContext = createContext<
  ScrollIntoViewContextValue | undefined
>(undefined);

function useScrollIntoView() {
  const context = useContext(ScrollIntoViewContext);
  if (!context) {
    throw new Error(
      "useScrollIntoView must be used within an ScrollIntoViewProvider"
    );
  }
  return context;
}

interface ScrollIntoViewProps {
  children?: React.ReactNode;
}

function ScrollIntoView({ children }: ScrollIntoViewProps) {
  const contentRef = useRef<HTMLElement>(null);

  const handleScrollIntoView = useCallback(
    (options?: ScrollIntoViewOptions) => {
      contentRef.current?.scrollIntoView(options);
    },
    []
  );

  return (
    <ScrollIntoViewContext.Provider
      value={{ contentRef, onScrollIntoView: handleScrollIntoView }}
    >
      {children}
    </ScrollIntoViewContext.Provider>
  );
}

interface ScrollIntoViewTriggerProps extends SlotProps {
  asChild?: boolean;
  options?: ScrollIntoViewOptions;
}

function ScrollIntoViewTrigger({
  asChild,
  options,
  ...props
}: ScrollIntoViewTriggerProps) {
  const { onScrollIntoView } = useScrollIntoView();

  const handleScrollIntoView = useCallback(() => {
    onScrollIntoView(options);
  }, [onScrollIntoView, options]);

  const Comp = asChild ? Slot : Button;

  return <Comp onClick={handleScrollIntoView} {...props} />;
}

function ScrollIntoViewContent({ children }: { children: React.ReactNode }) {
  const { contentRef } = useScrollIntoView();

  return <Slot ref={contentRef}>{children}</Slot>;
}

export {
  ScrollIntoView,
  ScrollIntoViewContent,
  ScrollIntoViewTrigger,
  useScrollIntoView,
};
