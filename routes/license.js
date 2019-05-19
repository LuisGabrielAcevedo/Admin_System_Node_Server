const express = require('express');
const licenseCtrl = require('../controllers/license');
const api = express.Router();

// 0. Prueba del controlador
api.get('/licenses', licenseCtrl.license);
// 1. Guardar cliente
api.post('/licenses', licenseCtrl.saveLicense);
// 2. Obtener clientes
api.get('/licenses', licenseCtrl.getLicenses);
// 3. Buscar cliente
api.get('/licenses/:id', licenseCtrl.findLicenses);
// 4. Borrar un cliente
api.delete('/licenses/:id', licenseCtrl.removeLicense);
// 5. Actualizar un cliente
api.put('/licenses/:id', licenseCtrl.updateLicense);
// 6. Obtener clientes buscador
api.get('/licenses/search/all-list', licenseCtrl.simpleSearch);


module.exports = api;