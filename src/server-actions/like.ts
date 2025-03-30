"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { Pages, toUrl } from "@/lib/routes";

import { getCurrentUserOrThrow } from "./auth";
import { getPostByIdOrThrow } from "./post";

export async function createLikeAction(postId: number) {
  const t = await getTranslations();

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
      return errorState(t("Like.likeFailed"));
    }

    revalidatePath(toUrl(Pages.Posts, { id: postId }));

    return successState(null, t("Like.likeSuccess"));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      return errorState(error.errors.map((e) => e.message).join("\n"));
    }
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}

export async function deleteLikeAction(postId: number) {
  const t = await getTranslations();

  try {
    const user = await getCurrentUserOrThrow();

    const like = await db.query.likes.findFirst({
      where: and(eq(likes.postId, postId), eq(likes.userId, user.id)),
    });

    if (!like) {
      return errorState(t("Like.likeNotFound"));
    }

    await db
      .delete(likes)
      .where(and(eq(likes.id, like.id), eq(likes.userId, user.id)))
      .execute();

    revalidatePath(toUrl(Pages.Posts, { id: like.postId }));

    return successState(null, t("Like.unlikeSuccess"));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}
