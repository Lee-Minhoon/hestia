"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import useActionToast from "@/hooks/use-action-toast";
import { initState } from "@/lib/action";
import { addTestUsersAction, deleteAllUsersAction } from "@/lib/actions/user";

export default function UserTestSection() {
  return (
    <div className="flex gap-2">
      <AddTestUsersForm />
      <DeleteAllUsersForm />
    </div>
  );
}

const AddTestUsersForm = () => {
  const [state, dispatch, isPending] = useActionState(
    addTestUsersAction,
    initState()
  );

  useActionToast(state);

  return (
    <form action={dispatch}>
      <Button variant="outline" disabled={isPending}>
        Add Test Users
      </Button>
    </form>
  );
};

export function DeleteAllUsersForm() {
  const [state, dispatch, isPending] = useActionState(
    deleteAllUsersAction,
    initState()
  );

  useActionToast(state);

  return (
    <form action={dispatch}>
      <Button variant="outline" disabled={isPending}>
        Delete All Users
      </Button>
    </form>
  );
}
