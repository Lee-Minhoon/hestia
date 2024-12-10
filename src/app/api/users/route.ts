import { asc, desc, gt, lt } from "drizzle-orm";
import { NextRequest } from "next/server";

import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { parseCursor } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const { cursor, limit, order } = parseCursor({
    cursor: searchParams.get("cursor"),
    limit: searchParams.get("limit"),
    order: searchParams.get("order"),
  });

  const data = await db
    .select()
    .from(users)
    .where(
      cursor
        ? order === "desc"
          ? lt(users.id, cursor)
          : gt(users.id, cursor)
        : undefined
    )
    .limit(limit + 1)
    .orderBy(order === "desc" ? desc(users.id) : asc(users.id))
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
