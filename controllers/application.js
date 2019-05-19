const Application = require('../models/application');
const dataBase = require('../services/dataBaseMethods');


// 0. Appplication controller
function application(req, res) {
    res.status(200).send({ msg: 'Application controller works' });
}

// 1. Save appplication
async function saveApplication(req, res) {
    const payload = {
        repeatedFieldsOr: ['name', 'code'],
        requestData: req.body,
        collection: Application
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get applications
async function getApplications(req, res) {
    const payload = {
        collection: Application,
        query: req.query.query,
        sort: req.query.sort,
        pagination: req.query.pagination,
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 3. Get application
async function findApplication(req, res) {
    const payload = {
        id: req.params.id,
        collection: Application,
        unselectFields: ['__v']
    }
    try {
        const resp = await dataBase.findByIdCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 4. Update application
async function updateApplication(req, res) {
    const payload = {
        id: req.params.id,
        collection: Application,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5. Delete application
async function deleteApplication(req, res) {
    const payload = {
        id: req.params.id,
        collection: Application
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
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
    deleteApplication,
}