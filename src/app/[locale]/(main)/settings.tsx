import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeSwitcher } from "@/components/controls/theme-switcher";

export default function Settings() {
  return (
    <nav>
      <ul className="flex gap-2">
        <li>
          <LocaleSwitcher />
        </li>
        <li>
          <ThemeSwitcher />
        </li>
      </ul>
    </nav>
  );
}
