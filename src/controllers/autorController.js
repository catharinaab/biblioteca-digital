
import * as Autor from "../models/autorModel.js";
import * as Livro from "../models/livroModel.js";

// Administrador não precisa de filtro por proprietário.
function obterUsuarioId(req) {
    return req.usuario.perfil === "admin"
        ? null
        : req.usuario.id;
}

// Verifica se o autor pertence ao usuário autenticado.
function verificarPropriedade(req, res, autor) {
    if (
        req.usuario.perfil !== "admin" &&
        autor.usuario_id !== req.usuario.id
    ) {
        res.status(403).json({
            erro: "Você não tem permissão para acessar este autor."
        });

        return false;
    }

    return true;
}

// Validar os dados recebidos
function validarAutor(dados = {}) {
    const { nome, nacionalidade, ano_nascimento } = dados;

    if (
        typeof nome !== "string" ||
        nome.trim() === ""
    ) {
        return "O campo 'nome' é obrigatório.";
    }

    if (
        typeof nacionalidade !== "string" ||
        nacionalidade.trim() === ""
    ) {
        return "O campo 'nacionalidade' é obrigatório.";
    }

    if (
        !Number.isInteger(ano_nascimento) ||
        ano_nascimento <= 0 ||
        ano_nascimento > new Date().getFullYear()
    ) {
        return "O campo 'ano_nascimento' deve ser um ano válido.";
    }

    return null;
}

// GET /autores
export async function listar(req, res, next) {
    try {
        const usuarioId = obterUsuarioId(req);
        const autores = await Autor.listarAutores(usuarioId);

        return res.status(200).json(autores);
    } catch (error) {
        next(error);
    }
}

// GET /autores/:id
export async function buscarPorId(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const autor = await Autor.buscarAutorPorId(id);

        if (!autor) {
            return res.status(404).json({
                erro: "Autor não encontrado."
            });
        }

        if (!verificarPropriedade(req, res, autor)) {
            return;
        }

        return res.status(200).json(autor);
    } catch (error) {
        next(error);
    }
}

// POST /autores
export async function criar(req, res, next) {
    try {
        const erro = validarAutor(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const autor = await Autor.criarAutor({
            ...req.body,
            nome: req.body.nome.trim(),
            nacionalidade: req.body.nacionalidade.trim(),
            usuario_id: req.usuario.id
        });

        return res.status(201).json(autor);
    } catch (error) {
        next(error);
    }
}

// PUT /autores/:id
export async function atualizar(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const autorExistente = await Autor.buscarAutorPorId(id);

        if (!autorExistente) {
            return res.status(404).json({
                erro: "Autor não encontrado."
            });
        }

        if (!verificarPropriedade(req, res, autorExistente)) {
            return;
        }

        const erro = validarAutor(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const usuarioId = obterUsuarioId(req);

        await Autor.atualizarAutor(
            id,
            {
                ...req.body,
                nome: req.body.nome.trim(),
                nacionalidade: req.body.nacionalidade.trim()
            },
            usuarioId
        );

        const autorAtualizado = await Autor.buscarAutorPorId(id);

        return res.status(200).json(autorAtualizado);
    } catch (error) {
        next(error);
    }
}

// DELETE /autores/:id
export async function excluir(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const autor = await Autor.buscarAutorPorId(id);

        if (!autor) {
            return res.status(404).json({
                erro: "Autor não encontrado."
            });
        }

        if (!verificarPropriedade(req, res, autor)) {
            return;
        }

        if (await Autor.possuiLivros(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir um autor que possui livros cadastrados."
            });
        }

        const usuarioId = obterUsuarioId(req);

        await Autor.excluirAutor(id, usuarioId);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

// GET /autores/:id/livros
export async function listarLivros(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const autor = await Autor.buscarAutorPorId(id);

        if (!autor) {
            return res.status(404).json({
                erro: "Autor não encontrado."
            });
        }

        if (!verificarPropriedade(req, res, autor)) {
            return;
        }

        const livros = await Livro.listarLivrosPorAutor(
    id,
    obterUsuarioId(req)
);

        return res.status(200).json({
            autor: autor.nome,
            total_livros: livros.length,
            livros
        });
    } catch (error) {
        next(error);
    }
}
