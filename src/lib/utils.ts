import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "";
};

export function getRootFontSize() {
  if (typeof window === "undefined") {
    return 16;
  }
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function toRem(n: number) {
  return n * getRootFontSize();
}
