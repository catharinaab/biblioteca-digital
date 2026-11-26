import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const testsDir = dirname(fileURLToPath(import.meta.url));

process.env.DB_PATH = resolve(
    testsDir,
    "../database/biblioteca.test.db"
);
