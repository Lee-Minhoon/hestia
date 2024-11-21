import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";

export default function UserTest() {
  return (
    <form
      action={async () => {
        "use server";

        await db
          .insert(users)
          .values(
            Array.from({ length: 1000 }).map((_, i) => {
              return {
                id: `user-${i + 1}`,
                name: `User ${i + 1}`,
                email: `User ${i + 1}@gmail.com`,
              };
            })
          )
          .execute();
      }}
    >
      <Button>Add Test Users</Button>
    </form>
  );
}
