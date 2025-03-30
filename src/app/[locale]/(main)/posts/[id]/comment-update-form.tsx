"use client";

import { useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, XIcon } from "lucide-react";
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
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { handleSubmit, initState } from "@/lib/action";
import { Comment, updateCommentSchema } from "@/lib/db/schema";
import { updateCommentAction } from "@/server-actions/comment";

interface CommentUpdateFormProps {
  comment: Comment;
  onCancel: () => void;
}

export default function CommentUpdateForm({
  comment,
  onCancel,
}: CommentUpdateFormProps) {
  const t = useTranslations("Common");

  const updateCommentWithCommentId = updateCommentAction.bind(null, comment.id);
  const [state, dispatch, isPending] = useActionState(
    updateCommentWithCommentId,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

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
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isPending}
            >
              <XIcon />
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              <CheckIcon />
              {t("edit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
