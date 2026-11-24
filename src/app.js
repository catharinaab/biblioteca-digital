
import express from "express";

import autorRoutes from "./routes/autorRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Permite receber JSON
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "API Biblioteca Digital funcionando!"
    });
});

// Rotas de autores
app.use("/autores", autorRoutes);

// Rota para endereços inexistentes
app.use((req, res, next) => {
    const error = new Error("Rota não encontrada.");
    error.status = 404;

    next(error);
});

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
