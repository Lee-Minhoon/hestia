"use client";

import { useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useActionToast } from "@/hooks/use-action-toast";
import { handleSubmit, initState } from "@/lib/action";
import { createCommentAction } from "@/lib/actions/comment";
import { insertCommentSchema } from "@/lib/db/schema";

interface CommentCreateFormProps {
  postId: number;
}

export default function CommentCreateForm({ postId }: CommentCreateFormProps) {
  const createCommentWithPostId = createCommentAction.bind(null, postId);

  const t = useTranslations("Post");
  const [state, dispatch, isPending] = useActionState(
    createCommentWithPostId,
    initState()
  );
  useActionToast(state);

  const form = useForm<z.infer<typeof insertCommentSchema>>({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (state.status === "success") {
      form.reset();
    }
  }, [form, state]);

  return (
    <Form {...form}>
      <form action={dispatch} onSubmit={handleSubmit(form, dispatch)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea className="h-24" {...field} />
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
        </div>
      </form>
    </Form>
  );
}
