const express = require('express');
const productCtrl = require('../../controllers/product/product');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/products/controller', productCtrl.product);
// 1. Guagar un producto
api.post('/products', authMiddleware.authMiddlewareFirstActionFunction, productCtrl.saveProduct);
// 2. Buscar productos
api.get('/products', authMiddleware.authMiddlewareFirstActionFunction, productCtrl.getProducts);
// 3. Actualizar un producto
api.put('/products/:id', authMiddleware.authMiddlewareFirstActionFunction, productCtrl.updateProduct);
// 4. Obtener la imagen del producto
api.get('/products/image/:id/:file', productCtrl.getImage);
// 6. Obtener productos buscador
api.get('/products/search/all-list', authMiddleware.authMiddlewareFirstActionFunction, productCtrl.simpleSearch);

module.exports = api;