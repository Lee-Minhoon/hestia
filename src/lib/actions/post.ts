"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { posts, users } from "@/lib/db/schema";

import { auth } from "../auth";
import { Pages, toUrl } from "../routes";

export const addTestPostsAction = async () => {
  try {
    const userId = (await auth())?.user?.id;

    if (!userId) {
      return errorState("You must be logged in to add test posts.");
    }

    if (isNaN(Number(userId))) {
      return errorState("Invalid user ID.");
    }

    const user = (
      await db
        .select()
        .from(users)
        .where(eq(users.id, Number(userId)))
    )[0];

    if (!user) {
      return errorState("User not found.");
    }

    await db
      .insert(posts)
      .values(
        Array.from({ length: 1000 }).map((_, i) => {
          return {
            title: `Test Post ${i + 1}`,
            content: "This is a test post.",
            userId: user.id,
          };
        })
      )
      .execute();

    revalidatePath(toUrl(Pages.Posts));

    return successState(null, "Successfully added test posts.");
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};

export const deleteAllPostsAction = async () => {
  try {
    await db.update(posts).set({ deletedAt: new Date() }).execute();

    revalidatePath(toUrl(Pages.Posts));

    return successState(null, "Successfully deleted all posts.");
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};
