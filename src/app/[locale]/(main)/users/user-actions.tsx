"use client";

import { useActionState, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { Endpoints, toUrl } from "@/lib/routes";
import {
  createTestUsersAction,
  deleteAllUsersAction,
} from "@/server-actions/user";

export default function UserActions() {
  return (
    <div className="flex gap-2">
      <CreateTestUsersForm />
      <DeleteAllUsersForm />
    </div>
  );
}

function CreateTestUsersForm() {
  const t = useTranslations("User");

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
      <Button type="submit" variant="outline" disabled={isPending}>
        {t("createTestUsers")}
      </Button>
    </form>
  );
}

function DeleteAllUsersForm() {
  const t = useTranslations("User");

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
      <Button type="submit" variant="outline" disabled={isPending}>
        {t("deleteAllUsers")}
      </Button>
    </form>
  );
}
