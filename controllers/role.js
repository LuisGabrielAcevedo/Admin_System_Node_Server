const Rol = require('../models/role');
const dataBase = require('../services/dataBaseMethods');
const queryMethods = require('../services/query');

// 0. Roles controller
function role(req, res) {
    res.status(200).send({ msg: 'Roles controller works' });
}

// 1. Save role
async function saveRol(req, res) {
    const payload = {
        requiredFields: ['name', 'company', 'application'],
        requestData: req.body,
        collection: Rol
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
    if (req.tokenVerified.company) {
        req.query.filters = {
            company: req.tokenVerified.company
        }
    }
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Rol,
        query: query,
        sort: req.query.sort ? req.query.sort : '-updatedAt',
        page: req.query.page ? Number(req.query.page) : 1,
        itemsPerPage: req.query.itemsPerPage ? Number(req.query.itemsPerPage) : 10,
        unselectFields: ['__v'],
        requiredFields: ['name', 'company', 'application'],
        populateFields: [
            {
                path: 'company',
                select: { _id: 1, name: 1, profileImage: 1}
            },
            {
                path: 'application',
                select: { _id: 1, name: 1}
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

// 3. Get role
async function findRol(req, res) {
    const payload = {
        id: req.params.id,
        collection: Rol,
        unselectFields: ['__v'],
        populateFields: [{
                path: 'company',
                select: { name: 1, _id: 1 }
            },
            {
                path: 'permissions',
                select: { name: 1, _id: 1 }
            },
            {
                path: 'stores',
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

// 4. Update role
async function updateRol(req, res) {
    const payload = {
        id: req.params.id,
        collection: Rol,
        requestData: req.body
    }
    try {
        const resp = await dataBase.updateCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}


// 5. Delete role
async function removeRol(req, res) {
    const payload = {
        id: req.params.id,
        collection: Rol
    }
    try {
        const resp = await dataBase.removeCollectionId(payload);
        return res.status(resp.code).send(resp)
    } catch (err) {
        return res.status(err.code).send(err);
    }
}

// 6. Get roles search
async function simpleSearch(req, res) {
    const searchFields = ['name'];
    const query = req.query.search || req.query.filters ?
        queryMethods.query(req.query.search, searchFields, req.query.filters) : {};
    const payload = {
        collection: Rol,
        query: query,
        unselectFields: ['__v', 'password'],
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
    role,
    saveRol,
    getRoles,
    findRol,
    updateRol,
    removeRol,
    simpleSearch
}