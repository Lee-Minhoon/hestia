"use client";

import { useActionState } from "react";

import { DeleteIcon, EditIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Common");
  const searchParams = useSearchParams();

  const [state, dispatch, isPending] = useActionState(
    deletePostAction.bind(null, post.id, previous ?? toUrl(Pages.Posts)),
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  return (
    <div className="flex gap-2">
      <Button asChild variant="outline">
        <ProgressLink
          href={{
            pathname: toUrl(Pages.PostEdit, { id: post.id }),
            query: Object.fromEntries(searchParams.entries()),
          }}
        >
          <EditIcon />
          {t("edit")}
        </ProgressLink>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <DeleteIcon />
            {t("delete")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteWarning")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <form action={dispatch}>
              <AlertDialogAction type="submit" disabled={isPending}>
                {t("continue")}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
