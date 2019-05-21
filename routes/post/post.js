const express = require('express');
const postCtrl = require('../../controllers/post/post');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');
const roleMiddleware = require('../../middlewares/roles');
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Post controller
api.get('/posts/controller', postCtrl.post);
// 1. Save post 
api.post('/posts', compose([
    authMiddleware.authMiddlewareSecondActionFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), postCtrl.savePost);
// 2. Get posts 
api.get('/posts',compose([
    authMiddleware.authMiddlewareSecondActionFunction,
    queryMiddleware.queryMiddlewareFunction
]), postCtrl.getPosts);
// 3. Get post
api.get('/posts/:id',compose([
    authMiddleware.authMiddlewareSecondActionFunction,
    queryMiddleware.queryMiddlewareFunction
]), postCtrl.findPost);

module.exports = api;