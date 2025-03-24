import { defineRouting } from "next-intl/routing";

import { Locale } from "./locale";

export const routing = defineRouting({
  locales: [Locale.en, Locale.ko],
  defaultLocale: Locale.en,
});
