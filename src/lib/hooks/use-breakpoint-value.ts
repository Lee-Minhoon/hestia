import { useEffect, useState } from "react";

import defaultTheme from "tailwindcss/defaultTheme";
import { Entries } from "type-fest";

import { getRootFontSize } from "../utils";

const screens = defaultTheme.screens;

const toPx = (value: string) => {
  const isRem = value.endsWith("rem");
  const isEm = value.endsWith("em");
  const factor = isRem || isEm ? getRootFontSize() : 1;

  return Number(value.match(/\d+/)?.[0] ?? 0) * factor;
};

const breakpoints = (Object.entries(screens) as Entries<typeof screens>)
  .sort((a, b) => {
    return toPx(a[1]) - toPx(b[1]);
  })
  .reduce(
    (acc, [key, value]) => {
      acc[key] = toPx(value);
      return acc;
    },
    {} as Record<keyof typeof screens, number>
  );

const useMediaQueries = (queries: string[]) => {
  const [matches, setMatches] = useState<boolean[]>([]);

  useEffect(() => {
    const mediaQueryLists = queries.map((q) => window.matchMedia(q));

    const handleMatch = () => {
      setMatches(mediaQueryLists.map((mql) => mql.matches));
    };

    handleMatch();

    mediaQueryLists.forEach((mql) =>
      mql.addEventListener("change", handleMatch)
    );

    return () => {
      mediaQueryLists.forEach((mql) =>
        mql.removeEventListener("change", handleMatch)
      );
    };
  }, [queries]);

  return matches;
};

const queries = Object.values(breakpoints).map((bp) => `(min-width: ${bp}px)`);

const useBreakpointValue = <T, S extends T | undefined>(
  values: Partial<Record<keyof typeof breakpoints, T>>,
  fallback?: S
) => {
  const matches = useMediaQueries(queries);

  return (Object.entries(breakpoints) as Entries<typeof breakpoints>).reduce(
    (acc, [key], index) => {
      if (matches[index] && values[key]) {
        return values[key];
      }
      return acc;
    },
    fallback as T | S
  );
};

export { useBreakpointValue };
