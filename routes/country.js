const express = require('express');
const countryCtrl = require('../controllers/country');
const api = express.Router();
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roles');
const queryMiddleware = require('../middlewares/query');
const validationsMiddleware = require('../middlewares/validations');
const compose = require('compose-middleware').compose;

// 0. Prueba del controlador
api.get('/countries/controller', countryCtrl.country);
// 1. Guardar pais
api.post('/countries', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    validationsMiddleware.validationsMiddlewareFunction
]), countryCtrl.saveCountry);
// 2. Obtener paises
api.get('/countries', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction,
    queryMiddleware.queryMiddlewareFunction
]), countryCtrl.getCountries);
// 3. Buscar Paises
api.get('/countries/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), countryCtrl.findCountries);
// 4. Actualizar un pais
api.put('/countries/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), countryCtrl.updateCountry);
// 5. Borrar un pais
api.delete('/countries/:id', compose([
    authMiddleware.authMiddlewareFirstActionFunction,
    roleMiddleware.roleMiddlewareFunction
]), countryCtrl.deleteCountry);

module.exports = api;