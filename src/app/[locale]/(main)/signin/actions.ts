"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { getLocale } from "next-intl/server";
import { z } from "zod";

import { ActionState, errorState, successState } from "@/lib/action";
import { AvailableProviders, signIn } from "@/lib/auth";
import { signinSchema } from "@/lib/db/schema";
import { Locale } from "@/lib/i18n/locale";
import { Pages, toUrl, withLocale } from "@/lib/routes";

const getRedirectUrl = async () => {
  const url = new URL((await headers()).get("referer") ?? "");
  const next = url.searchParams.get("next");
  const locale = (await getLocale()) as Locale;

  return next || withLocale(toUrl(Pages.Home), locale);
};

export const signinAction = async (
  previousState: ActionState<null>,
  formData: FormData
) => {
  try {
    const parsed = signinSchema.parse(Object.fromEntries(formData));

    await signIn("credentials", {
      ...parsed,
      redirectTo: await getRedirectUrl(),
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
};

export const socialLoginAction = async (provider: AvailableProviders) => {
  try {
    await signIn(provider, {
      redirectTo: await getRedirectUrl(),
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return errorState(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
};
