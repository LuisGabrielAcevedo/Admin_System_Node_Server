const express = require('express');
const productCategoryCtrl = require('../../controllers/product/productCategory');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/product-categories/controller', productCategoryCtrl.productCategory);
// 1. Guagar una categoria
api.post('/product-categories', authMiddleware.authMiddlewareFunction, productCategoryCtrl.saveProductCategory);
// 2. Obtener categorias buscador
api.get('/product-categories/search/all-list', authMiddleware.authMiddlewareFunction, productCategoryCtrl.simpleSearch);
// 3. Borrar una categoria
api.delete('/product-categories/:id', authMiddleware.authMiddlewareFunction, productCategoryCtrl.removeProductCategory);
// 4. Actualizar un producto
api.put('/product-categories/:id', authMiddleware.authMiddlewareFunction, productCategoryCtrl.updateProductCategory);
// 5. Obtener categorias
api.get('/product-categories', authMiddleware.authMiddlewareFunction, productCategoryCtrl.getProductCategories);

module.exports = api;