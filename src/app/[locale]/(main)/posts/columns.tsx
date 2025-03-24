"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SortableHeader } from "@/components/ui/data-table";
import { PostWithUser } from "@/lib/db/schema";
import { Link } from "@/lib/i18n/navigation";
import { QueryParamKeys } from "@/lib/queryParams";
import { buildUrl, Pages, toUrl } from "@/lib/routes";

const columnHelper = createColumnHelper<PostWithUser>();

export const columns = [
  columnHelper.accessor("post.id", {
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
  }),
  columnHelper.accessor("user.id", {
    header: SortableHeader,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 max-w-28 overflow-hidden">
        <Avatar>
          <AvatarImage
            src={row.original.user?.image ?? undefined}
            alt="profile"
          />
          <AvatarFallback />
        </Avatar>
        <span className="truncate">{row.original.user?.name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("post.title", {
    header: SortableHeader,
    cell: ({ row, table }) => {
      const { searchParams } = table.options.meta ?? {};
      return (
        <div className="max-w-sm truncate">
          <Link
            href={buildUrl(toUrl(Pages.Posts, { id: row.original.post.id }), {
              [QueryParamKeys.Next]: buildUrl(toUrl(Pages.Posts), searchParams),
            })}
            className="hover:underline"
          >
            {row.original.post.title}
          </Link>
        </div>
      );
    },
  }),
  columnHelper.accessor("post.createdAt", {
    header: SortableHeader,
    cell: ({ row }) => format(row.original.post.updatedAt, "yyyy-MM-dd"),
  }),
  columnHelper.accessor("post.updatedAt", {
    header: SortableHeader,
    cell: ({ row }) => format(row.original.post.updatedAt, "yyyy-MM-dd"),
  }),
];
