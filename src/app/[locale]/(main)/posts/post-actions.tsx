"use client";

import { useActionState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProgressLink } from "@/components/progress-link";
import ScrollSaver from "@/components/scroll-saver";
import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import useLocation from "@/hooks/use-location";
import { initState } from "@/lib/action";
import { QueryParamKeys } from "@/lib/queryParams";
import { Endpoints, Pages, toUrl } from "@/lib/routes";
import {
  createTestPostsAction,
  deleteAllPostsAction,
} from "@/server-actions/post";

export default function PostActions() {
  const t = useTranslations("Post");
  const location = useLocation();

  return (
    <div className="flex gap-2">
      <ScrollSaver>
        <Button asChild>
          <ProgressLink
            href={{
              pathname: toUrl(Pages.PostAdd),
              query: {
                [QueryParamKeys.Next]: location,
              },
            }}
          >
            <PlusIcon />
            {t("createPost")}
          </ProgressLink>
        </Button>
      </ScrollSaver>
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
