const express = require('express');
const rolCtrl = require('../controllers/rol');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/roles/controller', rolCtrl.rol);
// 1. Guardar rol
api.post('/roles', rolCtrl.saveRol);
// 2. Obtener roles
api.get('/roles', authMiddleware.authMiddlewareFunction, rolCtrl.getRoles);
// 3. Buscar un rol
api.get('/roles/:id',authMiddleware.authMiddlewareFunction, rolCtrl.findRol);
// 4. Actualizar un rol
api.put('/roles/:id', authMiddleware.authMiddlewareFunction, rolCtrl.updateRol);
// 5. Borrar un rol
api.delete('/roles/:id', authMiddleware.authMiddlewareFunction, rolCtrl.removeRol);
// 6. Obtener roles sin paginacion
api.get('/roles/search/all-list', authMiddleware.authMiddlewareFunction, rolCtrl.simpleSearch);

module.exports = api;