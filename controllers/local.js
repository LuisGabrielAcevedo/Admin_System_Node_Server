// Modelos
const Local = require('../models/local');
const Company = require('../models/company');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');
// Metodos de validacion
const validation = require('../services/validation');

// 0. Funcion de prueba del controlador
function local(req, res) {
    res.status(200).send({ msg: 'Controlador de locales funcionando' })
}

// 1. Guardar local
async function saveLocal(req, res) {
    const payload = {
        repeatedFields: ['name'],
        requestData: req.body,
        collection: Local
    }
    try {
        await validation.body(Local, req.body, 'POST');
        const resp = await dataBase.saveCollection(payload);
        const payloadToSearchCompany = {
            id: req.body.company,
            collection: Company
        }
        const respSearchCompany = await dataBase.findCollectionId(payloadToSearchCompany);
        const locals = respSearchCompany.data.locals;
        locals.push(resp.data._id);
        const payloadToUpdateCompany = {
            id: req.body.company,
            collection: Company,
            requestData: {
                locals: locals
            }
        }
        const respUpdateCompany = await dataBase.updateCollectionId(payloadToUpdateCompany);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener Locales
async function getLocals(req, res) {
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Local,
        query: query,
        sort: req.query.sort ? req.query.sort : 'createdAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [{
            path: 'application',
            select: { name: 1, _id: 1 }
        },
        {
            path: 'company',
            select: { name: 1, _id: 1, profileImage: 1 }
        }
        ]
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Buscar un local
async function findLocal(req, res) {
    const payload = {
        id: req.params.id,
        collection: Local,
        unselectFields: ['__v'],
        populateFields: [{
            path: 'application',
            select: { name: 1, _id: 1 }
        },
        {
            path: 'company',
            select: { name: 1, _id: 1 }
        }
        ]
    }
    try {
        const resp = await dataBase.findCollectionId(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Actualizar un local
async function updateLocal(req, res) {
    const payload = {
        id: req.params.id,
        collection: Local,
        requestData: req.body
    }
    try {
        await validation.body(Local, req.body);
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Borrar un local
async function removeLocal(req, res) {
    const payload = {
        id: req.params.id,
        collection: Local
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Obtener locales buscador
async function simpleSearch(req, res) {
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Local,
        query: query,
        unselectFields: ['__v', 'password'],
        sort: req.query.sort ? req.query.sort : 'createdAt'
    }
    try {
        const resp = await dataBase.simpleSearch(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    local,
    saveLocal,
    getLocals,
    findLocal,
    updateLocal,
    removeLocal,
    simpleSearch
}