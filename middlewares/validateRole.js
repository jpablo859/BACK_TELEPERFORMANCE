const validateRoleAdmin = async (req, res, next) => {
    const { role } = req;

    if (role === 'user') return res.status(401).json({
        ok: false,
        msg: 'El usuario no tiene permiso'
    })

    next();
}

const validateRoleUser = async (req, res, next) => {
    const { role } = req;

    if (role === 'admin') return res.status(401).json({
        ok: false,
        msg: 'El usuario no tiene permiso'
    })

    next();
}

module.exports = {
    validateRoleUser,
    validateRoleAdmin
}
