"use server";

import { hash } from "bcrypt";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { getLocale } from "next-intl/server";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import { AvailableProviders, signIn } from "@/lib/auth";
import db from "@/lib/db";
import { signinSchema, signupSchema, users } from "@/lib/db/schema";
import { Locale } from "@/lib/i18n/locale";
import { buildUrl, Pages, toUrl, withLocale } from "@/lib/routes";

import { redirect } from "../i18n/routing";
import { QueryParamKeys } from "../queryParams";

async function getRedirectUrl() {
  const url = new URL((await headers()).get("referer") ?? "");
  const next = url.searchParams.get("next");
  const locale = (await getLocale()) as Locale;

  return next || withLocale(toUrl(Pages.Home), locale);
}

export async function signinAction(
  previousState: ActionState<null>,
  formData: FormData
) {
  try {
    const parsed = signinSchema.parse(Object.fromEntries(formData));

    await signIn("credentials", {
      ...parsed,
      redirectTo: buildUrl(await getRedirectUrl(), {
        [QueryParamKeys.Notification]: "Successfully signed in.",
      }),
    });

    return successState(null, "Successfully signed in.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      return errorState(error.errors.map((e) => e.message).join("\n"));
    }
    if (error instanceof AuthError) {
      return errorState("Invalid email or password.");
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function socialLoginAction(provider: AvailableProviders) {
  try {
    await signIn(provider, {
      redirectTo: buildUrl(await getRedirectUrl(), {
        [QueryParamKeys.Notification]: "Successfully signed in.",
      }),
    });

    return successState(null, "Successfully signed in.");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function signupAction(
  previousState: ActionState<number>,
  formData: FormData
) {
  try {
    const parsed = signupSchema.parse(Object.fromEntries(formData));
    const result = await db
      .insert(users)
      .values({
        ...parsed,
        password: await hash(parsed.password, 10),
      })
      .returning({ insertedId: users.id });

    const user = result[0];

    if (!user) {
      return errorState("Failed to create user.");
    }

    const locale = (await getLocale()) as Locale;

    redirect({
      href: buildUrl(toUrl(Pages.Signin), {
        [QueryParamKeys.Notification]: "User created successfully.",
      }),
      locale,
    });

    return successState(user.insertedId, "User created successfully.");
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
