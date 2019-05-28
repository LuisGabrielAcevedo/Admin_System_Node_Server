const express = require('express');
const commentCtrl = require('../../controllers/post/comment');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');
const roleMiddleware = require('../../middlewares/roles');
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Comment controller
api.get('/comments/controller', commentCtrl.comment);
// 1. Save comment
api.post('/comments', compose([
    authMiddleware.authMiddlewareSecondActionFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), commentCtrl.saveComment);

module.exports = api;