const express = require('express');
const vendorCtrl = require('../../controllers/inventory/vendor');
const api = express.Router();
const compose = require('compose-middleware').compose;
const authMiddleware = require('../../middlewares/auth');
const queryMiddleware = require('../../middlewares/query');
const validationsMiddleware = require('../../middlewares/validations');

// 0. Vendor Controller
api.get('/vendors/controller', vendorCtrl.vendor);
// 1. Save vendor
api.post('/vendors', compose([
    validationsMiddleware.validationsMiddlewareFunction
]), vendorCtrl.saveVendor);
// 2. Get vendors
api.get('/vendors', compose([
    queryMiddleware.queryMiddlewareFunction
]), vendorCtrl.getVendors);
// 3. Find vendor
api.get('/vendors/:id', compose([
    queryMiddleware.queryMiddlewareFunction
]), vendorCtrl.findVendor);
// 4. Update vendor
api.put('/vendors/:id', compose([
    validationsMiddleware.validationsMiddlewareFunction
]), vendorCtrl.updateVendor);
// 5. Delete vendor
api.delete('/vendors/:id', compose([]), vendorCtrl.deleteVendor);

module.exports = api;