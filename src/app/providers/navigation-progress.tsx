"use client";

import { useEffect } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import nProgress from "nprogress";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    nProgress.done();
  }, [pathname, searchParams]);

  return null;
}
