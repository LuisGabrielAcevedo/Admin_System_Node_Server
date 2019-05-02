const express = require('express');
const countryCtrl = require('../controllers/country');
const api = express.Router();

// 0. Prueba del controlador
api.get('/countries/controller', countryCtrl.country);
// 1. Guardar pais
api.post('/countries', countryCtrl.saveCountry);
// 2. Obtener paises
api.get('/countries', countryCtrl.getCountries);
// 3. Buscar Paises
api.get('/countries/:id', countryCtrl.findCountries);
// 4. Actualizar un pais
api.put('/countries/:id', countryCtrl.updateCountry);
// 5. Borrar un pais
api.delete('/countries/:id', countryCtrl.removeCountry);
// 6. Obtener paises buscador
api.get('/countries/search/all-list', countryCtrl.simpleSearch);

module.exports = api;