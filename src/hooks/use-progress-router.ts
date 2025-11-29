import { useMemo } from "react";

import { Locale, useLocale } from "next-intl";
import nProgress from "nprogress";

import { getPathname, useRouter } from "@/lib/i18n/navigation";

export function useProgressRouter() {
  const router = useRouter();
  const locale = useLocale();

  return useMemo<typeof router>(() => {
    function createHandler<
      Fn extends (href: string, options?: { locale?: Locale }) => void,
    >(handler: Fn) {
      return (...args: Parameters<Fn>) => {
        const [href, options] = args;
        const origin = window.location.pathname + window.location.search;
        const destination = getPathname({
          href,
          locale: options?.locale ?? locale,
        });
        if (destination !== origin) {
          nProgress.start();
        }
        return handler(href, options);
      };
    }

    return {
      ...router,
      push: createHandler(router.push),
      replace: createHandler(router.replace),
    };
  }, [locale, router]);
}
