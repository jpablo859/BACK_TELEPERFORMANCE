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
    }
});


module.exports = model('User', UserSchema);