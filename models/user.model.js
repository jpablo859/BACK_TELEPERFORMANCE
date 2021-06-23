const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    salario: {
        type: Number,
        required: true
    },
    fechaIngreso: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        required: true,
        default: 'Activo'
    }
});


module.exports = model('User', UserSchema);