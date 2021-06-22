const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const {generateJWT} = require('../helpers/jwt');

const createUser = async (req, res) => {
    
    const { role, body: { user, password } } = req;

    if (role === 'user') return res.status(401).json({
        ok: false,
        msg: 'El usuario no tiene permisos'
    });

    try {
        let responseUser = await User.findOne({user});
        if (responseUser) return res.status(400).json({
            ok: false,
            msg: 'El usuario ya se encuentra registrado'
        });

        responseUser = new User(req.body);
        const salt = bcrypt.genSaltSync();
        responseUser.password = bcrypt.hashSync(password, salt);
        const resp = await responseUser.save();

        const token = await generateJWT({uid: resp._id, user, role: resp.role});

        return res.status(201).json({
            ok: true,
            msg: 'usuario creado',
            token
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
    
}

const login = async (req, res) => {

    const {user, password} = req.body;

    try {

        const responseUser = await User.findOne({user});
        if (!responseUser) return res.status(400).json({
            ok: false,
            msg: 'Usuario o Contraseña incorrecta'
        })

        const validatePassword = bcrypt.compareSync(password, responseUser.password);

        
        if (!validatePassword) return res.status(400).json({
            ok: false,
            msg: 'Usuario o Contraseña incorrecta'
        })
        
        const token = await generateJWT({uid: responseUser._id, user, role: responseUser.role});
        
        return res.status(200).json({
            ok: true,
            token,
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}

const revalidateToken = async (req, res) => {
    const {uid, name} = req;

    try {
        const token = await generateJWT(uid, name);
    
        return res.status(200).json({
            ok: true,
            msg: 'Se ha generado un nuevo token',
            token,
            user: {
                uid,
                name 
            }
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}

module.exports = {
    createUser,
    login,
    revalidateToken
}