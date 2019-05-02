const express = require('express');
const dataBaseCtrl = require('../controllers/dataBase');
const api = express.Router();

// 0. Prueba del controlador
api.get('/data-base/controller', dataBaseCtrl.dataBaseCtrl);
// 2. Obtener el menu de colecciones
api.get('/data-base/collections-menu', dataBaseCtrl.collectionsMenu);
// 1. Consultar informacion de una coleccion
api.get('/data-base/:collection', dataBaseCtrl.getCollectionData);
// 3. Buscar un id en una coleccion
api.get('/data-base/:collection/:id', dataBaseCtrl.getIdOnCollection);
// 4. Borrar todos los datos de una coleccion 
api.delete('/data-base/:collection', dataBaseCtrl.removeCollection);
// 5. Borrar un id en una coleccion
api.delete('/data-base/:collection/:id', dataBaseCtrl.removeIdOnCollection);
// 6. Borrar todas las colecciones 
api.delete('/data-base', dataBaseCtrl.removeAllCollections);

module.exports=api;