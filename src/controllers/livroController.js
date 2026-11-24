
import * as Livro from "../models/livroModel.js";
import * as Autor from "../models/autorModel.js";

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

// Listar todos os livros

export async function listar(req, res, next) {
    try {
        const { genero } = req.query;

        // Se houver filtro por gênero
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
                genero.trim()
            );

            return res.status(200).json(livros);
        }

        // Se não houver filtro, listar todos
        const livros = await Livro.listarLivros();

        return res.status(200).json(livros);
    } catch (error) {
        next(error);
    }
}


// Buscar livro pelo ID
export async function buscarPorId(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: "ID inválido." });
        }

        const livro = await Livro.buscarLivroPorId(id);

        if (!livro) {
            return res.status(404).json({ erro: "Livro não encontrado." });
        }

        return res.status(200).json(livro);
    } catch (error) {
        next(error);
    }
}

// Cadastrar livro
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

        const livro = await Livro.criarLivro({
            ...req.body,
            titulo: req.body.titulo.trim(),
            genero: req.body.genero.trim()
        });

        return res.status(201).json(livro);
    } catch (error) {
        next(error);
    }
}

// Atualizar livro
export async function atualizar(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: "ID inválido." });
        }

        const livroExistente = await Livro.buscarLivroPorId(id);

        if (!livroExistente) {
            return res.status(404).json({ erro: "Livro não encontrado." });
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

        await Livro.atualizarLivro(id, {
            ...req.body,
            titulo: req.body.titulo.trim(),
            genero: req.body.genero.trim()
        });

        const livroAtualizado = await Livro.buscarLivroPorId(id);

        return res.status(200).json(livroAtualizado);
    } catch (error) {
        next(error);
    }
}

// Excluir livro
export async function excluir(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: "ID inválido." });
        }

        const livro = await Livro.buscarLivroPorId(id);

        if (!livro) {
            return res.status(404).json({ erro: "Livro não encontrado." });
        }

        await Livro.excluirLivro(id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}
