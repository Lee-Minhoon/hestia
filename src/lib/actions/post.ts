"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getLocale } from "next-intl/server";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { insertPostSchema, posts, updatePostSchema } from "@/lib/db/schema";

import { auth } from "../auth";
import { redirect } from "../i18n/routing";
import { QueryParamKeys } from "../queryParams";
import { buildUrl, Pages, toUrl } from "../routes";
import { getBaseUrl } from "../utils";

async function getUser() {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!session || !userId) {
      throw new Error("You must be logged in to add a post.");
    }

    if (isNaN(Number(userId))) {
      throw new Error("Invalid user ID.");
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, Number(userId)),
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  } catch (err) {
    throw err;
  }
}

export async function createPostAction(
  previousState: ActionState<null>,
  formData: FormData
) {
  try {
    const user = await getUser();

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
      return errorState("Failed to create post.");
    }

    const locale = await getLocale();

    redirect({
      href: buildUrl(toUrl(Pages.Posts, { id: post.insertedId }), {
        [QueryParamKeys.Notification]: "Successfully created post.",
      }),
      locale,
    });

    return successState(null, "Successfully created post.");
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

export async function updatePostAction(
  id: number,
  previousState: ActionState<null>,
  formData: FormData
) {
  try {
    const user = await getUser();

    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) {
      return errorState("Post not found.");
    }

    if (user.id !== post.userId) {
      return errorState("You do not have permission to update this post.");
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
      return errorState("Failed to update post.");
    }

    const locale = await getLocale();

    redirect({
      href: buildUrl(toUrl(Pages.Posts, { id: updatedPost.insertedId }), {
        [QueryParamKeys.Notification]: "Successfully updated post.",
      }),
      locale,
    });

    return successState(null, "Successfully updated post.");
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

export async function deletePostAction(id: number, next: string) {
  try {
    const user = await getUser();

    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) {
      return errorState("Post not found.");
    }

    if (user.id !== post.userId) {
      return errorState("You do not have permission to delete this post.");
    }

    await db
      .update(posts)
      .set({ deletedAt: new Date() })
      .where(and(eq(posts.id, id), eq(posts.userId, user.id)))
      .execute();

    const locale = await getLocale();

    const nextUrl = new URL(next, getBaseUrl());

    redirect({
      href: buildUrl(nextUrl.pathname, {
        ...Object.fromEntries(nextUrl.searchParams),
        [QueryParamKeys.Notification]: "Successfully deleted post.",
      }),
      locale,
    });

    return successState(null, "Successfully deleted post.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function addTestPostsAction() {
  try {
    const user = await getUser();

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
}

export async function deleteAllPostsAction() {
  try {
    await db.update(posts).set({ deletedAt: new Date() }).execute();

    revalidatePath(toUrl(Pages.Posts));

    return successState(null, "Successfully deleted all posts.");
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}
