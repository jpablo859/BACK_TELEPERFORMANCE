const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const {generateJWT} = require('../helpers/jwt');
const axios = require('axios');

const createUser = async (req, res) => {
    const { user, password } = req.body;

    try {
        let responseUser = await User.findOne({user});
        if (responseUser) return res.status(400).json({
            ok: false,
            msg: 'El usuario ya se encuentra registrado'
        });

        responseUser = new User(req.body);
        const salt = bcrypt.genSaltSync();
        responseUser.password = bcrypt.hashSync(password, salt);
        const response = await responseUser.save();

        return res.status(201).json({
            ok: true,
            msg: 'usuario creado',
            usuario: response
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}

const updateUser = async (req, res) => {
    const { nombre, apellido, cargo, salario, fechaIngreso } = req.body;
    const { user } = req.params;

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

const updateEstadoUser = async (req, res) => {
    const { estado } = req.body;
    const { user } = req.params;

    try {
        const response = await User.findOneAndUpdate({_id: user}, { estado });

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
    const { user } = req.params;

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
    try {
        const response = await User.find({role: 'user'}, {role: 0, password: 0});
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

        const userOK = {
            uid: responseUser._id, user, role: responseUser.role
        }

        const token = await generateJWT({ ...userOK });
        
        return res.status(200).json({
            ok: true,
            token,
            token,
            user: { ...userOK }
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}

const revalidateToken = async (req, res) => {

    const { uid, user, role } = req;

    try {
        const token = await generateJWT({uid, user, role});
    
        return res.status(200).json({
            ok: true,
            token,
            user: { uid, user, role }
        })
    } catch {
        res.status(500).json({
            ok: false,
            msg: 'Error interno'
        })
    }
}

const getApi = async (req, res) => {
    try {
        const resp = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return res.status(200).json({
            ok: true,
            response: resp.data.slice(0, 10)
        });

    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    updateEstadoUser,
    getApi,
    revalidateToken,
    getUsers,
    deleteUser,
    updateUser,
    createUser,
    login,
}