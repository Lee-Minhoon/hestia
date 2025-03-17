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
    header: ({ column }) => (
      <DataTableHeader column={column}>Profile</DataTableHeader>
    ),
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.image || undefined} alt="profile" />
        <AvatarFallback />
      </Avatar>
    ),
  },
  {
    accessorKey: "email",
    header: SortableHeader,
  },
  {
    accessorKey: "name",
    header: SortableHeader,
  },
  {
    accessorKey: "createdAt",
    header: SortableHeader,
    cell: (props) => format(props.row.original.createdAt, "yyyy-MM-dd"),
  },
  {
    accessorKey: "updatedAt",
    header: SortableHeader,
    cell: (props) => format(props.row.original.updatedAt, "yyyy-MM-dd"),
  },
];
