import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/database.js";

// Limpa os dados antes de cada teste
beforeEach(async () => {
    await db.run("DELETE FROM livros");
    await db.run("DELETE FROM autores");
    await db.run("DELETE FROM usuarios");
});

// Função auxiliar para cadastrar um usuário
async function cadastrarUsuario() {
    return request(app)
        .post("/usuarios/cadastro")
        .send({
            nome: "Usuário de Teste",
            email: "teste@biblioteca.com",
            senha: "Senha123!"
        });
}

describe("Testes de autenticação e autorização", () => {

    test("deve realizar login com sucesso", async () => {
        await cadastrarUsuario();

        const resposta = await request(app)
            .post("/usuarios/login")
            .send({
                email: "teste@biblioteca.com",
                senha: "Senha123!"
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body.token).toBeDefined();
    });

    test("deve rejeitar login com senha incorreta", async () => {
        await cadastrarUsuario();

        const resposta = await request(app)
            .post("/usuarios/login")
            .send({
                email: "teste@biblioteca.com",
                senha: "senhaerrada"
            });

        expect(resposta.status).toBe(401);
    });

    test("deve bloquear acesso à rota protegida sem token", async () => {
        const resposta = await request(app)
            .get("/usuarios/perfil");

        expect(resposta.status).toBe(401);
    });

    test("deve impedir usuário comum de acessar rota administrativa", async () => {
        await cadastrarUsuario();

        const login = await request(app)
            .post("/usuarios/login")
            .send({
                email: "teste@biblioteca.com",
                senha: "Senha123!"
            });

        const resposta = await request(app)
            .get("/usuarios/admin")
            .set("Authorization", `Bearer ${login.body.token}`);

        expect(resposta.status).toBe(403);
    });

});
