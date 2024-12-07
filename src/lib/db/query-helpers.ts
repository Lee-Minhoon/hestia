import { asc, desc, getTableColumns } from "drizzle-orm";
import { PgSelect, PgTable } from "drizzle-orm/pg-core";

export function withPagination<T extends PgSelect>(
  qb: T,
  pageIndex: number,
  pageSize: number
) {
  return qb.limit(pageSize).offset((pageIndex - 1) * pageSize);
}

export function withSorting<T extends PgSelect, S extends PgTable>(
  qb: T,
  table: S,
  sortBy?: string,
  sortableColumns?: (keyof S["_"]["columns"])[]
) {
  if (!sortBy) {
    return qb;
  }

  // check if sortBy is in the format of column.order
  const [column, order] = sortBy.split(".");
  if (!column || !order) {
    return qb;
  }

  // if sortableColumns is provided, check if column is in the list
  if (sortableColumns && !sortableColumns.includes(column)) {
    return qb;
  }

  // check if column exists in the table
  const columns = getTableColumns(table);
  if (!columns[column]) {
    return qb;
  }

  return qb.orderBy(
    order === "desc" ? desc(columns[column]) : asc(columns[column])
  );
}
