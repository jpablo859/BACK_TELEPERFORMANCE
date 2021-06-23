const {Router} = require('express');
const {check} = require('express-validator');
const {validateJWT} = require('../middlewares/validateJWT');
const router = Router();

const {login, createUser, deleteUser, updateUser, getUsers} = require('../controllers/user.controller');
const { validate } = require('../middlewares/validate');

router.post ('/login', [
    check('user', 'Usuario o Contraseña incorrecta').not().isEmpty(),
    check('password', 'Usuario o Contraseña incorrecta').isLength({min:5}),
    validate
], login);

router.post('/new', [
    check('user', 'El usuario es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe contener mínimo 5 caracteres').isLength({min:5}),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('cargo', 'El cargo es obligatorio').not().isEmpty(),
    check('salario', 'El salario no es correcto').isNumeric(),
    check('fechaIngreso', 'Fecha inválida').isDate({format: 'YYYY-MM-DD'}),
    [validate, validateJWT]
], createUser);

router.put('/updateUser/:user', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('cargo', 'El cargo es obligatorio').not().isEmpty(),
    check('salario', 'El salario no es correcto').isNumeric(),
    check('fechaIngreso', 'Fecha inválida').isDate({format: 'YYYY-MM-DD'}),
    [validate, validateJWT]
], updateUser);

router.delete('/deleteUser/:user', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('cargo', 'El cargo es obligatorio').not().isEmpty(),
    check('salario', 'El salario no es correcto').isNumeric(),
    check('fechaIngreso', 'Fecha inválida').isDate({format: 'YYYY-MM-DD'}),
    [validate, validateJWT]
], deleteUser);

router.get('/getUsers', [validateJWT], getUsers);
module.exports = router;