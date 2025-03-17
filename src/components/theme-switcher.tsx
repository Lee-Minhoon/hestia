"use client";

import { capitalize } from "lodash-es";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const themeOptions = [
  {
    icon: <SunIcon className="size-4" />,
    value: "light",
  },
  {
    icon: <MoonIcon className="size-4" />,
    value: "dark",
  },
  {
    icon: <SunMoonIcon className="size-4" />,
    value: "system",
  },
];

// https://ui.shadcn.com/docs/dark-mode/next
function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map(({ icon, value }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            {icon}
            {capitalize(value)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ThemeSwitcher };
