"use client";

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { capitalCase } from "change-case";
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

import { usePagination } from "./use-pagination";
import { useSorting } from "./use-sorting";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
}

const pageRange = 10;

// https://ui.shadcn.com/docs/components/data-table
function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const { pagination, onPaginationChange } = usePagination();
  const { sortBy, onSortingChange } = useSorting();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount,
    state: { pagination, sorting: sortBy },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange,
    onSortingChange,
  });

  const maxPage =
    rowCount > 0 ? Math.ceil(rowCount / pagination.pageSize) - 1 : 0;
  const pageIndex = Math.min(maxPage, pagination.pageIndex);
  const startPage = Math.floor(pageIndex / pageRange) * pageRange;
  const pageCount = Math.min(pageRange, table.getPageCount() - startPage);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={table.previousPage}
              disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>
          {Array.from({ length: pageCount }, (_, i) => startPage + i).map(
            (page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => table.setPageIndex(page)}
                  isActive={pagination.pageIndex === page}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={table.nextPage}
              disabled={!table.getCanNextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children?: React.ReactNode;
}

function SortableHeader<TData, TValue>({
  column,
  children,
}: SortableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
    >
      {children ?? capitalCase(column.id)}
      {column.getIsSorted() === "desc" ? (
        <TiArrowSortedDown />
      ) : column.getIsSorted() === "asc" ? (
        <TiArrowSortedUp />
      ) : (
        <TiArrowUnsorted />
      )}
    </Button>
  );
}

export { DataTable, SortableHeader };
