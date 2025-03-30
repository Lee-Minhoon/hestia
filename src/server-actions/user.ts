"use server";

import { hash } from "bcrypt";
import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";

import { errorState, successState } from "@/lib/action";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { Pages, toUrl } from "@/lib/routes";

export async function getUserById(id: number) {
  try {
    return await db.query.users.findFirst({
      where: and(eq(users.id, id), isNull(users.deletedAt)),
    });
  } catch (error) {
    throw error;
  }
}

export async function getUserByIdOrThrow(id: number) {
  const t = await getTranslations("User");

  const user = await getUserById(id);

  if (!user) {
    throw new Error(t("userNotFound"));
  }

  return user;
}

function getTestUserName(locale: string, i: number) {
  switch (locale) {
    case "ko":
      return `유저-${i}`;
  }
  return `user-${i}`;
}

export async function createTestUsersAction() {
  const t = await getTranslations();
  const locale = await getLocale();

  try {
    const password = await hash("q1w2e3r4", 10);

    const lastUser = await db.query.users.findFirst({
      orderBy: desc(users.id),
    });

    const lastUserId = lastUser?.id ?? 0;

    await db
      .insert(users)
      .values(
        Array.from({ length: 1000 }).map((_, i) => {
          return {
            name: getTestUserName(locale, lastUserId + i + 1),
            email: `user-${lastUserId + i + 1}@gmail.com`,
            password,
          };
        })
      )
      .execute();

    revalidatePath(toUrl(Pages.Users));

    return successState(null, t("Common.actionSuccess"));
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}

export async function deleteAllUsersAction() {
  const t = await getTranslations();

  try {
    await db.update(users).set({ deletedAt: new Date() }).execute();

    revalidatePath(toUrl(Pages.Users));

    return successState(null, t("Common.actionSuccess"));
  } catch (error) {
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}
