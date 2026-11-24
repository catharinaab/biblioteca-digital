
import db from "../config/database.js";

// Listar todos os livros
export async function listarLivros() {
    return await db.all(`
        SELECT
            livros.*,
            autores.nome AS autor_nome
        FROM livros
        INNER JOIN autores
            ON livros.autor_id = autores.id
        ORDER BY livros.id
    `);
}

// Buscar um livro pelo ID
export async function buscarLivroPorId(id) {
    return await db.get(
        `SELECT
            livros.*,
            autores.nome AS autor_nome
        FROM livros
        INNER JOIN autores
            ON livros.autor_id = autores.id
        WHERE livros.id = ?`,
        [id]
    );
}

// Cadastrar um novo livro
export async function criarLivro(livro) {
    const resultado = await db.run(
        `INSERT INTO livros
        (titulo, ano_publicacao, genero, autor_id)
        VALUES (?, ?, ?, ?)`,
        [
            livro.titulo,
            livro.ano_publicacao,
            livro.genero,
            livro.autor_id
        ]
    );

    return await buscarLivroPorId(resultado.lastID);
}

// Atualizar um livro
export async function atualizarLivro(id, livro) {
    return await db.run(
        `UPDATE livros
        SET titulo = ?,
            ano_publicacao = ?,
            genero = ?,
            autor_id = ?
        WHERE id = ?`,
        [
            livro.titulo,
            livro.ano_publicacao,
            livro.genero,
            livro.autor_id,
            id
        ]
    );
}

// Excluir um livro
export async function excluirLivro(id) {
    return await db.run(
        "DELETE FROM livros WHERE id = ?",
        [id]
    );
}


// Listar livros de um autor específico
export async function listarLivrosPorAutor(autorId) {
    return await db.all(
        `SELECT
            livros.*,
            autores.nome AS autor_nome
        FROM livros
        INNER JOIN autores
            ON livros.autor_id = autores.id
        WHERE livros.autor_id = ?
        ORDER BY livros.id`,
        [autorId]
    );
}


// Filtrar livros por gênero
export async function filtrarLivrosPorGenero(genero) {
    return await db.all(
        `SELECT
            livros.*,
            autores.nome AS autor_nome
        FROM livros
        INNER JOIN autores
            ON livros.autor_id = autores.id
        WHERE LOWER(livros.genero) = LOWER(?)
        ORDER BY livros.id`,
        [genero]
    );
}
