"use client";

import { useTranslations } from "next-intl";

import { ProgressLink } from "@/components/progress-link";
import { Button } from "@/components/ui/button";
import { Pages, toUrl } from "@/lib/routes";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 pb-16">
      <h2>{t("notFound")}</h2>
      <p>{t("notFoundDescription")}</p>
      <Button asChild>
        <ProgressLink href={toUrl(Pages.Home)}>{t("goHome")}</ProgressLink>
      </Button>
    </div>
  );
}
