"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import useActionToast from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { addTestUsersAction } from "@/lib/actions/user";

export default function UserTest() {
  const [state, dispatch, isPending] = useActionState(
    addTestUsersAction,
    initState()
  );
  useActionToast(state);

  return (
    <form action={dispatch}>
      <Button disabled={isPending}>Add Test Users</Button>
    </form>
  );
}
