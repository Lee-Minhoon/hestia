"use client";

import { format, UrlObject } from "url";

import { Locale, useLocale } from "next-intl";
import nProgress from "nprogress";

import { getPathname, Link } from "@/lib/i18n/navigation";

function getDestination(href: string | UrlObject, locale: Locale) {
  const formatedHref = typeof href === "string" ? href : format(href);
  return getPathname({ href: formatedHref, locale });
}

export function ProgressLink(props: React.ComponentProps<typeof Link>) {
  const locale = useLocale();

  return (
    <Link
      onClick={(e) => {
        props.onClick?.(e);
        const origin = window.location.pathname + window.location.search;
        const destination = getDestination(props.href, props.locale ?? locale);
        if (destination === origin) return;
        nProgress.start();
      }}
      {...props}
    />
  );
}
