import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const base = {
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "date" }),
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  ...base,
});

const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password.min(8),
  username: (schema) => schema.username.min(3),
});

export const signupSchema = insertUserSchema
  .pick({
    email: true,
    password: true,
    username: true,
  })
  .merge(z.object({ checkPassword: z.string().min(8) }))
  .refine((data) => data.password === data.checkPassword, {
    message: "Passwords do not match.",
    path: ["checkPassword"],
  });

export const signinSchema = insertUserSchema.pick({
  email: true,
  password: true,
});
