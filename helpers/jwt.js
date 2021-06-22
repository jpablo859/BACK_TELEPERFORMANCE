const jwt = require('jsonwebtoken');

const generateJWT = async (payload) => {
    try {
        const token = await jwt.sign(payload, process.env.SECRET_JWT_SEED, { expiresIn: '1h' });
        return token;
    } catch (err) {
        throw new Error('No se pudo generar el token');
    }
}

module.exports = {
    generateJWT
}