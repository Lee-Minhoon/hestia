"use server";

import { and, count, eq, isNull, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import {
  comments,
  insertCommentSchema,
  updateCommentSchema,
} from "@/lib/db/schema";
import { redirect } from "@/lib/i18n/navigation";
import { QueryParamKeys } from "@/lib/queryParams";
import { Pages, toUrl } from "@/lib/routes";
import { paginationSchema } from "@/lib/validation";

import { getCurrentUserOrThrow } from "./auth";
import { getPostByIdOrThrow } from "./post";

export async function getCommentById(id: number) {
  try {
    return await db.query.comments.findFirst({
      where: and(eq(comments.id, id), isNull(comments.deletedAt)),
    });
  } catch (error) {
    throw error;
  }
}

export async function getCommentByIdOrThrow(id: number) {
  const t = await getTranslations("Comment");

  const comment = await getCommentById(id);

  if (!comment) {
    throw new Error(t("commentNotFound"));
  }

  return comment;
}

export async function createCommentAction(
  postId: number,
  previousState: ActionState<null>,
  formData: FormData
) {
  const t = await getTranslations();

  try {
    const user = await getCurrentUserOrThrow();

    const post = await getPostByIdOrThrow(postId);

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
      return errorState(t("Comment.commentFailed", { action: "create" }));
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
        href: {
          pathname: toUrl(Pages.Posts, { id: postId }),
          query: {
            [QueryParamKeys.PageIndex]: Math.ceil(commentCount / 10).toString(),
          },
        },
        locale,
      });
    }

    return successState(
      null,
      t("Comment.commentSuccess", { action: "create" })
    );
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

export async function updateCommentAction(
  id: number,
  previousState: ActionState<null>,
  formData: FormData
) {
  const t = await getTranslations();

  try {
    const user = await getCurrentUserOrThrow();

    const comment = await getCommentByIdOrThrow(id);

    if (user.id !== comment.userId) {
      return errorState(t("Common.permissionDenied"));
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
      return errorState(t("Comment.commentFailed", { action: "update" }));
    }

    revalidatePath(toUrl(Pages.Posts, { id: comment.postId }));

    return successState(
      null,
      t("Comment.commentSuccess", { action: "update" })
    );
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

export async function deleteCommentAction(id: number) {
  const t = await getTranslations();

  try {
    const user = await getCurrentUserOrThrow();

    const comment = await getCommentByIdOrThrow(id);

    if (user.id !== comment.userId) {
      return errorState(t("Common.permissionDenied"));
    }

    await db
      .update(comments)
      .set({ deletedAt: new Date() })
      .where(and(eq(comments.id, id), eq(comments.userId, user.id)))
      .execute();

    revalidatePath(toUrl(Pages.Posts, { id: comment.postId }));

    return successState(
      null,
      t("Comment.commentSuccess", { action: "delete" })
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}
