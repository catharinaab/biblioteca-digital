
import db from "../config/database.js";

// Listar todos os autores
export async function listarAutores() {
    return await db.all(
        "SELECT * FROM autores ORDER BY id"
    );
}

// Buscar um autor pelo ID
export async function buscarAutorPorId(id) {
    return await db.get(
        "SELECT * FROM autores WHERE id = ?",
        [id]
    );
}

// Cadastrar um novo autor
export async function criarAutor(autor) {
    const resultado = await db.run(
        `INSERT INTO autores
        (nome, nacionalidade, ano_nascimento)
        VALUES (?, ?, ?)`,
        [
            autor.nome,
            autor.nacionalidade,
            autor.ano_nascimento
        ]
    );

    return await buscarAutorPorId(resultado.lastID);
}

// Atualizar um autor
export async function atualizarAutor(id, autor) {
    return await db.run(
        `UPDATE autores
        SET nome = ?,
            nacionalidade = ?,
            ano_nascimento = ?
        WHERE id = ?`,
        [
            autor.nome,
            autor.nacionalidade,
            autor.ano_nascimento,
            id
        ]
    );
}

// Verificar se o autor possui livros
export async function possuiLivros(id) {
    const resultado = await db.get(
        "SELECT COUNT(*) AS total FROM livros WHERE autor_id = ?",
        [id]
    );

    return resultado.total > 0;
}

// Excluir um autor
export async function excluirAutor(id) {
    return await db.run(
        "DELETE FROM autores WHERE id = ?",
        [id]
    );
}
