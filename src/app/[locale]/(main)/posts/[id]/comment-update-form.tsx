"use client";

import { useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { updateCommentAction } from "@/lib/actions/comment";
import { Comment, updateCommentSchema } from "@/lib/db/schema";

interface CommentUpdateFormProps {
  comment: Comment;
  onCancel: () => void;
}

export default function CommentUpdateForm({
  comment,
  onCancel,
}: CommentUpdateFormProps) {
  const bindedUpdateCommentAction = updateCommentAction.bind(null, comment.id);

  const t = useTranslations("Post");
  const [state, dispatch, isPending] = useActionState(
    bindedUpdateCommentAction,
    initState()
  );
  useActionToast(state);

  const form = useForm<z.infer<typeof updateCommentSchema>>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      content: comment?.content ?? "",
    },
  });

  useEffect(() => {
    if (state.status === "success") {
      onCancel();
    }
  }, [onCancel, state]);

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
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onCancel} disabled={isPending}>
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t("Edit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
