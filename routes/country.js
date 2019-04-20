const express = require('express');
const countryCtrl = require('../controllers/country');
const api = express.Router();

// 0. Prueba del controlador
api.get('/country', countryCtrl.country);
// 1. Guardar pais
api.post('/country', countryCtrl.saveCountry);
// 2. Obtener paises
api.get('/countries', countryCtrl.getCountries);
// 3. Buscar Paises
api.get('/country/:id', countryCtrl.findCountries);
// 4. Actualizar un pais
api.put('/country/:id', countryCtrl.updateCountry);
// 5. Borrar un pais
api.delete('/country/:id', countryCtrl.removeCountry);
// 6. Obtener paises buscador
api.get('/countries/search/all-list', countryCtrl.simpleSearch);

module.exports = api;