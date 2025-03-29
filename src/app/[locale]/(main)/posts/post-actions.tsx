"use client";

import { useActionState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

import { ProgressLink } from "@/components/progress-link";
import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { Endpoints, Pages, toUrl } from "@/lib/routes";
import {
  addTestPostsAction,
  deleteAllPostsAction,
} from "@/server-actions/post";

export default function PostActions() {
  return (
    <div className="flex gap-2">
      <Button asChild>
        <ProgressLink href={toUrl(Pages.PostAdd)}>
          <PlusIcon />
          Add Post
        </ProgressLink>
      </Button>
      <CreateTestPostsForm />
      <DeleteAllPostsForm />
    </div>
  );
}

function CreateTestPostsForm() {
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    addTestPostsAction,
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
        Add Test Posts
      </Button>
    </form>
  );
}

function DeleteAllPostsForm() {
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
        Delete All Posts
      </Button>
    </form>
  );
}
