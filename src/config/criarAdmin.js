import "dotenv/config";
import bcrypt from "bcrypt";
import db from "./database.js";

try {
    const nome = process.env.ADMIN_NOME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const senha = process.env.ADMIN_SENHA;

    // Validar os dados necessários
    if (!nome || !email || !senha) {
        throw new Error(
            "Configure ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA no arquivo .env."
        );
    }

    if (senha.length < 8) {
        throw new Error(
            "A senha do administrador deve possuir pelo menos 8 caracteres."
        );
    }

    // Verificar se o e-mail já está cadastrado
    const existente = await db.get(
        "SELECT id, perfil FROM usuarios WHERE email = ?",
        [email]
    );

    if (existente) {
        if (existente.perfil === "admin") {
            console.log("Este administrador já está cadastrado.");
        } else {
            throw new Error(
                "Este e-mail já pertence a um usuário comum. Utilize outro e-mail."
            );
        }
    } else {
        // Gerar hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Criar administrador
        await db.run(
            `INSERT INTO usuarios (nome, email, senha_hash, perfil)
             VALUES (?, ?, ?, ?)`,
            [nome, email, senhaHash, "admin"]
        );

        console.log("Administrador cadastrado com sucesso!");
        console.log(`E-mail: ${email}`);
    }

} catch (error) {
    console.error("Erro ao criar administrador:", error.message);
    process.exitCode = 1;

} finally {
    await db.close();
}
