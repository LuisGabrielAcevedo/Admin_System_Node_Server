// Modelos
const Application = require('../models/application');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');
// Metodos de validacion
const validation = require('../services/validation');

// 0. Funcion de prueba del controlador
function application(req, res) {
    res.status(200).send({ msg: 'Controlador de aplicationes funcionando' });
}
// 1. Guardar una aplicacion
async function saveApplication(req, res) {
    const payload = {
        repeatedFields: ['name', 'code'],
        requestData: req.body,
        collection: Application
    }
    try {
        await validation.body(Application, req.body, 'POST');
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener aplicaciones
async function getApplications(req, res) {
    const searchFields = ['name', 'code'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Application,
        query: query,
        sort: req.query.sort ? req.query.sort : 'updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 3. Buscar un aplication
async function findApplication(req, res) {
    const payload = {
        id: req.params.id,
        collection: Application,
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Actualizar la aplication
async function updateApplication(req, res) {
    const payload = {
        id: req.params.id,
        collection: Application,
        requestData: req.body
    }
    try {
        await validation.body(Application, req.body);
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5. Borrar una aplication
async function removeApplication(req, res) {
    const payload = {
        id: req.params.id,
        collection: Application
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Obtener aplicaciones buscador
async function simpleSearch(req, res) {
    const searchFields = ['name', 'code'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Application,
        query: query,
        unselectFields: ['__v'],
        sort: req.query.sort ? req.query.sort : 'updatedAt'
    }
    try {
        const resp = await dataBase.simpleSearch(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}



module.exports = {
    application,
    saveApplication,
    getApplications,
    findApplication,
    updateApplication,
    removeApplication,
    simpleSearch
}