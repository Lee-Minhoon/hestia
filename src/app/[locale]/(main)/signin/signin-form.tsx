"use client";

import { useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { handleSubmit, initState } from "@/lib/action";
import { signinSchema } from "@/lib/db/schema";
import { signinAction } from "@/server-actions/auth";

import SocialLoginSection from "./social-login-section";

export default function SigninForm() {
  const t = useTranslations("Auth");

  const [state, dispatch, isPending] = useActionState(
    signinAction,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Card className="w-[320px] md:w-[400px]">
      <CardHeader>
        <CardTitle>{t("signin")}</CardTitle>
        <CardDescription>{t("signinDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Form {...form}>
          <form
            action={dispatch}
            onSubmit={handleSubmit(form, dispatch)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      autoComplete="email"
                      placeholder={t("email")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="password"
                      autoComplete="current-password"
                      placeholder={t("password")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {t("signin")}
            </Button>
          </form>
        </Form>
        <SocialLoginSection />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">Welcome to the hestia.</p>
      </CardFooter>
    </Card>
  );
}
