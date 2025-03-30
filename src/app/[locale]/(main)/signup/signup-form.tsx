"use client";

import { useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  ImageUploader,
  ImageUploaderClear,
  ImageUploaderPreview,
  ImageUploaderTrigger,
} from "@/components/image-uploader";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { handleSubmit, initState } from "@/lib/action";
import { signupSchema } from "@/lib/db/schema";
import { signupAction } from "@/server-actions/auth";

export default function SignupForm() {
  const t = useTranslations("Auth");

  const [state, dispatch, isPending] = useActionState(
    signupAction,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      checkPassword: "",
      name: "",
    },
  });

  return (
    <Card className="w-[320px] md:w-[400px]">
      <CardHeader>
        <CardTitle>{t("signup")}</CardTitle>
        <CardDescription>{t("signupDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            action={dispatch}
            onSubmit={handleSubmit(form, dispatch)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader {...field}>
                      {({ preview }) => {
                        return (
                          <div className="flex justify-center">
                            <div className="relative w-24 h-24 p-2">
                              {preview ? (
                                <>
                                  <ImageUploaderClear className="absolute top-1 right-1 z-10 rounded-full w-6 h-6 p-0">
                                    <Button type="button" variant="outline">
                                      <XIcon />
                                    </Button>
                                  </ImageUploaderClear>
                                  <figure className="relative rounded-full overflow-hidden w-20 h-20 ">
                                    <ImageUploaderPreview fill sizes={"80px"} />
                                  </figure>
                                </>
                              ) : (
                                <ImageUploaderTrigger className="rounded-full w-20 h-20 p-0 [&_svg]:size-6">
                                  <Button type="button" variant="outline">
                                    <UserRoundPlusIcon className="text-muted-foreground size-10" />
                                  </Button>
                                </ImageUploaderTrigger>
                              )}
                            </div>
                          </div>
                        );
                      }}
                    </ImageUploader>
                  </FormControl>
                </FormItem>
              )}
            />
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
                  <FormDescription>{t("emailDescription")}</FormDescription>
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
                      autoComplete="new-password"
                      placeholder={t("password")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("checkPassword")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("username")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      autoComplete="name"
                      placeholder={t("username")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("usernameDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {t("join")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">Welcome to the hestia.</p>
      </CardFooter>
    </Card>
  );
}
