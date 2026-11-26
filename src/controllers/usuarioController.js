
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as Usuario from "../models/usuarioModel.js";

export async function cadastrar(req, res, next) {
    try {
        const { nome, email, senha } = req.body;

        // Validação dos campos
        if (
            typeof nome !== "string" ||
            nome.trim() === "" ||
            typeof email !== "string" ||
            email.trim() === "" ||
            typeof senha !== "string" ||
            senha.length < 8
        ) {
            return res.status(400).json({
                erro: "Informe nome, e-mail e senha com pelo menos 8 caracteres."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        // Verifica se o e-mail já está cadastrado
        const usuarioExistente = await Usuario.buscarPorEmail(
            emailNormalizado
        );

        if (usuarioExistente) {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        // Criptografa a senha com bcrypt
        const senhaHash = await bcrypt.hash(senha, 10);

        // Cria o usuário no banco
        const novoUsuario = await Usuario.criar({
            nome: nome.trim(),
            email: emailNormalizado,
            senhaHash
        });

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: novoUsuario
        });

    } catch (error) {
        if (error.code?.startsWith("SQLITE_CONSTRAINT")) {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, senha } = req.body;

        if (
            typeof email !== "string" ||
            email.trim() === "" ||
            typeof senha !== "string" ||
            senha === ""
        ) {
            return res.status(400).json({
                erro: "Informe e-mail e senha."
            });
        }

        // Busca o usuário pelo e-mail
        const usuario = await Usuario.buscarPorEmail(
            email.trim().toLowerCase()
        );

        // Verifica se o usuário existe
        if (!usuario) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        // Compara a senha informada com o hash armazenado
        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha_hash
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        // Gera o token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                perfil: usuario.perfil
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });

    } catch (error) {
        next(error);
    }
}

