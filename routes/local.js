const express = require('express');
const localCtrl = require('../controllers/local');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/locals/controller', localCtrl.local);
// 1. Guagar un administrador
api.post('/locals' , authMiddleware.authMiddlewareFunction, localCtrl.saveLocal);
// 2. Obtener locales
api.get('/locals', authMiddleware.authMiddlewareFunction, localCtrl.getLocals);
// 3. Buscar un local
api.get('/locals/:id', authMiddleware.authMiddlewareFunction, localCtrl.findLocal);
// 4. Actualizar un local
api.put('/locals/:id', authMiddleware.authMiddlewareFunction, localCtrl.updateLocal);
// 5. Borrar un local
api.delete('/locals/:id', authMiddleware.authMiddlewareFunction, localCtrl.removeLocal);
// 6. Obtener locales buscador
api.get('/locals/search/all-list', authMiddleware.authMiddlewareFunction, localCtrl.simpleSearch);

module.exports = api;