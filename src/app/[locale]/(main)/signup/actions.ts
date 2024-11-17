"use server";

import { hash } from "bcrypt";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { signupSchema, users } from "@/lib/db/schema";

export const signupAction = async (
  previousState: ActionState<string>,
  formData: FormData
) => {
  try {
    const parsed = signupSchema.parse(Object.fromEntries(formData));
    const result = await db
      .insert(users)
      .values({
        ...parsed,
        password: await hash(parsed.password, 10),
      })
      .returning({ insertedId: users.id });

    const user = result[0];

    if (!user) {
      return errorState("Failed to create user.");
    }

    return successState(user.insertedId, "User created successfully.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorState(error.errors.map((e) => e.message).join("\n"));
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};
