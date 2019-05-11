const express = require('express');
const orderCtrl = require('../../controllers/sale/order');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/orders/controller', orderCtrl.order);
// 1. Guadar una orden
api.post('/orders', orderCtrl.saveOrder);
// 2. Borrar una orden
api.delete('/orders/:id', orderCtrl.deleteOrder);
// 3. Actualizar una orden
api.put('/orders/:id', authMiddleware.authMiddlewareFunction, orderCtrl.updateOrder);
// 4. Buscar una orden una orden 
api.get('/orders/:id', orderCtrl.findOrder);
// 5. Buscar todas las ordenes
api.get('/orders', authMiddleware.authMiddlewareFunction, orderCtrl.findOrders);
// 6. Pagar orden 
api.post('/orders/:id/paid', authMiddleware.authMiddlewareFunction, orderCtrl.paidOrder);
// 7. Anular orden 
api.put('/orders/:id/cancel', authMiddleware.authMiddlewareFunction, orderCtrl.cancelOrder);


module.exports = api;

