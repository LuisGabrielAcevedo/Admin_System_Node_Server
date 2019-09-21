const express = require('express');
const productTypeCtrl = require('../../controllers/inventory/productType');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/product-types/controller', productTypeCtrl.productType);
// 1. Guagar un tipo de producto
api.post('/product-types', authMiddleware.authMiddlewareFirstActionFunction, productTypeCtrl.saveProductType);
// 2. Obtener tipos de producto buscador
api.get('/product-types/search/all-list', authMiddleware.authMiddlewareFirstActionFunction, productTypeCtrl.simpleSearch);
// 3. Borrar un producto
api.delete('/product-types/:id', authMiddleware.authMiddlewareFirstActionFunction, productTypeCtrl.removeProductType);
// 4. Actualizar un producto
api.put('/product-types/:id', authMiddleware.authMiddlewareFirstActionFunction, productTypeCtrl.updateProductType);
// 5. Obtener productos
api.get('/product-types', authMiddleware.authMiddlewareFirstActionFunction, productTypeCtrl.getProductTypes);

module.exports = api;