"use server";

import { hash } from "bcrypt";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import { upload } from "@/lib/api";
import { auth, AvailableProviders, signIn } from "@/lib/auth";
import db from "@/lib/db";
import { signinSchema, signupSchema, users } from "@/lib/db/schema";
import { Locale } from "@/lib/i18n/locale";
import { redirect } from "@/lib/i18n/navigation";
import { makeNotification } from "@/lib/notification";
import { QueryParamKeys } from "@/lib/queryParams";
import { buildUrl, Pages, toUrl, withLocale } from "@/lib/routes";

import { getUserById, getUserByIdOrThrow } from "./user";

async function getRedirectUrl() {
  const url = new URL((await headers()).get("referer") ?? "");
  const next = url.searchParams.get("next");
  const locale = (await getLocale()) as Locale;

  return next || withLocale(toUrl(Pages.Home), locale);
}

async function getCurrentUserId() {
  const t = await getTranslations();

  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return null;
    }

    if (isNaN(Number(userId))) {
      throw new Error(t("Auth.invalidUserID"));
    }

    return Number(userId);
  } catch (err) {
    throw err;
  }
}

export async function getCurrentUser() {
  try {
    const userId = await getCurrentUserId();

    return getUserById(Number(userId));
  } catch (err) {
    throw err;
  }
}

export async function getCurrentUserOrThrow() {
  try {
    const userId = await getCurrentUserId();

    return getUserByIdOrThrow(Number(userId));
  } catch (err) {
    throw err;
  }
}

export async function signinAction(
  previousState: ActionState<null>,
  formData: FormData
) {
  const t = await getTranslations();

  try {
    const parsed = signinSchema.parse(Object.fromEntries(formData));

    await signIn("credentials", {
      ...parsed,
      redirectTo: buildUrl(await getRedirectUrl(), {
        [QueryParamKeys.Notification]: makeNotification({
          type: "success",
          description: t("Auth.signinSuccess"),
        }),
      }),
    });

    return successState(null, t("Auth.signinSuccess"));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      return errorState(error.errors.map((e) => e.message).join("\n"));
    }
    if (error instanceof AuthError) {
      return errorState(t("Auth.InvalidAccount"));
    }
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}

export async function socialLoginAction(provider: AvailableProviders) {
  const t = await getTranslations();

  try {
    await signIn(provider, {
      redirectTo: buildUrl(await getRedirectUrl(), {
        [QueryParamKeys.Notification]: makeNotification({
          type: "success",
          description: t("Auth.signinSuccess"),
        }),
      }),
    });

    return successState(null, t("Auth.signinSuccess"));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : t("Common.unknownError")
    );
  }
}

export async function signupAction(
  previousState: ActionState<number>,
  formData: FormData
) {
  const t = await getTranslations();

  try {
    const parsed = signupSchema.parse(Object.fromEntries(formData));

    const imageUrl = parsed.image ? (await upload(parsed.image)).data : null;

    const result = await db
      .insert(users)
      .values({
        ...parsed,
        image: imageUrl,
        password: await hash(parsed.password, 10),
      })
      .returning({ insertedId: users.id });

    const user = result[0];

    if (!user) {
      return errorState(t("Auth.signupFailed"));
    }

    const locale = (await getLocale()) as Locale;

    redirect({
      href: {
        pathname: toUrl(Pages.Signin),
        query: {
          [QueryParamKeys.Notification]: makeNotification({
            type: "success",
            description: t("Auth.signupSuccess"),
          }),
        },
      },
      locale,
    });

    return successState(user.insertedId, t("Auth.signupSuccess"));
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
