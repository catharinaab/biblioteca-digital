import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
    // Obtém o cabeçalho Authorization
    const authorization = req.headers.authorization;

    // Verifica se o token foi enviado
    if (!authorization) {
        return res.status(401).json({
            erro: "Token de autenticação não informado."
        });
    }

    // Verifica o formato Bearer do token
    const [tipo, token] = authorization.split(" ");

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({
            erro: "Formato de token inválido. Utilize Bearer."
        });
    }

    try {
        // Valida a assinatura e a expiração do token
        const dadosUsuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Disponibiliza os dados do usuário para as próximas etapas
        req.usuario = dadosUsuario;

        next();

} catch (error) {
    console.error("Erro na validação JWT:", error.name, error.message);

    return res.status(401).json({
        erro: "Token inválido ou expirado."
    });
}
}
