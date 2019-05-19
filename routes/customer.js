const express = require('express');
const customerCtrl = require('../controllers/customer');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const validationsMiddleware = require('../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Customer controller
api.get('/customers/controller', customerCtrl.customer);
// 1. Save customer
api.post('/customers', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), customerCtrl.saveCustomer);
// 2. Get customers
api.get('/customers', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), customerCtrl.getCustomers);
// 3. Get customer
api.get('/customers/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), customerCtrl.findCustomer);
// 4. Put customer
api.put('/customers/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), customerCtrl.updateCustomer);
// 5. Delete customer
api.delete('/customers/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), customerCtrl.removeCustomer);
// 6. Get image customer
api.get('/customers/image/:id/:file', customerCtrl.getImage);

module.exports = api;