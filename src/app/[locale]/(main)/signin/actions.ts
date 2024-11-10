"use server";

import { compare } from "bcrypt";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { signinSchema } from "@/lib/db/schema";

export const signinAction = async (
  previousState: ActionState<null>,
  formData: FormData
) => {
  try {
    const parsed = signinSchema.parse(Object.fromEntries(formData));
    const result = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, parsed.email),
    });

    if (!result || !(await compare(parsed.password, result.password))) {
      return errorState("Invalid email or password.");
    }

    return successState(null, "Successfully signed in.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorState(error.errors.map((e) => e.message).join("\n"));
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};
