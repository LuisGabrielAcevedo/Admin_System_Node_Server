const express = require('express');
const adminCtrl = require('../controllers/admin');
const api = express.Router();

// 0. Prueba del controlador
api.get('/admins/controller', adminCtrl.admin);
// 1. Guagar un administrador
api.post('/admins', adminCtrl.saveAdmin);
// 2. Buscar un administrador
api.get('/admins/:id', adminCtrl.findAdmin);
// 3. Obtener admistradores
api.get('/admins', adminCtrl.getAdmins);
// 4. Actualizar un administrador
api.put('/admins/:id', adminCtrl.updateAdmin);
// 5. Borrar un administrador
api.delete('/admins/:id', adminCtrl.removeAdmin);
// 6. Obtener la imagen del administrador
api.get('/admins/image/:id/:file', adminCtrl.getImage);
// 7. Obtener administradres buscador
api.get('/admins/search/all-list', adminCtrl.simpleSearch);
// 8. Register user
api.post('/admins/register', adminCtrl.adminRegister);
// 9. Login user
api.post('/admins/login', adminCtrl.adminLogin);

module.exports = api;