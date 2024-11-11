import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

import authConfig from "../auth.config";

const intlMiddleware = createMiddleware(routing);

export const { auth } = NextAuth(authConfig);

const authMiddleware = auth((req) => {
  console.log("auth", req.auth);
  return intlMiddleware(req);
});

export default authMiddleware;

export const config = {
  matcher: ["/", "/(en|ko)/:path*"],
};
