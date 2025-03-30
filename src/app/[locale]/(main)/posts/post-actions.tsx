"use client";

import { useActionState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProgressLink } from "@/components/progress-link";
import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { Endpoints, Pages, toUrl } from "@/lib/routes";
import {
  createTestPostsAction,
  deleteAllPostsAction,
} from "@/server-actions/post";

export default function PostActions() {
  const t = useTranslations("Post");

  return (
    <div className="flex gap-2">
      <Button asChild>
        <ProgressLink href={toUrl(Pages.PostAdd)}>
          <PlusIcon />
          {t("createPost")}
        </ProgressLink>
      </Button>
      <CreateTestPostsForm />
      <DeleteAllPostsForm />
    </div>
  );
}

function CreateTestPostsForm() {
  const t = useTranslations("Post");
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    createTestPostsAction,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  useEffect(() => {
    if (state.status === "idle") return;
    queryClient.invalidateQueries({ queryKey: [toUrl(Endpoints.Posts)] });
  }, [queryClient, state]);

  return (
    <form action={dispatch}>
      <Button type="submit" variant="outline" disabled={isPending}>
        {t("createTestPosts")}
      </Button>
    </form>
  );
}

function DeleteAllPostsForm() {
  const t = useTranslations("Post");
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    deleteAllPostsAction,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  useEffect(() => {
    if (state.status === "idle") return;
    queryClient.invalidateQueries({ queryKey: [toUrl(Endpoints.Posts)] });
  }, [queryClient, state]);

  return (
    <form action={dispatch}>
      <Button type="submit" variant="outline" disabled={isPending}>
        {t("deleteAllPosts")}
      </Button>
    </form>
  );
}
