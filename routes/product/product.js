const express = require('express');
const productCtrl = require('../../controllers/product/product');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');
const roleMiddleware = require('../../middlewares/roles');
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Prueba del controlador
api.get('/products/controller', productCtrl.product);
// 1. Guagar un producto
api.post('/products', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), productCtrl.saveProduct);
// 2. Buscar productos
api.get('/products', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), productCtrl.getProducts);
// 3. Actualizar un producto
api.put('/products/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), productCtrl.updateProduct);
// 4. Obtener la imagen del producto
api.get('/products/image/:id/:file', productCtrl.getImage);
// 3. Get product
api.get('/products/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), productCtrl.findProduct);

module.exports = api;