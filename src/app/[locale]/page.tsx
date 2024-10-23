import { useTranslations } from "next-intl";

import { ThemeSwitcher } from "@/components/controls/theme-switcher";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div>
      <h1>{t("title")}</h1>
      <Button>Click Me!</Button>
      <div>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
