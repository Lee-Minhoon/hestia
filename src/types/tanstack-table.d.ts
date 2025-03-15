import "@tanstack/table-core";

declare module "@tanstack/table-core" {
  // eslint-disable-next-line
  interface TableMeta<TData extends RowData> {
    searchParams: URLSearchParams;
  }
}
