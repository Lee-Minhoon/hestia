"use server";

import { z } from "zod";

import db from "@/lib/db";
import { insertUserSchema, users } from "@/lib/db/schema";

export const signupAction = async (data: z.infer<typeof insertUserSchema>) => {
  const parsedBody = insertUserSchema.parse(data);
  const results = await db
    .insert(users)
    .values(parsedBody)
    .returning({ insertedId: users.id });
  return { data: results[0].insertedId };
};
