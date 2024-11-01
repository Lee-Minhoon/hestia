import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "./schema";

const client = new PGlite();

const db = drizzle(client, { schema });

await migrate(db, {
  migrationsFolder: path.join(process.cwd(), "drizzle"),
});

export default db;
