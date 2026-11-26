
import db from "./database.js";

async function adicionarColunaUsuario(tabela) {
    const colunas = await db.all(`PRAGMA table_info(${tabela})`);

    const existe = colunas.some(
        coluna => coluna.name === "usuario_id"
    );

    if (!existe) {
        await db.exec(`
            ALTER TABLE ${tabela}
            ADD COLUMN usuario_id INTEGER
            REFERENCES usuarios(id)
            ON DELETE SET NULL
        `);

        console.log(`Coluna usuario_id adicionada em ${tabela}.`);
    } else {
        console.log(`Coluna usuario_id já existe em ${tabela}.`);
    }
}

try {
    await adicionarColunaUsuario("autores");
    await adicionarColunaUsuario("livros");

    console.log("Migração concluída com sucesso!");
} catch (error) {
    console.error("Erro na migração:", error);
    process.exitCode = 1;
} finally {
    await db.close();
}
