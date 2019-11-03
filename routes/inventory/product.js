const express = require("express");
const productCtrl = require("../../controllers/inventory/product");
const api = express.Router();
const compose = require("compose-middleware").compose;
const queryMiddleware = require("../../middlewares/query");
const validationsMiddleware = require("../../middlewares/validations");

// 0. Product controller
api.get("/products/controller", productCtrl.product);
// 1. Save product
api.post(
  "/products",
  compose([validationsMiddleware.validationsMiddlewareFunction]),
  productCtrl.saveProduct
);
// 2. Get products
api.get(
  "/products",
  compose([queryMiddleware.queryMiddlewareFunction]),
  productCtrl.getProducts
);
// 3. Find product
api.get(
  "/products/:id",
  compose([queryMiddleware.queryMiddlewareFunction]),
  productCtrl.findProduct
);
// 4. Update product
api.put(
  "/products/:id",
  compose([validationsMiddleware.validationsMiddlewareFunction]),
  productCtrl.updateProduct
);
// 5. Delete product
api.delete("/products/:id", compose([]), productCtrl.deleteProduct);

module.exports = api;
