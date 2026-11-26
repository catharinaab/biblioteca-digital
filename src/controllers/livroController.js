import * as Livro from "../models/livroModel.js";
import * as Autor from "../models/autorModel.js";

// Administrador não precisa de filtro por proprietário.
function obterUsuarioId(req) {
    return req.usuario.perfil === "admin"
        ? null
        : req.usuario.id;
}

// Verificar se o registro pertence ao usuário.
function verificarPropriedade(req, res, registro, tipo) {
    if (
        req.usuario.perfil !== "admin" &&
        registro.usuario_id !== req.usuario.id
    ) {
        res.status(403).json({
            erro: `Você não tem permissão para acessar este ${tipo}.`
        });

        return false;
    }

    return true;
}

// Verificar se o autor pertence ao usuário.
function verificarPropriedadeAutor(req, res, autor) {
    if (
        req.usuario.perfil !== "admin" &&
        autor.usuario_id !== req.usuario.id
    ) {
        res.status(403).json({
            erro: "Você não tem permissão para utilizar este autor."
        });

        return false;
    }

    return true;
}

// Validar os dados recebidos
function validarLivro(dados = {}) {
    const {
        titulo,
        ano_publicacao,
        genero,
        autor_id
    } = dados;

    if (typeof titulo !== "string" || titulo.trim() === "") {
        return "O campo 'titulo' é obrigatório.";
    }

    if (
        !Number.isInteger(ano_publicacao) ||
        ano_publicacao <= 0 ||
        ano_publicacao > new Date().getFullYear()
    ) {
        return "O campo 'ano_publicacao' deve ser um ano válido.";
    }

    if (typeof genero !== "string" || genero.trim() === "") {
        return "O campo 'genero' é obrigatório.";
    }

    if (!Number.isInteger(autor_id) || autor_id <= 0) {
        return "O campo 'autor_id' deve ser um número inteiro positivo.";
    }

    return null;
}

// GET /livros
export async function listar(req, res, next) {
    try {
        const usuarioId = obterUsuarioId(req);
        const { genero } = req.query;

        if (genero !== undefined) {
            if (
                typeof genero !== "string" ||
                genero.trim() === ""
            ) {
                return res.status(400).json({
                    erro: "O parâmetro 'genero' não pode estar vazio."
                });
            }

            const livros = await Livro.filtrarLivrosPorGenero(
                genero.trim(),
                usuarioId
            );

            return res.status(200).json(livros);
        }

        const livros = await Livro.listarLivros(usuarioId);

        return res.status(200).json(livros);
    } catch (error) {
        next(error);
    }
}

// GET /livros/:id
export async function buscarPorId(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const livro = await Livro.buscarLivroPorId(id);

        if (!livro) {
            return res.status(404).json({
                erro: "Livro não encontrado."
            });
        }

        if (!verificarPropriedade(req, res, livro, "livro")) {
            return;
        }

        return res.status(200).json(livro);
    } catch (error) {
        next(error);
    }
}

// POST /livros
export async function criar(req, res, next) {
    try {
        const erro = validarLivro(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const autor = await Autor.buscarAutorPorId(req.body.autor_id);

        if (!autor) {
            return res.status(404).json({
                erro: "O autor informado não foi encontrado."
            });
        }

        if (!verificarPropriedadeAutor(req, res, autor)) {
            return;
        }

        const livro = await Livro.criarLivro({
            ...req.body,
            titulo: req.body.titulo.trim(),
            genero: req.body.genero.trim(),
            usuario_id: req.usuario.id
        });

        return res.status(201).json(livro);
    } catch (error) {
        next(error);
    }
}

// PUT /livros/:id
export async function atualizar(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const livroExistente = await Livro.buscarLivroPorId(id);

        if (!livroExistente) {
            return res.status(404).json({
                erro: "Livro não encontrado."
            });
        }

        if (!verificarPropriedade(req, res, livroExistente, "livro")) {
            return;
        }

        const erro = validarLivro(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const autor = await Autor.buscarAutorPorId(req.body.autor_id);

        if (!autor) {
            return res.status(404).json({
                erro: "O autor informado não foi encontrado."
            });
        }

        if (!verificarPropriedadeAutor(req, res, autor)) {
            return;
        }

        const usuarioId = obterUsuarioId(req);

        await Livro.atualizarLivro(
            id,
            {
                ...req.body,
                titulo: req.body.titulo.trim(),
                genero: req.body.genero.trim()
            },
            usuarioId
        );

        const livroAtualizado = await Livro.buscarLivroPorId(id);

        return res.status(200).json(livroAtualizado);
    } catch (error) {
        next(error);
    }
}

// DELETE /livros/:id
export async function excluir(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const livro = await Livro.buscarLivroPorId(id);

        if (!livro) {
            return res.status(404).json({
                erro: "Livro não encontrado."
            });
        }

        if (!verificarPropriedade(req, res, livro, "livro")) {
            return;
        }

        const usuarioId = obterUsuarioId(req);

        await Livro.excluirLivro(id, usuarioId);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}
