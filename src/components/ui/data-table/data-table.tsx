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
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../button";

import { useSorting } from "./use-sorting";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
}

// https://ui.shadcn.com/docs/components/data-table
function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const { sortBy, onSortingChange } = useSorting();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting: sortBy },
    manualSorting: true,
    onSortingChange,
    meta: { searchParams: useSearchParams(), t: useTranslations() },
  });

  return (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface DataTableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children?: React.ReactNode;
}

function DataTableHeader<TData, TValue>({
  column,
  children,
}: DataTableHeaderProps<TData, TValue>) {
  return children ?? capitalCase(column.id);
}

function SortableHeader<TData, TValue>({
  column,
  children,
}: DataTableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
    >
      {children ?? capitalCase(column.id)}
      {column.getIsSorted() === "desc" ? (
        <ChevronDownIcon />
      ) : column.getIsSorted() === "asc" ? (
        <ChevronUpIcon />
      ) : (
        <ChevronsUpDownIcon />
      )}
    </Button>
  );
}

export { DataTable, DataTableHeader, SortableHeader };
