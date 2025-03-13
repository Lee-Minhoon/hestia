import { useEffect } from "react";

import { toast } from "sonner";

import { ActionState } from "@/lib/action";

export default function useActionToast(state: ActionState<unknown>) {
  useEffect(() => {
    switch (state.status) {
      case "success":
        toast.success("Success", {
          description: state.message,
          cancel: {
            label: "Dismiss",
            onClick: () => toast.dismiss(),
          },
        });
        break;
      case "error":
        toast.error("Error", {
          description: state.message,
          cancel: {
            label: "Dismiss",
            onClick: () => toast.dismiss(),
          },
        });
        break;
    }
  }, [state]);
}
