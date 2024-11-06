"use client";

import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeSwitcher } from "@/components/controls/theme-switcher";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/lib/i18n/routing";
import {
  buildUrl,
  getNavHierarchy,
  navItems,
  Pages,
  toUrl,
} from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function MainLayoutHeader() {
  const t = useTranslations("MainLayout");
  const pathname = usePathname();

  return (
    <div className="flex py-4 border-b-1 items-center justify-center">
      <div className="flex w-content justify-between">
        <nav className="flex items-center gap-10">
          <Link
            href={toUrl(Pages.Home)}
            className="text-xl font-bold text-muted-foreground transition-colors hover:text-primary"
          >
            HESTIA
          </Link>
          <ul className="flex gap-6">
            {navItems.map((item) => {
              return (
                <li key={item.label} className="flex">
                  <Link
                    key={item.label}
                    href={buildUrl(toUrl(item.pathname), item.search)}
                    className={cn(
                      "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                      getNavHierarchy(pathname).includes(item)
                        ? "text-primary"
                        : ""
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <nav className="flex items-center gap-10">
          <ul className="flex gap-2">
            <li>
              <LocaleSwitcher />
            </li>
            <li>
              <ThemeSwitcher />
            </li>
          </ul>
          <ul className="flex gap-2">
            <li>
              <Button asChild variant={"outline"}>
                <Link href={toUrl(Pages.Signin)}>{t("Signin")}</Link>
              </Button>
            </li>
            <li>
              <Button asChild>
                <Link href={toUrl(Pages.Signup)}>{t("Signup")}</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
