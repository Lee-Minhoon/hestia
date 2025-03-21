"use client";

import { startTransition, useActionState, useCallback } from "react";

import { ArrowLeftIcon, DeleteIcon, EditIcon } from "lucide-react";

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
import { deletePostAction } from "@/lib/actions/post";
import { Post } from "@/lib/db/schema";
import { Link } from "@/lib/i18n/routing";
import { Pages, toUrl } from "@/lib/routes";

interface ArticleActionsProps {
  previous?: string;
  post: Post;
  isOwner: boolean;
}

export default function ArticleActions({
  previous,
  post,
  isOwner,
}: ArticleActionsProps) {
  const [state, dispatch, isPending] = useActionState(
    deletePostAction.bind(null, post.id, previous ?? toUrl(Pages.Posts)),
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  const handleSubmit = useCallback(() => {
    startTransition(() => {
      dispatch();
    });
  }, [dispatch]);

  return (
    <div className="flex justify-between">
      <Button asChild variant="outline">
        <Link href={previous ?? toUrl(Pages.Posts)}>
          <ArrowLeftIcon />
          Back
        </Link>
      </Button>
      {isOwner && (
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={toUrl(Pages.PostEdit, { id: post.id })}>
              <EditIcon />
              Edit
            </Link>
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
                  This action cannot be undone. This will permanently delete
                  your post.
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
      )}
    </div>
  );
}
