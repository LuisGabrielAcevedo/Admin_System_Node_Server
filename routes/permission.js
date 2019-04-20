const express = require('express');
const permissionCtrl = require('../controllers/permission');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/permissions/controller', permissionCtrl.permission);
// 1. Guardar Permiso
api.post('/permissions', authMiddleware.authMiddlewareFunction, permissionCtrl.savePermission);
// 2. Obtener Permiso
api.get('/permissions', authMiddleware.authMiddlewareFunction, permissionCtrl.getPermissions);
// 3. Buscar Permisos
api.get('/permissions/:id', authMiddleware.authMiddlewareFunction, permissionCtrl.findPermission);
// 4. Actualizar un Permiso
api.put('/permissions/:id', authMiddleware.authMiddlewareFunction, permissionCtrl.updatePermission);
// 5. Borrar Permiso
api.delete('/permissions/:id', authMiddleware.authMiddlewareFunction, permissionCtrl.removePermission);
// 6. Atualizar permisos automaticamente
api.post('/permissions/update', authMiddleware.authMiddlewareFunctionSecondAction, permissionCtrl.updatePermissions);
// 7. Obtener administradres buscador
api.get('/permissions/search/all-list', authMiddleware.authMiddlewareFunction, permissionCtrl.simpleSearch);

module.exports = api;