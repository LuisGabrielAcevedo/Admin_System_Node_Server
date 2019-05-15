const express = require('express');
const followCtrl = require('../controllers/follow');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

api.get('/follows/controller', followCtrl.follow);
api.post('/follows', authMiddleware.authMiddlewareFirstActionFunction, followCtrl.saveFollow);
api.get('/follows', authMiddleware.authMiddlewareFirstActionFunction, followCtrl.findFollows);
api.delete('/follows/:id', authMiddleware.authMiddlewareFirstActionFunction, followCtrl.deleteFollow);

module.exports = api;