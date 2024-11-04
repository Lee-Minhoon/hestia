import { compile, match } from "path-to-regexp";

export enum Pages {
  Home = "/",
  Signin = "/signin",
  Signup = "/signup",
  Users = "/users{/:id}",
  Posts = "/posts{/:id}",
}

export enum Endpoints {
  Users = "/api/users{/:id}",
}

export const toUrl = (path: Pages | Endpoints, params?: object) => {
  return compile(path, { encode: encodeURIComponent })(
    Object.fromEntries(
      Object.entries(params || {}).map(([key, value]) => [
        key,
        value.toString(),
      ])
    )
  );
};

type Search = string | Record<string, string>;

export const toQueryString = (search: Search) => {
  return typeof search === "string"
    ? search
    : new URLSearchParams(search).toString();
};

export const buildUrl = (pathname: string, search?: Search) => {
  return `${pathname}${search ? `?${toQueryString(search)}` : ""}`;
};

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

export const getNavHierarchy = (
  pathname: string,
  current = navItems,
  parents: NavItem[] = []
): NavItem[] => {
  for (const navItem of current) {
    const matched = !!match(navItem.pathname)(pathname);
    if (matched) return [...parents, navItem];
    if (navItem.children) {
      const navs = getNavHierarchy(pathname, navItem.children, [
        ...parents,
        navItem,
      ]);
      if (navs.length) return navs;
    }
  }
  return [];
};
