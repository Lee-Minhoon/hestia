"use client";

import { useActionState, useEffect, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { Endpoints, toUrl } from "@/lib/routes";
import {
  createTestUsersAction,
  deleteAllUsersAction,
} from "@/server-actions/user";

export default function UserActions() {
  const t = useTranslations("User");

  const createTestUsers = useCreateTestUsers();
  const deleteAllUsers = useDeleteAllUsers();

  const actions = useMemo(() => {
    return [
      { id: "create", label: t("createTestUsers"), ...createTestUsers },
      { id: "delete", label: t("deleteAllUsers"), ...deleteAllUsers },
    ];
  }, [createTestUsers, deleteAllUsers, t]);

  return (
    <>
      <div className="hidden lg:flex gap-2">
        {actions.map(({ id, label, dispatch, isPending }) => (
          <form key={id} action={dispatch}>
            <Button type="submit" variant="outline" disabled={isPending}>
              {label}
            </Button>
          </form>
        ))}
      </div>
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map(({ id, label, dispatch, isPending }) => (
              <form key={id} action={dispatch}>
                <DropdownMenuItem asChild disabled={isPending}>
                  <button className="w-full" type="submit">
                    {label}
                  </button>
                </DropdownMenuItem>
              </form>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

function useCreateTestUsers() {
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

  return { state, dispatch, isPending };
}

function useDeleteAllUsers() {
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

  return { state, dispatch, isPending };
}
