import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "./schema";

const global = globalThis as unknown as {
  client: PGlite;
};

if (!global.client) {
  global.client = new PGlite();
}

const db = drizzle(global.client, { schema });

await migrate(db, {
  migrationsFolder: path.join(process.cwd(), "drizzle"),
});

export default db;
