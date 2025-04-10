"use client";

import { useTranslations } from "next-intl";

import { ProgressLink } from "@/components/progress-link";
import { usePathname } from "@/lib/i18n/navigation";
import { findNavHierarchy, navItems } from "@/lib/navigation";
import { toUrl } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function Navigations() {
  const t = useTranslations("Navigation");

  const pathname = usePathname();

  return (
    <ul className="flex gap-6">
      {navItems.map((item) => {
        return (
          <li key={item.label} className="flex">
            <ProgressLink
              key={item.label}
              href={{
                pathname: toUrl(item.pathname),
                query: item.search,
              }}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                findNavHierarchy(pathname).includes(item) ? "text-primary" : ""
              )}
            >
              {t(item.label)}
            </ProgressLink>
          </li>
        );
      })}
    </ul>
  );
}
