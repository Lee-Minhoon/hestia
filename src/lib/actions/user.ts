"use server";

import { hash } from "bcrypt";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";

import { Pages, toUrl } from "../routes";

export const addTestUsersAction = async () => {
  try {
    const password = await hash("q1w2e3r4", 10);

    const lastUserId =
      (await db.select().from(users).orderBy(desc(users.id)).limit(1))[0]?.id ??
      0;

    await db
      .insert(users)
      .values(
        Array.from({ length: 1000 }).map((_, i) => {
          return {
            name: `user-${lastUserId + i + 1}`,
            email: `user-${lastUserId + i + 1}@gmail.com`,
            password,
          };
        })
      )
      .execute();

    revalidatePath(toUrl(Pages.Users));

    return successState(null, "Successfully added test users.");
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};

export const deleteAllUsersAction = async () => {
  try {
    await db.update(users).set({ deletedAt: new Date() }).execute();

    revalidatePath(toUrl(Pages.Users));

    return successState(null, "Successfully deleted all users.");
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};
