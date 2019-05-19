const express = require('express');
const applicationCtrl = require('../controllers/application');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const validationsMiddleware = require('../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Application controller
api.get('/applications/controller', applicationCtrl.application);
// 1. Save application
api.post('/applications', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), applicationCtrl.saveApplication);
// 2. Get applications
api.get('/applications', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), applicationCtrl.getApplications);
// 3. Get application
api.get('/applications/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), applicationCtrl.findApplication);
// 4. Put application
api.put('/applications/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), applicationCtrl.updateApplication);
// 5. Delete application
api.delete('/applications/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), authMiddleware.authMiddlewareFirstActionFunction, applicationCtrl.deleteApplication);

module.exports = api;