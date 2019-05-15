const express = require('express');
const vendorCtrl = require('../../controllers/product/vendor');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/vendors/controller', vendorCtrl.vendor);
// 1. Guagar una vendedor
api.post('/vendors', authMiddleware.authMiddlewareFirstActionFunction, vendorCtrl.saveVendor);
// 2. Obtener vendedores buscador
api.get('/vendors/search/all-list', authMiddleware.authMiddlewareFirstActionFunction, vendorCtrl.simpleSearch);
// 3. Borrar una vendedor
api.delete('/vendors/:id',authMiddleware.authMiddlewareFirstActionFunction, vendorCtrl.removeVendor);
// 4. Actualizar una vendedor
api.put('/vendors/:id', authMiddleware.authMiddlewareFirstActionFunction, vendorCtrl.updateVendor);
// 5. Obtener vendedores
api.get('/vendors', authMiddleware.authMiddlewareFirstActionFunction, vendorCtrl.getVendors);

module.exports = api;