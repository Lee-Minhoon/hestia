/* eslint-disable @typescript-eslint/no-unused-vars */
import "@tanstack/table-core";
import { useTranslations } from "next-intl";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    searchParams: URLSearchParams;
    t: ReturnType<typeof useTranslations<never>>;
  }

  interface ColumnMeta<TData extends RowData, TValue = unknown> {
    className?: string;
  }
}
