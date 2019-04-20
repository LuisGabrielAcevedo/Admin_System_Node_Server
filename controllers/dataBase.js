// Libreria para acceder a la base de datos
const mongoose = require('mongoose');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');

// 0. Funcion de prueba del controlador
function dataBaseCtrl(req, res) {
    res.status(200).send({ msg: 'Controlador de base de datos funcionando' })
}
async function collectionsMenu(req, res) {
    let collections = [];
    for (const prop in mongoose.modelSchemas) {
        collections.push(prop);
    }
    res.status(200).send({
        status: 'OK',
        msg: 'Colleciones actuales en la base de datos',
        data: collections
    });
}

async function getCollectionData(req, res) {
    const collection = validateCollection(req.params.collection).collection;
    const fields = validateCollection(req.params.collection).fields;
    const payload = {
        collection: collection,
        page: req.params.page ? Number(req.params.page) : 1,
        itemsPerPage: req.params.itemsPerPage ? Number(req.params.itemsPerPage) : 10,
        unselectFields: ['__v'],
        successMessage: 'Coleccion encontrada con exito',
        errorMessage: `No se encontrados datos para la coleccion ${collection}`
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

async function getIdOnCollection(req, res) {
    const collection = validateCollection(req.params.collection).collection;
    const payload = {
        id: req.params.id,
        collection: collection,
        unselectFields: ['__v'],
        successMessage: 'Id encontrado con exito',
        errorMessage: `Error buscando Id, el id ${req.params.id} no existe`
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

async function removeIdOnCollection(req, res) {
    const collection = validateCollection(req.params.collection).collection;
    const payload = {
        id: req.params.id,
        collection: collection,
        successMessage: 'Id eliminado con exito',
        errorMessage: 'Error eliminando id'
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

async function removeCollection(req, res) {
    const collection = validateCollection(req.params.collection).collection;
    const payload = {
        collection: collection,
        successMessage: 'Coleccion eliminada con exito',
        errorMessage: `Error eliminando la coleccion ${collection}`
    }
    try {
        const resp = await dataBase.removeCollection(payload);
        return res.status(resp.code).send(resp);
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

function validateCollection(collectionFront) {
    let collection = null;
    let fields = ['_id'];
    for (const prop in mongoose.models) {
        if (prop === collectionFront) {
            collection = mongoose.models[prop];
            for (const name in mongoose.modelSchemas[prop].obj) {
                fields.push(name);
            }
        }
    }
    return {
        collection: collection,
        fields: fields
    }
}

module.exports = {
    dataBaseCtrl,
    collectionsMenu,
    getCollectionData,
    getIdOnCollection,
    removeIdOnCollection,
    removeCollection
}