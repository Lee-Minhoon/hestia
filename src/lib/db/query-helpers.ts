import { asc, desc, getTableColumns, SQL } from "drizzle-orm";
import { PgSelect, PgTable } from "drizzle-orm/pg-core";

export function withPagination<T extends PgSelect>(
  qb: T,
  pageIndex: number,
  pageSize: number
) {
  return qb
    .limit(pageSize)
    .offset(Math.max(pageIndex - 1, 0) * Math.max(pageSize, 10));
}

interface SortBy<T extends PgTable> {
  table: T;
  column: string;
  order: string;
  sortableColumns?: (keyof T["_"]["columns"])[];
}

export function withSorting<T extends PgSelect, S extends PgTable>(
  qb: T,
  sortBy?: SortBy<S>[]
) {
  if (!sortBy) {
    return qb;
  }

  const orderColumns: SQL[] = [];

  for (const { table, column, order, sortableColumns } of sortBy) {
    // check if sortBy is in the format of column.order
    if (!column || !order) {
      continue;
    }

    // if sortableColumns is provided, check if column is in the list
    if (sortableColumns && !sortableColumns.includes(column)) {
      continue;
    }

    // check if column exists in the table
    const columns = getTableColumns(table);
    if (!columns[column]) {
      continue;
    }

    orderColumns.push(
      order === "desc" ? desc(columns[column]) : asc(columns[column])
    );
  }

  return orderColumns.length ? qb.orderBy(...orderColumns) : qb;
}
