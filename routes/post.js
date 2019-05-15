const express = require('express');
const postCtrl = require('../controllers/post');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const compose = require('compose-middleware').compose;

// 0. Post controller
api.get('/post/controller', compose([
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), postCtrl.post);

module.exports = api;