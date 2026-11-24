
import { Router } from "express";

import {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir
} from "../controllers/livroController.js";

const router = Router();

// Listar todos os livros
router.get("/", listar);

// Buscar livro pelo ID
router.get("/:id", buscarPorId);

// Cadastrar livro
router.post("/", criar);

// Atualizar livro
router.put("/:id", atualizar);

// Excluir livro
router.delete("/:id", excluir);

export default router;
