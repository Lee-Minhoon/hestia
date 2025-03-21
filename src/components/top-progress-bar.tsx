"use client";

import { useEffect } from "react";

import nProgress from "nprogress";

function TopProgressBar() {
  useEffect(() => {
    nProgress.configure({ showSpinner: false });
  }, []);

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

export { TopProgressBar };
