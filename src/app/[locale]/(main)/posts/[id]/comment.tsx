"use client";

import { startTransition, useActionState, useCallback } from "react";

import { format } from "date-fns";
import { Ellipsis } from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActionToast } from "@/hooks/use-action-toast";
import { useDisclosure } from "@/hooks/use-disclosure";
import { initState } from "@/lib/action";
import { deleteCommentAction } from "@/lib/actions/comment";
import { CommentWithUser } from "@/lib/db/schema";

import CommentUpdateForm from "./comment-update-form";

interface CommentProps {
  comment: CommentWithUser;
}

export default function Comment({ comment }: CommentProps) {
  const updateForm = useDisclosure();
  const deleteDialog = useDisclosure();

  const [state, dispatch, isPending] = useActionState(
    deleteCommentAction.bind(null, comment.comment.id),
    initState()
  );
  useActionToast(state);

  const handleSubmit = useCallback(() => {
    deleteDialog.onClose();
    startTransition(() => {
      dispatch();
    });
  }, [deleteDialog, dispatch]);

  return (
    <li className="flex py-4 border-b last:border-b-0">
      {updateForm.isOpen ? (
        <div className="flex-1">
          <CommentUpdateForm
            comment={comment.comment}
            onCancel={updateForm.onClose}
          />
        </div>
      ) : (
        <div className="flex flex-1 gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.user?.image ?? undefined} alt="profile" />
            <AvatarFallback />
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex gap-2">
              <h2 className="text-sm truncate">{comment.user?.name ?? ""}</h2>
              <time className="text-sm text-muted-foreground">
                {format(comment.comment.createdAt, "yyyy-MM-dd HH:mm")}
              </time>
            </div>
            <p className="text-sm break-words">{comment.comment.content}</p>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={updateForm.onOpen}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteDialog.onOpen}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <AlertDialog open={deleteDialog.isOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your comment.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={deleteDialog.onClose}
                  disabled={isPending}
                >
                  Cancel
                </AlertDialogCancel>
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
    </li>
  );
}
