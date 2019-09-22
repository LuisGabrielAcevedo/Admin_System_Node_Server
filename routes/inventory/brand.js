const express = require('express');
const brandCtrl = require('../../controllers/inventory/brand');
const api = express.Router();
const compose = require('compose-middleware').compose;
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');

// 0. Brand controller
api.get('/brands/controller', brandCtrl.brand);
// 1. Save brand
api.post('/brands', compose([
    validationsMiddleware.validationsMiddlewareFunction
]), brandCtrl.saveBrand);
// 2. Get brands
api.get('/brands', compose([
    queryMiddleware.queryMiddlewareFunction
]), brandCtrl.getBrands);
// 3. Find brand
api.get('/brands/:id', compose([
    queryMiddleware.queryMiddlewareFunction
]), brandCtrl.findBrand);
// 4. Update brand
api.put('/brands/:id', compose([
    validationsMiddleware.validationsMiddlewareFunction
]), brandCtrl.updateBrand);
// 5. Delete brand
api.delete('/brands/:id', compose([]), brandCtrl.deleteBrand);

module.exports = api;