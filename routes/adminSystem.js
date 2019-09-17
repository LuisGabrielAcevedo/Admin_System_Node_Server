const express = require('express');
const adminSystemCtrl = require('../controllers/adminSystem');
const api = express.Router();

// 1. Prueba Admin System Server
api.get('/', adminSystemCtrl.adminSystemServer);
// 1. Prueba del controlador
api.get('/admin-system', adminSystemCtrl.adminSystem);
// 2. Obtener api product types
api.get('/admin-system/apiProductTypes', adminSystemCtrl.apiProductTypes);
// 3. Cargar datos en la base de datos
api.post('/admin-system/loadDataBaseData', adminSystemCtrl.loadDataBaseData);
// 4. Unidades de medida
api.get('/admin-system/units', adminSystemCtrl.units);
// 5. Monedas
api.get('/admin-system/currencies', adminSystemCtrl.coins);
// 6. Metodos de pago
api.get('/admin-system/payment-methods', adminSystemCtrl.paymentMethods);
// 7. Generar usuarios 
api.post('/admin-system/random-users', adminSystemCtrl.randomUsers);
// 8. Generar productos
api.post('/admin-system/random-products', adminSystemCtrl.randomProducts);
// 8. Generar customers
api.post('/admin-system/random-customers', adminSystemCtrl.randomCustomers);
// 9. Languages
api.get('/admin-system/languages', adminSystemCtrl.languages);


module.exports = api;