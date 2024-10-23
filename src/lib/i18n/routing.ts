import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { Locale } from "./locale";

export const routing = defineRouting({
  locales: [Locale.en, Locale.ko],
  defaultLocale: Locale.en,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
