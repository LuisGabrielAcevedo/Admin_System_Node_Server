const Store = require('../models/store');
const StoreConfigurations = require('../models/storeConfigurations');
const Company = require('../models/company');
const dataBase = require('../services/dataBaseMethods');

// 0. Store controller
function store(req, res) {
    res.status(200).send({ msg: 'Store controller works' })
}

// 1. Save store
async function saveStore(req, res) {
    try {
        const storeConfigurationsResp = await dataBase.saveCollection({
            requestData: req.body,
            collection: StoreConfigurations
        });
        req.body.storeConfigurations = storeConfigurationsResp.data._id;
        const storeResp = await dataBase.saveCollection({
            repeatedFieldsAnd: [ 'name', 'company' ],
            requestData: req.body,
            collection: Store
        });
        const companyResp = await dataBase.pushIdCollection({
            id: storeResp.data.company,
            collection: Company,
            push: { stores: storeResp.data._id }
        });
        return res.status(storeResp.code).send(storeResp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get stores
async function getStores(req, res) {
    const payload = {
        collection: Store,
        query: req.query.query,
        sort: req.query.sort,
        pagination: req.query.pagination,
        unselectFields: ['__v'],
        populateFields: req.query.populate
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 3. Get store
async function findStore(req, res) {
    const payload = {
        id: req.params.id,
        collection: Store,
        unselectFields: ['__v'],
        populateFields: req.query.populate
    }
    try {
        const resp = await dataBase.findByIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 4. Update store
async function updateStore(req, res) {
    const payload = {
        id: req.params.id,
        collection: Store,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Delete store
async function deleteStore(req, res) {
    const payload = {
        id: req.params.id,
        collection: Store
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
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
    deleteStore
}