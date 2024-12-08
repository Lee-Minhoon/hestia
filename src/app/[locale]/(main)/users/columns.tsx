"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { InferSelectModel } from "drizzle-orm";
import { FaUserAlt } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableHeader, SortableHeader } from "@/components/ui/data-table";
import { users } from "@/lib/db/schema";

export const columns: ColumnDef<InferSelectModel<typeof users>>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
  },
  {
    accessorKey: "image",
    header: DataTableHeader,
    cell: ({ row }) => (
      <Avatar className="w-8 h-8">
        <AvatarImage src={row.original.image || undefined} alt="profile" />
        <AvatarFallback>
          <FaUserAlt />
        </AvatarFallback>
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
