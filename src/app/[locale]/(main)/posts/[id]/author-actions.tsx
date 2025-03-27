"use client";

import { startTransition, useActionState, useCallback } from "react";

import { DeleteIcon, EditIcon } from "lucide-react";

import { ProgressLink } from "@/components/progress-link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { Post } from "@/lib/db/schema";
import { Pages, toUrl } from "@/lib/routes";
import { deletePostAction } from "@/server-actions/post";

interface AuthorActionsProps {
  previous?: string;
  post: Post;
}

export default function AuthorActions({ previous, post }: AuthorActionsProps) {
  const [state, dispatch, isPending] = useActionState(
    deletePostAction.bind(null, post.id, previous ?? toUrl(Pages.Posts)),
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  const handleSubmit = useCallback<React.FormEventHandler>(
    (e) => {
      e.preventDefault();
      startTransition(() => {
        dispatch();
      });
    },
    [dispatch]
  );

  return (
    <div className="flex gap-2">
      <Button asChild variant="outline">
        <ProgressLink href={toUrl(Pages.PostEdit, { id: post.id })}>
          <EditIcon />
          Edit
        </ProgressLink>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <DeleteIcon />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={dispatch} onSubmit={handleSubmit}>
              <AlertDialogAction type="submit" disabled={isPending}>
                Continue
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
