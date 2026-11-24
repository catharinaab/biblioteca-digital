
import { Router } from "express";

import {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir,
    listarLivros
} from "../controllers/autorController.js";

const router = Router();

router.get("/", listar);
router.get("/:id/livros", listarLivros);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", excluir);

export default router;
