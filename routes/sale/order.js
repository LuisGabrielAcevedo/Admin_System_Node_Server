const express = require("express");
const orderCtrl = require("../../controllers/sale/order");
const api = express.Router();
const compose = require("compose-middleware").compose;
const queryMiddleware = require("../../middlewares/query");
const authMiddleware = require("../../middlewares/auth");

// 0. Order controller
api.get("/orders/controller", orderCtrl.order);
// 1. Save a order
api.post("/orders", orderCtrl.saveOrder);
// 2. Delete a order
api.delete("/orders/:id", orderCtrl.deleteOrder);
// 3. Update a order
api.put(
  "/orders/:id",
  authMiddleware.authMiddlewareFirstActionFunction,
  orderCtrl.updateOrder
);
// 4. Find order
api.get(
  "/orders/:id",
  compose([queryMiddleware.queryMiddlewareFunction]),
  orderCtrl.findOrder
);
// 5. Get orders
api.get(
  "/orders",
  compose([queryMiddleware.queryMiddlewareFunction]),
  orderCtrl.findOrders
);
// 7. Paid order
api.post(
  "/orders/:id/paid",
  authMiddleware.authMiddlewareFirstActionFunction,
  orderCtrl.paidOrder
);
// 8. Cancel order
api.put(
  "/orders/:id/cancel",
  authMiddleware.authMiddlewareFirstActionFunction,
  orderCtrl.cancelOrder
);

module.exports = api;
