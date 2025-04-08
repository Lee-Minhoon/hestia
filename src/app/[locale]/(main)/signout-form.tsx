"use client";

import { useActionState } from "react";

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

  return (
    <form action={dispatch}>
      <Button type="submit" variant={"outline"} disabled={isPending}>
        <LogOutIcon />
        {t("signout")}
      </Button>
    </form>
  );
}
