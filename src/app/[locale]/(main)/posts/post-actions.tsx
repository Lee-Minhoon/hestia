"use client";

import { useActionState, useEffect } from "react";

import { PlusIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { initState } from "@/lib/action";
import { addTestPostsAction, deleteAllPostsAction } from "@/lib/actions/post";
import useActionToast from "@/lib/hooks/use-action-toast";
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
      <AddTestPostsForm />
      <DeleteAllPostsForm />
    </div>
  );
}

const AddTestPostsForm = () => {
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    addTestPostsAction,
    initState()
  );

  useActionToast(state);

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
};

const DeleteAllPostsForm = () => {
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    deleteAllPostsAction,
    initState()
  );

  useActionToast(state);

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
};
