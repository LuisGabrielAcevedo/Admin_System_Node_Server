const express = require('express');
const companyCtrl = require('../controllers/company');
const api = express.Router();

// 0. Prueba del controlador
api.get('/companies/controller', companyCtrl.company);
// 1. Guardar empresa
api.post('/companies', companyCtrl.saveCompany);
// 2. Obtener usuarios
api.get('/companies', companyCtrl.getCompanies);
// 4. Actualizar un empresa
api.put('/companies/:id/:fileType?', companyCtrl.updateCompany);
// 5. Borrar un empresa
api.delete('/companies/:id/', companyCtrl.removeCompany);
// 6. Obtener la imagen de la empresa
api.get('companies/image/:id/:file', companyCtrl.getImage);
// 7. Obtener el logo de la empresa
api.get('/companies/logo/:id/:file', companyCtrl.getLogo);
// 8. Obtener compañias buscador
api.get('/companies/search/all-list', companyCtrl.simpleSearch);

module.exports = api;