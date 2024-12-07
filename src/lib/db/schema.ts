import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import type { AdapterAccountType } from "next-auth/adapters";

const base = {
  id: serial("id").primaryKey(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
};

export const users = pgTable("user", {
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  ...base,
});

export const accounts = pgTable(
  "account",
  {
    userId: integer("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password.min(8),
  name: (schema) => schema.name.min(3),
});

export const signupSchema = insertUserSchema
  .pick({
    email: true,
    name: true,
  })
  .merge(
    z.object({
      password: z.string().min(8),
      checkPassword: z.string().min(8),
    })
  )
  .refine((data) => data.password === data.checkPassword, {
    message: "Passwords do not match.",
    path: ["checkPassword"],
  });

export const signinSchema = insertUserSchema
  .pick({
    email: true,
  })
  .merge(
    z.object({
      password: z.string().min(8),
    })
  );
