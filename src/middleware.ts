import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { getLocale } from "next-intl/server";

import authConfig from "../auth.config";

import { getPathname } from "./lib/i18n/navigation";
import { routing } from "./lib/i18n/routing";
import { QueryParamKeys } from "./lib/queryParams";
import { isAuthPage, isPrivatePage, Pages, toUrl } from "./lib/routes";

const intlMiddleware = createMiddleware(routing);

export const { auth } = NextAuth(authConfig);

const middleware = auth(async (req) => {
  const { pathname } = req.nextUrl;
  const locale = await getLocale();

  if (!req.auth && isPrivatePage(pathname)) {
    const redirectUrl = new URL(
      getPathname({ href: toUrl(Pages.Signin), locale }),
      req.nextUrl.origin
    );
    redirectUrl.searchParams.set(QueryParamKeys.Next, pathname);
    return NextResponse.redirect(redirectUrl);
  }
  if (req.auth && isAuthPage(pathname)) {
    const next = req.nextUrl.searchParams.get(QueryParamKeys.Next);
    const redirectUrl = new URL(
      next ?? getPathname({ href: toUrl(Pages.Home), locale }),
      req.nextUrl.origin
    );
    return NextResponse.redirect(redirectUrl);
  }
  return intlMiddleware(req);
});

export default middleware;

export const config = {
  matcher: ["/", "/(en|ko)/:path*"],
};
