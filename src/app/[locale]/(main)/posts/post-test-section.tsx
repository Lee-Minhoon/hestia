"use client";

import { useActionState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { initState } from "@/lib/action";
import { addTestPostsAction, deleteAllPostsAction } from "@/lib/actions/post";
import useActionToast from "@/lib/hooks/use-action-toast";
import { Endpoints, toUrl } from "@/lib/routes";

export default function PostTestSection() {
  return (
    <div className="flex gap-2">
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
