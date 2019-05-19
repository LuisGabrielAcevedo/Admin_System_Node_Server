const express = require('express');
const rolCtrl = require('../controllers/role');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const validationsMiddleware = require('../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Role controller
api.get('/roles/controller', rolCtrl.role);
// 1. Save role
api.post('/roles',compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), rolCtrl.saveRole);
// 2. Get roles
api.get('/roles', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), rolCtrl.getRoles);
// 3. Get role
api.get('/roles/:id',compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), rolCtrl.findRole);
// 4. Update role
api.put('/roles/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), rolCtrl.updateRole);
// 5. Delete role
api.delete('/roles/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), rolCtrl.deleteRole);

module.exports = api;