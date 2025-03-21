"use client";

import { useActionState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import {
  createTestUsersAction,
  deleteAllUsersAction,
} from "@/lib/actions/user";
import { Endpoints, toUrl } from "@/lib/routes";

export default function UserActions() {
  return (
    <div className="flex gap-2">
      <CreateTestUsersForm />
      <DeleteAllUsersForm />
    </div>
  );
}

function CreateTestUsersForm() {
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    createTestUsersAction,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  useEffect(() => {
    if (state.status === "idle") return;
    queryClient.invalidateQueries({ queryKey: [toUrl(Endpoints.Users)] });
  }, [queryClient, state]);

  return (
    <form action={dispatch}>
      <Button variant="outline" disabled={isPending}>
        Add Test Users
      </Button>
    </form>
  );
}

function DeleteAllUsersForm() {
  const queryClient = useQueryClient();

  const [state, dispatch, isPending] = useActionState(
    deleteAllUsersAction,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  useEffect(() => {
    if (state.status === "idle") return;
    queryClient.invalidateQueries({ queryKey: [toUrl(Endpoints.Users)] });
  }, [queryClient, state]);

  return (
    <form action={dispatch}>
      <Button variant="outline" disabled={isPending}>
        Delete All Users
      </Button>
    </form>
  );
}
