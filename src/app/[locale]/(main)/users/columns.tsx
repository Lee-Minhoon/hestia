"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableHeader, SortableHeader } from "@/components/ui/data-table";
import { User } from "@/lib/db/schema";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
  },
  {
    accessorKey: "image",
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <DataTableHeader column={column}>{t?.("User.profile")}</DataTableHeader>
      );
    },
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.image || undefined} alt="profile" />
        <AvatarFallback />
      </Avatar>
    ),
  },
  {
    accessorKey: "email",
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <SortableHeader column={column}>{t?.("User.email")}</SortableHeader>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <SortableHeader column={column}>{t?.("User.name")}</SortableHeader>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <SortableHeader column={column}>
          {t?.("Schema.createdAt")}
        </SortableHeader>
      );
    },
    cell: (props) => format(props.row.original.createdAt, "yyyy-MM-dd"),
  },
  {
    accessorKey: "updatedAt",
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <SortableHeader column={column}>
          {t?.("Schema.updatedAt")}
        </SortableHeader>
      );
    },
    cell: (props) => format(props.row.original.updatedAt, "yyyy-MM-dd"),
  },
];
