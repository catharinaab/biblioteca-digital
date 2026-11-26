
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../.."
);

const dbPath = resolve(
    projectRoot,
    "database",
    "biblioteca.db"
);

const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
});

await db.exec("PRAGMA foreign_keys = ON");

export default db;
