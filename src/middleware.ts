import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import createMiddleware from "next-intl/middleware";

import authConfig from "../auth.config";

import { Locale } from "./lib/i18n/locale";
import { routing } from "./lib/i18n/routing";
import { QueryParamKeys } from "./lib/queryParams";
import {
  getLocale,
  isAuthPage,
  isPrivatePage,
  Pages,
  toUrl,
  withLocale,
} from "./lib/routes";

declare module "next/server" {
  interface NextRequest {
    auth?: {
      user?: DefaultSession["user"];
    } | null;
  }
}

export const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

/**
 * @param path - redirect path
 * @param targetLocale - user's locale
 * @param origin - request origin
 * @param next - next URL to redirect to
 * @returns URL object
 */
function createRedirectUrl(
  path: string,
  targetLocale: Locale,
  origin: string,
  next?: string | null
): URL {
  const url = new URL(withLocale(path, targetLocale), origin);
  if (next) url.searchParams.set(QueryParamKeys.Next, next);
  return url;
}

const middleware = auth(async (req) => {
  const { pathname } = req.nextUrl;
  const locale = getLocale(pathname);

  if (!req.auth && isPrivatePage(pathname)) {
    return NextResponse.redirect(
      createRedirectUrl(
        toUrl(Pages.Signin),
        locale,
        req.nextUrl.origin,
        pathname
      )
    );
  }

  if (req.auth && isAuthPage(pathname)) {
    const next = req.nextUrl.searchParams.get(QueryParamKeys.Next);
    const redirectPath = next ?? toUrl(Pages.Home);

    return NextResponse.redirect(
      createRedirectUrl(redirectPath, locale, req.nextUrl.origin)
    );
  }

  return intlMiddleware(req);
});

export default middleware;

export const config = {
  matcher: ["/", "/(en|ko)/:path*"],
};
