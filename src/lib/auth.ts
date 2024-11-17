import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import db from "@/lib/db";

import authConfig from "../../auth.config";

import { accounts, users } from "./db/schema";

export type AvailableProviders = "github" | "google" | "facebook";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [
    GitHub,
    Google,
    Facebook,
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
        if (
          !user ||
          !(user.password && (await compare(String(password), user.password)))
        ) {
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
