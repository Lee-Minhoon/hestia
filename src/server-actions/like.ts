"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

import { errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { Pages, toUrl } from "@/lib/routes";

import { getCurrentUserOrThrow } from "./auth";
import { getPostByIdOrThrow } from "./post";

export async function createLikeAction(postId: number) {
  try {
    const user = await getCurrentUserOrThrow();

    const post = await getPostByIdOrThrow(postId);

    const result = await db
      .insert(likes)
      .values({
        postId: post.id,
        userId: user.id,
      })
      .returning({ insertedId: likes.id });

    const like = result[0];

    if (!like) {
      return errorState("Failed to create like.");
    }

    revalidatePath(toUrl(Pages.Posts, { id: postId }));

    return successState(null, "Successfully created like.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      return errorState(error.errors.map((e) => e.message).join("\n"));
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function deleteLikeAction(postId: number) {
  try {
    const user = await getCurrentUserOrThrow();

    const like = await db.query.likes.findFirst({
      where: and(eq(likes.postId, postId), eq(likes.userId, user.id)),
    });

    if (!like) {
      return errorState("Like not found.");
    }

    await db
      .delete(likes)
      .where(and(eq(likes.id, like.id), eq(likes.userId, user.id)))
      .execute();

    revalidatePath(toUrl(Pages.Posts, { id: like.postId }));

    return successState(null, "Successfully deleted like.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}
