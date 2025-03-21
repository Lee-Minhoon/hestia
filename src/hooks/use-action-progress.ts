import { useEffect } from "react";

import nProgress from "nprogress";

import { ActionState } from "@/lib/action";

function useActionProgress(state: ActionState<unknown>, isPending: boolean) {
  useEffect(() => {
    if (isPending) {
      nProgress.start();
    } else if (state.status !== "idle") {
      nProgress.done();
    }
  }, [isPending, state.status]);
}

export { useActionProgress };
