const express = require('express');
const localCtrl = require('../controllers/store');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/stores/controller', localCtrl.local);
// 1. Guagar un administrador
api.post('/stores' , authMiddleware.authMiddlewareFunction, localCtrl.saveLocal);
// 2. Obtener locales
api.get('/stores', authMiddleware.authMiddlewareFunction, localCtrl.getLocals);
// 3. Buscar un local
api.get('/stores/:id', authMiddleware.authMiddlewareFunction, localCtrl.findLocal);
// 4. Actualizar un local
api.put('/stores/:id', authMiddleware.authMiddlewareFunction, localCtrl.updateLocal);
// 5. Borrar un local
api.delete('/stores/:id', authMiddleware.authMiddlewareFunction, localCtrl.removeLocal);
// 6. Obtener locales buscador
api.get('/stores/search/all-list', authMiddleware.authMiddlewareFunction, localCtrl.simpleSearch);

module.exports = api;