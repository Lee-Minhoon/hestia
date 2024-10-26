import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeSwitcher } from "@/components/controls/theme-switcher";
import { Button } from "@/components/ui/button";

import QueryTest from "./query-test";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div>
      <h1>{t("title")}</h1>
      <Button>Click Me!</Button>
      <div>
        <ThemeSwitcher />
      </div>
      <div>
        <LocaleSwitcher />
      </div>
      <QueryTest />
    </div>
  );
}
