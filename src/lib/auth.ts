import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import db from "@/lib/db";

import authConfig from "../../auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        // find the user by email
        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, String(email)),
        });

        // check if the user exists and the password is correct
        if (!user || !(await compare(String(password), user.password))) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
