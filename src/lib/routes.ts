import { compile } from "path-to-regexp";

export enum Pages {
  Home = "/",
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
  pathname: string;
  search?: Record<string, string>;
}

export const navItems: NavItem[] = [
  {
    label: "Home",
    pathname: toUrl(Pages.Home),
  },
  {
    label: "Users",
    pathname: toUrl(Pages.Users),
  },
  {
    label: "Posts",
    pathname: toUrl(Pages.Posts),
  },
];
