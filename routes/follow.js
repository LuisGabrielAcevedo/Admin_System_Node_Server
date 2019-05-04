const express = require('express');
const followCtrl = require('../controllers/follow');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

api.get('/follows/controller', followCtrl.follow);
api.post('/follows', authMiddleware.authMiddlewareFunction, followCtrl.saveFollow);
api.get('/follows', authMiddleware.authMiddlewareFunction, followCtrl.findFollows);
api.delete('/follows/:id', authMiddleware.authMiddlewareFunction, followCtrl.deleteFollow);

module.exports = api;