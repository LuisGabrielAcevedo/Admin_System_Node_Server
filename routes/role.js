const express = require('express');
const rolCtrl = require('../controllers/role');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Role controller
api.get('/roles/controller', rolCtrl.role);
// 1. Save role
api.post('/roles', rolCtrl.saveRol);
// 2. Get roles
api.get('/roles', authMiddleware.authMiddlewareFirstActionFunction, rolCtrl.getRoles);
// 3. Get role
api.get('/roles/:id',authMiddleware.authMiddlewareFirstActionFunction, rolCtrl.findRol);
// 4. Update role
api.put('/roles/:id', authMiddleware.authMiddlewareFirstActionFunction, rolCtrl.updateRol);
// 5. Delete role
api.delete('/roles/:id', authMiddleware.authMiddlewareFirstActionFunction, rolCtrl.removeRol);
// 6. Get role search
api.get('/roles/search/all-list', authMiddleware.authMiddlewareFirstActionFunction, rolCtrl.simpleSearch);

module.exports = api;