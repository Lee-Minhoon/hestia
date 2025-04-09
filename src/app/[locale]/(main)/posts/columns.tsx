"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";

import { ProgressLink } from "@/components/progress-link";
import ScrollSaver from "@/components/scroll-saver";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SortableHeader } from "@/components/ui/data-table";
import { PostWithUser } from "@/lib/db/schema";
import { QueryParamKeys } from "@/lib/queryParams";
import { buildUrl, Pages, toUrl } from "@/lib/routes";

const columnHelper = createColumnHelper<PostWithUser>();

export const columns = [
  columnHelper.accessor("post.id", {
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
  }),
  columnHelper.accessor("user.id", {
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <SortableHeader column={column}>{t?.("Post.author")}</SortableHeader>
      );
    },
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
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <SortableHeader column={column}>{t?.("Post.title")}</SortableHeader>
      );
    },
    cell: ({ row, table }) => {
      const { searchParams } = table.options.meta ?? {};
      return (
        <div className="max-w-sm truncate">
          <ScrollSaver>
            <ProgressLink
              href={{
                pathname: toUrl(Pages.Posts, { id: row.original.post.id }),
                query: {
                  [QueryParamKeys.Next]: buildUrl(
                    toUrl(Pages.Posts),
                    searchParams
                  ),
                },
              }}
              className="hover:underline"
            >
              {row.original.post.title}
            </ProgressLink>
          </ScrollSaver>
        </div>
      );
    },
  }),
  columnHelper.accessor("post.createdAt", {
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <SortableHeader column={column}>
          {t?.("Schema.createdAt")}
        </SortableHeader>
      );
    },
    cell: ({ row }) => format(row.original.post.updatedAt, "yyyy-MM-dd"),
    meta: {
      className: "hidden md:table-cell",
    },
  }),
  columnHelper.accessor("post.updatedAt", {
    header: ({ table, column }) => {
      const t = table.options.meta?.t;
      return (
        <SortableHeader column={column}>
          {t?.("Schema.updatedAt")}
        </SortableHeader>
      );
    },
    cell: ({ row }) => format(row.original.post.updatedAt, "yyyy-MM-dd"),
    meta: {
      className: "hidden md:table-cell",
    },
  }),
];
