"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useSearchParams } from "@/hooks/use-search-params";
import { QueryParamKeys } from "@/lib/queryParams";

export default function Notifier() {
  const { searchParams, setSearchParams } = useSearchParams();

  useEffect(() => {
    if (!searchParams.has(QueryParamKeys.Notification)) return;

    const notification = searchParams.get(QueryParamKeys.Notification);

    toast.success("Success", {
      description: notification,
      cancel: {
        label: "Dismiss",
        onClick: () => toast.dismiss(),
      },
    });

    setSearchParams(
      (searchParams) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(QueryParamKeys.Notification);
        return newSearchParams;
      },
      { replace: true }
    );
  }, [searchParams, setSearchParams]);

  return null;
}
