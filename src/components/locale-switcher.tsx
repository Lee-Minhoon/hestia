"use client";

import { capitalize } from "lodash-es";
import { useLocale } from "next-intl";

import { Locale } from "@/lib/i18n/locale";
import { usePathname, useRouter } from "@/lib/i18n/routing";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="flex px-2 items-center">
          {Object.values(Locale).map((item) => (
            <p key={item} className={item === locale ? "visible" : "hidden"}>
              {capitalize(item)}
            </p>
          ))}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(Locale).map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => {
              router.push(pathname, { locale });
            }}
          >
            {capitalize(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LocaleSwitcher };
