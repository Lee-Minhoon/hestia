import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

import authConfig from "../auth.config";

import {
  getLocale,
  matchWithLocale,
  Pages,
  toUrl,
  withLocale,
} from "./lib/routes";

const intlMiddleware = createMiddleware(routing);

export const { auth } = NextAuth(authConfig);

const publicRoutes = [Pages.Home, Pages.Signin, Pages.Signup, Pages.Users];

const middleware = auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isPublic = publicRoutes.some((route) =>
    matchWithLocale(route)(pathname)
  );
  if (!isPublic && !req.auth) {
    req.nextUrl.pathname = withLocale(toUrl(Pages.Signin), getLocale(pathname));
    return NextResponse.redirect(req.nextUrl);
  }
  return intlMiddleware(req);
});

export default middleware;

export const config = {
  matcher: ["/", "/(en|ko)/:path*"],
};
