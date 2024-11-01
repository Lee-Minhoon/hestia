import { eq } from "drizzle-orm";

import db from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function UserTest() {
  const result = await db.query.users.findMany({
    where: eq(users.id, 1),
  });

  return (
    <div>
      <p>{`Username: ${result[0]?.username}`}</p>
    </div>
  );
}
