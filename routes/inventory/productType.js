const express = require('express');
const productTypeCtrl = require('../../controllers/inventory/productType');
const api = express.Router();
const compose = require('compose-middleware').compose;
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');

// 0. Product type controller
api.get('/product-types/controller', productTypeCtrl.productType);
// 1. Save product type
api.post('/product-types', compose([
    validationsMiddleware.validationsMiddlewareFunction
]), productTypeCtrl.saveProductType);
// 2. Get product types
api.get('/product-types', compose([
    queryMiddleware.queryMiddlewareFunction
]), productTypeCtrl.getProductTypes);
// 3. Find product type
api.get('/product-types/:id', compose([
    queryMiddleware.queryMiddlewareFunction
]), productTypeCtrl.findProductType);
// 4. Update product type
api.put('/product-types/:id', compose([
    validationsMiddleware.validationsMiddlewareFunction
]), productTypeCtrl.updateProductType);
// 5. Delete product type
api.delete('/product-types/:id', compose([]), productTypeCtrl.deleteProductType);

module.exports = api;