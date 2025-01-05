import { useEffect } from "react";

import { ActionState } from "@/lib/action";

import { errorToast, successToast } from "./use-toast";

export default function useActionToast(state: ActionState<unknown>) {
  useEffect(() => {
    switch (state.status) {
      case "success":
        successToast(state.message);
        break;
      case "error":
        errorToast(state.message);
        break;
    }
  }, [state]);
}
