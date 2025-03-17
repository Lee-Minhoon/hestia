"use client";

import { useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useActionToast } from "@/hooks/use-action-toast";
import { handleSubmit, initState } from "@/lib/action";
import { createPostAction, updatePostAction } from "@/lib/actions/post";
import { insertPostSchema, Post, updatePostSchema } from "@/lib/db/schema";

interface PostUpsertFormProps {
  post?: Post;
}

export default function PostUpsertForm({ post }: PostUpsertFormProps) {
  const t = useTranslations("Post");
  const [state, dispatch, isPending] = useActionState(
    post ? updatePostAction.bind(null, post.id) : createPostAction,
    initState()
  );
  useActionToast(state);

  const form = useForm<
    z.infer<typeof insertPostSchema | typeof updatePostSchema>
  >({
    resolver: zodResolver(post ? updatePostSchema : insertPostSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
    },
  });

  return (
    <Form {...form}>
      <form
        action={dispatch}
        onSubmit={handleSubmit(form, dispatch)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Title")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Content")}</FormLabel>
              <FormControl>
                <Editor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            <PencilIcon />
            {t("Post")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
