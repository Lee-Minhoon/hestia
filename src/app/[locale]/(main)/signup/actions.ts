"use server";

import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { insertUserSchema, users } from "@/lib/db/schema";

export const signupAction = async (
  previousState: ActionState<number>,
  formData: FormData
) => {
  try {
    const parsed = insertUserSchema.parse(Object.fromEntries(formData));
    const results = await db
      .insert(users)
      .values(parsed)
      .returning({ insertedId: users.id });
    return successState(results[0].insertedId, "User created successfully.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorState(error.errors.map((e) => e.message).join("\n"));
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};
