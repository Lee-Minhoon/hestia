"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { AuthError } from "next-auth";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import { signIn } from "@/lib/auth";
import { signinSchema } from "@/lib/db/schema";

export const signinAction = async (
  previousState: ActionState<null>,
  formData: FormData
) => {
  try {
    const parsed = signinSchema.parse(Object.fromEntries(formData));

    await signIn("credentials", {
      ...parsed,
      redirect: false,
    });

    return successState(null, "Successfully signed in.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorState(error.errors.map((e) => e.message).join("\n"));
    }
    if (error instanceof AuthError) {
      return errorState("Invalid email or password.");
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};

export const socialLoginAction = async (provider: string) => {
  try {
    await signIn(provider);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};
