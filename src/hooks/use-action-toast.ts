import { useCallback, useEffect } from "react";

import { toast } from "sonner";

import { ActionState } from "@/lib/action";

function useActionToast(state: ActionState<unknown>) {
  const handleDissmiss = useCallback(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    if (state.status === "idle") return;
    toast[state.status]("Success", {
      description: state.message,
      cancel: {
        label: "Dismiss",
        onClick: handleDissmiss,
      },
    });
  }, [handleDissmiss, state]);
}

export { useActionToast };
