"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { InferSelectModel } from "drizzle-orm";

import { users } from "@/lib/db/schema";

export const columns: ColumnDef<InferSelectModel<typeof users>>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (props) => format(props.row.original.createdAt, "yyyy-MM-dd"),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: (props) => format(props.row.original.updatedAt, "yyyy-MM-dd"),
  },
];
