import { InferSelectModel } from "drizzle-orm";
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

import { Nullable } from "@/types/common";

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

export type User = InferSelectModel<typeof users>;

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
  name: (schema) => schema.name.min(3),
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password.min(8),
  image: (schema) => schema.image,
});

export const signupSchema = insertUserSchema
  .pick({
    name: true,
    email: true,
  })
  .merge(
    z.object({
      password: z.string().min(8),
      checkPassword: z.string().min(8),
      image: z.instanceof(File).optional(),
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

export const posts = pgTable("post", {
  userId: integer("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  ...base,
});

export type Post = InferSelectModel<typeof posts>;

export type PostWithUser = {
  post: Post;
  user: Nullable<User>;
};

export const insertPostSchema = createInsertSchema(posts, {
  title: (schema) => schema.title.min(3),
  content: (schema) => schema.content.min(3),
}).pick({
  title: true,
  content: true,
});

export const updatePostSchema = insertPostSchema.pick({
  title: true,
  content: true,
});

export const comments = pgTable("comment", {
  userId: integer("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  postId: integer("postId")
    .notNull()
    .references(() => posts.id, {
      onDelete: "cascade",
    }),
  content: text("content").notNull(),
  ...base,
});

export type Comment = InferSelectModel<typeof comments>;

export type CommentWithUser = {
  comment: Comment;
  user: Nullable<User>;
};

export const insertCommentSchema = createInsertSchema(comments, {
  content: (schema) => schema.content.min(3),
}).pick({
  content: true,
});

export const updateCommentSchema = insertCommentSchema.pick({
  content: true,
});

export const likes = pgTable("like", {
  id: base.id,
  createdAt: base.createdAt,
  userId: integer("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  postId: integer("postId")
    .notNull()
    .references(() => posts.id, {
      onDelete: "cascade",
    }),
});

export type Like = InferSelectModel<typeof likes>;
