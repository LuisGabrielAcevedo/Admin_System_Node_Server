const express = require('express');
const localCtrl = require('../controllers/store');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/stores/controller', localCtrl.store);
// 1. Guagar un administrador
api.post('/stores' , authMiddleware.authMiddlewareFunction, localCtrl.saveStore);
// 2. Obtener tiendas
api.get('/stores', authMiddleware.authMiddlewareFunction, localCtrl.getStores);
// 3. Buscar una tienda
api.get('/stores/:id', authMiddleware.authMiddlewareFunction, localCtrl.findStore);
// 4. Actualizar una tienda
api.put('/stores/:id', authMiddleware.authMiddlewareFunction, localCtrl.updateStore);
// 5. Borrar una tienda
api.delete('/stores/:id', authMiddleware.authMiddlewareFunction, localCtrl.removeStore);
// 6. Obtener tiendas buscador
api.get('/stores/search/all-list', authMiddleware.authMiddlewareFunction, localCtrl.simpleSearch);

module.exports = api;