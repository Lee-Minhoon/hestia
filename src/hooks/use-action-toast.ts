import { useEffect } from "react";

import { ActionState } from "@/lib/action";

import { toast } from "./use-toast";

export default function useActionToast(state: ActionState<unknown>) {
  useEffect(() => {
    switch (state.status) {
      case "success":
        toast({
          title: "Success",
          description: state.message,
        });
        break;
      case "error":
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
        break;
    }
  }, [state]);
}
