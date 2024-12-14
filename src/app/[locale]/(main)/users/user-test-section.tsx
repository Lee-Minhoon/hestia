"use client";

import { useActionState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { initState } from "@/lib/action";
import { addTestUsersAction, deleteAllUsersAction } from "@/lib/actions/user";
import useActionToast from "@/lib/hooks/use-action-toast";
import { Endpoints, toUrl } from "@/lib/routes";

export default function UserTestSection() {
  return (
    <div className="flex gap-2">
      <AddTestUsersForm />
      <DeleteAllUsersForm />
    </div>
  );
}

const AddTestUsersForm = () => {
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    addTestUsersAction,
    initState()
  );

  useActionToast(state);

  useEffect(() => {
    if (state.status === "idle") return;
    queryClient.invalidateQueries({ queryKey: [toUrl(Endpoints.Users)] });
  }, [queryClient, state.status]);

  return (
    <form action={dispatch}>
      <Button variant="outline" disabled={isPending}>
        Add Test Users
      </Button>
    </form>
  );
};

const DeleteAllUsersForm = () => {
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    deleteAllUsersAction,
    initState()
  );

  useActionToast(state);

  useEffect(() => {
    if (state.status === "idle") return;
    queryClient.invalidateQueries({ queryKey: [toUrl(Endpoints.Users)] });
  }, [queryClient, state.status]);

  return (
    <form action={dispatch}>
      <Button variant="outline" disabled={isPending}>
        Delete All Users
      </Button>
    </form>
  );
};
