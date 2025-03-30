import { compile, match } from "path-to-regexp";

import { isLocale } from "./i18n/locale";

export enum Pages {
  Home = "/",
  Signin = "/signin",
  Signup = "/signup",
  Users = "/users{/:id}",
  Posts = "/posts{/:id}",
  PostAdd = "/posts/add",
  PostEdit = "/posts/{/:id}/edit",
}

export enum Endpoints {
  Users = "/api/users{/:id}",
  Posts = "/api/posts{/:id}",
  Upload = "/api/upload",
}

export function toUrl(path: Pages | Endpoints, params?: object) {
  return compile(path, { encode: encodeURIComponent })(
    Object.fromEntries(
      Object.entries(params || {}).map(([key, value]) => [
        key,
        value.toString(),
      ])
    )
  );
}

type Search = string | Record<string, string> | URLSearchParams;

export function toQueryString(search: Search) {
  if (typeof search === "string") {
    return search;
  }
  if (search instanceof URLSearchParams) {
    return search.toString();
  }
  return new URLSearchParams(search).toString();
}

export function buildUrl(pathname: string, search?: Search) {
  const queryString = search ? toQueryString(search) : "";
  return `${pathname}${queryString ? `?${queryString}` : ""}`;
}

/**
 * @param pathname pathname with locale
 * @returns pathname without locale
 */
export function withoutLocale(pathname: string) {
  const [, locale] = pathname.split("/");
  if (!locale || !isLocale(locale)) {
    return pathname;
  }
  return pathname.slice(locale.length + 1) || "/";
}

/**
 * @param params parameters for path-to-regexp's match function
 * @returns function that matches pathname without locale
 */
export function matchWithLocale(...params: Parameters<typeof match>) {
  return (path: string) => match(...params)(withoutLocale(path));
}

export const authPages = [Pages.Signin, Pages.Signup];

export const publicPages = [Pages.Home, Pages.Users, ...authPages];

export function isPublicPage(pathname: string) {
  return publicPages.some((route) => matchWithLocale(route)(pathname));
}

export function isPrivatePage(pathname: string) {
  return !isPublicPage(pathname);
}

export function isAuthPage(pathname: string) {
  return authPages.some((route) => matchWithLocale(route)(pathname));
}
