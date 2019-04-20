const express = require('express');
const dataBaseCtrl = require('../controllers/dataBase');
const api = express.Router();

// 0. Prueba del controlador
api.get('/dataBase', dataBaseCtrl.dataBaseCtrl);
// 2. Obtener el menu de colecciones
api.get('/collectionsMenu', dataBaseCtrl.collectionsMenu);
// 1. Consultar informacion de una coleccion
api.get('/collectionData/:collection/:page?/:itemsPerPage?', dataBaseCtrl.getCollectionData);
// 3. Buscar un id en una coleccion
api.get('/collectionItem/:collection/:id', dataBaseCtrl.getIdOnCollection);
// 4. Borrar todos los datos de una coleccion 
api.delete('/removeCollection/:collection', dataBaseCtrl.removeCollection);
// 5. Borrar un id en una coleccion
api.delete('/removeCollectionItem/:collection/:id', dataBaseCtrl.removeIdOnCollection);

module.exports=api;