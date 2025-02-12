import { and, asc, desc, gt, isNull, like, lt } from "drizzle-orm";
import { NextRequest } from "next/server";

import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { cursorSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const { cursor, limit, order, search } = cursorSchema.parse(
    Object.fromEntries(req.nextUrl.searchParams)
  );

  const data = await db
    .select()
    .from(users)
    .where(
      and(
        cursor
          ? order === "asc"
            ? gt(users.id, cursor)
            : lt(users.id, cursor)
          : undefined,
        search ? like(users.name, `%${search}%`) : undefined,
        isNull(users.deletedAt)
      )
    )
    .limit(limit + 1)
    .orderBy(order === "asc" ? asc(users.id) : desc(users.id))
    .execute();

  const nextCursor = data.length > limit ? data[data.length - 2]?.id : null;

  return Response.json({
    data: {
      data: data.slice(0, limit),
      nextCursor,
    },
    message: "Successfully fetched users.",
  });
}
