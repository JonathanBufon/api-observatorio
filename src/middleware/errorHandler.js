const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: 'Erro de validação', errors: messages });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'ID inválido' });
    }

    if (err.code === 11000) {
        return res.status(409).json({ message: 'Registro duplicado' });
    }

    res.status(500).json({ message: 'Erro interno do servidor' });
};

export default errorHandler;
