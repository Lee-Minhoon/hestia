"use client";

import { startTransition, useActionState, useCallback } from "react";

import { LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useActionProgress } from "@/hooks/use-action-progress";
import { useActionToast } from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { signoutAction } from "@/server-actions/auth";

export default function SignoutForm() {
  const t = useTranslations("Auth");

  const [state, dispatch, isPending] = useActionState(
    signoutAction,
    initState()
  );
  useActionToast(state);
  useActionProgress(state, isPending);

  const handleSubmit = useCallback<React.FormEventHandler>(
    (e) => {
      e.preventDefault();
      startTransition(() => {
        dispatch();
      });
    },
    [dispatch]
  );

  return (
    <form action={dispatch} onSubmit={handleSubmit}>
      <Button type="submit" variant={"outline"}>
        <LogOutIcon />
        {t("signout")}
      </Button>
    </form>
  );
}
