const express = require('express');
const customerCtrl = require('../controllers/customer');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');

// 0. Prueba del controlador
api.get('/customers/controller', customerCtrl.customer);
// 1. Guardar cliente
api.post('/customers', authMiddleware.authMiddlewareFirstActionFunction, customerCtrl.saveCustomer);
// 2. Obtener clientes
api.get('/customers', authMiddleware.authMiddlewareFirstActionFunction, customerCtrl.getCustomers);
// 3. Buscar cliente
api.get('/customers/:id', authMiddleware.authMiddlewareFirstActionFunction, customerCtrl.findCustomers);
// 4. Actualizar un cliente
api.put('/customers/:id', authMiddleware.authMiddlewareFirstActionFunction, customerCtrl.updateCustomer);
// 5. Borrar un cliente
api.delete('/customers/:id', authMiddleware.authMiddlewareFirstActionFunction, customerCtrl.removeCustomer);
// 6. Obtener la imagen del cliente
api.get('/customers/image/:id/:file', customerCtrl.getImage);
// 7. Obtener clientes buscador
api.get('/customers/search/all-list', authMiddleware.authMiddlewareFirstActionFunction, customerCtrl.simpleSearch);


module.exports = api;