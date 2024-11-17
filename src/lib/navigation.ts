import { match } from "path-to-regexp";

import { Pages } from "./routes";

interface NavItem {
  label: string;
  pathname: Pages;
  search?: Record<string, string>;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    label: "Home",
    pathname: Pages.Home,
  },
  {
    label: "Users",
    pathname: Pages.Users,
  },
  {
    label: "Posts",
    pathname: Pages.Posts,
  },
];

/**
 * Recursively finds the hierarchy of nav items that match the given pathname.
 * Which can be useful highlighting the active nav item in a navigation bar or breadcrumbs.
 * @param pathname the pathname to match
 * @param current the current nav items to search
 * @param parents the accumulated parent nav items
 * @returns parent nav items containing the matching nav item for the pathname
 */
export const findNavHierarchy = (
  pathname: string,
  current = navItems,
  parents: NavItem[] = []
): NavItem[] => {
  for (const navItem of current) {
    if (match(navItem.pathname)(pathname)) {
      return [...parents, navItem];
    }
    if (navItem.children) {
      const navs = findNavHierarchy(pathname, navItem.children, [
        ...parents,
        navItem,
      ]);
      if (navs.length) {
        return navs;
      }
    }
  }
  return [];
};
