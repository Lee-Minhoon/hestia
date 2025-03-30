"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 pb-16">
      <h2>{t("message")}</h2>
      <Button onClick={reset}>{t("tryAgain")}</Button>
    </div>
  );
}
