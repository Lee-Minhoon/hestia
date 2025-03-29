"use client";

import { useEffect } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import nProgress from "nprogress";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    nProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    nProgress.done();
  }, [pathname, searchParams]);

  return (
    <style>
      {`#nprogress {
          pointer-events: none;
        }

        #nprogress .bar {
          background: var(--foreground);

          position: fixed;
          z-index: 1031;
          top: 0;
          left: 0;

          width: 100%;
          height: 2px;
        }`}
    </style>
  );
}
