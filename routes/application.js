const express = require('express');
const applicationCtrl = require('../controllers/application');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/applications/controller', applicationCtrl.application);
// 1. Guardar aplicacion
api.post('/applications', authMiddleware.authMiddlewareFirstActionFunction, applicationCtrl.saveApplication);
// 2. Obtener aplicaciones
api.get('/applications', authMiddleware.authMiddlewareFirstActionFunction, applicationCtrl.getApplications);
// 3. Buscar un aplicacion
api.get('/applications/:id', authMiddleware.authMiddlewareFirstActionFunction, applicationCtrl.findApplication);
// 4. Actualizar la aplication
api.put('/applications/:id', authMiddleware.authMiddlewareFirstActionFunction, applicationCtrl.updateApplication);
// 5. Borrar un aplication
api.delete('/applications/:id', authMiddleware.authMiddlewareFirstActionFunction, applicationCtrl.removeApplication);
// 7. Buscar aplicaciones sin paginacion
api.get('/applications/search/all-list', authMiddleware.authMiddlewareFirstActionFunction, applicationCtrl.simpleSearch);

module.exports = api;