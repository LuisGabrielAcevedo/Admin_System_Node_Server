const express = require('express');
const likeCtrl = require('../../controllers/post/like');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');
const roleMiddleware = require('../../middlewares/roles');
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Comment controller
api.get('/likes/controller', likeCtrl.like);

module.exports = api;