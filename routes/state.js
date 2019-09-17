const express = require('express');
const stateCtrl = require('../controllers/state');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const validationsMiddleware = require('../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. State controller
api.get('/states/controller', stateCtrl.state);
// 1. Save state
api.post('/states', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), stateCtrl.saveState);
// 2. Get states
api.get('/states', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), stateCtrl.getStates);
// 3. Get state
api.get('/states/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), stateCtrl.findState);
// 4. Update state
api.put('/states/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), stateCtrl.updateState);
// 5. Delete state
api.delete('/states/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), stateCtrl.deleteState);

module.exports = api;