const express = require('express');
const adminSystemCtrl = require('../controllers/adminSystem');
const api = express.Router();

// 1. Prueba Admin System Server
api.get('/', adminSystemCtrl.adminSystemServer);
// 1. Prueba del controlador
api.get('/adminSystem', adminSystemCtrl.adminSystem);
// 2. Obtener api product types
api.get('/apiProductTypes', adminSystemCtrl.apiProductTypes);
// 3. Cargar datos en la base de datos
api.post('/loadDataBaseData', adminSystemCtrl.loadDataBaseData);
// 4. Unidades de medida
api.get('/units', adminSystemCtrl.units);
// 5. Monedas
api.get('/coins', adminSystemCtrl.coins);
// 6. Metodos de pago
api.get('/payment-methods', adminSystemCtrl.paymentMethods);

module.exports = api;