"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { capitalize } from "lodash-es";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const themeOptions = ["light", "dark", "system"];

// https://ui.shadcn.com/docs/dark-mode/next
const ThemeSwitcher = () => {
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
        {themeOptions.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
            {capitalize(theme)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
