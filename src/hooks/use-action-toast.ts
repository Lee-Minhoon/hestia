import { useCallback, useEffect } from "react";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ActionState } from "@/lib/action";

function useActionToast(state: ActionState<unknown>) {
  const t = useTranslations("Common");

  const handleDissmiss = useCallback(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    if (state.status === "idle") return;
    toast[state.status](t(state.status), {
      description: state.message,
      cancel: {
        label: "Dismiss",
        onClick: handleDissmiss,
      },
    });
  }, [handleDissmiss, state, t]);
}

export { useActionToast };
