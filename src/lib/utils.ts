import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleAction<TData, TResponse>(
  action: (data: TData) => TResponse
) {
  return async (data: TData) => {
    try {
      await action(data);
      toast({
        title: "Success",
        description: "Your action was successful",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };
}
