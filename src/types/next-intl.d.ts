import { SharedUnionFieldsDeep, TupleToUnion } from "type-fest";

import enMessages from "@/lib/i18n/locales/en.json";
import koMessages from "@/lib/i18n/locales/ko.json";
import { formats } from "@/lib/i18n/request";
import { routing } from "@/lib/i18n/routing";

type Messages = [typeof enMessages, typeof koMessages];

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: SharedUnionFieldsDeep<TupleToUnion<typeof messages>>;
    Formats: typeof formats;
  }
}
