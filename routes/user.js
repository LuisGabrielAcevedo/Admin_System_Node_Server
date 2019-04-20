const express = require('express');
const userCtrl = require('../controllers/user');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/users/controller', userCtrl.user);
// 1. Guardar usuario
api.post('/users', authMiddleware.authMiddlewareFunction, userCtrl.saveUser);
// 2. Obtener usuarios
api.get('/users', authMiddleware.authMiddlewareFunction, userCtrl.getUsers);
// 3. Buscar un usuario
api.get('/users/:id', authMiddleware.authMiddlewareFunction, userCtrl.findUser);
// 4. Actualizar un usuario
api.put('/users/:id', authMiddleware.authMiddlewareFunction,userCtrl.updateUser);
// 5. Borrar un usuario
api.delete('/users/:id', authMiddleware.authMiddlewareFunction, userCtrl.removeUser);
// 6. Obtener la imagen del usuario
api.get('/users/image/:id/:file', userCtrl.getImage);
// 7. Buscar usuarios sin paginacion
api.get('/users/search/all-list', authMiddleware.authMiddlewareFunction, userCtrl.simpleSearch);
// 8. Register user
api.post('/users/register', authMiddleware.authMiddlewareFunction, userCtrl.userRegister);
// 9. Login user
api.post('/users/login', userCtrl.userLogin);


module.exports = api;