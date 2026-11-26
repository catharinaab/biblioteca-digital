
import db from "../config/database.js";

// Listar autores.
// Administrador: todos os autores.
// Usuário comum: somente seus autores.
export async function listarAutores(usuarioId = null) {
    if (usuarioId === null) {
        return db.all(
            "SELECT * FROM autores ORDER BY id"
        );
    }

    return db.all(
        "SELECT * FROM autores WHERE usuario_id = ? ORDER BY id",
        [usuarioId]
    );
}

// Buscar um autor pelo ID
export async function buscarAutorPorId(id) {
    return db.get(
        "SELECT * FROM autores WHERE id = ?",
        [id]
    );
}

// Cadastrar autor vinculado ao usuário
export async function criarAutor(autor) {
    const resultado = await db.run(
        `INSERT INTO autores
        (nome, nacionalidade, ano_nascimento, usuario_id)
        VALUES (?, ?, ?, ?)`,
        [
            autor.nome,
            autor.nacionalidade,
            autor.ano_nascimento,
            autor.usuario_id
        ]
    );

    return buscarAutorPorId(resultado.lastID);
}

// Atualizar autor
export async function atualizarAutor(id, autor, usuarioId = null) {
    if (usuarioId === null) {
        return db.run(
            `UPDATE autores
             SET nome = ?, nacionalidade = ?, ano_nascimento = ?
             WHERE id = ?`,
            [
                autor.nome,
                autor.nacionalidade,
                autor.ano_nascimento,
                id
            ]
        );
    }

    return db.run(
        `UPDATE autores
         SET nome = ?, nacionalidade = ?, ano_nascimento = ?
         WHERE id = ? AND usuario_id = ?`,
        [
            autor.nome,
            autor.nacionalidade,
            autor.ano_nascimento,
            id,
            usuarioId
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

// Excluir autor
export async function excluirAutor(id, usuarioId = null) {
    if (usuarioId === null) {
        return db.run(
            "DELETE FROM autores WHERE id = ?",
            [id]
        );
    }

    return db.run(
        "DELETE FROM autores WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]
    );
}
