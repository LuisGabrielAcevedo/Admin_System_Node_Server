const express = require('express');
const companyCtrl = require('../controllers/company');
const api = express.Router();

// 0. Prueba del controlador
api.get('/company', companyCtrl.company);
// 1. Guardar empresa
api.post('/company', companyCtrl.saveCompany);
// 2. Obtener usuarios
api.get('/companies', companyCtrl.getCompanies);
// 4. Actualizar un empresa
api.put('/company/:id/:fileType?', companyCtrl.updateCompany);
// 5. Borrar un empresa
api.delete('/company/:id/', companyCtrl.removeCompany);
// 6. Obtener la imagen de la empresa
api.get('/imageCompany/:id/:file', companyCtrl.getImage);
// 7. Obtener el logo de la empresa
api.get('/logoCompany/:id/:file', companyCtrl.getLogo);
// 8. Obtener compañias buscador
api.get('/companies/search/all-list', companyCtrl.simpleSearch);

module.exports = api;