const express = require('express');
const likeCtrl = require('../../controllers/post/like');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');
const roleMiddleware = require('../../middlewares/roles');
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Like controller
api.get('/likes/controller', likeCtrl.like);
// 1. Save like 
api.post('/likes', compose([
    authMiddleware.authMiddlewareSecondActionFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), likeCtrl.saveLike);

module.exports = api;