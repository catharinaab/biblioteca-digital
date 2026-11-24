
import * as Autor from "../models/autorModel.js";

// Validar os dados recebidos
function validarAutor(dados) {
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
        const autores = await Autor.listarAutores();

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
            return res.status(400).json({
                erro
            });
        }

        const autor = await Autor.criarAutor({
            ...req.body,
            nome: req.body.nome.trim(),
            nacionalidade: req.body.nacionalidade.trim()
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

        const erro = validarAutor(req.body);

        if (erro) {
            return res.status(400).json({
                erro
            });
        }

        await Autor.atualizarAutor(id, {
            ...req.body,
            nome: req.body.nome.trim(),
            nacionalidade: req.body.nacionalidade.trim()
        });

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

        if (await Autor.possuiLivros(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir um autor que possui livros cadastrados."
            });
        }

        await Autor.excluirAutor(id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}
