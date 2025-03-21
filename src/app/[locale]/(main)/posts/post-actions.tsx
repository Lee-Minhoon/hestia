"use client";

import { useActionState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { addTestPostsAction, deleteAllPostsAction } from "@/lib/actions/post";
import { Link } from "@/lib/i18n/routing";
import { buildUrl, Endpoints, Pages, toUrl } from "@/lib/routes";

export default function PostActions() {
  return (
    <div className="flex gap-2">
      <Button asChild>
        <Link href={buildUrl(toUrl(Pages.PostAdd))}>
          <PlusIcon />
          Add Post
        </Link>
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
      <Button variant="outline" disabled={isPending}>
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
      <Button variant="outline" disabled={isPending}>
        Delete All Posts
      </Button>
    </form>
  );
}
