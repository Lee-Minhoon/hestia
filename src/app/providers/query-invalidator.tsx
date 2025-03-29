"use client";

import { useEffect } from "react";

import { QueryKey, useQueryClient } from "@tanstack/react-query";

import { resolveQueryInvalidation } from "@/lib/react-query/invalidation";

interface QueryInvalidatorProps {
  queryKeys: QueryKey[];
}

export default function QueryInvalidator({ queryKeys }: QueryInvalidatorProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey }).then(() => {
        resolveQueryInvalidation(queryKey);
      });
    });
  }, [queryClient, queryKeys]);

  return null;
}
