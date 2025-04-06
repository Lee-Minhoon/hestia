import { useCallback, useEffect, useMemo } from "react";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ActionState } from "@/lib/action";

function useActionToast(state: ActionState<unknown>) {
  const t = useTranslations("Common");

  const handleDissmiss = useCallback(() => {
    toast.dismiss();
  }, []);

  const title = useMemo(() => {
    if (state.status === "idle") return "";
    return t(state.status);
  }, [state.status, t]);

  const dismissLabel = useMemo(() => t("dismiss"), [t]);

  useEffect(() => {
    if (state.status === "idle") return;
    toast[state.status](title, {
      description: state.message,
      cancel: {
        label: dismissLabel,
        onClick: handleDissmiss,
      },
    });
  }, [dismissLabel, handleDissmiss, state, title]);
}

export { useActionToast };
