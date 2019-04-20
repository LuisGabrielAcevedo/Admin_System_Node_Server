const express = require('express');
const orderItemCtrl = require('../../controllers/sale/orderItem');
const api = express.Router();
const authMiddleware = require('../../middlewares/auth');

// 0. Prueba del controlador
api.get('/orderItems/controller', orderItemCtrl.orderItem);
// 1. Guardar un order item
api.post('/orderItems/:orderId?', authMiddleware.authMiddlewareFunction, orderItemCtrl.saveOrderItem);
// 2. Borrar un order item
api.delete('/orderItems/:id/:orderId', authMiddleware.authMiddlewareFunction, orderItemCtrl.deleteOrderItem);
// 3. Actualizar un order item
api.put('/orderItems/:id/:orderId', authMiddleware.authMiddlewareFunction, orderItemCtrl.updateOrderItem);

module.exports = api;

