type Messages = typeof import("../lib/i18n/locales/en.json");

// eslint-disable-next-line
declare interface IntlMessages extends Messages {}

import "@tanstack/table-core";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line
  interface TableMeta<TData extends RowData> {
    searchParams: URLSearchParams;
  }
}
