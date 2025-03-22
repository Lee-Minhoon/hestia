import { useCallback, useEffect } from "react";

import { capitalCase } from "change-case";
import { toast } from "sonner";

import { ActionState } from "@/lib/action";

function useActionToast(state: ActionState<unknown>) {
  const handleDissmiss = useCallback(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    if (state.status === "idle") return;
    toast[state.status](capitalCase(state.status), {
      description: state.message,
      cancel: {
        label: "Dismiss",
        onClick: handleDissmiss,
      },
    });
  }, [handleDissmiss, state]);
}

export { useActionToast };
