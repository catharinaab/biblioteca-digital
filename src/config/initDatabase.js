import db from "./database.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../.."
);

async function inicializarBanco() {
    try {
        // Lendo os arquivos SQL
        const schema = readFileSync(
            resolve(projectRoot, "database/schema.sql"),
            "utf-8"
        );

        const seed = readFileSync(
            resolve(projectRoot, "database/seed.sql"),
            "utf-8"
        );

        // Criando as tabelas antes de consultar qualquer uma delas
        await db.exec(schema);

        console.log("Estrutura do banco de dados criada/verificada!");

        // Verificando a quantidade de usuários
        const usuarios = await db.get(
            "SELECT COUNT(*) AS total FROM usuarios"
        );

        console.log(`Usuários cadastrados: ${usuarios.total}`);

        // Verificando se já existem autores
        const resultado = await db.get(
            "SELECT COUNT(*) AS total FROM autores"
        );

        // Inserindo dados somente se o banco estiver vazio
        if (resultado.total === 0) {
            await db.exec(seed);
            console.log("Dados de exemplo inseridos!");
        } else {
            console.log("O banco já possui dados. Seed ignorado.");
        }

        // Conferindo os registros
        const autores = await db.all(
            "SELECT * FROM autores"
        );

        const livros = await db.all(
            "SELECT * FROM livros"
        );

        console.log("Autores cadastrados:", autores.length);
        console.log("Livros cadastrados:", livros.length);

        console.log("Banco de dados inicializado com sucesso!");

    } catch (error) {
        console.error("Erro ao inicializar o banco:", error.message);
        process.exitCode = 1;

    } finally {
        await db.close();
    }
}

await inicializarBanco();
