import db from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST() {
  const results = await db
    .insert(users)
    .values({
      email: "john@example.com",
      password: "password",
      username: "John Doe",
    })
    .returning({ insertedId: users.id });
  return Response.json({ data: results[0].insertedId }, { status: 201 });
}
