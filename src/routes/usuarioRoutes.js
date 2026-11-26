import { Router } from "express";
import { autenticar } from "../middlewares/autenticar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { loginLimiter } from "../middlewares/loginLimiter.js";

import {
    cadastrar,
    login
} from "../controllers/usuarioController.js";

const router = Router();

router.post("/cadastro", cadastrar);
router.post("/login", loginLimiter, login);

export default router;

router.get("/perfil", autenticar, (req, res) => {
    return res.status(200).json({
        mensagem: "Autenticação realizada com sucesso!",
        usuario: req.usuario
    });
});

router.get(
    "/admin",
    autenticar,
    autorizar("admin"),
    (req, res) => {
        return res.status(200).json({
            mensagem: "Acesso administrativo autorizado!",
            usuario: req.usuario
        });
    }
);