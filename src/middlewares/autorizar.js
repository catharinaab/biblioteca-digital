export function autorizar(...perfisPermitidos) {
    return (req, res, next) => {
        // Verifica se o usuário possui um perfil permitido
        if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({
                erro: "Você não tem permissão para acessar este recurso."
            });
        }

        next();
    };
}
