import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/database.js";

const usuario1 = {
    nome: "Usuário Um",
    email: "usuario1@biblioteca.com",
    senha: "Senha123!"
};

const usuario2 = {
    nome: "Usuário Dois",
    email: "usuario2@biblioteca.com",
    senha: "Senha123!"
};

let token1;
let token2;
let autorId;
let livroId;

async function cadastrarELogar(usuario) {
    await request(app)
        .post("/usuarios/cadastro")
        .send(usuario);

    const resposta = await request(app)
        .post("/usuarios/login")
        .send({
            email: usuario.email,
            senha: usuario.senha
        });

    return resposta.body.token;
}

beforeAll(async () => {
    await db.run("DELETE FROM livros");
    await db.run("DELETE FROM autores");
    await db.run("DELETE FROM usuarios");

    token1 = await cadastrarELogar(usuario1);
    token2 = await cadastrarELogar(usuario2);
});

beforeEach(async () => {
    await db.run("DELETE FROM livros");
    await db.run("DELETE FROM autores");

    const autor = await request(app)
        .post("/autores")
        .set("Authorization", `Bearer ${token1}`)
        .send({
            nome: "Machado de Assis",
            nacionalidade: "Brasileira",
            ano_nascimento: 1839
        });

    autorId = autor.body.id;

    const livro = await request(app)
        .post("/livros")
        .set("Authorization", `Bearer ${token1}`)
        .send({
            titulo: "Dom Casmurro",
            ano_publicacao: 1899,
            genero: "Romance",
            autor_id: autorId
        });

    livroId = livro.body.id;
});

describe("Testes de propriedade dos registros", () => {

    test("usuário deve visualizar apenas seus próprios autores", async () => {
        const resposta = await request(app)
            .get("/autores")
            .set("Authorization", `Bearer ${token2}`);

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveLength(0);
    });

    test("usuário não deve acessar autor de outra pessoa", async () => {
        const resposta = await request(app)
            .get(`/autores/${autorId}`)
            .set("Authorization", `Bearer ${token2}`);

        expect(resposta.status).toBe(403);
    });

    test("usuário não deve editar autor de outra pessoa", async () => {
        const resposta = await request(app)
            .put(`/autores/${autorId}`)
            .set("Authorization", `Bearer ${token2}`)
            .send({
                nome: "Autor alterado",
                nacionalidade: "Brasileira",
                ano_nascimento: 1900
            });

        expect(resposta.status).toBe(403);
    });

    test("usuário deve visualizar apenas seus próprios livros", async () => {
        const resposta = await request(app)
            .get("/livros")
            .set("Authorization", `Bearer ${token2}`);

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveLength(0);
    });

    test("usuário não deve acessar livro de outra pessoa", async () => {
        const resposta = await request(app)
            .get(`/livros/${livroId}`)
            .set("Authorization", `Bearer ${token2}`);

        expect(resposta.status).toBe(403);
    });

    test("usuário não deve excluir livro de outra pessoa", async () => {
        const resposta = await request(app)
            .delete(`/livros/${livroId}`)
            .set("Authorization", `Bearer ${token2}`);

        expect(resposta.status).toBe(403);
    });

    test("usuário não deve utilizar autor de outra pessoa ao cadastrar livro", async () => {
        const resposta = await request(app)
            .post("/livros")
            .set("Authorization", `Bearer ${token2}`)
            .send({
                titulo: "Livro não autorizado",
                ano_publicacao: 2020,
                genero: "Ficção",
                autor_id: autorId
            });

        expect(resposta.status).toBe(403);
    });

});
