import db from "../config/database.js";

// Busca um usuário pelo e-mail.
// Inclui o hash da senha, necessário para validar o login.
export async function buscarPorEmail(email) {
    return db.get(
        `SELECT id, nome, email, senha_hash, perfil
         FROM usuarios
         WHERE email = ?`,
        [email]
    );
}

// Busca um usuário pelo ID.
// Não retorna o hash da senha.
export async function buscarPorId(id) {
    return db.get(
        `SELECT id, nome, email, perfil, criado_em
         FROM usuarios
         WHERE id = ?`,
        [id]
    );
}

// Cadastra um novo usuário.
export async function criar({ nome, email, senhaHash }) {
    const resultado = await db.run(
        `INSERT INTO usuarios (nome, email, senha_hash)
         VALUES (?, ?, ?)`,
        [nome, email, senhaHash]
    );

    return buscarPorId(resultado.lastID);
}
