"use client";

import { useActionState, useEffect, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { EllipsisIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProgressLink } from "@/components/progress-link";
import ScrollSaver from "@/components/scroll-saver";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const createTestPosts = useCreateTestPosts();
  const deleteAllPosts = useDeleteAllPosts();

  const actions = useMemo(() => {
    return [
      { id: "create", label: t("createTestPosts"), ...createTestPosts },
      { id: "delete", label: t("deleteAllPosts"), ...deleteAllPosts },
    ];
  }, [createTestPosts, deleteAllPosts, t]);

  return (
    <>
      <div className="hidden lg:flex gap-2">
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
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ScrollSaver>
              <DropdownMenuItem asChild>
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
              </DropdownMenuItem>
            </ScrollSaver>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {actions.map(({ id, label, dispatch, isPending }) => (
                <form key={id} action={dispatch}>
                  <DropdownMenuItem asChild disabled={isPending}>
                    <button className="w-full" type="submit">
                      {label}
                    </button>
                  </DropdownMenuItem>
                </form>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

function useCreateTestPosts() {
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

  return { state, dispatch, isPending };
}

function useDeleteAllPosts() {
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

  return { state, dispatch, isPending };
}
