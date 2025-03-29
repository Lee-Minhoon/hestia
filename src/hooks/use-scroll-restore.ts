import { useEffect, useState } from "react";

import useLocation from "./use-location";

const listeners: ((key: string, scrollPos: number) => void)[] = [];

function subscribe(listener: (key: string, scrollPos: number) => void) {
  listeners.push(listener);
  return () => {
    listeners.splice(listeners.indexOf(listener), 1);
  };
}

function saveScrollPos(key: string, scrollPos: number) {
  listeners.forEach((listener) => {
    listener(key, scrollPos);
  });
}

function useScrollRestore() {
  const [scrollPositions, setScrollPositions] = useState<{
    [key: string]: number;
  }>({});
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = subscribe((key, scrollPos) => {
      setScrollPositions((prev) => ({
        ...prev,
        [key]: scrollPos,
      }));
    });
    return unsubscribe;
  });

  useEffect(() => {
    const scrollPos = scrollPositions[location];

    if (scrollPos) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPos);
      });
    }
  }, [location, scrollPositions]);
}

export { saveScrollPos, useScrollRestore };
