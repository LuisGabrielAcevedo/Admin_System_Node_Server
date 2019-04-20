const express = require('express');
const brandCtrl = require('../../controllers/product/brand');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/brands/controller', brandCtrl.brand);
// 1. Guagar una marca
api.post('/brands', authMiddleware.authMiddlewareFunction, brandCtrl.saveBrand);
// 2. Obtener marcas buscador
api.get('/brands/search/all-list', authMiddleware.authMiddlewareFunction, brandCtrl.simpleSearch);
// 3. Borrar una marca
api.delete('/brands/:id', authMiddleware.authMiddlewareFunction, brandCtrl.removeBrand);
// 4. Actualizar una marca
api.put('/brands/:id', authMiddleware.authMiddlewareFunction, brandCtrl.updateBrand);
// 5. Buscar marcas
api.get('/brands', authMiddleware.authMiddlewareFunction, brandCtrl.getBrands);

module.exports = api;