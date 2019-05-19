const express = require('express');
const followCtrl = require('../controllers/follow');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const queryMiddleware = require('../middlewares/query');
const validationsMiddleware = require('../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Follow constroller
api.get('/follows/controller', followCtrl.follow);
// 1. Save follow
api.post('/follows', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), followCtrl.saveFollow);
// 2. Get follows
api.get('/follows', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    queryMiddleware.queryMiddlewareFunction
]), followCtrl.findFollows);
// 3. Delete follow
api.delete('/follows/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
]), followCtrl.deleteFollow);

module.exports = api;