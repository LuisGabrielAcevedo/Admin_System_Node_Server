const express = require('express');
const permissionCtrl = require('../controllers/permission');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/permissions/controller', permissionCtrl.permission);
// 1. Guardar Permiso
api.post('/permissions', authMiddleware.authMiddlewareFirstActionFunction, permissionCtrl.savePermission);
// 2. Obtener Permiso
api.get('/permissions', authMiddleware.authMiddlewareFirstActionFunction, permissionCtrl.getPermissions);
// 3. Buscar Permisos
api.get('/permissions/:id', authMiddleware.authMiddlewareFirstActionFunction, permissionCtrl.findPermission);
// 4. Actualizar un Permiso
api.put('/permissions/:id', authMiddleware.authMiddlewareFirstActionFunction, permissionCtrl.updatePermission);
// 5. Borrar Permiso
api.delete('/permissions/:id', authMiddleware.authMiddlewareFirstActionFunction, permissionCtrl.removePermission);
// 6. Atualizar permisos automaticamente
api.post('/permissions/update', authMiddleware.authMiddlewareSecondActionFunction, permissionCtrl.updatePermissions);
// 7. Obtener administradres buscador
api.get('/permissions/search/all-list', authMiddleware.authMiddlewareFirstActionFunction, permissionCtrl.simpleSearch);
// 8. Actualizar varios permisos
api.put('/permissions', authMiddleware.authMiddlewareFirstActionFunction, permissionCtrl.updateManyPermissions);

module.exports = api;