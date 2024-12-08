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
          duration: 2000,
        });
        break;
      case "error":
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
          duration: 2000,
        });
        break;
    }
  }, [state]);
}
