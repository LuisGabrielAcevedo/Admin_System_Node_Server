const express = require('express');
const brandCtrl = require('../../controllers/product/brand');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/brands/controller', brandCtrl.brand);
// 1. Guagar una marca
api.post('/brands', authMiddleware.authMiddlewareFirstActionFunction, brandCtrl.saveBrand);
// 2. Obtener marcas buscador
api.get('/brands/search/all-list', authMiddleware.authMiddlewareFirstActionFunction, brandCtrl.simpleSearch);
// 3. Borrar una marca
api.delete('/brands/:id', authMiddleware.authMiddlewareFirstActionFunction, brandCtrl.removeBrand);
// 4. Actualizar una marca
api.put('/brands/:id', authMiddleware.authMiddlewareFirstActionFunction, brandCtrl.updateBrand);
// 5. Buscar marcas
api.get('/brands', authMiddleware.authMiddlewareFirstActionFunction, brandCtrl.getBrands);

module.exports = api;