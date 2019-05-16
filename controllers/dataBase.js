// Libreria para acceder a la base de datos
const mongoose = require('mongoose');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');
// Metodos para manejar search fields
const searchFieldsMethods = require('../services/searchFields');
// Metodos para manejar search fields
const populateMethods = require('../services/populateQuery');

function dataBaseCtrl(req, res) {
    res.status(200).send({ msg: 'Data base controller works' })
}

async function collectionsMenu(req, res) {
    let collections = [];
    for (const prop in mongoose.modelSchemas) {
        collections.push(prop);
    }
    res.status(200).send({
        status: 'OK',
        code: 200,
        msg: 'Current collections in the database',
        data: collections
    });
}

async function getCollectionData(req, res) {
    // 1. Identify the collection
    const collection = validateCollection(req.params.collection).collection;
    if (!collection) return res.status(500).send({
        status: 'ERROR',
        code: 500,
        msg: 'Invalid collection'
    });
    // 2. Get the search fields
    const searchFields = searchFieldsMethods.seachFileds(req.params.collection);
    // 3. Get query
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    // 4. Get the population query
    const populate = req.query.populate ? populateMethods.populateQuery(req.query.populate) : [];
    // 5. Assemble the search payload
    const payload = {
        collection: collection,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        populateFields: populate,
        unselectFields: ['__v']
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
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findByIdCollection(payload);
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
        collection: collection
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    }
    catch (err) {
        return res.status(err.code).send(err);
    }
}

async function removeCollection(req, res) {
    const collection = validateCollection(req.params.collection).collection;
    if (!collection) return res.status(500).send({
        status: 'ERROR',
        code: 500,
        msg: 'Invalid collection'
    });
    const payload = {
        collection: collection
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

function removeAllCollections(req, res) {

}

module.exports = {
    dataBaseCtrl,
    collectionsMenu,
    getCollectionData,
    getIdOnCollection,
    removeIdOnCollection,
    removeCollection,
    removeAllCollections
}