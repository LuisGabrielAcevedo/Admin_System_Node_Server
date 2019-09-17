const State = require('../models/state');
const dataBase = require('../services/dataBaseMethods');

// 0. State controller
function state(req, res) {
    res.status(200).send({ msg: 'State controller works' });
}

// 1. Save state
async function saveState(req, res) {
    const payload = {
        repeatedFieldsOr: ['name', 'code'],
        requestData: req.body,
        collection: State
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get states
async function getStates(req, res) {
    const payload = {
        collection: State,
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

// 3. Get state
async function findState(req, res) {
    const payload = {
        id: req.params.id,
        collection: State,
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

// 4. Update state
async function updateState(req, res) {
    const payload = {
        id: req.params.id,
        collection: State,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 5. Delete state
async function deleteState(req, res) {
    const payload = {
        id: req.params.id,
        collection: State
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    state,
    saveState,
    getStates,
    findState,
    updateState,
    deleteState
}