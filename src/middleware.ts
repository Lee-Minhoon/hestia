import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

import authConfig from "../auth.config";

import { QueryParamKeys } from "./lib/queryParams";
import {
  getLocale,
  isAuthPage,
  isPrivatePage,
  Pages,
  toUrl,
  withLocale,
} from "./lib/routes";

const intlMiddleware = createMiddleware(routing);

export const { auth } = NextAuth(authConfig);

const middleware = auth(async (req) => {
  const { pathname } = req.nextUrl;
  const locale = getLocale(pathname);

  if (!req.auth && isPrivatePage(pathname)) {
    const redirectUrl = new URL(
      withLocale(toUrl(Pages.Signin), locale),
      req.nextUrl.origin
    );
    redirectUrl.searchParams.set(QueryParamKeys.Next, pathname);
    return NextResponse.redirect(redirectUrl);
  }
  if (req.auth && isAuthPage(pathname)) {
    const next = req.nextUrl.searchParams.get(QueryParamKeys.Next);
    const redirectUrl = new URL(
      next ?? withLocale(toUrl(Pages.Home), locale),
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
