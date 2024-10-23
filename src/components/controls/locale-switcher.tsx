"use client";

import { useLocale } from "next-intl";

import { Locale } from "@/lib/i18n/locale";
import { usePathname, useRouter } from "@/lib/i18n/routing";

const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={locale}
      onChange={(e) => {
        router.push(pathname, { locale: e.target.value });
      }}
    >
      {Object.values(Locale).map((locale) => (
        <option key={locale} value={locale}>
          {locale}
        </option>
      ))}
    </select>
  );
};

export { LocaleSwitcher };
