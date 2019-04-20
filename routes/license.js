const express = require('express');
const licenseCtrl = require('../controllers/license');
const api = express.Router();

// 0. Prueba del controlador
api.get('/license', licenseCtrl.license);
// 1. Guardar cliente
api.post('/license', licenseCtrl.saveLicense);
// 2. Obtener clientes
api.get('/licenses', licenseCtrl.getLicenses);
// 3. Buscar cliente
api.get('/license/:id', licenseCtrl.findLicenses);
// 4. Borrar un cliente
api.delete('/license/:id', licenseCtrl.removeLicense);
// 5. Actualizar un cliente
api.put('/license/:id', licenseCtrl.updateLicense);
// 6. Obtener clientes buscador
api.get('/licenses/search/all-list', licenseCtrl.simpleSearch);


module.exports = api;