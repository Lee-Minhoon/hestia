"use client";

import { useActionState, useEffect } from "react";

import { ScrollIntoViewContent } from "@/components/scroll-into-view";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { useActiveId } from "@/hooks/use-active-id";
import { initState, noopAction } from "@/lib/action";
import { CommentWithUser } from "@/lib/db/schema";
import { deleteCommentAction } from "@/server-actions/comment";

import Comment from "./comment";

interface CommentListProps {
  comments: CommentWithUser[];
}

export default function CommentList({ comments }: CommentListProps) {
  const deleting = useActiveId();

  const [state, dispatch, isPending] = useActionState(
    deleting.id ? deleteCommentAction.bind(null, deleting.id) : noopAction,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  useEffect(() => {
    if (!isPending) return;
    deleting.deactive();
  }, [isPending, deleting]);

  return (
    <ScrollIntoViewContent>
      <ul className="flex flex-col">
        {comments.map((comment) => (
          <Comment
            key={comment.comment.id}
            comment={comment}
            onDelete={deleting.active}
          />
        ))}
        <AlertDialog open={deleting.activated}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                comment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={deleting.deactive}
                disabled={isPending}
              >
                Cancel
              </AlertDialogCancel>
              <form action={dispatch}>
                <AlertDialogAction type="submit" disabled={isPending}>
                  Continue
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ul>
    </ScrollIntoViewContent>
  );
}
