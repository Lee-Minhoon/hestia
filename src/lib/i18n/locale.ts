export enum Locale {
  en = "en",
  ko = "ko",
}

export const isLocale = (value: string): value is Locale => {
  return Object.values(Locale).includes(value as Locale);
};
