"use client";

import { useEffect } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import nProgress from "nprogress";

import { FunctionKeys } from "@/types/common";

function applyHandler<T extends (...args: any[]) => any>(
  handler: (
    target: T,
    thisArg: ThisParameterType<T>,
    argArray: Parameters<T>
  ) => ReturnType<T>
) {
  return handler;
}

export default function NavigationProgress() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const routerFns: FunctionKeys<typeof router>[] = [
      "push",
      "replace",
      "back",
      "forward",
    ];

    const originalFns = routerFns.map((fn) => router[fn]);
    const revokeFns = routerFns.map((fn) => {
      const { proxy, revoke } = Proxy.revocable(router[fn], {
        apply: applyHandler((target, thisArg, argArray) => {
          if (fn === "push" || fn === "replace") {
            if (
              argArray[0] ===
              window.location.pathname + window.location.search
            ) {
              return;
            }
          }
          nProgress.start();
          return Reflect.apply(target, thisArg, argArray);
        }),
      });
      router[fn] = proxy as any;
      return revoke;
    });

    return () => {
      originalFns.forEach((fn, i) => {
        router[routerFns[i]] = fn as any;
      });
      revokeFns.forEach((revoke) => revoke());
    };
  }, [router]);

  useEffect(() => {
    nProgress.done();
  }, [pathname, searchParams]);

  return null;
}
