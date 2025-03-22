"use server";

import { and, count, eq, isNull, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import {
  comments,
  insertCommentSchema,
  updateCommentSchema,
} from "@/lib/db/schema";

import { redirect } from "../i18n/routing";
import { QueryParamKeys } from "../queryParams";
import { buildUrl, Pages, toUrl } from "../routes";
import { paginationSchema } from "../validation";

import { getCurrentUser } from "./auth";
import { getPostById } from "./post";

export async function getCommentById(id: number) {
  const comment = await db.query.comments.findFirst({
    where: and(eq(comments.id, id), isNull(comments.deletedAt)),
  });

  if (!comment) {
    throw new Error("Comment not found.");
  }

  return comment;
}

export async function createCommentAction(
  postId: number,
  previousState: ActionState<null>,
  formData: FormData
) {
  try {
    const user = await getCurrentUser();

    const post = await getPostById(postId);

    console.log("post", post);

    const parsed = insertCommentSchema.parse(Object.fromEntries(formData));

    const result = await db
      .insert(comments)
      .values({
        ...parsed,
        postId: post.id,
        userId: user.id,
      })
      .returning({ insertedId: comments.id });

    const comment = result[0];

    if (!comment) {
      return errorState("Failed to create comment.");
    }

    const commentCount = (
      await db
        .select({ count: count() })
        .from(comments)
        .where(
          and(
            eq(comments.postId, postId),
            isNull(comments.deletedAt),
            lte(comments.id, comment.insertedId)
          )
        )
    )[0].count;

    const headerList = await headers();
    const url = new URL(headerList.get("referer") ?? "");

    const { pageIndex } = paginationSchema.parse(
      Object.fromEntries(url.searchParams.entries())
    );
    const nextPageIndex = Math.ceil(commentCount / 10);

    if (pageIndex === nextPageIndex) {
      revalidatePath(toUrl(Pages.Posts, { id: postId }));
    } else {
      const locale = await getLocale();
      redirect({
        href: buildUrl(toUrl(Pages.Posts, { id: postId }), {
          [QueryParamKeys.PageIndex]: Math.ceil(commentCount / 10).toString(),
        }),
        locale,
      });
    }

    return successState(null, "Successfully created comment.");
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

export async function updateCommentAction(
  id: number,
  previousState: ActionState<null>,
  formData: FormData
) {
  try {
    const user = await getCurrentUser();

    const comment = await getCommentById(id);

    if (user.id !== comment.userId) {
      return errorState("You do not have permission to update this comment.");
    }

    const parsed = updateCommentSchema.parse(Object.fromEntries(formData));

    const result = await db
      .update(comments)
      .set({
        content: parsed.content,
      })
      .where(eq(comments.id, id))
      .returning({ insertedId: comments.id });

    const updatedComment = result[0];

    if (!updatedComment) {
      return errorState("Failed to update comment.");
    }

    revalidatePath(toUrl(Pages.Posts, { id: comment.postId }));

    return successState(null, "Successfully updated comment.");
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

export async function deleteCommentAction(id: number) {
  try {
    const user = await getCurrentUser();

    const comment = await getCommentById(id);

    if (user.id !== comment.userId) {
      return errorState("You do not have permission to delete this comment.");
    }

    await db
      .update(comments)
      .set({ deletedAt: new Date() })
      .where(and(eq(comments.id, id), eq(comments.userId, user.id)))
      .execute();

    revalidatePath(toUrl(Pages.Posts, { id: comment.postId }));

    return successState(null, "Successfully deleted comment.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}
