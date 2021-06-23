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
        await responseUser.save();

        return res.status(201).json({
            ok: true,
            msg: 'usuario creado'
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}

const updateUser = async (req, res) => {
    
    const { role, body: { 
        nombre, apellido, cargo, salario, fechaIngreso
     } } = req;
    const { user } = req.params;

    if (role === 'user') return res.status(401).json({
        ok: false,
        msg: 'El usuario no tiene permisos'
    });

    try {
        const response = await User.findOneAndUpdate({_id: user}, {
            nombre, apellido, cargo, salario, fechaIngreso
        });

        if (!response) return res.status(400).json({
            ok: true,
            msg: 'No se encontró el usuario que intenta actualizar'
        })

        return res.status(200).json({
            ok: true,
            msg: 'usuario actualizado'
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}

const deleteUser = async (req, res) => {
    
    const { role } = req;
    const { user } = req.params;

    if (role === 'user') return res.status(401).json({
        ok: false,
        msg: 'El usuario no tiene permisos'
    });

    try {
        const response = await User.findOneAndDelete({_id: user});

        if (!response) return res.status(400).json({
            ok: true,
            msg: 'No se encontró el usuario que intenta eliminar'
        })

        return res.status(200).json({
            ok: true,
            msg: 'usuario eliminado'
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}

const getUsers = async (req, res) => {

    const { role } = req;

    if (role === 'user') return res.status(401).json({
        ok: false,
        msg: 'El usuario no tiene permiso'
    })

    try {

        const response = await User.find({role: 'user'});
        return res.status(200).json({
            ok: true,
            response
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
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

module.exports = {
    getUsers,
    deleteUser,
    updateUser,
    createUser,
    login,
}