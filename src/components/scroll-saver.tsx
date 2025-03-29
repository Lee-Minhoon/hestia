"use client";

import { Slot, SlotProps } from "@radix-ui/react-slot";

import useLocation from "@/hooks/use-location";
import { saveScrollPos } from "@/hooks/use-scroll-restore";

export default function ScrollSaver(props: SlotProps) {
  const location = useLocation();

  return (
    <Slot
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        saveScrollPos(location, window.scrollY);
      }}
    />
  );
}
