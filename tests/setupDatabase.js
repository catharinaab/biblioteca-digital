import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import db from "../src/config/database.js";

const testsDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(testsDir, "..");

const schemaPath = resolve(
    projectRoot,
    "database",
    "schema.sql"
);

const schema = await readFile(schemaPath, "utf-8");

await db.exec(schema);

afterAll(async () => {
    await db.close();
});
