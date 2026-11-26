
import db from "../config/database.js";

// Listar livros.
// Administrador: todos os livros.
// Usuário comum: somente seus livros.
export async function listarLivros(usuarioId = null) {
    if (usuarioId === null) {
        return db.all(`
            SELECT
                livros.*,
                autores.nome AS autor_nome
            FROM livros
            INNER JOIN autores
                ON livros.autor_id = autores.id
            ORDER BY livros.id
        `);
    }

    return db.all(`
        SELECT
            livros.*,
            autores.nome AS autor_nome
        FROM livros
        INNER JOIN autores
            ON livros.autor_id = autores.id
        WHERE livros.usuario_id = ?
        ORDER BY livros.id
    `, [usuarioId]);
}

// Buscar livro pelo ID
export async function buscarLivroPorId(id) {
    return db.get(`
        SELECT
            livros.*,
            autores.nome AS autor_nome
        FROM livros
        INNER JOIN autores
            ON livros.autor_id = autores.id
        WHERE livros.id = ?
    `, [id]);
}

// Cadastrar livro vinculado ao usuário
export async function criarLivro(livro) {
    const resultado = await db.run(
        `INSERT INTO livros
        (titulo, ano_publicacao, genero, autor_id, usuario_id)
        VALUES (?, ?, ?, ?, ?)`,
        [
            livro.titulo,
            livro.ano_publicacao,
            livro.genero,
            livro.autor_id,
            livro.usuario_id
        ]
    );

    return buscarLivroPorId(resultado.lastID);
}

// Atualizar livro
export async function atualizarLivro(id, livro, usuarioId = null) {
    if (usuarioId === null) {
        return db.run(
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

    return db.run(
        `UPDATE livros
         SET titulo = ?,
             ano_publicacao = ?,
             genero = ?,
             autor_id = ?
         WHERE id = ? AND usuario_id = ?`,
        [
            livro.titulo,
            livro.ano_publicacao,
            livro.genero,
            livro.autor_id,
            id,
            usuarioId
        ]
    );
}

// Excluir livro
export async function excluirLivro(id, usuarioId = null) {
    if (usuarioId === null) {
        return db.run(
            "DELETE FROM livros WHERE id = ?",
            [id]
        );
    }

    return db.run(
        "DELETE FROM livros WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]
    );
}

// Listar livros de um autor específico
export async function listarLivrosPorAutor(autorId, usuarioId = null) {
    if (usuarioId === null) {
        return db.all(`
            SELECT
                livros.*,
                autores.nome AS autor_nome
            FROM livros
            INNER JOIN autores
                ON livros.autor_id = autores.id
            WHERE livros.autor_id = ?
            ORDER BY livros.id
        `, [autorId]);
    }

    return db.all(`
        SELECT
            livros.*,
            autores.nome AS autor_nome
        FROM livros
        INNER JOIN autores
            ON livros.autor_id = autores.id
        WHERE livros.autor_id = ?
          AND livros.usuario_id = ?
        ORDER BY livros.id
    `, [autorId, usuarioId]);
}

// Filtrar livros por gênero
export async function filtrarLivrosPorGenero(genero, usuarioId = null) {
    if (usuarioId === null) {
        return db.all(`
            SELECT
                livros.*,
                autores.nome AS autor_nome
            FROM livros
            INNER JOIN autores
                ON livros.autor_id = autores.id
            WHERE LOWER(livros.genero) = LOWER(?)
            ORDER BY livros.id
        `, [genero]);
    }

    return db.all(`
        SELECT
            livros.*,
            autores.nome AS autor_nome
        FROM livros
        INNER JOIN autores
            ON livros.autor_id = autores.id
        WHERE LOWER(livros.genero) = LOWER(?)
          AND livros.usuario_id = ?
        ORDER BY livros.id
    `, [genero, usuarioId]);
}
