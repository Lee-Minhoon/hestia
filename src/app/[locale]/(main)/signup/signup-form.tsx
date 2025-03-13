"use client";

import { startTransition, useActionState, useCallback, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { FaUserAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "sonner";
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
import { initState } from "@/lib/action";
import { signupAction } from "@/lib/actions/auth";
import { upload } from "@/lib/api";
import { signupSchema } from "@/lib/db/schema";
import useActionToast from "@/lib/hooks/use-action-toast";
import { Nullable } from "@/types/common";

export default function SignupForm() {
  const t = useTranslations("Signup");
  const [state, dispatch, isPending] = useActionState(
    signupAction,
    initState()
  );
  useActionToast(state);

  const [profile, setProfile] = useState<Nullable<File>>(null);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      checkPassword: "",
      name: "",
    },
  });

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async () => {
        const formData = new FormData(e.target as HTMLFormElement);
        if (profile) {
          try {
            const { data } = await upload(profile);
            formData.append("image", data);
          } catch (err) {
            toast.error("Error", {
              description:
                err instanceof Error
                  ? err.message
                  : "An unknown error occurred.",
              cancel: {
                label: "Dismiss",
                onClick: () => toast.dismiss(),
              },
            });
            return;
          }
        }
        startTransition(() => {
          dispatch(formData);
        });
        return;
      })(e);
    },
    [dispatch, form, profile]
  );

  return (
    <Card className="w-[320px] md:w-[400px]">
      <CardHeader>
        <CardTitle>{t("Signup")}</CardTitle>
        <CardDescription>{t("Signup Description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            action={dispatch}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <ImageUploader onFileChange={setProfile}>
              {({ preview }) => {
                return (
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24 p-2">
                      {preview ? (
                        <>
                          <ImageUploaderClear className="absolute top-1 right-1 z-10 rounded-full w-6 h-6 p-0">
                            <Button type="button" variant="outline">
                              <IoCloseOutline />
                            </Button>
                          </ImageUploaderClear>
                          <figure className="relative rounded-full overflow-hidden w-20 h-20 ">
                            <ImageUploaderPreview fill sizes={"80px"} />
                          </figure>
                        </>
                      ) : (
                        <ImageUploaderTrigger className="rounded-full w-20 h-20 p-0 [&_svg]:size-6">
                          <Button type="button" variant="outline">
                            <FaUserAlt className="text-muted-foreground" />
                          </Button>
                        </ImageUploaderTrigger>
                      )}
                    </div>
                  </div>
                );
              }}
            </ImageUploader>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Email")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      autoComplete="email"
                      placeholder={t("Email")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("Email Description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Password")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("Password")}
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
                  <FormLabel>{t("Check Password")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("Check Password")}
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
                  <FormLabel>{t("Username")}</FormLabel>
                  <FormControl>
                    <Input
                      required
                      autoComplete="name"
                      placeholder={t("Username")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("Username Description")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {t("Join")}
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
