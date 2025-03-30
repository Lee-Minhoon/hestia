"use client";

import { useEffect } from "react";

import nProgress from "nprogress";

import useLocation from "@/hooks/use-location";

export default function NavigationProgress() {
  const location = useLocation();

  useEffect(() => {
    nProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    nProgress.done();
  }, [location]);

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
