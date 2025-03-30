"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { insertPostSchema, posts, updatePostSchema } from "@/lib/db/schema";
import { redirect } from "@/lib/i18n/navigation";
import { makeNotification } from "@/lib/notification";
import { QueryParamKeys } from "@/lib/queryParams";
import { requestQueryInvalidation } from "@/lib/react-query/invalidation";
import { Endpoints, Pages, toUrl } from "@/lib/routes";
import { getBaseUrl } from "@/lib/utils";

import { getCurrentUserOrThrow } from "./auth";

export async function getPostById(id: number) {
  try {
    return await db.query.posts.findFirst({
      where: and(eq(posts.id, id), isNull(posts.deletedAt)),
    });
  } catch (error) {
    throw error;
  }
}

export async function getPostByIdOrThrow(id: number) {
  const t = await getTranslations("Post");

  const post = await getPostById(id);

  if (!post) {
    throw new Error(t("postNotFound"));
  }

  return post;
}

export async function createPostAction(
  previousState: ActionState<null>,
  formData: FormData
) {
  const t = await getTranslations();

  try {
    const user = await getCurrentUserOrThrow();

    const parsed = insertPostSchema.parse(Object.fromEntries(formData));

    const result = await db
      .insert(posts)
      .values({
        ...parsed,
        userId: user.id,
      })
      .returning({ insertedId: posts.id });

    const post = result[0];

    if (!post) {
      return errorState(t("Post.postFailed", { action: "create" }));
    }

    const locale = await getLocale();

    await requestQueryInvalidation([toUrl(Endpoints.Posts)]);

    redirect({
      href: {
        pathname: toUrl(Pages.Posts, { id: post.insertedId }),
        query: {
          [QueryParamKeys.Notification]: makeNotification({
            type: "success",
            description: t("Post.postSuccess", { action: "create" }),
          }),
        },
      },
      locale,
    });

    return successState(null, t("Post.postSuccess", { action: "create" }));
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

export async function updatePostAction(
  id: number,
  previousState: ActionState<null>,
  formData: FormData
) {
  const t = await getTranslations();

  try {
    const user = await getCurrentUserOrThrow();

    const post = await getPostByIdOrThrow(id);

    if (user.id !== post.userId) {
      return errorState(t("Common.permissionDenied"));
    }

    const parsed = updatePostSchema.parse(Object.fromEntries(formData));

    const result = await db
      .update(posts)
      .set({
        title: parsed.title,
        content: parsed.content,
      })
      .where(eq(posts.id, id))
      .returning({ insertedId: posts.id });

    const updatedPost = result[0];

    if (!updatedPost) {
      return errorState(t("Post.postFailed", { action: "update" }));
    }

    const locale = await getLocale();

    await requestQueryInvalidation([toUrl(Endpoints.Posts)]);

    redirect({
      href: {
        pathname: toUrl(Pages.Posts, { id: updatedPost.insertedId }),
        query: {
          [QueryParamKeys.Notification]: makeNotification({
            type: "success",
            description: t("Post.postSuccess", { action: "update" }),
          }),
        },
      },
      locale,
    });

    return successState(null, t("Post.postSuccess", { action: "update" }));
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

export async function deletePostAction(id: number, next: string) {
  const t = await getTranslations();

  try {
    const user = await getCurrentUserOrThrow();

    const post = await getPostByIdOrThrow(id);

    if (user.id !== post.userId) {
      return errorState(t("Common.permissionDenied"));
    }

    await db
      .update(posts)
      .set({ deletedAt: new Date() })
      .where(and(eq(posts.id, id), eq(posts.userId, user.id)))
      .execute();

    const locale = await getLocale();

    const nextUrl = new URL(next, getBaseUrl());

    await requestQueryInvalidation([toUrl(Endpoints.Posts)]);

    redirect({
      href: {
        pathname: nextUrl.pathname,
        query: {
          ...Object.fromEntries(nextUrl.searchParams),
          [QueryParamKeys.Notification]: makeNotification({
            type: "success",
            description: t("Post.postSuccess", { action: "delete" }),
          }),
        },
      },
      locale,
    });

    return successState(null, t("Post.postSuccess", { action: "delete" }));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}

function getTestPostTitle(locale: string, i: number) {
  switch (locale) {
    case "ko":
      return `테스트 게시글 ${i}`;
  }
  return `Test Post ${i}`;
}

function getTestPostContent(locale: string) {
  switch (locale) {
    case "ko":
      return "테스트 게시글입니다.";
  }
  return "This is a test post.";
}

export async function addTestPostsAction() {
  const t = await getTranslations();
  const locale = await getLocale();

  try {
    const user = await getCurrentUserOrThrow();

    const lastPost = await db.query.posts.findFirst({
      orderBy: desc(posts.id),
    });

    const lastPostId = lastPost?.id ?? 0;

    await db
      .insert(posts)
      .values(
        Array.from({ length: 1000 }).map((_, i) => {
          return {
            title: getTestPostTitle(locale, lastPostId + i + 1),
            content: getTestPostContent(locale),
            userId: user.id,
          };
        })
      )
      .execute();

    revalidatePath(toUrl(Pages.Posts));

    return successState(null, t("Common.actionSuccess"));
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}

export async function deleteAllPostsAction() {
  const t = await getTranslations();

  try {
    await db.update(posts).set({ deletedAt: new Date() }).execute();

    revalidatePath(toUrl(Pages.Posts));

    return successState(null, t("Common.actionSuccess"));
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}
