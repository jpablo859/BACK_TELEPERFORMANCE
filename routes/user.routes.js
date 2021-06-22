const {Router} = require('express');
const {check} = require('express-validator');
const {validateJWT} = require('../middlewares/validateJWT');
const router = Router();

const {login, createUser, revalidateToken} = require('../controllers/user.controller');
const { validate } = require('../middlewares/validate');

router.post ('/login', [
    check('user', 'Usuario o Contraseña incorrecta').not().isEmpty(),
    check('password', 'Usuario o Contraseña incorrecta').isLength({min:5}),
    validate
], login);

router.post('/new', [
    check('user', 'El usuario es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe contener mínimo 5 caracteres').isLength({min:5}),
    [validate, validateJWT]
], createUser);

router.get('/renew', validateJWT, revalidateToken);

module.exports = router;