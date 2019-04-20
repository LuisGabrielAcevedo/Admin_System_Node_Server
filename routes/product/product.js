const express = require('express');
const productCtrl = require('../../controllers/product/product');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/products/controller', productCtrl.product);
// 1. Guagar un producto
api.post('/products', authMiddleware.authMiddlewareFunction, productCtrl.saveProduct);
// 2. Buscar productos
api.get('/products', authMiddleware.authMiddlewareFunction, productCtrl.getProducts);
// 3. Actualizar un producto
api.put('/products/:id', authMiddleware.authMiddlewareFunction, productCtrl.updateProduct);
// 4. Obtener la imagen del producto
api.get('/products/image/:id/:file', productCtrl.getImage);

module.exports = api;