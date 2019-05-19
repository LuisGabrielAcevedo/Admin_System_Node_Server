const express = require('express');
const permissionCtrl = require('../controllers/permission');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const validationsMiddleware = require('../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Permission controller
api.get('/permissions/controller', permissionCtrl.permission);
// 1. Save permission
api.post('/permissions', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), permissionCtrl.savePermission);
// 2. Get permissions
api.get('/permissions', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), permissionCtrl.getPermissions);
// 3. Get permission
api.get('/permissions/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), permissionCtrl.findPermission);
// 4. Update permission
api.put('/permissions/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), permissionCtrl.updatePermission);
// 5. Delete permission
api.delete('/permissions/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), permissionCtrl.deletePermission);
// 6. Create permissions
api.post('/permissions/create', compose([
    authMiddleware.authMiddlewareSecondActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), permissionCtrl.updatePermissions);
// 7. Update many permissions
api.put('/permissions',  compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), permissionCtrl.updateManyPermissions);

module.exports = api;