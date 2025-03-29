import { toast } from "sonner";
import { z } from "zod";

import { Optional } from "@/types/common";

type AvailableToastTypes = keyof Pick<
  typeof toast,
  "success" | "info" | "warning" | "error"
>;

function typeIsKeyOfToast(type: string): type is AvailableToastTypes {
  return type in toast;
}

const notificationSchema = z.object({
  type: z.string().refine(typeIsKeyOfToast),
  description: z.string(),
});

export function makeNotification({
  type,
  description,
}: z.infer<typeof notificationSchema>) {
  return JSON.stringify({ type, description });
}

export function parseNotification(
  notification: string
): Optional<z.infer<typeof notificationSchema>> {
  const { data } = notificationSchema.safeParse(JSON.parse(notification));
  return data;
}
