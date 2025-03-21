"use client";

import { Link, usePathname } from "@/lib/i18n/routing";
import { findNavHierarchy, navItems } from "@/lib/navigation";
import { buildUrl, toUrl } from "@/lib/routes";
import { cn } from "@/lib/utils";

export default function Navigations() {
  const pathname = usePathname();

  return (
    <ul className="flex gap-6">
      {navItems.map((item) => {
        return (
          <li key={item.label} className="flex">
            <Link
              key={item.label}
              href={buildUrl(toUrl(item.pathname), item.search)}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                findNavHierarchy(pathname).includes(item) ? "text-primary" : ""
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
