"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useSearchParams } from "@/hooks/use-search-params";
import { parseNotification } from "@/lib/notification";
import { QueryParamKeys } from "@/lib/queryParams";

export default function Notifier() {
  const t = useTranslations("Common");

  const { searchParams, setSearchParams } = useSearchParams();

  useEffect(() => {
    const notification = searchParams.get(QueryParamKeys.Notification);

    if (!notification) return;

    const parsedNotifcation = parseNotification(notification);

    if (parsedNotifcation) {
      const { type, description } = parsedNotifcation;

      toast[type](t(type), {
        description,
        cancel: {
          label: "Dismiss",
          onClick: () => toast.dismiss(),
        },
      });
    }

    setSearchParams(
      (searchParams) => {
        searchParams.delete(QueryParamKeys.Notification);
        return searchParams;
      },
      { replace: true }
    );
  }, [searchParams, setSearchParams, t]);

  return null;
}
