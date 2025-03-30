import "@tanstack/table-core";
import { useTranslations } from "next-intl";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line
  interface TableMeta<TData extends RowData> {
    searchParams: URLSearchParams;
    t: ReturnType<typeof useTranslations<never>>;
  }
}
