import express from "express";

import autorRoutes from "./routes/autorRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import livroRoutes from "./routes/livroRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import helmet from "helmet";
import cors from "cors";

const app = express();


app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "API Biblioteca Digital funcionando!"
    });
});

// Rotas de autores, livros e usuários
app.use("/autores", autorRoutes);
app.use("/livros", livroRoutes);
app.use("/usuarios", usuarioRoutes);

// Tratamento de rotas inexistentes
app.use((req, res, next) => {
    const error = new Error("Rota não encontrada.");
    error.status = 404;
    next(error);
});

// Middleware centralizado de erros
app.use(errorHandler);

export default app;
