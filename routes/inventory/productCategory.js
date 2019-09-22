const express = require('express');
const productCategoryCtrl = require('../../controllers/inventory/productCategory');
const api = express.Router();
const compose = require('compose-middleware').compose;
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');

// 0. Product category controller
api.get('/product-categories/controller', productCategoryCtrl.productCategory);
// 1. Save product category
api.post('/product-categories', compose([
    validationsMiddleware.validationsMiddlewareFunction
]), productCategoryCtrl.saveProductCategory);
// 2. Get product categories
api.get('/product-categories', compose([
    queryMiddleware.queryMiddlewareFunction
]), productCategoryCtrl.getProductCategories);
// 3. Find product category
api.get('/product-categories/:id', compose([
    queryMiddleware.queryMiddlewareFunction
]), productCategoryCtrl.findProductCategory);
// 4. Update product category
api.put('/product-categories/:id', compose([
    validationsMiddleware.validationsMiddlewareFunction
]), productCategoryCtrl.updateProductCategory);
// 5. Delete product category
api.delete('/product-categories/:id', compose([]), productCategoryCtrl.deleteProductCategory);

module.exports = api;