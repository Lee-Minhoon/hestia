import { NextAuthConfig } from "next-auth";

export default {
  session: {
    strategy: "jwt",
  },
  providers: [],
} satisfies NextAuthConfig;
