const Role = require('../models/role');
const dataBase = require('../services/dataBaseMethods');

// 0. Roles controller
function role(req, res) {
    res.status(200).send({ msg: 'Roles controller works' });
}

// 1. Save role
async function saveRole(req, res) {
    const payload = {
        repeatedFieldsAnd: ['name', 'company'],
        requestData: req.body,
        collection: Role
    }
    try {
        const resp = await dataBase.saveCollection(payload);
        return res.status(resp.code).send(resp);
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 2. Get roles
async function getRoles(req, res) {
    const payload = {
        collection: Role,
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

// 3. Get role
async function findRole(req, res) {
    const payload = {
        id: req.params.id,
        collection: Role,
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

// 4. Update role
async function updateRole(req, res) {
    const payload = {
        id: req.params.id,
        collection: Role,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5. Delete role
async function deleteRole(req, res) {
    const payload = {
        id: req.params.id,
        collection: Role
    }
    try {
        const resp = await dataBase.deleteIdCollection(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

module.exports = {
    role,
    saveRole,
    getRoles,
    findRole,
    updateRole,
    deleteRole
}