"use server";

import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";

import { errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";

import { Pages } from "../routes";

export const addTestUsersAction = async () => {
  try {
    const password = await hash("q1w2e3r4", 10);

    await db
      .insert(users)
      .values(
        Array.from({ length: 1000 }).map((_, i) => {
          return {
            name: `user-${i + 1}`,
            email: `user-${i + 1}@gmail.com`,
            password,
          };
        })
      )
      .execute();

    revalidatePath(Pages.Users);

    return successState(null, "Successfully added test users.");
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};
