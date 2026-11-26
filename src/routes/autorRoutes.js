
import { Router } from "express";

import {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir,
    listarLivros
} from "../controllers/autorController.js";

import { autenticar } from "../middlewares/autenticar.js";

const router = Router();

router.use(autenticar);

router.get("/", listar);
router.get("/:id/livros", listarLivros);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", excluir);

export default router;
