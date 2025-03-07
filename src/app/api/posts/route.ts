import { and, asc, desc, eq, gt, isNull, like, lt } from "drizzle-orm";
import { NextRequest } from "next/server";

import db from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { cursorSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const { cursor, limit, order, search } = cursorSchema.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const data = await db
    .select()
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(
      and(
        cursor
          ? order === "asc"
            ? gt(posts.id, cursor)
            : lt(posts.id, cursor)
          : undefined,
        search ? like(posts.title, `%${search}%`) : undefined,
        isNull(posts.deletedAt)
      )
    )
    .limit(limit + 1)
    .orderBy(order === "asc" ? asc(posts.id) : desc(posts.id))
    .execute();

  const nextCursor =
    data.length > limit ? data[data.length - 2]?.post.id : null;

  return Response.json({
    data: {
      data: data.slice(0, limit),
      nextCursor,
    },
    message: "Successfully fetched posts.",
  });
}
