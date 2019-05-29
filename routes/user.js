const express = require('express');
const userCtrl = require('../controllers/user');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const validationsMiddleware = require('../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. User controller
api.get('/users/controller', userCtrl.user);
// 1. Save user
api.post('/users', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), userCtrl.saveUser);
// 2. Get users
api.get('/users', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), userCtrl.getUsers);
// 3. Get user
api.get('/users/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), userCtrl.findUser);
// 4. Update user
api.put('/users/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), userCtrl.updateUser);
// 5. Delete user
api.delete('/users/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), userCtrl.removeUser);
// 6. Get user image
api.get('/users/image/:id/:file', userCtrl.getImage);
// 7. Register user
api.post('/users/register', compose([
    //authMiddleware.authMiddlewareFirstActionFunction,
    //validationsMiddleware.validationsMiddlewareFunction
]), userCtrl.userRegister);
// 8. Login user
api.post('/users/login', userCtrl.userLogin);


module.exports = api;