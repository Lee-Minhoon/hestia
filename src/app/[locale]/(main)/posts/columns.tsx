"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { FaUserAlt } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SortableHeader } from "@/components/ui/data-table";
import { PostWithUser } from "@/lib/db/schema";

const columnHelper = createColumnHelper<PostWithUser>();

export const columns = [
  columnHelper.accessor("post.id", {
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
  }),
  columnHelper.accessor("user.id", {
    header: SortableHeader,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={row.original.user?.image || undefined}
            alt="profile"
          />
          <AvatarFallback>
            <FaUserAlt />
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{row.original.user?.name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("post.title", {
    header: SortableHeader,
  }),
  columnHelper.accessor("post.content", {
    header: SortableHeader,
    cell: (props) => (
      <p className="max-w-sm truncate">{props.row.original.post.content}</p>
    ),
  }),
  columnHelper.accessor("post.createdAt", {
    header: SortableHeader,
    cell: (props) => format(props.row.original.post.updatedAt, "yyyy-MM-dd"),
  }),
  columnHelper.accessor("post.updatedAt", {
    header: SortableHeader,
    cell: (props) => format(props.row.original.post.updatedAt, "yyyy-MM-dd"),
  }),
];
