// Modelos
const Store = require('../models/store');
const StoreConfigurations = require('../models/storeConfigurations');
const Company = require('../models/company');
// Metodos de base de datos
const dataBase = require('../services/dataBaseMethods');
// Metodos para manejar queries de busqueda
const queryMethods = require('../services/query');
// Metodos de validacion
const validation = require('../services/validation');

// 0. Funcion de prueba del controlador
function store(req, res) {
    res.status(200).send({ msg: 'Store controller works' })
}

// 1. Guardar una tienda
async function saveStore(req, res) {
    try {
        await validation.body(Store, req.body, 'POST');
        const storeConfigurationsResp = await dataBase.saveCollection({
            requestData: req.body,
            collection: StoreConfigurations
        });
        req.body.storeConfigurations = storeConfigurationsResp.data._id;
        const storeResp = await dataBase.saveCollection({
            requestData: req.body,
            collection: Store
        });
        const companyResp = await dataBase.pushCollectionId({
            id: storeResp.data.company,
            collection: Company,
            push: { stores: storeResp.data._id }
        });
        return res.status(storeResp.code).send(storeResp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Obtener tiendas
async function getStores(req, res) {
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Store,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        populateFields: [
            {
                path: 'application',
                select: { name: 1, _id: 1 }
            },
            {
                path: 'country',
                select: { name: 1, _id: 1 }
            },
            {
                path: 'company',
                select: { name: 1, _id: 1, profileImage: 1 }
            },
            {
                path: 'storeConfigurations',
                select: { __v: 0 }
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

// 3. Buscar una tienda
async function findStore(req, res) {
    const payload = {
        id: req.params.id,
        collection: Store,
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

// 4. Actualizar una tienda
async function updateStore(req, res) {
    const payload = {
        id: req.params.id,
        collection: Store,
        requestData: req.body
    }
    try {
        await validation.body(Store, req.body);
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Borrar una tienda
async function removeStore(req, res) {
    const payload = {
        id: req.params.id,
        collection: Store
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Obtener tiendas buscador
async function simpleSearch(req, res) {
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Store,
        query: query,
        unselectFields: ['__v'],
        sort: req.query.sort ? req.query.sort : '-updatedAt'
    }
    try {
        const resp = await dataBase.simpleSearch(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    store,
    saveStore,
    getStores,
    findStore,
    updateStore,
    removeStore,
    simpleSearch
}