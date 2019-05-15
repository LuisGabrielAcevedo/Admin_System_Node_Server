const express = require('express');
const userCtrl = require('../controllers/user');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const compose = require('compose-middleware').compose;

// 0. User controller
api.get('/users/controller', userCtrl.user);
// 1. Save user
api.post('/users', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
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
    roleMiddleware.roleMiddlewareFunction
]), userCtrl.findUser);
// 4. Update user
api.put('/users/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]),userCtrl.updateUser);
// 5. Delete user
api.delete('/users/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), userCtrl.removeUser);
// 6. Get user image
api.get('/users/image/:id/:file', userCtrl.getImage);
// 7. Get users search
api.get('/users/search/all-list', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), userCtrl.simpleSearch);
// 8. Register user
api.post('/users/register', userCtrl.userRegister);
// 9. Login user
api.post('/users/login', userCtrl.userLogin);


module.exports = api;